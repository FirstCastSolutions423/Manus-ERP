# Manus ERP Zapier Integration

Production-ready Zapier app that connects Manus ERP with 6000+ applications. Built with TypeScript, OAuth2, instant webhooks, and comprehensive error handling.

## Features

### Authentication
- **OAuth2 with PKCE** - Secure authorization code flow with refresh tokens
- **Auto-refresh** - Automatic token rotation
- **Connection labels** - Shows tenant and user email
- **Scoped access** - Read and write permissions

### Triggers (12 total)
Instant webhooks with polling fallbacks:

- ✅ New Task Created
- ✅ Task Updated
- ✅ New Transaction Recorded
- ✅ Transaction Updated
- ✅ New Ticket Submitted
- ✅ Ticket Updated
- ✅ New Lead Added
- ✅ Lead Updated
- ✅ New Employee Added
- ✅ Employee Updated
- ✅ New Purchase Order Created
- ✅ Purchase Order Updated

### Actions (12 total)
With idempotency keys:

- ✅ Create Task
- ✅ Update Task
- ✅ Create Transaction
- ✅ Create Ticket
- ✅ Update Ticket
- ✅ Create Lead
- ✅ Update Lead
- ✅ Create Contact
- ✅ Update Contact
- ✅ Create Employee
- ✅ Update Employee
- ✅ Create Purchase Order

### Searches (7 total)
Enable "Find or Create" patterns:

- ✅ Find Task
- ✅ Find Transaction
- ✅ Find Ticket
- ✅ Find Lead
- ✅ Find Contact
- ✅ Find Employee
- ✅ Find Purchase Order

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Zapier Platform CLI: `npm install -g zapier-platform-cli`
- Zapier account (free tier works)
- Manus ERP instance with API access

### Installation

```bash
# Clone or navigate to the zapier-integration directory
cd zapier-integration

# Install dependencies
npm install

# Set up environment variables (see ENV_SETUP.md)
cp ENV_SETUP.md .env
# Edit .env with your credentials

# Build TypeScript
npm run build

# Validate the app
npm run zapier:validate

# Run tests
npm test
```

### Development Workflow

```bash
# 1. Make changes to src/
# 2. Build
npm run build

# 3. Test locally
npm run zapier:test

# 4. Push to Zapier (creates new version)
npm run zapier:push

# 5. Test in Zapier editor
# Visit https://zapier.com/app/editor

# 6. Promote to production when ready
npm run zapier:promote 1.0.1
```

## Project Structure

```
zapier-integration/
├── src/
│   ├── index.ts              # Main app definition
│   ├── types.ts              # TypeScript type definitions
│   ├── authentication/
│   │   └── oauth2.ts         # OAuth2 configuration
│   ├── triggers/
│   │   ├── index.ts          # Export all triggers
│   │   ├── newTask.ts        # Example: New Task trigger
│   │   └── ...               # 11 more triggers
│   ├── actions/
│   │   ├── index.ts          # Export all actions
│   │   ├── createTask.ts     # Example: Create Task action
│   │   └── ...               # 11 more actions
│   ├── searches/
│   │   ├── index.ts          # Export all searches
│   │   ├── findTask.ts       # Example: Find Task search
│   │   └── ...               # 6 more searches
│   └── utils/
│       └── http.ts           # HTTP utilities, error handling
├── docs/
│   ├── API_SPEC.md           # OpenAPI specification
│   └── USER_GUIDE.md         # End-user documentation
├── package.json
├── tsconfig.json
├── jest.config.js
├── ENV_SETUP.md              # Environment setup guide
└── README.md                 # This file
```

## Configuration

### Environment Variables

Required variables (create `.env` file):

```bash
CLIENT_ID=your_oauth_client_id
CLIENT_SECRET=your_oauth_client_secret
BASE_URL=https://your-erp.manus.space
WEBHOOK_SECRET=your_webhook_secret
```

See `ENV_SETUP.md` for detailed setup instructions.

### OAuth2 Setup

