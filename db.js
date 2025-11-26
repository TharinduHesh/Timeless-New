const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Initialize Firebase Admin
let db;
let useFirestore = false;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || path.join(__dirname, 'firebase-service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    }
    
    db = admin.firestore();
    useFirestore = true;
    console.log('✓ Using Firebase Firestore for database');
  } else {
    console.log('⚠ Firebase not configured, using local JSON file');
  }
} catch (err) {
  console.log('⚠ Firebase initialization failed, using local JSON file:', err.message);
}

// Fallback to JSON file
let localDB = { products: [], orders: [] };

// Always load local JSON as backup
if (fs.existsSync(PRODUCTS_FILE)) {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8')) || [];
    localDB.products = products;
    console.log(`Loaded ${products.length} products from local JSON file`);
  } catch (err) {
    console.error('Failed to load products.json:', err);
  }
}


function saveLocalDB() {
  if (!useFirestore) {
    try {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(localDB.products, null, 2));
    } catch (err) {
      console.error('Failed to save products:', err);
    }
  }
}

// Firestore product functions
async function getAllProductsFirestore() {
  try {
    const snapshot = await db.collection('products').get();
    const firestoreProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If Firestore is empty, use local JSON as fallback
    if (firestoreProducts.length === 0) {
      console.log('⚠ Firestore empty, returning products from local JSON');
      return getAllProductsLocal();
    }
    
    return firestoreProducts;
  } catch (err) {
    console.error('Firestore error, falling back to local JSON:', err.message);
    return getAllProductsLocal();
  }
}

async function getProductByIdFirestore(id) {
  const doc = await db.collection('products').doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function createProductFirestore(p) {
  const docRef = await db.collection('products').add({
    name: p.name || '',
    brand: p.brand || '',
    category: p.category || '',
    price: Number(p.price || 0),
    stock: Number(p.stock || p.inStock || 0),
    discount: Number(p.discount || 0),
    description: p.description || '',
    image: p.image || '',
    images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
}

async function updateProductFirestore(id, fields) {
  const docRef = db.collection('products').doc(id);
  const updateData = {};
  
  if (fields.name !== undefined) updateData.name = fields.name;
  if (fields.brand !== undefined) updateData.brand = fields.brand;
  if (fields.category !== undefined) updateData.category = fields.category;
  if (fields.price !== undefined) updateData.price = Number(fields.price);
  if (fields.stock !== undefined) updateData.stock = Number(fields.stock);
  if (fields.discount !== undefined) updateData.discount = Number(fields.discount);
  if (fields.description !== undefined) updateData.description = fields.description;
  if (fields.image !== undefined) updateData.image = fields.image;
  if (fields.images !== undefined) updateData.images = Array.isArray(fields.images) ? fields.images : [];
  
  updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
  await docRef.update(updateData);
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
}

async function deleteProductFirestore(id) {
  await db.collection('products').doc(id).delete();
  return true;
}

// Local JSON product functions
function getAllProductsLocal() {
  return localDB.products || [];
}

function getProductByIdLocal(id) {
  return (localDB.products || []).find(p => String(p.id) === String(id)) || null;
}

function createProductLocal(p) {
  const id = p.id || ("p_" + Math.random().toString(36).slice(2, 9));
  const product = {
    id: String(id),
    name: p.name || '',
    brand: p.brand || '',
    category: p.category || '',
    price: Number(p.price || 0),
    stock: Number(p.stock || p.inStock || 0),
    discount: Number(p.discount || 0),
    description: p.description || '',
    image: p.image || '',
    images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
    createdAt: new Date().toISOString()
  };
  localDB.products.push(product);
  saveLocalDB();
  return product;
}

function updateProductLocal(id, fields) {
  const idx = localDB.products.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  const p = localDB.products[idx];
  
  if (fields.name !== undefined) p.name = fields.name;
  if (fields.brand !== undefined) p.brand = fields.brand;
  if (fields.category !== undefined) p.category = fields.category;
  if (fields.price !== undefined) p.price = Number(fields.price);
  if (fields.stock !== undefined) p.stock = Number(fields.stock);
  if (fields.discount !== undefined) p.discount = Number(fields.discount);
  if (fields.description !== undefined) p.description = fields.description;
  if (fields.image !== undefined) p.image = fields.image;
  if (fields.images !== undefined) p.images = Array.isArray(fields.images) ? fields.images : [];
  
  localDB.products[idx] = p;
  saveLocalDB();
  return p;
}

function deleteProductLocal(id) {
  const len = localDB.products.length;
  localDB.products = localDB.products.filter(p => String(p.id) !== String(id));
  if (localDB.products.length < len) {
    saveLocalDB();
    return true;
  }
  return false;
}


// Exports: product functions
module.exports = {
  async getAllProducts() {
    return useFirestore ? await getAllProductsFirestore() : getAllProductsLocal();
  },
  async getProductById(id) {
    return useFirestore ? await getProductByIdFirestore(id) : getProductByIdLocal(id);
  },
  async createProduct(p) {
    return useFirestore ? await createProductFirestore(p) : createProductLocal(p);
  },
  async updateProduct(id, fields) {
    return useFirestore ? await updateProductFirestore(id, fields) : updateProductLocal(id, fields);
  },
  async deleteProduct(id) {
    return useFirestore ? await deleteProductFirestore(id) : deleteProductLocal(id);
  },

  // Orders (keep local for now)
  getAllOrders() {
    return localDB.orders || [];
  },
  createOrder(order) {
    if (!localDB.orders) localDB.orders = [];
    localDB.orders.push(order);
    return order;
  },
  
  // Migration utility
  async migrateToFirestore() {
    if (!useFirestore) {
      throw new Error('Firestore not configured');
    }
    const products = getAllProductsLocal();
    console.log(`Migrating ${products.length} products to Firestore...`);
    for (const product of products) {
      await createProductFirestore(product);
    }
    console.log('Migration complete!');
    return products.length;
  }
};
