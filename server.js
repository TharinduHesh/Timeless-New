const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const ShortUniqueId = require('short-unique-id');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const uid = new ShortUniqueId({ length: 10 });
const db = require('./db');
const firebase = require('./storage');

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// CORS: allow same-origin and localhost during dev
// Security: Helmet for standard headers (CSP managed separately)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));

// CORS: allow same-origin and localhost during dev but prefer ALLOWED_ORIGINS in production
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4000,http://127.0.0.1:4000,http://localhost:5173,http://127.0.0.1:5173').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, cb){
    // allow non-browser tools (no origin)
    if (!origin) return cb(null, true);
    try {
      const u = new URL(origin);
      // always allow localhost during development
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return cb(null, true);
    } catch {}
    // Check allowed origins list; if not present, deny (safer)
    if (allowedOrigins.length && allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true
}));

// Limit JSON bodies to prevent large payload DoS
app.use(bodyParser.json({ limit: '10kb' }));

// Input sanitization middleware
app.use((req, res, next) => {
  // Sanitize request body to prevent XSS and injection attacks
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          // Remove potentially dangerous characters
          obj[key] = obj[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      });
    };
    sanitize(req.body);
  }
  next();
});

// Global security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY'); // Prevent clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block'); // XSS protection
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com; " +
    "frame-ancestors 'none';"
  );
  next();
});

// Static files disabled - using React frontend

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, '[]');

// Helper to send email (config via env)
async function sendOrderEmail(order) {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const to = process.env.NOTIFY_TO || process.env.EMAIL_USER;

  if (!host || !port || !user || !pass || !to) {
    console.log('Email not configured. Skipping email send. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, NOTIFY_TO.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass }
  });

  const itemsHtml = order.items.map(i => `<li>${i.name} x${i.qty} - $${i.price.toFixed(2)}</li>`).join('');
  const html = `<h2>New Order: ${order.orderId}</h2>
  <p><strong>Date:</strong> ${order.date}</p>
  <p><strong>Customer:</strong> ${order.customer.name}</p>
  <p><strong>Address:</strong> ${order.customer.address}</p>
  <p><strong>Contact:</strong> ${order.customer.contact}</p>
  <h3>Items</h3>
  <ul>${itemsHtml}</ul>
  <p><strong>Grand Total:</strong> $${order.grandTotal.toFixed(2)}</p>
  <p><strong>Payment:</strong> Cash on Delivery</p>`;

  await transporter.sendMail({
    from: user,
    to,
    subject: `New Order ${order.orderId}`,
    html
  });
}

