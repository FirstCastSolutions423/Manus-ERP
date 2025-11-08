# Manus ERP API Specification for Zapier Integration

This document specifies the API endpoints that Manus ERP must expose for the Zapier integration to function properly.

## Base URL

```
https://your-erp-instance.manus.space
```

## Authentication

### OAuth 2.0 Authorization Code Flow with PKCE

#### 1. Authorization Request

```
GET /api/oauth/authorize
```

**Parameters:**
- `client_id` (required): OAuth client ID
- `response_type=code` (required)
- `redirect_uri` (required): Zapier callback URL
- `scope` (required): `read write`
- `state` (required): CSRF protection token
- `code_challenge` (required): PKCE challenge
- `code_challenge_method=S256` (required)

**Response:**
Redirects to `redirect_uri` with `code` and `state` parameters.

#### 2. Token Exchange

```
POST /api/oauth/token
Content-Type: application/json
```

**Request Body:**
```json
{
  "grant_type": "authorization_code",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "code": "authorization_code",
  "redirect_uri": "https://zapier.com/...",
  "code_verifier": "pkce_verifier"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "refresh_token_here",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

#### 3. Token Refresh

```
POST /api/oauth/token
Content-Type: application/json
```

**Request Body:**
```json
{
  "grant_type": "refresh_token",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "refresh_token": "refresh_token_here"
}
```

**Response:**
```json
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token",
  "expires_in": 3600
}
```

#### 4. Test Authentication

```
GET /api/trpc/auth.me
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "result": {
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

## Webhook Management

### Subscribe to Webhook

```
POST /api/webhooks/subscribe
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "targetUrl": "https://hooks.zapier.com/hooks/catch/...",
  "event": "task.created"
}
```

**Supported Events:**
- `task.created`, `task.updated`
- `transaction.created`, `transaction.updated`
- `ticket.created`, `ticket.updated`
- `lead.created`, `lead.updated`
- `employee.created`, `employee.updated`
- `purchaseOrder.created`, `purchaseOrder.updated`

**Response:**
```json
{
  "data": {
    "id": "webhook_123",
    "targetUrl": "https://hooks.zapier.com/...",
    "event": "task.created",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Unsubscribe from Webhook

```
DELETE /api/webhooks/{webhook_id}
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true
}
```

### Webhook Payload Format

When an event occurs, POST to the subscribed `targetUrl`:

```
POST {targetUrl}
Content-Type: application/json
X-Webhook-Signature: {hmac_sha256_signature}
```

**Headers:**
- `X-Webhook-Signature`: HMAC-SHA256 signature of the payload using `WEBHOOK_SECRET`

**Body Example (task.created):**
```json
{
  "id": 123,
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59Z",
  "userId": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Resource Endpoints (tRPC)

All resource endpoints follow tRPC conventions:

### Tasks

#### List Tasks
```
GET /api/trpc/tasks.list?input={"limit":100,"page":0,"sort":"createdAt:desc"}
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "result": {
    "data": [
      {
        "id": 1,
        "title": "Complete Report",
        "description": "Finish Q4 report",
        "status": "pending",
        "priority": "high",
        "dueDate": "2024-12-31T23:59:59Z",
        "userId": 1,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### Create Task
```
POST /api/trpc/tasks.create
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "id": 123,
      "title": "New Task",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### Update Task
```
PUT /api/trpc/tasks.update
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 123,
  "status": "completed",
  "priority": "medium"
}
```

#### Search Tasks
```
GET /api/trpc/tasks.search?input={"id":123}
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `id`: Task ID
- `title`: Task title (partial match)

### Transactions

#### List Transactions
```
GET /api/trpc/transactions.list?input={"limit":100,"sort":"createdAt:desc"}
Authorization: Bearer {access_token}
```

#### Create Transaction
```
POST /api/trpc/transactions.create
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "income",
  "amount": 150000,
  "description": "Client payment",
  "date": "2024-01-15",
  "category": "sales"
}
```

#### Search Transactions
```
GET /api/trpc/transactions.search?input={"id":123}
Authorization: Bearer {access_token}
```

### Tickets

#### List Tickets
```
GET /api/trpc/tickets.list?input={"limit":100,"sort":"createdAt:desc"}
Authorization: Bearer {access_token}
```

#### Create Ticket
```
POST /api/trpc/tickets.create
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "System Issue",
  "description": "Unable to login",
  "priority": "urgent",
  "status": "open"
}
```

#### Update Ticket
```
PUT /api/trpc/tickets.update
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 123,
  "status": "resolved",
  "priority": "low"
}
```

### Leads

#### List Leads
```
GET /api/trpc/leads.list?input={"limit":100,"sort":"createdAt:desc"}
Authorization: Bearer {access_token}
```

#### Create Lead
```
POST /api/trpc/leads.create
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "company": "ACME Corp",
  "phone": "+1234567890",
  "source": "website"
}
```

#### Search Leads
```
GET /api/trpc/leads.search?input={"email":"jane@company.com"}
Authorization: Bearer {access_token}
```

### Contacts

#### Create Contact
```
POST /api/trpc/contacts.create
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Tech Inc",
  "phone": "+1234567890"
}
```

### Employees

#### Create Employee
```
POST /api/trpc/employees.create
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "name": "Alice Johnson",
  "email": "alice@company.com",
  "department": "Engineering",
  "position": "Senior Developer",
  "hireDate": "2024-01-01"
}
```

### Purchase Orders

#### Create Purchase Order
```
POST /api/trpc/purchaseOrders.create
Authorization: Bearer {access_token}
Idempotency-Key: {unique_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "poNumber": "PO-2024-001",
  "vendorName": "Office Supplies Inc",
  "totalAmount": 250000,
  "orderDate": "2024-01-15",
  "expectedDate": "2024-01-30"
}
```

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND",
    "details": {
      "resource": "task",
      "id": 999
    }
  }
}
```

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Codes

- `INVALID_INPUT`: Validation error
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

- **Default**: 100 requests per 10 seconds per user
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Pagination

### Offset-based
```
GET /api/trpc/tasks.list?input={"limit":50,"page":2}
```

### Cursor-based (preferred)
```
GET /api/trpc/tasks.list?input={"limit":50,"cursor":"eyJpZCI6MTIzfQ=="}
```

**Response includes:**
```json
{
  "result": {
    "data": [...],
    "meta": {
      "hasMore": true,
      "nextCursor": "eyJpZCI6MTczfQ=="
    }
  }
}
```

## Security

### Webhook Signature Verification

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}
```

### Idempotency

All create/update operations support idempotency via the `Idempotency-Key` header:

```
Idempotency-Key: {timestamp}-{random_string}
```

Duplicate requests with the same key within 24 hours return the original response.

## Testing

### Test Credentials

For development/testing:
- Client ID: `test_client_id`
- Client Secret: `test_client_secret`
- Base URL: `https://staging-erp.manus.space`
- Webhook Secret: `test_webhook_secret`

### Sample Data

The API should provide sample data for testing:
- At least 5 tasks, transactions, tickets, leads
- Various statuses and priorities
- Recent timestamps for webhook testing

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15
