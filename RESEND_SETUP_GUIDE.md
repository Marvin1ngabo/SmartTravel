# Resend Email Service Setup Guide

## Overview
Your VoyageShield system now uses Resend to send real emails. Resend is a modern email API that's reliable, fast, and easy to set up.

## System Email
- **From Address**: ngabolu@gmail.com
- **Display Name**: VoyageShield

## Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" or "Get Started"
3. Sign up with your email (you can use ngabolu@gmail.com)
4. Verify your email address

## Step 2: Get Your API Key

1. After logging in, go to the [API Keys page](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "VoyageShield Production")
4. Select permissions: "Sending access"
5. Click "Create"
6. **IMPORTANT**: Copy the API key immediately (it won't be shown again)
   - It will look like: `re_123abc456def789ghi`

## Step 3: Add API Key to Your Project

1. Open `backend/.env` file
2. Find the line: `RESEND_API_KEY=your_resend_api_key_here`
3. Replace `your_resend_api_key_here` with your actual API key
4. Save the file

Example:
```env
RESEND_API_KEY=re_123abc456def789ghi
```

## Step 4: Verify Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., voyageshield.com)
4. Follow the DNS setup instructions
5. Wait for verification (usually takes a few minutes)

**Note**: For testing, you can skip this step. Resend allows sending to any email address in development mode.

## Step 5: Test Email Sending

1. Make sure your backend server is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Register a new user with a real email address
3. Check your email inbox for the verification code
4. Check spam folder if you don't see it

## Email Templates

Your system sends two types of emails:

### 1. Verification Email
- **Subject**: "Verify your VoyageShield account"
- **Contains**: 6-digit verification code
- **Expires**: 24 hours
- **Sent when**: User registers

### 2. Welcome Email
- **Subject**: "Welcome to VoyageShield! 🎉"
- **Contains**: Welcome message and next steps
- **Sent when**: User successfully verifies email

## Pricing

Resend offers:
- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Pro Tier**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

For most startups, the free tier is sufficient for testing and early users.

## Troubleshooting

### "Failed to send email" error

1. **Check API Key**:
   - Make sure you copied the full API key
   - Check for extra spaces in .env file
   - API key should start with `re_`

2. **Check Resend Dashboard**:
   - Go to [Resend Logs](https://resend.com/logs)
   - See if emails are being sent
   - Check for error messages

3. **Check Backend Console**:
   - Look for error messages in terminal
   - Should see "✅ Email sent successfully" or error details

### Emails going to spam

1. **Verify your domain** (see Step 4 above)
2. **Add SPF and DKIM records** (Resend provides these)
3. **Warm up your domain** (start with small volumes)
4. **Avoid spam trigger words** in email content

### Rate limiting

If you're sending too many emails:
- Free tier: 100 emails/day limit
- Add delays between emails
- Upgrade to Pro tier for higher limits

## Security Best Practices

1. **Never commit API keys to Git**:
   - .env file is in .gitignore
   - Use environment variables in production

2. **Rotate API keys regularly**:
   - Create new key every 3-6 months
   - Delete old keys after rotation

3. **Use different keys for environments**:
   - Development key for testing
   - Production key for live system

4. **Monitor usage**:
   - Check Resend dashboard regularly
   - Set up alerts for unusual activity

## Alternative Email Services

If you prefer a different service, you can modify `backend/src/services/email.service.ts`:

### SendGrid
```bash
npm install @sendgrid/mail
```

### AWS SES
```bash
npm install @aws-sdk/client-ses
```

### Mailgun
```bash
npm install mailgun.js
```

## Production Checklist

Before going live:
- [ ] Verify domain in Resend
- [ ] Set up SPF and DKIM records
- [ ] Test emails to multiple providers (Gmail, Outlook, Yahoo)
- [ ] Check spam scores
- [ ] Set up email monitoring/alerts
- [ ] Add unsubscribe links (if sending marketing emails)
- [ ] Comply with email regulations (CAN-SPAM, GDPR)

## Support

- **Resend Documentation**: [https://resend.com/docs](https://resend.com/docs)
- **Resend Support**: support@resend.com
- **Status Page**: [https://status.resend.com](https://status.resend.com)

## Current Configuration

```typescript
// System email (from address)
const SYSTEM_EMAIL = 'ngabolu@gmail.com';

// Email templates use:
// - Professional HTML design
// - Responsive layout
// - Brand colors (maroon gradient)
// - Clear call-to-action
```

## Next Steps

1. Get your Resend API key (see Step 2)
2. Add it to `backend/.env`
3. Restart backend server
4. Test by registering a new user
5. Check your email inbox for verification code

That's it! Your email system is now ready to send real emails. 📧