// Serve watch data from both endpoints for compatibility
app.get('/data/products.json', (req, res) => {
  try {
    const products = db.getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error('Error serving /data/products.json:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/watches', (req, res) => {
  const watches = db.getAllProducts();
  res.json(watches);
});

// Public API endpoints for products
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// Public API endpoints for orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const orders = db.getAllOrders();
    const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to load order' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const order = {
      id: uid.rnd(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    db.createOrder(order);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const orders = db.getAllOrders();
    const orderIndex = orders.findIndex(o => o.id === req.params.id || o.orderId === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    orders[orderIndex].status = req.body.status;
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// --- Admin authentication and product management ---
// Admin login returns a JWT when correct ADMIN_USER/ADMIN_PASS are provided (useful for admin UI)
app.post('/api/admin/login', (req, res) => {
  const { user, pass } = req.body || {};
  if (!user || !pass) return res.status(400).json({ error: 'Missing credentials' });
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminUser || !adminPass) return res.status(500).json({ error: 'Admin credentials not configured on server' });
  if (user === adminUser && pass === adminPass) {
    const token = jwt.sign({ user, role: 'admin' }, process.env.JWT_SECRET || 'dev-local-secret', { expiresIn: '12h' });
    return res.json({ token });
  }
  return res.status(403).json({ error: 'Invalid credentials' });
});

// Middleware to verify JWT (custom or Firebase) and admin role
async function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing authorization token' });
  const token = auth.slice(7);
  
  // Try Firebase token first
  try {
    const admin = require('firebase-admin');
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken) {
      req.admin = { user: decodedToken.email, uid: decodedToken.uid, role: 'admin' };
      return next();
    }
  } catch (firebaseErr) {
    // If Firebase token verification fails, try custom JWT
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-local-secret');
      if (payload && payload.role === 'admin') {
        req.admin = payload;
        return next();
      }
      return res.status(403).json({ error: 'Forbidden' });
    } catch (jwtErr) {
      return res.status(401).json({ error: 'Invalid token', details: jwtErr.message });
    }
  }
}

// Admin product CRUD (database-backed)
app.get('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Admin GET products error', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name || typeof body.price === 'undefined') return res.status(400).json({ error: 'Missing product name or price' });
    const newProduct = await db.createProduct({
      name: String(body.name),
      brand: String(body.brand || ''),
      category: String(body.category || ''),
      price: Number(body.price) || 0,
      stock: Number(body.stock) || 0,
      discount: Number(body.discount) || 0,
      description: body.description || '',
      image: body.image || '',
      images: Array.isArray(body.images) ? body.images : (body.image ? [body.image] : [])
    });
    res.json({ ok: true, product: newProduct });
  } catch (err) {
    console.error('Admin create product error', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const updated = await db.updateProduct(String(id), body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true, product: updated });
  } catch (err) {
    console.error('Admin update product error', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    // Get product to delete images from Firebase
    const product = await db.getProductById(String(id));
    if (product && product.images && product.images.length > 0) {
      // Delete images from Firebase if configured
      for (const imageUrl of product.images) {
        try {
          await firebase.deleteImage(imageUrl);
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      }
    }
    const ok = await db.deleteProduct(String(id));
    if (!ok) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Admin delete product error', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Single image upload endpoint
app.post('/api/admin/upload', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!firebase.isConfigured()) {
      return res.status(500).json({ error: 'Firebase not configured. Add firebase-service-account.json and set FIREBASE_STORAGE_BUCKET' });
    }

    const productId = req.body.productId || 'temp';
    const imageUrl = await firebase.uploadImage(req.file, productId);
    res.json({ ok: true, url: imageUrl });
  } catch (err) {
    console.error('Image upload error', err);
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// Multiple images upload endpoint (max 5 images)
app.post('/api/admin/upload-multiple', requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    if (!firebase.isConfigured()) {
      return res.status(500).json({ error: 'Firebase not configured. Add firebase-service-account.json and set FIREBASE_STORAGE_BUCKET' });
    }

    const productId = req.body.productId || 'temp_' + Date.now();
    const uploadPromises = req.files.map(file => firebase.uploadImage(file, productId));
    const imageUrls = await Promise.all(uploadPromises);
    
    res.json({ ok: true, urls: imageUrls });
  } catch (err) {
    console.error('Multiple images upload error', err);
    res.status(500).json({ error: 'Failed to upload images', details: err.message });
  }
});

// Delete image endpoint
app.delete('/api/admin/image', requireAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Image URL required' });
    
    const deleted = await firebase.deleteImage(url);
    res.json({ ok: deleted });
  } catch (err) {
    console.error('Image delete error', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Migration endpoint - migrate products from JSON to Firestore
app.post('/api/admin/migrate', requireAdmin, async (req, res) => {
  try {
    const count = await db.migrateToFirestore();
    res.json({ 
      success: true, 
      migrated: count, 
      message: `Successfully migrated ${count} products to Firestore` 
    });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Settings endpoints
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Get settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ shippingFee: 0 }));
    }
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    res.json(settings);
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

// Update settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const { shippingFee } = req.body;
    if (typeof shippingFee !== 'number' || shippingFee < 0) {
      return res.status(400).json({ error: 'Invalid shipping fee' });
    }
    
    const settings = { shippingFee: Number(shippingFee) };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    res.json({ ok: true, settings });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Public endpoint to get shipping fee for checkout
app.get('/api/settings/shipping', (req, res) => {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return res.json({ shippingFee: 0 });
    }
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    res.json({ shippingFee: settings.shippingFee || 0 });
  } catch (err) {
    console.error('Get shipping fee error:', err);
    res.json({ shippingFee: 0 });
  }
});

// Admin user management endpoints
const admin = require('firebase-admin');

// Get all admin users
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      disabled: user.disabled
    }));
    res.json({ users });
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// Add new admin user
app.post('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true
    });
    
    res.json({ 
      success: true, 
      user: { uid: userRecord.uid, email: userRecord.email } 
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: err.message || 'Failed to create user' });
  }
});

