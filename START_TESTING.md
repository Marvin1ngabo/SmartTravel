# Quick Start Guide - Email Verification Testing

## Prerequisites

### 1. Get Resend API Key (Required for Real Emails)
1. Go to [https://resend.com](https://resend.com) and sign up
2. Create an API key in the dashboard
3. Copy the API key (starts with `re_`)
4. Open `backend/.env` file
5. Replace `your_resend_api_key_here` with your actual API key
6. Save the file

**See `RESEND_SETUP_GUIDE.md` for detailed instructions**

## Step 1: Start Backend Server
Open a terminal in the `backend` folder and run:
```bash
cd backend
npm run dev
```

The backend should start on `http://localhost:3001`

## Step 2: Start Frontend Server
Open another terminal in the `travel-smart-pay-main` folder and run:
```bash
cd travel-smart-pay-main
npm run dev
```

The frontend should start on `http://localhost:5173` (or similar)

## Step 3: Test Email Verification

### Register a New User
1. Open browser to `http://localhost:5173/auth`
2. Fill in registration form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
3. Click "Create Account"
4. You should be redirected to the verification page

### Get Verification Code
1. **Check your email inbox** (the email you used to register)
2. Look for email from "VoyageShield <ngabolu@gmail.com>"
3. Subject: "Verify your VoyageShield account"
4. The 6-digit code will be displayed prominently in the email
5. **Also check spam folder** if you don't see it in inbox

**Note**: The backend console will also log when emails are sent for debugging.

### Verify Email
1. Enter the 6-digit code in the verification page
2. Click "Verify Email"
3. You should see a success message and be redirected to onboarding

### Complete Onboarding
1. Select travel date
2. Choose travel purpose
3. Select insurance provider
4. Click "Go to Dashboard"

### Access Dashboard
1. You should now see your dashboard with payment information
2. Your insurance plan should be displayed
3. You can make payments and view your certificate

## What Changed?

### New Features
✅ Email verification required before onboarding
✅ 6-digit verification code system
✅ **Real email sending via Resend API**
✅ **Professional HTML email templates**
✅ Code expires in 24 hours
✅ Resend code functionality
✅ Auto-focus and auto-advance code input
✅ Paste support for verification codes
✅ Welcome email after verification
✅ Onboarding blocks unverified users

### Database Changes
✅ Added `isEmailVerified` field (default: false)
✅ Added `verificationCode` field (6-digit code)
✅ Added `verificationCodeExpiry` field (24-hour expiry)

### New API Endpoints
✅ POST `/api/auth/verify-email` - Verify email with code
✅ POST `/api/auth/resend-verification` - Resend verification code

### New Pages
✅ `/verify-email` - Email verification page with 6-digit input

## Troubleshooting

### Backend won't start
- Make sure PostgreSQL is running
- Check `backend/.env` has correct database URL
- Run `npm install` in backend folder

### Frontend won't start
- Run `npm install` in travel-smart-pay-main folder
- Check if port 5173 is available

### Can't see verification code
- **Check your email inbox** (including spam folder)
- Email comes from "VoyageShield <ngabolu@gmail.com>"
- Make sure you entered a valid email address
- Check backend terminal for "✅ Email sent successfully" message
- If email fails, check Resend API key in backend/.env

### "Email not verified" error
- Make sure you entered the correct code from backend console
- Code expires in 24 hours - request a new one if needed
- Check backend terminal for any errors

### Database errors
- Run `npx prisma db push` in backend folder
- Make sure PostgreSQL is running
- Check database connection in backend/.env

## Production Deployment

Your system is now production-ready with real email sending!

### What's Already Set Up:
✅ Resend email service integrated
✅ Professional HTML email templates
✅ System email: ngabolu@gmail.com
✅ Verification and welcome emails

### For Production:
1. ✅ Get Resend API key (see RESEND_SETUP_GUIDE.md)
2. ✅ Add API key to backend/.env
3. 🔄 Consider verifying your domain in Resend (optional but recommended)
4. 🔄 Add rate limiting to prevent abuse
5. 🔄 Add email verification status to admin dashboard
6. 🔄 Monitor email delivery in Resend dashboard

See `RESEND_SETUP_GUIDE.md` for complete production setup instructions.
