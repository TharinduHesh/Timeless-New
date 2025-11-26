const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let bucket = null;
let initialized = false;

function initializeFirebase() {
  if (initialized) return bucket;
  
  try {
    // Check if service account file exists
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || path.join(__dirname, 'firebase-service-account.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.log('Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT path or add firebase-service-account.json');
      return null;
    }

    const serviceAccount = require(serviceAccountPath);
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!storageBucket) {
      console.log('Firebase Storage Bucket not configured. Set FIREBASE_STORAGE_BUCKET in .env');
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket
    });

    bucket = admin.storage().bucket();
    initialized = true;
    console.log('Firebase initialized successfully');
    return bucket;
  } catch (err) {
    console.error('Firebase initialization error:', err.message);
    return null;
  }
}

async function uploadImage(file, productId) {
  const bucket = initializeFirebase();
  if (!bucket) {
    throw new Error('Firebase not configured');
  }

  const filename = `products/${productId}/${Date.now()}_${file.originalname}`;
  const blob = bucket.file(filename);
  
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', async () => {
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
}

async function deleteImage(imageUrl) {
  const bucket = initializeFirebase();
  if (!bucket) return false;

  try {
    // Extract filename from URL
    const filename = imageUrl.split(`/${bucket.name}/`)[1];
    if (filename) {
      await bucket.file(filename).delete();
      return true;
    }
    return false;
  } catch (err) {
    console.error('Delete image error:', err.message);
    return false;
  }
}

module.exports = {
  initializeFirebase,
  uploadImage,
  deleteImage,
  isConfigured: () => initialized || initializeFirebase() !== null
};
