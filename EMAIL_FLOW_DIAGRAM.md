# Email Verification Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. USER VISITS /auth
   │
   ├─> Fills registration form:
   │   • First Name: John
   │   • Last Name: Doe
   │   • Email: john@example.com
   │   • Password: ••••••••
   │   • Phone: +250 123 456 789
   │
   └─> Clicks "Create Account"

2. BACKEND PROCESSES REGISTRATION
   │
   ├─> Creates user in database
   │   • isEmailVerified: false
   │   • verificationCode: "123456"
   │   • verificationCodeExpiry: +24 hours
   │
   ├─> Calls Resend API
   │   • From: VoyageShield <ngabolu@gmail.com>
   │   • To: john@example.com
   │   • Subject: "Verify your VoyageShield account"
   │   • Body: HTML email with 6-digit code
   │
   └─> Returns success + JWT token

3. FRONTEND REDIRECTS
   │
   └─> Navigate to /verify-email
       • Pass email via React Router state
       • Show 6-digit input boxes

4. USER CHECKS EMAIL
   │
   ├─> Opens inbox (or spam folder)
   │
   ├─> Sees email from VoyageShield
   │   ┌────────────────────────────────────┐
   │   │  VoyageShield                      │
   │   │  ================================  │
   │   │  Hello John,                       │
   │   │                                    │
   │   │  Your verification code is:        │
   │   │                                    │
   │   │      ┌──────────────┐              │
   │   │      │   123456     │              │
   │   │      └──────────────┘              │
   │   │                                    │
   │   │  Expires in 24 hours               │
   │   └────────────────────────────────────┘
   │
   └─> Copies code: 123456

5. USER ENTERS CODE
   │
   ├─> Types in verification page:
   │   [1] [2] [3] [4] [5] [6]
   │
   └─> Clicks "Verify Email"

6. BACKEND VERIFIES CODE
   │
   ├─> Checks if code matches
   ├─> Checks if code expired
   │
   ├─> Updates user:
   │   • isEmailVerified: true
   │   • verificationCode: null
   │   • verificationCodeExpiry: null
   │
   ├─> Sends welcome email
   │   • Subject: "Welcome to VoyageShield! 🎉"
   │   • Body: Welcome message + next steps
   │
   └─> Returns updated user data

7. FRONTEND REDIRECTS
   │
   └─> Navigate to /onboarding
       • User can now complete onboarding
       • Access to dashboard unlocked

8. USER COMPLETES ONBOARDING
   │
   ├─> Selects travel date
   ├─> Chooses travel purpose
   ├─> Picks insurance provider
   │
   └─> Clicks "Go to Dashboard"

9. USER ACCESSES DASHBOARD
   │
   └─> Full access to:
       • Payment system
       • Insurance certificate
       • Travel details
       • Payment history

┌─────────────────────────────────────────────────────────────────┐
│                     ALTERNATIVE FLOWS                            │
└─────────────────────────────────────────────────────────────────┘

RESEND CODE FLOW:
   User on /verify-email
   │
   ├─> Clicks "Resend Code"
   │
   ├─> Backend generates new code
   │   • Old code invalidated
   │   • New code: "789012"
   │   • New expiry: +24 hours
   │
   ├─> Sends new email via Resend
   │
   └─> User receives new code

INVALID CODE FLOW:
   User enters wrong code
   │
   ├─> Backend checks code
   │
   ├─> Code doesn't match
   │
   └─> Returns error: "Invalid verification code"
       • User can try again
       • Can request new code

EXPIRED CODE FLOW:
   User waits > 24 hours
   │
   ├─> Tries to verify
   │
   ├─> Backend checks expiry
   │
   └─> Returns error: "Code expired. Request new one."
       • User clicks "Resend Code"
       • Gets fresh code

LOGIN WITH UNVERIFIED EMAIL:
   User logs in
   │
   ├─> Authentication succeeds
   │
   ├─> Tries to access /onboarding
   │
   ├─> Onboarding checks isEmailVerified
   │
   └─> Redirects to /verify-email
       • Must verify before continuing

┌─────────────────────────────────────────────────────────────────┐
│                     TECHNICAL FLOW                               │
└─────────────────────────────────────────────────────────────────┘

REGISTRATION API CALL:
   POST /api/auth/register
   │
   ├─> Body: { email, password, firstName, lastName, phone }
   │
   ├─> Backend:
   │   1. Hash password
   │   2. Generate 6-digit code
   │   3. Set expiry (+24h)
   │   4. Create user in DB
   │   5. Call Resend API
   │   6. Generate JWT token
   │
   └─> Response: { user, token, message }

