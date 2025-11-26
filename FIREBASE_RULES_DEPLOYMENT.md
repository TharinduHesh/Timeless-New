# Firebase Rules Deployment Guide

## Overview
Updated Firebase security rules for the Timeless e-commerce application with comprehensive product management, admin controls, and enhanced security.

## Files Updated
1. ✅ **firestore.rules** - Firestore database security rules
2. ✅ **storage.rules** - Firebase Storage security rules (increased to 5MB max)
3. ✅ **firebase.json** - Configuration already includes both rule files

## Key Security Features

### Firestore Rules (`firestore.rules`)
- **Products Collection**
  - ✅ Public read access (anyone can view products)
  - ✅ Admin-only write access (create, update, delete)
  - ✅ Data validation: price ≥ 0, stock ≥ 0
  - ✅ Required fields validation

- **Orders Collection**
  - ✅ Public read access (for order tracking)
  - ✅ Public create access (for checkout)
  - ✅ Admin-only update/delete
  - ✅ Customer data validation

- **Settings Collection**
  - ✅ Public read access (for shipping fees at checkout)
  - ✅ Admin-only write access

- **Admin Users Collection**
  - ✅ Admin-only access (read/write)

### Storage Rules (`storage.rules`)
- **Product Images**
  - ✅ Public read access
  - ✅ Admin-only upload/delete
  - ✅ Maximum 5MB per image (increased from 2MB)
  - ✅ Image files only validation
  - ✅ Up to 5 images per product support

## Authentication Model
- **Admin Users**: Any authenticated Firebase user is considered an admin
- Uses Firebase Authentication with email/password
- Token-based verification via `request.auth != null`

## How to Deploy

### Step 1: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase (if needed)
```bash
firebase init
# Select: Firestore, Storage
# Use existing firestore.rules and storage.rules files
```

### Step 4: Deploy Rules
```bash
# Deploy both Firestore and Storage rules
firebase deploy --only firestore,storage

# Or deploy individually:
firebase deploy --only firestore
firebase deploy --only storage
```

### Step 5: Verify Deployment
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **timeless-4db98**
3. Check **Firestore Database > Rules** tab
4. Check **Storage > Rules** tab
5. Verify the rules were updated with timestamps

## Testing the Rules

### Test Firestore Rules
```bash
firebase emulators:start --only firestore
```

### Test Storage Rules
```bash
firebase emulators:start --only storage
```

### Test All Rules Together
```bash
firebase emulators:start
```

## Rule Highlights

### Security Improvements
1. ✅ **Authentication Required**: All admin operations require Firebase authentication
2. ✅ **Data Validation**: Enforces required fields and data types
3. ✅ **Public Read, Admin Write**: Products are publicly viewable but only admins can modify
4. ✅ **File Size Limits**: Storage limited to 5MB per image
5. ✅ **File Type Validation**: Only image files accepted in storage

### Backward Compatibility
- ✅ Supports old image paths with fallback rules
- ✅ Public product access maintained
- ✅ Checkout process remains seamless for customers

## Important Notes

### Admin User Setup
After deploying rules, create admin users:
1. Go to Firebase Console > Authentication
2. Click "Add user"
3. Enter email and password
4. These users can now access `/admin` panel

### Settings Collection
Create initial settings document:
```javascript
// In Firestore Console, create:
Collection: settings
Document ID: general
Fields:
  - shippingFee: 0 (number)
```

### Security Best Practices
- ✅ Never expose Firebase Admin SDK keys in client code
- ✅ Keep `firebase-service-account.json` secure (server-side only)
- ✅ Use environment variables for sensitive data
- ✅ Enable App Check for additional security (optional but recommended)

## Troubleshooting

### Issue: "Permission Denied" for Products
**Solution**: Ensure Firebase Authentication is set up and users are logged in

### Issue: "Image Upload Fails"
**Solution**: 
- Check file size (must be < 5MB)
- Verify file is an image type
- Confirm user is authenticated

### Issue: "Rules Not Updating"
**Solution**: 
```bash
# Clear cache and redeploy
firebase deploy --only firestore,storage --force
```

## Next Steps
1. ✅ Deploy rules: `firebase deploy --only firestore,storage`
2. ✅ Create first admin user in Firebase Console
3. ✅ Test admin panel login at `/admin`
4. ✅ Add products with multiple images
5. ✅ Verify public can view products but not edit

## Support
For issues, check:
- Firebase Console > Firestore > Rules tab for syntax errors
- Firebase Console > Storage > Rules tab for storage issues
- Browser console for client-side errors
- Server logs for authentication issues
