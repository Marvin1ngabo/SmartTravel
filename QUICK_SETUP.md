# 🚀 Quick Setup - Real Email Verification

## 1️⃣ Get Resend API Key (2 minutes)

1. Go to **https://resend.com** → Sign up
2. Go to **API Keys** → Create API Key
3. Copy the key (starts with `re_`)

## 2️⃣ Add API Key to Project

Open `backend/.env` and update:
```env
RESEND_API_KEY=re_your_actual_key_here
```

## 3️⃣ Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd travel-smart-pay-main
npm run dev
```

## 4️⃣ Test It!

1. Go to `http://localhost:5173/auth`
2. Register with **your real email**
3. Check your **email inbox** for verification code
4. Enter code on verification page
5. Complete onboarding
6. Done! ✅

## 📧 Email Details

- **From**: VoyageShield <ngabolu@gmail.com>
- **Subject**: "Verify your VoyageShield account"
- **Contains**: 6-digit code in big letters
- **Check**: Inbox AND spam folder

## ⚠️ Troubleshooting

**No email received?**
- Check spam folder
- Verify API key in backend/.env
- Check backend console for errors
- Make sure backend server is running

**"Failed to send email" error?**
- Check if API key is correct
- Make sure it starts with `re_`
- No extra spaces in .env file
- Restart backend server after adding key

## 📚 More Info

- **Detailed Setup**: See `RESEND_SETUP_GUIDE.md`
- **Testing Guide**: See `START_TESTING.md`
- **Email Service Code**: See `backend/src/services/email.service.ts`

## 🎯 What You Get

✅ Real emails sent to users
✅ Professional HTML templates
✅ Verification codes
✅ Welcome emails
✅ Production-ready system

That's it! Your email system is ready. 🎉
