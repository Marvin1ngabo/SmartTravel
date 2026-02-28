# Gmail SMTP Setup Guide

## Overview
Your system now uses Gmail SMTP to send emails. This is completely FREE and can send to ANY email address!

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" in the left menu
3. Under "How you sign in to Google", click "2-Step Verification"
4. Follow the steps to enable 2FA (if not already enabled)

## Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. In the "Select app" dropdown, choose "Mail"
4. In the "Select device" dropdown, choose "Other (Custom name)"
5. Type: "VoyageShield"
6. Click "Generate"
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
8. Remove the spaces: `abcdefghijklmnop`

## Step 3: Add to Your Project

Open `backend/.env` and update:
```env
EMAIL_USER=ngabolu@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

Replace `abcdefghijklmnop` with your actual app password (no spaces).

## Step 4: Restart Backend

Stop and restart your backend server:
```bash
# Stop the current server (Ctrl+C)
# Then start again:
cd backend
npm run dev
```

## Step 5: Test It!

1. Register with ANY email address
2. Check that email's inbox
3. You should receive the verification code
4. Works with Gmail, Outlook, Yahoo, any email!

## ✅ Benefits of Gmail SMTP

- **Completely FREE**: No paid plans needed
- **Send to ANY email**: No restrictions on recipients
- **500 emails/day**: More than enough for testing and small apps
- **Reliable**: Gmail's infrastructure
- **No domain verification needed**: Works immediately

## 🔒 Security Notes

- **Never share your app password**
- **Don't commit .env to Git** (it's already in .gitignore)
- **App password is different from your Gmail password**
- **You can revoke app passwords anytime** at https://myaccount.google.com/apppasswords

## 📧 Email Limits

- **Free Gmail**: 500 emails/day
- **Google Workspace**: 2,000 emails/day
- Perfect for testing and small to medium apps

## 🆘 Troubleshooting

### "Invalid login" error
- Make sure 2FA is enabled on your Google account
- Generate a new app password
- Copy the password without spaces
- Use the app password, not your regular Gmail password

### "Less secure app" error
- This shouldn't happen with app passwords
- Make sure you're using an app password, not regular password

### Emails going to spam
- Normal for new senders
- Recipients should mark as "Not Spam"
- Gmail reputation improves over time

### Rate limit exceeded
- Free Gmail: 500 emails/day limit
- Wait 24 hours or upgrade to Google Workspace

## 🎯 Quick Reference

```env
# In backend/.env
EMAIL_USER=ngabolu@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
```

That's it! Much simpler than Resend and works with any email address. 🎉
