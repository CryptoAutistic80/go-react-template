# Go React Template

A full-stack monorepo template using Go for the backend and Next.js for the frontend.

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
- Turborepo for monorepo management
- pnpm for package management
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development servers:
```bash
npm run dev
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

### Development
- `turbo dev` - Start all applications in development mode
- `turbo dev --filter frontend` - Start only the frontend
- `turbo dev --filter backend` - Start only the backend

### Testing
- `turbo test` - Run all tests
- `turbo test --filter frontend` - Run frontend tests
- `turbo test --filter backend` - Run backend tests

### Building
- `turbo build` - Build all applications
- `turbo build --filter frontend` - Build only the frontend
- `turbo build --filter backend` - Build only the backend

### Linting
- `turbo lint` - Run linting for all applications
- `turbo lint --filter frontend` - Lint frontend code
- `turbo lint --filter backend` - Lint backend code

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT 