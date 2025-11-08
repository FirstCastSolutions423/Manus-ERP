# Zapier Integration Deployment Guide

Complete guide to deploying the Manus ERP Zapier integration to production.

## Prerequisites

- [x] Zapier account (free or paid)
- [x] Zapier CLI installed: `npm install -g zapier-platform-cli`
- [x] Node.js 18+ and npm 9+
- [x] OAuth credentials from Manus ERP
- [x] Webhook secret configured

## Step 1: Initial Setup

### 1.1 Install Zapier CLI

```bash
npm install -g zapier-platform-cli

# Verify installation
zapier --version
```

### 1.2 Login to Zapier

```bash
zapier login
# Opens browser for authentication
```

### 1.3 Register Your App

```bash
cd zapier-integration

# Register new app (first time only)
zapier register "Manus ERP"

# This creates a new app in your Zapier account
# Note the App ID (you'll need it for OAuth redirect URI)
```

## Step 2: Configure OAuth

### 2.1 Get OAuth Credentials

1. Log in to your Manus ERP instance as admin
2. Navigate to Settings → Integrations → OAuth Applications
3. Click "Create New Application"
4. Fill in details:
   - **Name**: Zapier Integration
   - **Redirect URI**: `https://zapier.com/dashboard/auth/oauth/return/App{YOUR_APP_ID}CLIAPI/`
   - **Scopes**: `read write`
5. Save and copy:
   - Client ID
   - Client Secret

### 2.2 Set Environment Variables

```bash
# Set for version 1.0.0
zapier env:set 1.0.0 CLIENT_ID=your_client_id_here
zapier env:set 1.0.0 CLIENT_SECRET=your_client_secret_here
zapier env:set 1.0.0 BASE_URL=https://your-erp.manus.space
zapier env:set 1.0.0 WEBHOOK_SECRET=your_webhook_secret_here

# Verify
zapier env:get 1.0.0
```

## Step 3: Build and Test

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Build TypeScript

```bash
npm run build

# Verify build output
ls -la lib/
```

### 3.3 Validate App

```bash
npm run zapier:validate

# Should output: "No structural errors found"
```

### 3.4 Run Tests

```bash
# Unit tests
npm test

# Zapier integration tests
zapier test
```

## Step 4: Push to Zapier

### 4.1 First Push

```bash
npm run zapier:push

# Output shows:
# - Build successful
# - Version 1.0.0 uploaded
# - App available for testing
```

### 4.2 Test in Zapier Editor

1. Go to https://zapier.com/app/editor
2. Click "Create Zap"
3. Search for "Manus ERP" (shows as private integration)
4. Test connection:
   - Click "Connect an account"
   - Should redirect to your ERP OAuth page
   - Authorize and verify connection works

### 4.3 Test Triggers and Actions

Test each component:

```bash
# Test specific trigger
zapier test --trigger=newTask

# Test specific action
zapier test --action=createTask

# Test search
zapier test --search=findTask
```

## Step 5: Implement Backend Webhooks

Before promoting to production, ensure your Manus ERP backend supports:

### 5.1 Webhook Subscription Endpoint

```typescript
// POST /api/webhooks/subscribe
router.post('/webhooks/subscribe', async (req, res) => {
  const { targetUrl, event } = req.body;
  
  // Store subscription in database
  const subscription = await db.webhookSubscriptions.create({
    targetUrl,
    event,
    userId: req.user.id,
  });
  
  res.json({ data: subscription });
});
```

### 5.2 Webhook Unsubscribe Endpoint

```typescript
// DELETE /api/webhooks/:id
router.delete('/webhooks/:id', async (req, res) => {
  await db.webhookSubscriptions.delete(req.params.id);
  res.json({ success: true });
});
```

### 5.3 Webhook Firing Logic

```typescript
// When event occurs (e.g., task created)
async function fireWebhooks(event: string, data: any) {
  const subscriptions = await db.webhookSubscriptions.findByEvent(event);
  
  for (const sub of subscriptions) {
    const signature = generateSignature(data, process.env.WEBHOOK_SECRET);
    
    await fetch(sub.targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
      },
      body: JSON.stringify(data),
    });
  }
}

function generateSignature(data: any, secret: string): string {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(data));
  return hmac.digest('hex');
}
```

## Step 6: Production Deployment

### 6.1 Create Production Version

```bash
# Update version in package.json to 1.0.0
# Ensure all tests pass
npm test

# Build and push
npm run build
npm run zapier:push
```

### 6.2 Promote to Production

