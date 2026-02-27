# SmartTravel

A modern travel insurance and payment platform built with React and Node.js.

## Project Structure

```
├── travel-smart-pay-main/  # Frontend (React + TypeScript)
└── backend/                 # Backend API (Node.js + TypeScript)
```

## Frontend

Built with:
- React 18 + TypeScript
- Vite for fast development
- shadcn/ui + Radix UI components
- TanStack Query for data fetching
- React Router for navigation
- Tailwind CSS for styling

### Setup
```bash
cd travel-smart-pay-main
npm install
npm run dev
```

## Backend

Built with:
- Node.js + TypeScript
- Express.js
- Zod for validation
- RESTful API architecture

### Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Features

- Travel insurance comparison and purchase
- Payment processing integration
- User authentication and dashboard
- Admin panel
- Certificate generation
- Multi-page application with routing

## Development

Frontend runs on: http://localhost:5173
Backend runs on: http://localhost:3001

## License

MIT
