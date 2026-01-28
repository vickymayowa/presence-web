# Activity Log Troubleshooting Guide

## Issue: No activity logs showing on dashboard

### Quick Diagnosis Steps

1. **Check Database Schema**
   ```bash
   npx prisma db push
   ```
   This ensures the `ActivityLog` table exists in your MySQL database.

2. **Test the Debug Endpoint**
   - Navigate to: `http://localhost:3000/api/activities/debug`
   - This will show you:
     - Whether the ActivityLog table exists
     - If activities can be created
     - Current activity counts
     - Sample recent activities

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for logs starting with `[ActivityLog]` or `[Activities API]`
   - Check for any error messages

4. **Check Server Console**
   - Look at your terminal where Next.js is running
   - Search for `[ActivityLog]` or `[Activities API]` logs

### Common Issues & Solutions

#### Issue 1: ActivityLog table doesn't exist
**Symptoms:** Error like "Table 'ActivityLog' doesn't exist"
**Solution:**
```bash
npx prisma db push
# or if needed
npx prisma db push --accept-data-loss
```

#### Issue 2: No activities being created
**Symptoms:** API returns empty array, count is 0
**Solution:**
- Perform a check-in or check-out to trigger activity creation
- Login/logout to create LOGIN activities
- Check server console for `[ActivityLog] Attempting to log activity` messages

#### Issue 3: API endpoint not being called
**Symptoms:** No logs in browser console
**Solution:**
- Check that `useActivitiesQuery` is being used in the component
- Verify the component is actually rendered on the page
- Check React Query DevTools (if installed)

#### Issue 4: Authentication issues
**Symptoms:** "Unauthorized" errors
**Solution:**
- Ensure you're logged in
- Check session cookie exists
- Try logging out and back in

### Manual Testing Steps

1. **Login** - Should create a LOGIN activity
2. **Check-in** - Should create a CHECK_IN activity
3. **Check-out** - Should create a CHECK_OUT activity
4. **Refresh Dashboard** - Activities should appear within 30 seconds

### Debugging Checklist

- [ ] Database schema is up to date (`npx prisma db push`)
- [ ] ActivityLog table exists in database
- [ ] User is logged in with valid session
- [ ] At least one activity has been created (login, check-in, etc.)
- [ ] Browser console shows no errors
- [ ] Server console shows activity creation logs
- [ ] API endpoint `/api/activities` returns data
- [ ] React Query is fetching data (check Network tab)

### Expected Console Output

When working correctly, you should see:

**Server Console:**
```
[ActivityLog] Attempting to log activity: { userId: '...', action: 'CHECK_IN', ... }
[ActivityLog] Successfully created activity log: abc123...
[Activities API] Request: { scope: 'company', limit: 10, ... }
[Activities API] Response: { scope: 'company', count: 5, ... }
```

**Browser Console:**
```
[ActivityLog] Fetching recent activities for company: ...
[ActivityLog] Found activities: 5
```

### Still Not Working?

1. Check the debug endpoint: `/api/activities/debug`
2. Look at the full response - it will tell you exactly what's wrong
3. Share the debug endpoint output for further assistance