```bash
# Promote version 1.0.0
zapier promote 1.0.0

# Confirm promotion
# This makes the version available to all users
```

### 6.3 Monitor Initial Usage

```bash
# Check logs
zapier logs --version=1.0.0 --limit=100

# Monitor errors
zapier logs --type=error --limit=50
```

## Step 7: Public Release (Optional)

To make your integration publicly available in Zapier's app directory:

### 7.1 Prepare for Review

1. **Complete all required fields**:
   ```bash
   zapier apps:info
   ```

2. **Add branding assets**:
   - App icon (256x256 PNG)
   - App logo (1200x630 PNG)
   - Screenshots (1280x720 PNG)

3. **Write descriptions**:
   - Short description (< 140 chars)
   - Long description (< 4000 chars)
   - Category selection

### 7.2 Submit for Review

```bash
# Mark app as public
zapier push --public

# Submit for Zapier review
# This triggers their approval process
```

### 7.3 Review Process

- **Timeline**: 1-2 weeks typically
- **Requirements**:
  - All triggers/actions work correctly
  - Good documentation
  - Proper error handling
  - Security best practices
  - Responsive support contact

## Step 8: Maintenance

### 8.1 Releasing Updates

```bash
# Update version in package.json (e.g., 1.0.1)
npm run build
npm run zapier:push

# Test new version
zapier test --version=1.0.1

# Promote when ready
zapier promote 1.0.1

# Migrate users from old version
zapier migrate 1.0.0 1.0.1 100%
```

### 8.2 Monitoring

```bash
# View app analytics
zapier apps:info

# Check error rates
zapier logs --type=error --since=24h

# Monitor performance
zapier logs --version=1.0.1 --limit=1000 | grep "duration"
```

### 8.3 Deprecating Old Versions

```bash
# List all versions
zapier versions

# Deprecate old version
zapier deprecate 1.0.0 --date=2024-06-01

# Delete deprecated version (after migration period)
zapier delete:version 1.0.0
```

## Troubleshooting

### Build Failures

```bash
# Clear build cache
rm -rf lib/ node_modules/
npm install
npm run build
```

### Authentication Issues

```bash
# Re-login to Zapier
zapier logout
zapier login

# Verify credentials
zapier whoami
```

### Environment Variable Issues

```bash
# List all env vars
zapier env:get 1.0.0

# Update specific var
zapier env:set 1.0.0 BASE_URL=https://new-url.com

# Remove var
zapier env:unset 1.0.0 OLD_VAR
```

### Webhook Issues

1. **Test webhook endpoint manually**:
   ```bash
   curl -X POST https://your-erp.manus.space/api/webhooks/subscribe \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"targetUrl":"https://hooks.zapier.com/test","event":"task.created"}'
   ```

2. **Verify signature generation**:
   ```javascript
   const crypto = require('crypto');
   const payload = JSON.stringify({ test: 'data' });
   const secret = 'your_webhook_secret';
   const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
   console.log(signature);
   ```

## Security Checklist

- [ ] OAuth credentials stored securely (never in code)
- [ ] Webhook signatures verified
- [ ] HTTPS enforced for all endpoints
- [ ] Rate limiting implemented
- [ ] Error messages don't leak sensitive data
- [ ] Audit logging enabled
- [ ] Regular security updates

## Performance Optimization

1. **Caching**: Cache frequently accessed data
2. **Pagination**: Implement cursor-based pagination
3. **Rate Limiting**: Respect API rate limits
4. **Batch Operations**: Group multiple operations when possible
5. **Async Processing**: Use webhooks instead of polling when possible

## Support Resources

- **Zapier Platform Docs**: https://platform.zapier.com/
- **CLI Reference**: https://github.com/zapier/zapier-platform/tree/main/packages/cli
- **Community**: https://community.zapier.com/developers-7
- **Support**: support@zapier.com

## Rollback Procedure

If issues arise after deployment:

```bash
# Promote previous stable version
zapier promote 0.9.9

# Migrate users back
zapier migrate 1.0.0 0.9.9 100%

# Investigate issues
zapier logs --version=1.0.0 --type=error

# Fix and redeploy
# ... make fixes ...
npm run build
zapier push
```

---

**Deployment Checklist**

- [ ] OAuth configured in ERP
- [ ] Environment variables set
- [ ] All tests passing
- [ ] Webhooks implemented
- [ ] Documentation complete
- [ ] Version pushed to Zapier
- [ ] Manual testing completed
- [ ] Promoted to production
- [ ] Monitoring enabled
- [ ] Support contact configured

**Version**: 1.0.0  
**Last Updated**: 2024-01-15
