# Getting Started with Presence

Welcome to Presence! This guide will help you get your attendance system up and running in minutes.

## Step 1: Create Your Account

1. Visit [presence.com/register](/auth/register)
2. Enter your organization details:
   - Company name
   - Your name and email
   - Create a secure password
3. Verify your email address
4. Complete your company profile

## Step 2: Set Up Your Organization

### Company Settings

Configure your organization's basic settings:

1. Navigate to **Dashboard** → **Settings** → **Company**
2. Fill in:
   - Company logo
   - Time zone
   - Working hours
   - Week start day
   - Date and time formats

### Departments

Organize your employees into departments:

1. Go to **Dashboard** → **Departments**
2. Click **Add Department**
3. Enter department name and description
4. Assign a department head (optional)

### Check-In Windows

Set up when employees can check in:

1. Navigate to **Settings** → **Check-In Windows**
2. Click **Create Window**
3. Configure:
   - Window name (e.g., "Morning Shift")
   - Start time (e.g., 7:30 AM)
   - End time (e.g., 10:00 AM)
   - Active days (Mon-Fri, etc.)
   - End time (e.g., 10:00 AM)
   - Active days (Mon-Fri, etc.)
4. Save the window

[Learn more about Check-In Windows →](./CHECKIN_WINDOWS.md)

## Step 3: Add Employees

### Manual Entry

Add employees one at a time:

1. Go to **Dashboard** → **Employees**
2. Click **Add Employee**
3. Enter employee details:
   - Name
   - Email
   - Phone number
   - Department
   - Role (Employee, Manager, HR, CEO)
   - Employee ID (optional)
4. Click **Send Invitation**

### Bulk Import

Import multiple employees at once:

1. Go to **Dashboard** → **Employees**
2. Click **Import** → **From CSV**
3. Download the CSV template
4. Fill in employee information
5. Upload the completed file
6. Review and confirm imports

### Invite Employees

Employees will receive an email invitation with:
- Link to set up their account
- Instructions for downloading the mobile app
- First login credentials

## Step 4: Configure Permissions

Set up role-based access control:

### Default Roles

- **CEO**: Full access to all features
- **HR**: Manage employees, attendance, and reports
- **Manager**: View team attendance, approve requests
- **Employee**: Check in/out, view personal records

### Custom Permissions

Create custom roles:

1. Go to **Settings** → **Roles & Permissions**
2. Click **Create Custom Role**
3. Name the role
4. Select permissions
5. Assign to employees

## Step 5: Set Up Verification (Optional)

### Facial Recognition

Enable AI-powered verification:

1. Navigate to **Settings** → **Security**
2. Toggle **Facial Recognition**
3. Configure settings:
   - Verification threshold
   - Require for all check-ins
   - Fallback method
4. Employees will register their face on first check-in

### Location Verification

Require employees to be on-site:

1. Go to **Settings** → **Security**
2. Toggle **Location Verification**
3. Set allowed locations:
   - Office address
   - Radius (meters)
   - Multiple locations supported

## Step 6: Employee Onboarding

### For Employees

Send onboarding instructions:

1. **Download the App**
   - iOS: App Store
   - Android: Google Play
   - Or use web portal: presence.com/login

2. **First Login**
   - Use invitation email
   - Set up password
   - Complete profile

3. **Set Up Verification**
   - Register face (if enabled)
   - Enable location services
   - Set notification preferences

4. **First Check-In**
   - Open app during check-in window
   - Tap "Check In"
   - Complete verification
   - Confirm check-in

## Step 7: Test the System

Before going live:

1. **Test Check-Ins**
   - Have a few employees test check-in/out
   - Verify times are recorded correctly
   - Check notifications are working

2. **Review Dashboard**
   - Ensure attendance is displaying
   - Test filters and search
   - Generate a test report

3. **Test Approval Workflow**
   - Submit a test leave request
   - Approve/reject as manager
   - Verify notifications

## Step 8: Go Live!

You're ready to launch:

1. **Announce to Team**
   - Send company-wide announcement
   - Provide training materials
   - Set expectations

2. **Monitor First Week**
   - Watch for issues
   - Collect feedback
   - Make adjustments

3. **Optimize**
   - Review attendance patterns
   - Adjust check-in windows if needed
   - Refine schedules

## Common Setup Questions

### Q: How many employees can I add?

**A:** Depends on your plan:
- Free: Up to 10 employees
- Starter: Up to 50 employees
- Professional: Up to 500 employees
- Enterprise: Unlimited

### Q: Can employees check in from home?

**A:** Yes, if you disable location verification. Otherwise, they must be within the designated radius of your office locations.

### Q: What if an employee doesn't have a smartphone?

**A:** Employees can use the web portal on any computer to check in/out. You can also enable NFC card check-in for a tap-based solution.

### Q: How do I handle multiple shifts?

**A:** Create multiple check-in windows for different shifts (e.g., "Morning Shift", "Afternoon Shift", "Night Shift").

## Next Steps

- [Learn about features](./features/overview.md)
- [Set up integrations](./integrations.md)
- [Explore API](./API.md)
- [Read best practices](./best-practices.md)

## Need Help?

- **Email**: support@presence.com
- **Live Chat**: Available in dashboard
- **Phone**: 1-800-PRESENCE
- **Community Forum**: community.presence.com