1. **In Manus ERP**: Create OAuth application
   - Go to Settings → Integrations → OAuth Apps
   - Create new app with redirect URI: `https://zapier.com/dashboard/auth/oauth/return/App{ZAPIER_APP_ID}CLIAPI/`
   - Copy Client ID and Client Secret

2. **In Zapier CLI**: Set environment variables
   ```bash
   zapier env:set 1.0.0 CLIENT_ID=your_client_id
   zapier env:set 1.0.0 CLIENT_SECRET=your_client_secret
   zapier env:set 1.0.0 BASE_URL=https://your-erp.manus.space
   ```

### Webhook Setup

Webhooks require backend support in Manus ERP:

1. **Subscribe endpoint**: `POST /api/webhooks/subscribe`
   ```json
   {
     "targetUrl": "https://hooks.zapier.com/...",
     "event": "task.created"
   }
   ```

2. **Unsubscribe endpoint**: `DELETE /api/webhooks/{id}`

3. **Signature verification**: HMAC-SHA256 with `WEBHOOK_SECRET`

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

### Integration Testing

```bash
# Test authentication
zapier test --auth

# Test a specific trigger
zapier test --trigger=newTask

# Test a specific action
zapier test --action=createTask
```

### Manual Testing in Zapier

1. Push your app: `npm run zapier:push`
2. Visit https://zapier.com/app/editor
3. Create a new Zap
4. Search for "Manus ERP" (your private integration)
5. Connect your account
6. Test triggers and actions

## Deployment

### Version Management

```bash
# Check current version
zapier versions

# Push new version
npm run zapier:push

# Promote version to production
zapier promote 1.0.1

# Migrate users from old version
zapier migrate 1.0.0 1.0.1 100%
```

### Publishing

For public release:

```bash
# Submit for review
zapier push --public

# Monitor review status
zapier history
```

## API Endpoints Required

The Manus ERP backend must expose these endpoints:

### Authentication
- `POST /api/oauth/authorize` - OAuth authorization
- `POST /api/oauth/token` - Token exchange and refresh
- `GET /api/trpc/auth.me` - Get current user

### Webhooks
- `POST /api/webhooks/subscribe` - Subscribe to events
- `DELETE /api/webhooks/{id}` - Unsubscribe

### Resources (tRPC)
- `GET /api/trpc/tasks.list` - List tasks
- `POST /api/trpc/tasks.create` - Create task
- `PUT /api/trpc/tasks.update` - Update task
- `GET /api/trpc/tasks.search` - Search tasks
- *(Similar endpoints for transactions, tickets, leads, contacts, employees, purchase orders)*

See `docs/API_SPEC.md` for complete OpenAPI specification.

## Troubleshooting

### Common Issues

**Authentication fails**
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check BASE_URL matches your ERP instance
- Ensure OAuth app redirect URI is configured

**Webhooks not firing**
- Verify webhook endpoints are implemented in ERP
- Check WEBHOOK_SECRET matches between systems
- Test webhook signature verification

**Rate limiting**
- Default: 100 requests per 10 seconds
- Implement exponential backoff
- Use polling fallbacks for triggers

### Debug Mode

```bash
# Enable verbose logging
export LOG_TO_STDOUT=true
zapier test --debug
```

### Support

- **Issues**: https://github.com/FirstCastSolutions423/Manus-ERP/issues
- **Documentation**: See `docs/` directory
- **Zapier Platform**: https://platform.zapier.com/

## Best Practices

1. **Idempotency**: All create/update actions use idempotency keys
2. **Error Handling**: Comprehensive error messages with retry logic
3. **Pagination**: Supports cursor and offset pagination
4. **Dedupe**: Triggers use `id + updatedAt` for deduplication
5. **Security**: PKCE for OAuth2, HMAC for webhooks
6. **Testing**: Unit tests for all triggers/actions/searches

## Changelog

### 1.0.0 (2024-01-15)
- Initial release
- 12 triggers with instant webhooks + polling
- 12 actions with idempotency
- 7 searches for find-or-create patterns
- OAuth2 with PKCE
- Comprehensive error handling

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ for Manus ERP**