// Remove admin user
app.delete('/api/admin/users/:uid', requireAdmin, async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Prevent deleting yourself
    if (req.admin.uid === uid) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await admin.auth().deleteUser(uid);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// Rate limiting: protect APIs from abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 orders per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many order attempts, please try again later.' }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 admin requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many admin requests, please try again later.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts, please try again after 15 minutes.' }
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/order', orderLimiter);
app.use('/api/admin/login', loginLimiter);
app.use('/api/admin/', adminLimiter);



app.post('/api/order', async (req, res) => {
  try {
    const body = req.body;
    // expected: customer {name,address,contact}, items [{id,qty}], coupon?
    if (!body.customer || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    // Load product catalog from DB
    let catalog = db.getAllProducts();
    
    const items = [];
    let grandTotal = 0;

    for (const it of body.items) {
      const product = catalog.find(x => String(x.id) === String(it.id));
      if (!product) return res.status(400).json({ error: `Product ${it.id} not found` });
      const priceAfterDiscount = product.price * (1 - (product.discount || 0) / 100);
      const qty = Math.max(0, Number(it.qty) || 1);
      items.push({ id: product.id, name: product.name, price: priceAfterDiscount, qty });
      grandTotal += priceAfterDiscount * qty;
    }

    // apply coupon
    let coupon = null;
    if (body.coupon) {
      // simple coupon codes
      const code = String(body.coupon.code || '').toUpperCase();
      if (code === 'TENOFF') {
        coupon = { code, type: 'percent', value: 10 };
        grandTotal = grandTotal * 0.9;
      } else if (code === '50OFF') {
        coupon = { code, type: 'fixed', value: 50 };
        grandTotal = Math.max(0, grandTotal - 50);
      }
    }

    const order = {
      orderId: uid.rnd(),
      date: new Date().toISOString(),
      customer: body.customer,
      items,
      coupon,
      grandTotal,
      payment: 'Cash on Delivery'
    };

    // validate and decrement stock using DB
    const insufficient = [];
    for (const it of body.items) {
      const p = db.getProductById(String(it.id));
      const qty = Number(it.qty) || 0;
      if (!p) return res.status(400).json({ error: `Product ${it.id} not found` });
      if (p.inStock < qty) insufficient.push({ id: p.id, name: p.name, available: p.inStock });
    }
    if (insufficient.length) return res.status(400).json({ error: 'Insufficient stock', details: insufficient });

    // All good - decrement stock in DB
    for (const it of body.items) {
      const p = db.getProductById(String(it.id));
      const qty = Number(it.qty) || 0;
      const newStock = Math.max(0, p.inStock - qty);
      db.updateProduct(String(it.id), { inStock: newStock });
    }

    // persist order to DB
    try {
      db.createOrder(order);
    } catch (err) {
      console.error('Failed to persist order to DB:', err);
    }

    // send email (don't block response)
    sendOrderEmail(order).catch(err => console.error('Email error', err));

    res.json({ ok: true, orderId: order.orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Try available ports in sequence
const tryPort = async (startPort) => {
    for (let port = startPort; port < startPort + 10; port++) {
        try {
            await new Promise((resolve, reject) => {
                const testServer = require('http').createServer();
                testServer.on('error', reject);
                testServer.on('listening', () => {
                    testServer.close();
                    resolve(port);
                });
                testServer.listen(port);
            });
            return port;
        } catch (err) {
            if (err.code !== 'EADDRINUSE') throw err;
            // Port is in use, try next one
            continue;
        }
    }
    throw new Error('No available ports found');
};

let PORT;
console.log('Starting server...');
console.log('Current directory:', __dirname);
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

// Add debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API-only server - HTML routes removed (using React frontend)

// Start the server with auto port selection
const startServer = async () => {
    try {
        // Try to get the preferred port from environment or use 4000 as default
        PORT = process.env.PORT || await tryPort(4000);
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on:`);
            console.log(`- http://localhost:${PORT}`);
            console.log(`- http://127.0.0.1:${PORT}`);
            require('dns').lookup(require('os').hostname(), (err, addr) => {
                if (!err) console.log(`- http://${addr}:${PORT}`);
            });
        });

        server.on('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Start the server
startServer();
