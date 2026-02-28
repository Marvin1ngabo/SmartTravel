# Email Verification System - Testing Guide

## Overview
The email verification system ensures users verify their email address before accessing the onboarding process. This prevents fake accounts and ensures valid contact information.

## How It Works

### Registration Flow
1. User fills out registration form (first name, last name, email, password, phone)
2. System creates account with `isEmailVerified: false`
3. System generates 6-digit verification code (expires in 24 hours)
4. System sends verification email (currently logs to backend console)
5. User is redirected to `/verify-email` page
6. User cannot access onboarding until email is verified

### Verification Flow
1. User enters 6-digit code from email
2. System validates code and expiry
3. On success: `isEmailVerified` set to `true`, welcome email sent
4. User is redirected to onboarding page
5. User can now complete onboarding and access dashboard

### Login Flow
- Existing users can log in regardless of verification status
- Onboarding page checks `isEmailVerified` and redirects to verification if needed
- Dashboard is only accessible after both email verification AND onboarding completion

## Testing Instructions

### Prerequisites
1. PostgreSQL database running on `localhost:5432`
2. Backend server running on `http://localhost:3001`
3. Frontend running on `http://localhost:5173` (or your dev port)

### Test Case 1: New User Registration
1. Navigate to `/auth` page
2. Click "Sign Up" if on login form
3. Fill in registration details:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
   - Phone: +250 123 456 789 (optional)
4. Click "Create Account"
5. **Expected**: Redirected to `/verify-email` page
6. **Check backend console** for verification code (look for "📧 VERIFICATION EMAIL")

### Test Case 2: Email Verification
1. From verification page, enter the 6-digit code from backend console
2. Code auto-advances to next input as you type
3. Click "Verify Email"
4. **Expected**: Success toast, redirected to `/onboarding`
5. **Check backend console** for welcome email confirmation

### Test Case 3: Resend Verification Code
1. On verification page, click "Resend Code"
2. **Expected**: New code sent, old code invalidated
3. **Check backend console** for new verification code
4. Enter new code to verify

### Test Case 4: Invalid Code
1. On verification page, enter wrong code (e.g., 000000)
2. Click "Verify Email"
3. **Expected**: Error toast "Invalid verification code"

### Test Case 5: Expired Code
1. Register a new user
2. Wait 24 hours (or manually update database to set `verificationCodeExpiry` to past date)
3. Try to verify with the code
4. **Expected**: Error toast "Verification code expired. Please request a new one."

### Test Case 6: Already Verified
1. Try to access `/verify-email` with an already verified account
2. **Expected**: Redirected to onboarding or dashboard

### Test Case 7: Onboarding Protection
1. Register new user but don't verify email
2. Try to access `/onboarding` directly
3. **Expected**: Redirected to `/verify-email` with error toast

### Test Case 8: Login with Unverified Email
1. Register new user, note the email
2. Close browser/logout
3. Login with same credentials
4. Try to access onboarding
5. **Expected**: Redirected to verification page

## Database Schema

```prisma
model User {
  // ... other fields
  isEmailVerified Boolean @default(false)
  verificationCode String?
  verificationCodeExpiry DateTime?
}
```

## API Endpoints

### POST /api/auth/register
Creates new user and sends verification email
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+250123456789"
}
```

### POST /api/auth/verify-email
Verifies email with code
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### POST /api/auth/resend-verification
Resends verification code
```json
{
  "email": "user@example.com"
}
```

## Email Service Configuration

### Current Setup (Development)
- Emails are logged to backend console
- Look for "📧 VERIFICATION EMAIL" in terminal
- Copy the 6-digit code from console output

### Production Setup (Future)
To enable real email sending, update `backend/src/services/email.service.ts`:

1. **Using Resend** (Recommended):
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'VoyageShield <noreply@voyageshield.com>',
  to: email,
  subject: 'Verify your VoyageShield account',
  html: `<h1>${code}</h1>`
});
```

2. **Using SendGrid**:
```bash
npm install @sendgrid/mail
```

3. **Using AWS SES**:
```bash
npm install @aws-sdk/client-ses
```

## Troubleshooting

### "Database not running" error
- Start PostgreSQL: `pg_ctl start` or use your database GUI
- Check connection string in `backend/.env`

### "Email not verified" keeps showing
- Check backend console for verification code
- Verify code hasn't expired (24 hours)
- Check database: `SELECT isEmailVerified FROM "User" WHERE email = 'test@example.com';`

### Verification code not appearing in console
- Ensure backend server is running
- Check for errors in backend terminal
- Verify email service is not throwing errors

### Can't access onboarding after verification
- Check if `isEmailVerified` is true in database
- Try refreshing the page
- Check browser console for errors
- Verify token is valid in localStorage

## Security Features

1. **Code Expiry**: Codes expire after 24 hours
2. **One-time Use**: Code is deleted after successful verification
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **Secure Storage**: Codes stored in database, not in JWT
5. **No Email in URL**: Email passed via React Router state, not URL params

## Next Steps

1. ✅ Database schema updated with verification fields
2. ✅ Backend endpoints created
3. ✅ Frontend verification page created
4. ✅ Email service (console logging)
5. ✅ Onboarding protection added
6. 🔄 Test the complete flow
7. 📧 Integrate real email service for production
8. 🎨 Consider adding email verification status to admin dashboard
9. 🔒 Add rate limiting to prevent code spam
10. 📱 Optional: Add SMS verification as alternative
