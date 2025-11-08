# Environment Variables Setup

The Zapier integration requires the following environment variables:

## Required Variables

```bash
CLIENT_ID=your_oauth_client_id_here
CLIENT_SECRET=your_oauth_client_secret_here
BASE_URL=https://your-erp-instance.manus.space
WEBHOOK_SECRET=your_webhook_signing_secret_here
```

## Setup Instructions

1. Create a `.env` file in the zapier-integration directory
2. Copy the variables above and fill in your actual values
3. Never commit the `.env` file to version control

## Getting Your Credentials

- **CLIENT_ID & CLIENT_SECRET**: Generate these in your Manus ERP OAuth settings
- **BASE_URL**: Your ERP instance URL (e.g., https://3000-xxx.manus.computer)
- **WEBHOOK_SECRET**: Generate a secure random string for webhook signature verification

## Environment-Specific Configuration

For staging:
```bash
BASE_URL=https://staging-erp.manus.space
```

For production:
```bash
BASE_URL=https://erp.yourcompany.com
```
