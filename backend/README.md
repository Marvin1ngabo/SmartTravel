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

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Payments
- `POST /api/payments` - Create payment (protected)
- `GET /api/payments/:id` - Get payment status (protected)

### Insurance
- `GET /api/insurance/options` - Get insurance plans
- `POST /api/insurance/policy` - Create insurance policy (protected)

## TODO

- [x] Add database (PostgreSQL + Prisma)
- [x] Implement authentication (JWT)
- [ ] Integrate Stripe for payments
- [ ] Add request validation middleware
- [ ] Add rate limiting
- [ ] Add logging (Winston/Pino)
- [ ] Add tests


## Database Setup

After installing dependencies, run:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Database Schema

- **User** - User accounts
- **Payment** - Payment transactions
- **InsurancePlan** - Available insurance plans
- **InsurancePolicy** - Active user policies
