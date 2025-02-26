# Go React Template

A full-stack monorepo template using Go for the backend and Next.js for the frontend.

## Prerequisites

1. Install Node.js (v20.x or later)
2. Install Go (v1.21 or later)
3. Install pnpm:
```bash
npm install -g pnpm@8
```

## Project Structure

```
go-react-template/
├── apps/
│   ├── frontend/     # Next.js frontend application
│   ├── backend/      # Go backend API
│   └── frontend-e2e/ # Cypress end-to-end tests
├── packages/         # Shared packages and utilities
└── .github/         # GitHub Actions and workflows
```

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- ESLint & Prettier

### Backend
- Go
- REST API
- Structured logging with Zap
- CORS middleware
- Environment variable configuration

### Development Tools
- Turborepo for monorepo management and task orchestration
- pnpm for fast, disk-efficient package management
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development servers:
```bash
pnpm dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:8080

## Backend API

### Health Check
```
GET /api/health
```
Returns the health status of the server.

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-25T12:34:56Z"
}
```

## Environment Variables

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:8080 |
| PORT | Frontend port | 3000 |

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| API_PORT | Port for the HTTP server | 8080 |
| GO_ENV | Environment (development/production) | development |

## Available Scripts

This project uses Turborepo for task orchestration and pnpm for package management. All commands can be run using either:
- `pnpm <command>` - Runs the command using pnpm's workspace features
- `turbo <command>` - Runs the command directly through Turborepo

### Development
- `pnpm dev` or `turbo dev` - Start all applications in development mode
- `pnpm dev --filter frontend` or `turbo dev --filter frontend` - Start only the frontend
- `pnpm dev --filter backend` or `turbo dev --filter backend` - Start only the backend

### Testing
- `pnpm test` or `turbo test` - Run all tests
- `pnpm test --filter frontend` or `turbo test --filter frontend` - Run frontend tests
- `pnpm test --filter backend` or `turbo test --filter backend` - Run backend tests
- `pnpm test:e2e` or `turbo test:e2e` - Run end-to-end tests

### Building
- `pnpm build` or `turbo build` - Build all applications
- `pnpm build --filter frontend` or `turbo build --filter frontend` - Build only the frontend
- `pnpm build --filter backend` or `turbo build --filter backend` - Build only the backend

### Linting
- `pnpm lint` or `turbo lint` - Run linting for all applications
- `pnpm lint --filter frontend` or `turbo lint --filter frontend` - Lint frontend code
- `pnpm lint --filter backend` or `turbo lint --filter backend` - Lint backend code

### Other Commands
- `pnpm start` or `turbo start` - Start all applications in production mode

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT 