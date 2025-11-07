# Manus ERP

A unified enterprise system that consolidates operations, analytics, and communications into one intelligent workspace. It streamlines financial oversight, automates data handling, and provides real-time insights through dynamic reports and visual dashboards.

## Features

### Core Modules

- **Dashboard & Analytics** - Real-time KPIs, financial overview, and quick actions
- **Task Management** - Complete to-do list with priority tracking, due dates, and status management
- **Financial Transactions** - Income/expense tracking with automated discrepancy detection
- **Reports & Analytics** - AI-powered report generation for financial and business insights
- **Document Management** - OCR scanning, text recognition, and intelligent document parsing
- **Support Tickets** - Comprehensive issue tracking with priority and status management
- **Notifications** - Custom notification system with real-time updates and unread badges

### Advanced Features

- **AI-Powered OCR** - Extract text from images and analyze documents
- **Discrepancy Detection** - Automated accounting anomaly detection using AI
- **Report Generation** - Generate financial and analytics reports with AI insights
- **Data Import/Export** - Support for CSV, Excel, JSON, and XML formats
- **Cloud Integrations** - Ready for OneDrive, Box, Email, and HubSpot connectors
- **API & MCP** - RESTful API with Model Context Protocol integration

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Node.js, Express 4, tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **AI Integration**: Built-in LLM for OCR, analysis, and report generation

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm package manager
- MySQL/TiDB database

### Installation

```bash
# Clone the repository
git clone https://github.com/FirstCastSolutions423/Manus-ERP.git
cd Manus-ERP

# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── lib/            # Utilities and tRPC client
│   │   └── App.tsx         # Routes and layout
├── server/
│   ├── db.ts              # Database helpers
│   ├── routers.ts         # tRPC procedures
│   ├── ocr.ts             # OCR and AI analysis
│   └── reportGenerator.ts # Report generation
├── drizzle/
│   └── schema.ts          # Database schema
└── shared/                # Shared types and constants
```

## Key Features Explained

### Notification System

The custom notification system includes:
- Database-backed notification storage
- Real-time unread count badge
- Notification center dropdown
- Mark as read/unread functionality
- Custom notification creation
- Category-based organization

### OCR & Document Processing

- Extract text from images using vision-capable AI
- Analyze documents and extract structured metadata
- Support for various document types
- Automatic text recognition and parsing

### Financial Discrepancy Detection

- AI-powered transaction analysis
- Automatic flagging of unusual patterns
- Severity classification (low, medium, high)
- Detailed discrepancy explanations

### Report Generation

- Financial reports with income/expense analysis
- Analytics reports with KPIs and trends
- Custom data analysis reports
- AI-generated insights and recommendations

## API Documentation

The application uses tRPC for type-safe API calls. Key routers include:

- `auth` - Authentication and user management
- `dashboard` - Dashboard statistics and widgets
- `tasks` - Task CRUD operations
- `transactions` - Financial transaction management
- `reports` - Report generation and retrieval
- `documents` - Document management with OCR
- `tickets` - Support ticket system
- `notifications` - Notification management
- `integrations` - External service integrations

## Development

```bash
# Run development server
pnpm dev

# Run database migrations
pnpm db:push

# Type checking
pnpm type-check

# Build for production
pnpm build
```

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please use the GitHub issue tracker or contact support.

---

Built with ❤️ using Manus Platform
