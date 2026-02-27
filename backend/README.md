# Travel Smart Pay Backend

Node.js + TypeScript backend for Travel Smart Pay application.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Development

```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment status

### Insurance
- `GET /api/insurance/options` - Get insurance plans
- `POST /api/insurance/policy` - Create insurance policy

## TODO

- [ ] Add database (PostgreSQL + Prisma)
- [ ] Implement authentication (JWT)
- [ ] Integrate Stripe for payments
- [ ] Add request validation middleware
- [ ] Add rate limiting
- [ ] Add logging (Winston/Pino)
- [ ] Add tests
