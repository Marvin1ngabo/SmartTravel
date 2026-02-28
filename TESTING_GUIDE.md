# Testing Guide

## Prerequisites
1. Backend server running on `http://localhost:3001`
2. Frontend running on `http://localhost:5173` (or your dev port)
3. Database seeded with insurance plans

## Test Scenarios

### 1. Test User Registration & Onboarding

**Steps:**
1. Go to `/auth` and create a new account
2. Complete onboarding:
   - Select travel date
   - Choose purpose (Tourism, Study, Work, Business)
   - Select an insurance provider
3. Click "Go to Dashboard"

**Expected Result:**
- User is redirected to dashboard
- Selected insurance plan is displayed
- Balance shows: Required = plan price, Paid = $0, Remaining = plan price
- No payment history shown

### 2. Test Payment System

**Steps:**
1. On dashboard, enter amount (e.g., $50)
2. Click "Add" button
3. Wait for success toast
4. Check the dashboard updates

**Expected Result:**
- Success toast appears: "Payment successful! $50 has been added to your account"
- Total Paid increases by $50
- Remaining balance decreases by $50
- Progress ring updates
- Payment appears in Payment Timeline

**Test Multiple Payments:**
1. Make another payment of $25
2. Make another payment of $100
3. Check "Contribution History" section

**Expected Result:**
- All payments listed with dates, amounts, methods
- Total paid = sum of all payments
- Math is correct: Required - Paid = Remaining

### 3. Test Full Payment

**Steps:**
1. Click "Pay Full Balance" button
2. Confirm payment

**Expected Result:**
- Remaining balance becomes $0
- Progress shows 100%
- "Fully Paid ✓" message appears
- "View Certificate" button becomes available

### 4. Test Certificate

**Steps:**
1. After full payment, click "View Certificate"
2. Check certificate details

**Expected Result:**
- Certificate shows correct:
  - Your name (firstName + lastName)
  - Destination
  - Insurance provider name
  - Coverage amount (plan price)
  - Travel dates
  - Policy number (generated from user ID)

### 5. Test Session Persistence

**Steps:**
1. Make a payment of $50
2. Logout
3. Login again
4. Go to dashboard

**Expected Result:**
- Payment history is still there
- Total paid still shows $50
- Balance is correct
- All data persisted

### 6. Test Admin Dashboard (Admin User Only)

**Create Admin User:**
```sql
-- In your database, update a user to admin:
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Steps:**
1. Login with admin account
2. Click "Admin" button in navbar
3. Check "Travelers" tab

**Expected Result:**
- See all registered users
- Each user shows:
  - Name, email, destination
  - Selected insurance plan
  - Required amount
  - Total paid
  - Progress bar
  - Status (Fully Paid, Saving, Not Started)

**Check Payment Logs:**
1. Click "Payment Logs" tab

**Expected Result:**
- See all payments from all users
- Shows date, user name, amount, method, status

**Check Revenue:**
1. Click "Revenue" tab

**Expected Result:**
- Total collected (sum of all payments)
- Total expected (sum of all plan prices)
- Outstanding balance
- Commission (5% of collected)
- Revenue per insurance provider

### 7. Test Insurance Plan Management (Admin Only)

**Create New Plan:**
1. Go to Admin Dashboard
2. Click "Insurance Plans" tab
3. Click "+ Add New Plan"
4. Fill in:
   - Name: "Test Premium Plan"
   - Description: "Premium coverage for testing"
   - Price: 350
   - Duration: 45
   - Coverage items: Add 2-3 items
5. Click "Create Plan"

**Expected Result:**
- Success toast appears
- New plan appears in the grid
- Plan is now available in onboarding

**Edit Plan:**
1. Click edit (✏️) button on a plan
2. Modify details
3. Save

**Expected Result:**
- Plan updates successfully
- Changes reflected immediately

**Deactivate Plan:**
1. Click delete (🗑️) button
2. Confirm

**Expected Result:**
- Plan marked as inactive
- No longer appears in onboarding
- Still visible in admin (marked inactive)

## Common Issues & Solutions

### Issue: "Failed to load insurance plan"
**Solution:** 
- Check backend is running
- Check database has insurance plans
- Run seed script: `npm run seed` in backend folder

### Issue: "Failed to load payment history"
**Solution:**
- Check backend API is accessible
- Check authentication token is valid
- Check browser console for errors

### Issue: Admin dashboard shows no users
**Solution:**
- Ensure you're logged in as admin
- Check user role in database: `SELECT email, role FROM "User";`
- Update role if needed: `UPDATE "User" SET role = 'admin' WHERE email = 'your-email';`

### Issue: Payments not persisting
**Solution:**
- Check database connection
- Check Prisma client is initialized
- Check backend logs for errors
- Verify payment endpoint is being called

## API Testing with curl

### Create Payment
```bash
curl -X POST http://localhost:3001/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount": 50, "currency": "USD", "method": "Test Payment"}'
```

### Get Payment History
```bash
curl http://localhost:3001/api/payments/user/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Users (Admin)
```bash
curl http://localhost:3001/api/insurance/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Database Queries for Verification

### Check user payments
```sql
SELECT u.email, u."firstName", u."lastName", p.amount, p.status, p."createdAt"
FROM "User" u
LEFT JOIN "Payment" p ON u.id = p."userId"
ORDER BY p."createdAt" DESC;
```

### Check total paid per user
```sql
SELECT 
  u.email,
  u."firstName",
  u."lastName",
  COALESCE(SUM(p.amount), 0) as total_paid
FROM "User" u
LEFT JOIN "Payment" p ON u.id = p."userId" AND p.status = 'completed'
GROUP BY u.id, u.email, u."firstName", u."lastName";
```

### Check insurance plans
```sql
SELECT * FROM "InsurancePlan" WHERE "isActive" = true;
```

## Success Criteria

✅ User can register and complete onboarding
✅ User can make payments of any amount
✅ Payments are saved to database
✅ Balance calculations are correct
✅ Payment history persists across sessions
✅ Certificate shows correct user data
✅ Admin can view all users and payments
✅ Admin can create/edit insurance plans
✅ All math is accurate (no rounding errors)
✅ No real money is required for testing
