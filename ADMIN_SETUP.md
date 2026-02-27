# Admin Role Setup Guide

## Overview
The SmartTravel application now has role-based access control. By default, all users are created with the "user" role. Admin users have access to the Admin dashboard.

## What's Been Implemented

1. **Database Schema**: Added `role` field to User model (default: "user")
2. **Backend**: Auth controllers return the `role` field in all responses
3. **Frontend**: 
   - Admin button only shows for users with `role === 'admin'`
   - AdminRoute component protects the Admin page
   - Non-admin users are redirected to dashboard if they try to access /admin

## How to Set a User as Admin

Since there's no UI for this yet, you need to manually update the database:

### Option 1: Using PostgreSQL Command Line
```bash
psql -U postgres -d SmartTravel
```

Then run:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Option 2: Using Prisma Studio
```bash
cd backend
npx prisma studio
```

1. Open the User table
2. Find your user
3. Change the `role` field from "user" to "admin"
4. Save

### Option 3: Using pgAdmin or any PostgreSQL GUI
Connect to the SmartTravel database and run:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Testing

1. **As Regular User**:
   - Login with a regular account
   - Admin button should NOT appear in the dashboard navbar
   - Trying to access `/admin` directly should redirect to `/dashboard`

2. **As Admin User**:
   - Set your user role to 'admin' using one of the methods above
   - Logout and login again (or refresh the page)
   - Admin button should appear in the dashboard navbar
   - Clicking Admin button should take you to the Admin page

## Future Enhancements

Consider adding:
- Admin user creation UI (for super admins)
- Role management page
- More granular permissions (e.g., moderator, support, etc.)
- Audit logs for admin actions
