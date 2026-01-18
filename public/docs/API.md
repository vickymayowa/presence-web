# API Reference

## Overview

The Presence API allows you to integrate attendance management functionality into your own applications. This RESTful API uses standard HTTP methods and returns JSON responses.

## Base URL

```
https://api.presence.com
```

For local development:
```
http://localhost:3000/api
```

## Authentication

All API requests require authentication using Bearer tokens. Include your API token in the `Authorization` header:

```
Authorization: Bearer YOUR_API_TOKEN
```

To obtain an API token:
1. Log in to your Presence dashboard
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Copy and securely store your API key

## Rate Limiting

- **Free Plan**: 100 requests per hour
- **Starter Plan**: 1,000 requests per hour
- **Professional Plan**: 10,000 requests per hour
- **Enterprise Plan**: Unlimited

Rate limit information is included in response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642521600
```

## Common Endpoints

### Authentication

#### POST /auth/login
Authenticate a user and receive an access token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "employee"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Attendance

#### POST /attendance/checkin
Check in an employee.

**Request:**

```json
{
  "userId": "user_123",
  "timestamp": "2026-01-18T08:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "verificationMethod": "facial"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "attendanceId": "att_456",
    "userId": "user_123",
    "checkInTime": "2026-01-18T08:30:00Z",
    "status": "checked_in",
    "verificationStatus": "verified"
  }
}
```

#### POST /attendance/checkout
Check out an employee.

**Request:**

```json
{
  "userId": "user_123",
  "timestamp": "2026-01-18T17:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "attendanceId": "att_456",
    "userId": "user_123",
    "checkInTime": "2026-01-18T08:30:00Z",
    "checkOutTime": "2026-01-18T17:00:00Z",
    "totalHours": 8.5,
    "status": "checked_out"
  }
}
```

#### GET /attendance/history
Get attendance history for a user or company.

**Query Parameters:**
- `userId` (optional): Filter by specific user
- `startDate` (required): Start date (ISO 8601)
- `endDate` (required): End date (ISO 8601)
- `limit` (optional): Number of records (default: 50, max: 1000)
- `offset` (optional): Pagination offset

**Response:**

```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "att_456",
        "userId": "user_123",
        "userName": "John Doe",
        "checkInTime": "2026-01-18T08:30:00Z",
        "checkOutTime": "2026-01-18T17:00:00Z",
        "totalHours": 8.5,
        "status": "checked_out"
      }
    ],
    "total": 247,
    "limit": 50,
    "offset": 0
  }
}
```

### Check-In Windows

See the [Check-In Windows documentation](./CHECKIN_WINDOWS.md) for detailed API reference.

### Reports

#### GET /reports/attendance-summary
Get attendance summary report.

**Query Parameters:**
- `startDate` (required): Start date
- `endDate` (required): End date
- `departmentId` (optional): Filter by department
- `format` (optional): `json`, `csv`, or `pdf` (default: json)

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEmployees": 150,
      "averageAttendance": 94.5,
      "totalAbsences": 45,
      "totalLateArrivals": 23
    },
    "byDepartment": [
      {
        "departmentId": "dept_1",
        "departmentName": "Engineering",
        "attendance": 96.2
      }
    ]
  }
}
```

## Webhooks

Presence can send webhook notifications when important events occur.

### Setting Up Webhooks

1. Navigate to **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Enter your endpoint URL
4. Select events to subscribe to
5. Save and copy your webhook secret

### Webhook Events

- `attendance.checked_in`: Employee checked in
- `attendance.checked_out`: Employee checked out
- `leave.requested`: Leave request submitted
- `leave.approved`: Leave request approved
- `leave.rejected`: Leave request rejected
- `schedule.updated`: Schedule modified

### Webhook Payload

```json
{
  "event": "attendance.checked_in",
  "timestamp": "2026-01-18T08:30:00Z",
  "data": {
    "userId": "user_123",
    "userName": "John Doe",
    "checkInTime": "2026-01-18T08:30:00Z"
  },
  "signature": "sha256=..."
}
```

### Verifying Webhooks

Verify webhook signatures using your webhook secret:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The 'userId' parameter is required",
    "details": {
      "field": "userId",
      "reason": "missing"
    }
  }
}
```

## SDKs and Libraries

Official SDKs are available for:

- **JavaScript/TypeScript**: `npm install @presence/sdk`
- **Python**: `pip install presence-sdk`
- **Ruby**: `gem install presence-sdk`
- **PHP**: `composer require presence/sdk`
- **Java**: Maven/Gradle available

## Support

For API support:
- Email: api@presence.com
- Documentation: https://docs.presence.com
- Status Page: https://status.presence.com
