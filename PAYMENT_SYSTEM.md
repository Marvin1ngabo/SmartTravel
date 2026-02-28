# Payment System Documentation

## Overview
The payment system is designed for testing without requiring real money. All payments are simulated but the math and data persistence are fully functional.

## How It Works

### User Dashboard Payment Flow

1. **View Balance**
   - User sees their required amount (from selected insurance plan)
   - Total paid amount (sum of all completed payments)
   - Remaining balance (required - paid)

2. **Make a Payment**
   - User can enter a custom amount or use quick buttons ($10, $25, $50)
   - Click "Add" or "Pay Full Balance"
   - Payment is instantly marked as "completed" (no real payment gateway)
   - Payment is saved to database
   - Dashboard refreshes to show updated balance

3. **Payment History**
   - All payments are stored in the database
   - Each payment includes:
     - Amount
     - Date/time
     - Payment method (default: "Online Payment")
     - Status (completed)
   - History persists across sessions

### Data Persistence

**What Gets Saved:**
- Every payment creates a record in the `Payment` table
- Linked to the user via `userId`
- Status is automatically set to "completed"
- Metadata includes payment method

**What Gets Loaded:**
- On dashboard load, fetches all user payments
- Calculates total paid from completed payments
- Shows payment history in chronological order

### Admin Dashboard

**Admin Can:**
1. View all users with their payment progress
2. See total revenue collected
3. View all payment transactions
4. Create new insurance plans
5. Edit existing insurance plans
6. Deactivate insurance plans

**Admin Endpoints:**
- `GET /api/insurance/admin/users` - Get all users with payment totals
- `GET /api/payments/admin/all` - Get all payments
- `POST /api/insurance/plans` - Create insurance plan
- `PUT /api/insurance/plans/:id` - Update insurance plan
- `DELETE /api/insurance/plans/:id` - Deactivate insurance plan

## API Endpoints

### Payment Endpoints
```
POST   /api/payments              - Create payment (authenticated)
GET    /api/payments/user/history - Get user's payment history
GET    /api/payments/admin/all    - Get all payments (admin only)
GET    /api/payments/:id          - Get specific payment
```

### Insurance Endpoints
```
GET    /api/insurance/options        - Get active insurance plans
POST   /api/insurance/plans          - Create plan (admin only)
PUT    /api/insurance/plans/:id      - Update plan (admin only)
DELETE /api/insurance/plans/:id      - Deactivate plan (admin only)
GET    /api/insurance/admin/users    - Get all users (admin only)
```

## Testing the System

### As a User:
1. Complete onboarding and select an insurance plan
2. Go to dashboard
3. Make test payments using any amount
4. View payment history
5. See progress update in real-time
6. Certificate becomes available when fully paid

### As an Admin:
1. Login with admin account
2. Navigate to Admin Dashboard
3. View all users and their payment status
4. See payment logs
5. Create/manage insurance plans
6. View revenue statistics

## Database Schema

### Payment Table
```prisma
model Payment {
  id              String   @id @default(uuid())
  userId          String
  amount          Float
  currency        String   @default("USD")
  status          String   @default("pending")
  stripePaymentId String?
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### User Fields (relevant to payments)
```prisma
model User {
  selectedPlanId  String?  // Links to InsurancePlan
  payments        Payment[] // All user payments
}
```

## Important Notes

1. **No Real Money**: All payments are simulated. Status is set to "completed" immediately.
2. **Math is Correct**: All calculations (balance, progress, totals) use real data.
3. **Data Persists**: Payments are saved to PostgreSQL database.
4. **Session Persistence**: User can logout and login - progress is maintained.
5. **Admin Access**: Only users with `role: "admin"` can access admin features.

## Future Enhancements

When ready for production:
1. Integrate Stripe or other payment gateway
2. Change payment status to "pending" initially
3. Add webhook to update status to "completed" after real payment
4. Add refund functionality
5. Add payment receipts/invoices
6. Add email notifications for payments
