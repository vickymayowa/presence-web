# Frequently Asked Questions (FAQ)

## General Questions

### What is Presence?

Presence is an AI-native attendance management system designed for modern teams. It combines real-time tracking, AI verification, and advanced analytics to help organizations manage workforce attendance efficiently.

### Who is Presence for?

Presence is ideal for:
- Small businesses (10-50 employees)
- Medium enterprises (50-500 employees)
- Large corporations (500+ employees)
- Remote, hybrid, and on-site teams
- Organizations in any industry requiring attendance tracking

### How is Presence different from other attendance systems?

Presence stands out with:
- **AI-Powered Verification**: Facial recognition prevents fraud
- **Real-Time Analytics**: Instant insights into workforce patterns
- **Global Compliance**: Automatic handling of regional labor laws
- **Modern UX**: Beautiful, intuitive interface employees love
- **Flexible**: Supports remote, hybrid, and on-site work

## Getting Started

### How do I sign up?

1. Visit [presence.com/register](/auth/register)
2. Enter your organization details
3. Verify your email
4. Complete setup wizard
5. Invite employees

### Is there a free trial?

Yes! We offer:
- **Free Plan**: Up to 10 employees forever
- **14-Day Trial**: All paid plans include a 14-day free trial
- No credit card required for free plan

### How long does setup take?

Setup typically takes 15-30 minutes:
- Account creation: 2 minutes
- Company configuration: 5 minutes
- Employee import: 5-10 minutes
- Testing: 5-10 minutes

## Features & Functionality

### Can employees check in from home?

Yes, if you configure it:
- **Disable location verification** to allow remote check-in
- **OR** set home addresses as valid check-in locations
- Administrators control this setting

### Does Presence work offline?

Partially:
- **Mobile apps**: Queue check-ins offline, sync when online
- **Web portal**: Requires internet connection
- Offline capability available on Professional+ plans

### How accurate is facial recognition?

