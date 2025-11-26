# Contact Messages Feature

## Overview
Implemented a complete contact form messaging system that allows customers to send inquiries and admins to manage them.

## Components Implemented

### 1. Firestore Service (`client/src/services/firestore.ts`)
Added `firestoreContactService` with the following methods:
- `getAll()` - Fetch all contact messages ordered by creation date
- `create(messageData)` - Save new contact form submissions
- `updateStatus(messageId, status)` - Mark messages as read/unread
- `delete(messageId)` - Delete messages

### 2. Contact Form (`client/src/pages/Contact.tsx`)
- Updated form submission to save messages to Firestore
- Messages include: name, email, subject, message, timestamp, and status
- Added error handling for submission failures

### 3. Admin Panel Messages Tab (`client/src/pages/Admin.tsx`)
Added new "Messages" tab with:
- Table view displaying all contact messages
- Columns: Date, Name, Email, Subject, Status, Actions
- Status badges (yellow for unread, green for read)
- Mark as Read/Unread button
- Delete button with confirmation
- Empty state when no messages exist

### 4. Firebase Security Rules (`firestore.rules`)
Added rules for `contactMessages` collection:
- Anyone can create messages (public contact form)
- Only authenticated admins can read, update, or delete messages
- Field validation: name, email, subject, message (all strings required)

## Deployment Status
✅ Firestore rules deployed successfully to Firebase project `timeless-4db98`

## Usage

### For Customers:
1. Navigate to Contact page
2. Fill out form: Name, Email, Subject, Message
3. Click "Send Message"
4. Message is saved to Firestore with "unread" status

### For Admins:
1. Login to Admin panel
2. Click "Messages" tab
3. View all customer messages in table format
4. Click "Mark as Read" to change status
5. Click "Delete" to remove a message (with confirmation)

## Technical Details

### Data Structure
```typescript
{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number; // timestamp
  status: 'read' | 'unread';
}
```

### Firebase Collection
- Collection name: `contactMessages`
- Ordered by: `createdAt` (descending)

### React Query Integration
- Query key: `['contact-messages']`
- Auto-refetches after mutations
- Enabled only when admin is authenticated

## Files Modified
1. `client/src/services/firestore.ts` - Added contact service
2. `client/src/pages/Contact.tsx` - Integrated form submission
3. `client/src/pages/Admin.tsx` - Added Messages tab
4. `firestore.rules` - Added security rules

## Security
- Public can only create messages
- Admins must be authenticated to view/manage
- Field validation enforced at database level
- Delete requires confirmation dialog
