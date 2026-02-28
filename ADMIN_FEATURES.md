# Admin Dashboard Features

## Overview
The enhanced admin dashboard provides comprehensive tools for managing travelers, payments, insurance plans, and generating reports.

## Key Features

### 1. Advanced Filtering System

**Filter Options:**
- **Search Bar**: Search users by name or email in real-time
- **Insurance Plan Filter**: Filter by specific insurance provider
- **Status Filter**: Filter by payment status (Fully Paid, Saving, Not Started)
- **Destination Filter**: Filter by travel destination
- **Date Range**: Filter by registration date (From/To dates)

**Clear Filters**: One-click button to reset all filters

### 2. Export & Reporting

**CSV Export:**
- Export travelers data with all details
- Export payment logs
- Exports only filtered data (respects current filters)
- Includes: Name, Email, Destination, Provider, Required, Paid, Status, Date

**PDF Report Generation:**
- Generates printable PDF report
- Includes summary statistics
- Full traveler table with all details
- Opens in new window for printing or saving
- Professional formatting

### 3. User Management

**User Details Modal:**
- Click "View" button on any user
- Shows complete user information:
  - Personal details (name, email, phone)
  - Travel details (destination, date, purpose)
  - Insurance details (provider, price, paid, remaining)
  - Complete payment history with dates

**User Table Features:**
- Sortable columns
- Progress bars showing payment completion
- Color-coded status badges
- Hover effects for better UX

### 4. Payment Tracking

**Payment Logs Tab:**
- View all payments from all users
- Filter by date range
- Search by user name/email
- Export to CSV
- Shows: Date, User, Email, Amount, Method, Status

**Payment Analytics:**
- Total revenue collected
- Total expected revenue
- Outstanding balance
- Average payment per user
- Completion rate percentage

### 5. Revenue Analytics

**Revenue Summary:**
- Total collected
- Total expected
- Outstanding amount
- Commission calculation (5%)

**Provider Revenue Breakdown:**
- Revenue per insurance provider
- Number of users per provider
- Helps identify popular plans

### 6. Insurance Plan Management

**View All Plans:**
- Grid layout with plan cards
- Shows: Name, Description, Price, Duration, Status

**Add New Plan:**
- Modal form for creating plans
- Fields: Name, Description, Price, Duration, Coverage items
- Dynamic coverage item addition

**Manage Plans:**
- Deactivate plans (soft delete)
- Plans remain in database but hidden from users
- Cannot delete plans with active users

### 7. Statistics Dashboard

**Real-time Stats:**
- Total Travelers (filtered count)
- Revenue Collected
- Fully Paid count
- Pending count
- Completion Rate %
- Average Payment per user

All stats update based on active filters.

## How to Use

### Filtering Data

1. **Search Users:**
   - Type in search box to filter by name or email
   - Results update in real-time

2. **Apply Filters:**
   - Select insurance plan from dropdown
   - Choose status (Fully Paid, Saving, Not Started)
   - Select destination
   - Set date range (From/To)

3. **Clear Filters:**
   - Click "Clear All" button to reset

### Exporting Reports

1. **Export to CSV:**
   - Apply desired filters
   - Click "📥 Export CSV" for travelers
   - Click "💳 Export Payments" for payment logs
   - File downloads automatically

2. **Generate PDF Report:**
   - Apply desired filters
   - Click "📄 Generate PDF Report"
   - New window opens with formatted report
   - Click "Print / Save as PDF" button
   - Use browser's print dialog to save as PDF

### Viewing User Details

1. Click "👁️ View" button on any user row
2. Modal opens with complete information
3. Review personal, travel, and payment details
4. Close modal when done

### Managing Insurance Plans

1. **Add New Plan:**
   - Click "+ Add New Plan"
   - Fill in all required fields
   - Add coverage items (click + to add more)
   - Click "Create Plan"

2. **Deactivate Plan:**
   - Click 🗑️ button on plan card
   - Confirm deactivation
   - Plan becomes inactive (hidden from users)

## Best Practices

### For Daily Operations:
1. Check dashboard stats each morning
2. Review pending payments
3. Follow up with users who haven't started paying
4. Monitor completion rates

### For Monthly Reports:
1. Set date range to last month
2. Export CSV for records
3. Generate PDF report for management
4. Review revenue by provider

### For User Support:
1. Search for user by email
2. View their details modal
3. Check payment history
4. Verify insurance plan details

## Tips & Tricks

1. **Quick Stats**: Stats update automatically based on filters - use this to analyze specific segments

2. **Date Range Reports**: Use date filters to generate monthly/quarterly reports

3. **Provider Analysis**: Use plan filter + revenue tab to see performance per provider

4. **Payment Tracking**: Use payment logs tab with date range to track daily/weekly revenue

5. **User Segments**: Combine filters (e.g., destination + status) to identify specific user groups

## Keyboard Shortcuts

- **Search**: Click search box or start typing
- **Tab**: Navigate between filter fields
- **Enter**: Apply filters (in search box)
- **Esc**: Close modals

## Data Privacy

- All exports contain only filtered data
- User passwords are never exported
- Payment details are secure
- Admin access is role-based

## Troubleshooting

**Filters not working?**
- Refresh the page
- Check if data is loaded (loading spinner should disappear)
- Try clearing filters and reapplying

**Export not downloading?**
- Check browser's download settings
- Ensure pop-ups are not blocked
- Try a different browser

**PDF report not opening?**
- Allow pop-ups for this site
- Check if browser blocks new windows
- Try using Chrome or Firefox

**User details not showing?**
- Ensure user has completed onboarding
- Check if data is loaded
- Refresh the page

## Future Enhancements

Planned features:
- Email notifications to users
- Bulk actions (email multiple users)
- Advanced charts and graphs
- Custom report templates
- Scheduled report generation
- User activity logs
- Payment refund functionality
- Multi-currency support
