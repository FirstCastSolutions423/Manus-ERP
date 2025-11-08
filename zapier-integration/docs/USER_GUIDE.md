# Manus ERP Zapier Integration - User Guide

Connect your Manus ERP with 6000+ apps using Zapier. Automate workflows, sync data, and eliminate manual tasks.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Connecting Your Account](#connecting-your-account)
3. [Available Triggers](#available-triggers)
4. [Available Actions](#available-actions)
5. [Common Zap Examples](#common-zap-examples)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

## Getting Started

### What You'll Need

- Active Manus ERP account
- Zapier account (free or paid)
- Admin access to your ERP instance for OAuth setup

### Quick Setup (5 minutes)

1. Log in to Zapier
2. Click "Create Zap"
3. Search for "Manus ERP"
4. Connect your account
5. Choose a trigger or action
6. Test and turn on your Zap

## Connecting Your Account

### First-Time Connection

1. **In Zapier**: Search for "Manus ERP" when creating a Zap
2. **Click "Connect an Account"**
3. **You'll be redirected** to your Manus ERP login page
4. **Sign in** with your ERP credentials
5. **Authorize** Zapier to access your ERP data
6. **You're connected!** Your account will show as "Connected"

### Connection Label

Your connection will display as: `Your Name - Manus ERP`

### Permissions

The integration requires:
- **Read**: View tasks, transactions, tickets, leads, contacts, employees, purchase orders
- **Write**: Create and update records

### Multiple Accounts

You can connect multiple Manus ERP accounts (e.g., staging and production) by repeating the connection process.

## Available Triggers

Triggers start your Zap when something happens in Manus ERP.

### Task Triggers

#### New Task
**When it triggers**: A new task is created  
**Use case**: Send Slack notification when high-priority tasks are created

**Sample Data**:
- Task ID
- Title
- Description
- Status (pending, in_progress, completed)
- Priority (low, medium, high)
- Due Date
- Created Date

#### Updated Task
**When it triggers**: A task is updated  
**Use case**: Track task completions in Google Sheets

### Transaction Triggers

#### New Transaction
**When it triggers**: A new financial transaction is recorded  
**Use case**: Log expenses in QuickBooks automatically

**Sample Data**:
- Transaction ID
- Type (income/expense)
- Amount
- Description
- Category
- Date
- Flagged status

#### Updated Transaction
**When it triggers**: A transaction is modified  
**Use case**: Alert accountant when transactions are flagged

### Ticket Triggers

#### New Ticket
**When it triggers**: A support ticket is submitted  
**Use case**: Create Trello card for new urgent tickets

**Sample Data**:
- Ticket ID
- Title
- Description
- Status (open, in_progress, resolved, closed)
- Priority (low, medium, high, urgent)
- Assigned To
- Created Date

#### Updated Ticket
**When it triggers**: A ticket status or priority changes  
**Use case**: Email customer when ticket is resolved

### Lead Triggers

#### New Lead
**When it triggers**: A new sales lead is added  
**Use case**: Add lead to Mailchimp mailing list

**Sample Data**:
- Lead ID
- Name
- Email
- Company
- Phone
- Status (new, contacted, qualified, lost)
- Score (0-100)
- Source

#### Updated Lead
**When it triggers**: A lead's status or score changes  
**Use case**: Notify sales team when lead is qualified

### Employee Triggers

#### New Employee
**When it triggers**: A new employee is added to the system  
**Use case**: Create accounts in other systems (Slack, email, etc.)

**Sample Data**:
- Employee ID
- Name
- Email
- Department
- Position
- Hire Date
- Status

#### Updated Employee
**When it triggers**: Employee information is updated  
**Use case**: Sync employee changes to HR systems

### Purchase Order Triggers

#### New Purchase Order
**When it triggers**: A new PO is created  
**Use case**: Send PO to vendor via email automatically

**Sample Data**:
- PO Number
- Vendor Name
- Total Amount
- Order Date
- Expected Delivery Date
- Status

#### Updated Purchase Order
**When it triggers**: PO status changes  
**Use case**: Update inventory system when PO is received

## Available Actions

Actions do something in Manus ERP when your Zap runs.

### Task Actions

#### Create Task
**What it does**: Creates a new task in your ERP  
**Required fields**:
- Title

**Optional fields**:
- Description
- Status
- Priority
- Due Date

**Use case**: Create ERP task from Trello card

#### Update Task
**What it does**: Updates an existing task  
**Required fields**:
- Task ID

**Optional fields**:
- Title, Status, Priority, Due Date

**Use case**: Mark task complete when Asana task is done

### Transaction Actions

#### Create Transaction
**What it does**: Records a new financial transaction  
**Required fields**:
- Type (income/expense)
- Amount
- Description
- Date

**Use case**: Log Stripe payments as income transactions

### Ticket Actions

#### Create Ticket
**What it does**: Creates a new support ticket  
**Required fields**:
- Title

**Optional fields**:
- Description, Priority, Status

**Use case**: Create ERP ticket from Intercom conversation

#### Update Ticket
**What it does**: Updates ticket status or priority  
**Required fields**:
- Ticket ID

**Use case**: Close ERP ticket when Zendesk ticket is solved

### Lead Actions

#### Create Lead
**What it does**: Adds a new sales lead  
**Required fields**:
- Name
- Email

**Optional fields**:
- Company, Phone, Source

**Use case**: Create lead from Typeform submissions

#### Update Lead
**What it does**: Updates lead status or score  
**Required fields**:
- Lead ID

**Use case**: Mark lead as qualified based on email engagement

### Contact Actions

#### Create Contact
**What it does**: Adds a new contact  
**Required fields**:
- Name
- Email

**Use case**: Sync HubSpot contacts to ERP

#### Update Contact
**What it does**: Updates contact information  
**Required fields**:
- Contact ID

### Employee Actions

#### Create Employee
**What it does**: Adds a new employee record  
**Required fields**:
- Employee ID
- Name
- Email
- Hire Date

**Use case**: Add employee from BambooHR

#### Update Employee
**What it does**: Updates employee information  
**Required fields**:
- Employee ID

### Purchase Order Actions

#### Create Purchase Order
**What it does**: Creates a new PO  
**Required fields**:
- PO Number
- Vendor Name
- Total Amount
- Order Date

**Use case**: Create PO from approved request form

## Common Zap Examples

### 1. Slack Notifications for High-Priority Tasks

**Trigger**: New Task (filtered by Priority = "high")  
**Action**: Send Channel Message in Slack

**Setup**:
1. Choose "New Task" trigger
2. Add filter: Priority equals "high"
3. Choose Slack action
4. Map fields:
   - Channel: #tasks
   - Message: "New high-priority task: {{Title}} - Due: {{Due Date}}"

### 2. Log Expenses to Google Sheets

**Trigger**: New Transaction (filtered by Type = "expense")  
**Action**: Create Spreadsheet Row in Google Sheets

**Setup**:
1. Choose "New Transaction" trigger
2. Add filter: Type equals "expense"
3. Choose Google Sheets action
4. Map fields:
   - Date: {{Date}}
   - Description: {{Description}}
   - Amount: {{Amount}}
   - Category: {{Category}}

### 3. Create Trello Cards from Urgent Tickets

**Trigger**: New Ticket (filtered by Priority = "urgent")  
**Action**: Create Card in Trello

**Setup**:
1. Choose "New Ticket" trigger
2. Add filter: Priority equals "urgent"
3. Choose Trello action
4. Map fields:
   - Board: Support
   - List: Urgent
   - Card Name: {{Title}}
   - Description: {{Description}}

### 4. Add Leads to Mailchimp

**Trigger**: New Lead  
**Action**: Add/Update Subscriber in Mailchimp

**Setup**:
1. Choose "New Lead" trigger
2. Choose Mailchimp action
3. Map fields:
   - Email: {{Email}}
   - First Name: {{Name}}
   - Company: {{Company}}
   - Tags: "erp-lead"

### 5. Create Tasks from Gmail

**Trigger**: New Email Matching Search in Gmail  
**Action**: Create Task in Manus ERP

**Setup**:
1. Choose Gmail trigger
2. Search: "label:todo"
3. Choose "Create Task" action
4. Map fields:
   - Title: {{Subject}}
   - Description: {{Body Plain}}
   - Priority: "medium"

### 6. Find or Create Contact Pattern

**Trigger**: New Row in Google Sheets  
**Search**: Find Contact by Email  
**Action**: Create Contact (if not found)

**Setup**:
1. Choose Google Sheets trigger
2. Add "Find Contact" search action
3. Email: {{Email from Sheet}}
4. Check "Create if not found"
5. Map contact fields from sheet

## Troubleshooting

### Connection Issues

**Problem**: Can't connect account  
**Solution**:
1. Verify you're using admin credentials
2. Check your ERP instance is accessible
3. Clear browser cache and try again
4. Contact ERP admin to verify OAuth is enabled

**Problem**: "Authentication failed" error  
**Solution**:
1. Disconnect and reconnect your account
2. Ensure your ERP password hasn't changed
3. Check if your account has API access enabled

### Trigger Issues

**Problem**: Zap not triggering  
**Solution**:
1. Check if webhooks are enabled in your ERP
2. Verify the trigger event is actually occurring
3. Test the trigger manually in Zapier
4. Check Zap history for error messages

**Problem**: Missing recent data  
**Solution**:
1. Triggers may take 1-5 minutes to fire
2. Check your Zapier plan's polling frequency
3. Verify data exists in ERP
4. Test trigger to fetch latest data

### Action Issues

**Problem**: "Required field missing" error  
**Solution**:
1. Check all required fields are mapped
2. Verify data from previous steps exists
3. Use default values for optional fields
4. Test with sample data first

**Problem**: Duplicate records created  
**Solution**:
1. Enable "Find or Create" pattern
2. Use search actions before creates
3. Check idempotency is working
4. Review Zap history for multiple runs

### Data Issues

**Problem**: Incorrect data format  
**Solution**:
1. Use Formatter to transform data
2. Check date/time formats match
3. Verify number formats (decimals, currency)
4. Test with sample data first

**Problem**: Missing fields  
**Solution**:
1. Refresh fields in Zapier editor
2. Check field permissions in ERP
3. Verify data exists in source system
4. Use custom fields if needed

## FAQ

### General

**Q: Is this integration free?**  
A: The integration itself is free, but requires a Zapier account (free or paid).

**Q: How often do triggers check for new data?**  
A: Instant webhooks fire immediately. Polling fallback checks every 1-15 minutes depending on your Zapier plan.

**Q: Can I connect multiple ERP accounts?**  
A: Yes, you can connect multiple accounts and choose which one to use in each Zap.

**Q: Is my data secure?**  
A: Yes. We use OAuth2 with encryption, and Zapier is SOC 2 certified.

### Limits

**Q: Are there rate limits?**  
A: Yes, 100 requests per 10 seconds per account. Most Zaps won't hit this limit.

**Q: How many Zaps can I create?**  
A: Unlimited, but depends on your Zapier plan.

**Q: Can I process bulk data?**  
A: Yes, use "Looping by Zapier" for batch processing.

### Support

**Q: Where do I get help?**  
A: 
1. Check this guide
2. Visit Zapier's help center
3. Contact Manus ERP support
4. Check GitHub issues

**Q: How do I report a bug?**  
A: Open an issue on GitHub or contact support with:
- Zap ID
- Error message
- Steps to reproduce

**Q: Can I request new triggers/actions?**  
A: Yes! Submit feature requests on GitHub or contact support.

## Best Practices

1. **Test First**: Always test Zaps with sample data before turning on
2. **Use Filters**: Filter triggers to reduce unnecessary Zap runs
3. **Error Handling**: Set up email notifications for Zap errors
4. **Naming**: Use clear Zap names like "Slack: New High-Priority Tasks"
5. **Documentation**: Document your Zaps for team members
6. **Monitoring**: Check Zap history regularly for issues
7. **Optimization**: Combine multiple actions in one Zap when possible

## Getting Help

- **Documentation**: https://github.com/FirstCastSolutions423/Manus-ERP
- **Support Email**: support@manus.im
- **Zapier Help**: https://help.zapier.com
- **Community**: Join our Slack community

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0