Very accurate:
- **99.9%** accuracy rate
- Works in various lighting conditions
- Privacy-focused (doesn't store photos)
- Compliant with data protection laws

### Can I disable facial recognition?

Yes:
- Facial recognition is optional
- Alternative methods: Password, PIN, NFC cards
- Configure per employee or company-wide

### What happens if I forget to check out?

Options depend on your company policy:
- **Auto check-out**: System can auto-check-out at set time
- **Manager adjustment**: Manager can manually update
- **Employee request**: Submit correction request
- Configure in **Settings** → **Attendance Rules**

## Check-In Windows

### What are check-in windows?

Check-in windows are time periods when employees can check in. Outside these windows, check-in is automatically blocked.

Example: "Morning Shift" from 7:30 AM - 10:00 AM

### Can I have multiple check-in windows?

Yes:
- Create unlimited windows
- Different windows for different shifts
- Different windows for specific days
- Overlap is allowed

### What if an employee is late?

Depends on your configuration:
- **Grace period**: Set grace period (e.g., 15 minutes)
- **Late check-in**: Allow but flag as late
- **Block check-in**: Prevent after window closes
- **Manager approval**: Require for late check-ins

## Attendance & Reports

### How do I view attendance reports?

1. Go to **Dashboard** → **Reports**
2. Select report type
3. Choose date range
4. Apply filters (department, employee, etc.)
5. Generate and export

### Can I export attendance data?

Yes, multiple formats:
- **Excel (.xlsx)**
- **CSV**
- **PDF**
- **JSON** (via API)

### How long is attendance data stored?

Depends on your plan:
- **Free**: 7 days
- **Starter**: 30 days
- **Professional**: Unlimited
- **Enterprise**: Unlimited + backups

### Can I generate custom reports?

Yes on Professional+ plans:
- Custom date ranges
- Custom fields
- Scheduled reports
- Automated email delivery

## Mobile App

### Is there a mobile app?

Yes:
- **iOS**: Available on App Store
- **Android**: Available on Google Play
- **Features**: Full feature parity with web

### Do employees need the app?

No:
- App is recommended but optional
- Employees can use web portal
- Same functionality on both

### How much data does the app use?

Minimal:
- Check-in: ~100 KB
- With photo: ~500 KB
- Background sync: ~10 KB/day

## Pricing & Billing

### How much does Presence cost?

Pricing tiers:
- **Free**: $0 (up to 10 employees)
- **Starter**: $29/month (up to 50 employees)
- **Professional**: $99/month (up to 500 employees)
- **Enterprise**: Custom pricing

### Can I change plans?

Yes:
- **Upgrade**: Anytime, instant access
- **Downgrade**: At end of billing period
- **Cancel**: Anytime, no penalties

### What payment methods do you accept?

- Credit/debit cards
- PayPal
- Bank transfer (Enterprise only)
- Purchase orders (Enterprise only)

### Is there a setup fee?

No:
- No setup fees
- No hidden charges
- Cancel anytime

## Security & Privacy

### Is my data secure?

Yes:
- **Encryption**: Data encrypted in transit and at rest
- **Compliance**: GDPR, SOC 2, ISO 27001
- **Regular audits**: Third-party security audits
- **Access control**: Role-based permissions

### Where is data stored?

- **Primary**: Cloud servers (AWS/Google Cloud)
- **Location**: Choose your region
- **Backups**: Daily automated backups
- **On-premise**: Available for Enterprise

### Who can see employee data?

Access is role-based:
- **Employees**: Own data only
- **Managers**: Their team's data
- **HR**: All employee data
- **CEO**: Full access

### Do you sell user data?

**No.** We never:
- Sell user data
- Share data with third parties
- Use data for advertising
- Your data is yours

## Technical Questions

### What browsers are supported?

Modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### Do I need special hardware?

No special hardware required:
- Standard computer/smartphone
- Camera (for facial recognition)
- Internet connection

### Can I integrate with other systems?

Yes:
- **Payroll**: QuickBooks, ADP, Gusto
- **HR**: BambooHR, Workday, SAP
- **Calendar**: Google, Outlook
- **Custom**: Via REST API

### Is there an API?

Yes:
- **REST API**: Full-featured
- **Webhooks**: Real-time events
- **Documentation**: [View API docs](/docs?page=api)
- **Rate limits**: Based on plan

## Support

### What support do you offer?

Support by plan:
- **Free**: Community forum, documentation
- **Starter**: Email support (48h response)
- **Professional**: Priority email (24h response)
- **Enterprise**: 24/7 phone + dedicated manager

### How do I contact support?

Multiple channels:
- **Email**: support@presence.com
- **Live Chat**: In dashboard
- **Phone**: 1-800-PRESENCE (Enterprise)
- **Help Center**: help.presence.com

### Do you offer training?

Yes:
- **Free**: Video tutorials, documentation
- **Starter**: Onboarding webinars
- **Professional**: Custom training sessions
- **Enterprise**: On-site training available

## Troubleshooting

### I can't check in. What should I do?

Check these:
1. Are you within a check-in window?
2. Is your location enabled (if required)?
3. Is your internet connection working?
4. Try restarting the app
5. Contact your manager or HR

### The app isn't syncing. Help!

Try:
1. Check internet connection
2. Force close and reopen app
3. Clear app cache
4. Reinstall app (data is cloud-stored)
5. Contact support if issue persists

### I'm getting errors. What does error code X mean?

Common errors:
- **101**: Outside check-in window
- **102**: Already checked in
- **103**: Location verification failed
- **201**: Invalid credentials
- **401**: Unauthorized access

[View full error codes →](/docs?page=errors)

## Still have questions?

- 📧 Email: support@presence.com
- 💬 Live Chat: Available in dashboard
- 📚 Help Center: help.presence.com
- 👥 Community: community.presence.com