VERIFICATION API CALL:
   POST /api/auth/verify-email
   │
   ├─> Body: { email, code }
   │
   ├─> Backend:
   │   1. Find user by email
   │   2. Check code matches
   │   3. Check not expired
   │   4. Update isEmailVerified = true
   │   5. Clear code & expiry
   │   6. Send welcome email
   │
   └─> Response: { user, message }

RESEND API CALL:
   POST /api/auth/resend-verification
   │
   ├─> Body: { email }
   │
   ├─> Backend:
   │   1. Find user by email
   │   2. Generate new code
   │   3. Set new expiry
   │   4. Update DB
   │   5. Call Resend API
   │
   └─> Response: { message }

┌─────────────────────────────────────────────────────────────────┐
│                     EMAIL SERVICE FLOW                           │
└─────────────────────────────────────────────────────────────────┘

RESEND API INTEGRATION:
   EmailService.sendVerificationEmail()
   │
   ├─> Initialize Resend client
   │   • API Key from env: RESEND_API_KEY
   │
   ├─> Prepare email data:
   │   • from: "VoyageShield <ngabolu@gmail.com>"
   │   • to: user email
   │   • subject: "Verify your VoyageShield account"
   │   • html: Professional template with code
   │
   ├─> Call resend.emails.send()
   │   • HTTPS request to Resend API
   │   • Resend validates and queues email
   │   • Resend delivers to recipient
   │
   ├─> Handle response:
   │   • Success: Log confirmation
   │   • Error: Log error and throw
   │
   └─> Return success/failure

EMAIL DELIVERY:
   Resend API
   │
   ├─> Validates sender (ngabolu@gmail.com)
   ├─> Checks recipient email
   ├─> Applies SPF/DKIM signatures
   ├─> Routes to recipient's mail server
   │
   └─> Delivered to inbox (or spam)
       • User receives email
       • Can view in email client

┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE SCHEMA                              │
└─────────────────────────────────────────────────────────────────┘

User Table:
   ┌─────────────────────────────────────┐
   │ id                  UUID (PK)       │
   │ email               String (unique) │
   │ password            String (hashed) │
   │ firstName           String?         │
   │ lastName            String?         │
   │ phone               String?         │
   │ role                String          │
   │ isEmailVerified     Boolean ◄───────┼─ NEW
   │ verificationCode    String? ◄───────┼─ NEW
   │ verificationCodeExpiry DateTime? ◄──┼─ NEW
   │ destination         String?         │
   │ travelDate          DateTime?       │
   │ purpose             String?         │
   │ selectedPlanId      String?         │
   │ paymentPlan         String?         │
   │ hasCompletedOnboarding Boolean      │
   │ createdAt           DateTime        │
   │ updatedAt           DateTime        │
   └─────────────────────────────────────┘

State Transitions:
   Registration:
   • isEmailVerified: false
   • verificationCode: "123456"
   • verificationCodeExpiry: now + 24h

   After Verification:
   • isEmailVerified: true
   • verificationCode: null
   • verificationCodeExpiry: null

┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY MEASURES                            │
└─────────────────────────────────────────────────────────────────┘

✅ Code Expiry: 24 hours
✅ One-time Use: Deleted after verification
✅ Random Generation: Math.random() * 900000 + 100000
✅ HTTPS: All API calls encrypted
✅ JWT Token: Secure authentication
✅ Password Hashing: bcrypt
✅ API Key: Environment variable (not in code)
✅ Rate Limiting: Can be added to prevent spam

┌─────────────────────────────────────────────────────────────────┐
│                     MONITORING & LOGS                            │
└─────────────────────────────────────────────────────────────────┘

Backend Console Logs:
   📧 SENDING VERIFICATION EMAIL
   To: john@example.com
   Code: 123456
   ✅ Email sent successfully

Resend Dashboard:
   • Email delivery status
   • Open rates
   • Bounce rates
   • Error logs
   • Usage statistics

Database Queries:
   • User creation
   • Code verification
   • Email verification update
```

## Summary

This flow ensures:
1. Users verify their email before accessing the system
2. Codes are secure and time-limited
3. Professional emails are sent via Resend
4. Clear user experience with helpful error messages
5. Production-ready implementation
