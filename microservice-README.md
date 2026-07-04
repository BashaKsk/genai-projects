# NestJS Microservices

A distributed backend built as a **NestJS monorepo**, split into independently deployable
services that communicate over a message-based transport. It demonstrates microservice
architecture, JWT authentication, Stripe payments, email notifications, and full Docker
orchestration.

## Architecture

```
                ┌─────────────────┐
   HTTP  ─────▶ │   reservation   │  :3000   ── creates reservations, calls payments
                └────────┬────────┘
                         │ (ClientProxy)
                ┌────────▼────────┐
                │      auth       │  :3001   ── JWT auth, users, login/guards
                └─────────────────┘
                ┌─────────────────┐
                │    payments     │  :3003   ── Stripe PaymentIntents
                └────────┬────────┘
                         │ emits "notify_email"
                ┌────────▼────────┐
                │  notifications  │  :3004   ── sends email via Nodemailer
                └─────────────────┘

   Shared code:  libs/common  (DTOs, database module, repository pattern, constants)
   Data store:   MongoDB
```

## Services

| Service | Port | Responsibility |
|---------|------|----------------|
| **auth** | 3001 | User registration & login, JWT issuance, Passport local + JWT strategies, route guards |
| **reservation** | 3000 | Create/read/update/delete reservations (MongoDB), triggers payment on booking |
| **payments** | 3003 | Charges cards via **Stripe** PaymentIntents, then emits a notification event |
| **notifications** | 3004 | Sends transactional **emails** via Nodemailer (Gmail OAuth2) |

## Tech Stack

- **Framework:** NestJS (monorepo with `apps/*` + shared `libs/common`)
- **Language:** TypeScript
- **Database:** MongoDB (repository pattern over a shared abstract repository)
- **Auth:** JWT + Passport (local & JWT strategies), cookie-based sessions
- **Payments:** Stripe
- **Email:** Nodemailer (Gmail OAuth2)
- **Inter-service comms:** NestJS `ClientProxy` (message-based microservice transport)
- **Logging:** `nestjs-pino` structured logging
- **Validation:** global `ValidationPipe` (whitelist + transform)
- **Containerization:** Docker (per-service Dockerfiles) + Docker Compose

## Project Structure

```
apps/
  auth/            # authentication service
  reservation/     # reservations service
  payments/        # Stripe payments service
  notifications/   # email notifications service
libs/
  common/          # shared DTOs, database module, repository base, service tokens
docker-compose.yml # orchestrates all services + MongoDB
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- A MongoDB instance (provided via Docker Compose)
- Stripe secret key & Gmail OAuth2 credentials (for payments/notifications)

### Environment
Each service reads its own `.env` file (`apps/<service>/.env`). Typical variables:

```env
# apps/reservation/.env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/reservations

# apps/auth/.env
PORT=3001
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600

# apps/payments/.env
PORT=3003
STRIPE_SECRET_KEY=sk_test_xxx

# apps/notifications/.env
PORT=3004
SMTP_USER=you@gmail.com
GOOGLE_OAUTH_CLIENT_ID=xxx
GOOGLE_OAUTH_CLIENT_SECRET=xxx
GOOGLE_OAUTH_REFRESH_TOKEN=xxx
```

### Run with Docker Compose
```bash
docker compose up --build
```
This starts all four services plus MongoDB. Each service hot-reloads in development mode.

### Run a single service locally
```bash
npm install
npm run start:dev reservation   # or auth | payments | notifications
```

## Example Flow
1. A client registers/logs in through **auth** and receives a JWT.
2. The client creates a reservation via **reservation** (JWT-protected).
3. **reservation** calls **payments**, which charges the card through **Stripe**.
4. On success, **payments** emits a `notify_email` event.
5. **notifications** consumes the event and emails the customer a confirmation.

## Testing
```bash
npm run test         # unit tests (Jest)
npm run test:e2e     # end-to-end tests
```

## What this project demonstrates
- Designing a system as **small, single-responsibility services** rather than a monolith
- **Event-driven** communication between services
- Reusing cross-cutting code through a **shared library** (`libs/common`)
- Integrating **third-party services** (Stripe, Gmail) cleanly behind service boundaries
- **Containerizing** and orchestrating a multi-service app with Docker Compose
