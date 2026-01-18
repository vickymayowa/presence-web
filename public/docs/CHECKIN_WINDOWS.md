# Check-In Time Windows Feature

## Overview
The Check-In Time Windows feature allows CEO and HR roles to configure specific time periods when employees can check in to the system. Outside these windows, the check-in functionality is automatically locked.

## Database Schema

### CheckInWindow Model
```prisma
model CheckInWindow {
  id          String   @id @default(uuid())
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id])
  name        String   // e.g., "Morning Shift", "Afternoon Shift"
  description String?
  startTime   String   // Format: "HH:mm" e.g., "07:30"
  endTime     String   // Format: "HH:mm" e.g., "10:00"
  daysOfWeek  String   // Comma-separated: "1,2,3,4,5" (Monday-Friday)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([companyId, isActive])
}
```

## API Endpoints

### 1. GET /api/checkin-windows
**Description**: Fetch all check-in windows for the authenticated user's company

**Query Parameters**:
- `activeOnly` (boolean, optional): If true, only returns active windows

**Response**:
```json
{
  "success": true,
  "data": {
    "windows": [
      {
        "id": "uuid",
        "companyId": "uuid",
        "name": "Morning Shift",
        "description": "Main morning check-in window",
        "startTime": "07:30",
        "endTime": "10:00",
        "daysOfWeek": [1, 2, 3, 4, 5],
        "isActive": true,
        "createdAt": "2026-01-18T...",
        "updatedAt": "2026-01-18T..."
      }
    ]
  }
}
```

### 2. POST /api/checkin-windows
**Description**: Create a new check-in window (CEO/HR only)

**Request Body**:
```json
{
  "name": "Morning Shift",
  "description": "Main morning check-in window",
  "startTime": "07:30",
  "endTime": "10:00",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "isActive": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "window": { /* created window object */ }
  },
  "message": "Check-in window created successfully"
}
```

### 3. PATCH /api/checkin-windows
**Description**: Update an existing check-in window (CEO/HR only)

**Request Body**:
```json
{
  "windowId": "uuid",
  "name": "Updated Morning Shift",
  "startTime": "08:00",
  "isActive": false
}
```

### 4. DELETE /api/checkin-windows?windowId={id}
**Description**: Delete a check-in window (CEO/HR only)

**Query Parameters**:
- `windowId` (string, required): ID of the window to delete

### 5. GET /api/checkin-windows/status
**Description**: Check if check-in is currently allowed

**Response**:
```json
{
  "success": true,
  "data": {
    "allowed": true,
    "activeWindow": {
      "id": "uuid",
      "name": "Morning Shift",
      "startTime": "07:30",
      "endTime": "10:00"
    }
  }
}
```

Or when not allowed:
```json
{
  "success": true,
  "data": {
    "allowed": false,
    "reason": "Check-in is currently closed. Next window: Afternoon Shift (13:00 - 16:00)"
  }
}
```

## Usage Examples

### Creating a Check-In Window
```typescript
const response = await fetch('/api/checkin-windows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Morning Shift',
    description: 'Primary morning check-in period',
    startTime: '07:30',
    endTime: '10:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    isActive: true
  })
});
```

### Checking if Check-In is Allowed
```typescript
const response = await fetch('/api/checkin-windows/status');
const data = await response.json();

if (data.data.allowed) {
  // Allow check-in
  console.log('Check-in is allowed');
} else {
  // Show error message
  console.log(data.data.reason);
}
```

## UI Components

### Settings Page
Location: `/dashboard/settings/checkin-windows`

**Features**:
- View all configured check-in windows
- Create new windows with a dialog form
- Edit existing windows
- Delete windows
- Toggle active/inactive status
- Visual day selection (Sun-Sat)
- Time picker for start/end times

**Access Control**:
- Only CEO and HR roles can access this page
- Other roles will see an "Access Denied" message

## Integration with Attendance

To integrate this with your attendance check-in flow:

```typescript
// Before allowing check-in
const statusResponse = await fetch('/api/checkin-windows/status');
const { data } = await statusResponse.json();

if (!data.allowed) {
  toast.error(data.reason);
  return;
}

// Proceed with check-in
await performCheckIn();
```

## Database Migration

Run the following command to apply the schema changes:

```bash
npx prisma migrate dev --name add_checkin_windows
```

Then generate the Prisma client:

```bash
npx prisma generate
```

## Example Scenarios

### Scenario 1: Standard Office Hours
- **Morning Shift**: 7:30 AM - 10:00 AM (Mon-Fri)
- **Afternoon Shift**: 1:00 PM - 4:00 PM (Mon-Fri)

### Scenario 2: 24/7 Operations
- **Night Shift**: 10:00 PM - 2:00 AM (All days)
- **Morning Shift**: 6:00 AM - 10:00 AM (All days)
- **Evening Shift**: 4:00 PM - 8:00 PM (All days)

### Scenario 3: Flexible Work Week
- **Weekday Window**: 8:00 AM - 11:00 AM (Mon-Fri)
- **Weekend Window**: 9:00 AM - 12:00 PM (Sat-Sun)

## Notes

- Times are stored in 24-hour format (HH:mm)
- Days of week: 0=Sunday, 1=Monday, ..., 6=Saturday
- Multiple windows can be active simultaneously
- The system checks windows in order of start time
- If no windows are configured, check-in may be blocked (depending on your implementation)
