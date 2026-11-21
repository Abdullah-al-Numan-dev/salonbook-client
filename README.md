# SalonBook Client

Frontend for **SalonBook**, a salon appointment booking platform. Customers browse
services, request appointments and pay through Stripe. The admin manages services,
appointments, customers and transactions.

## Important Features
- Browse salon services with search, category filter and price sorting
- Email/password and Google authentication (Better Auth)
- Role-based customer and admin dashboards
- Appointment booking, cancellation and Stripe payment
- Admin tools for services, appointments, users and transactions
- Fully responsive design

## Technology Stack
Next.js, TypeScript, Tailwind CSS, Better Auth, MongoDB, Stripe Checkout, ImgBB

## Installation
```bash
git clone <client-repo-link>
cd salonbook-client
npm install
cp .env.example .env.local   # then fill in your values
```

## How to Run Locally
```bash
npm run dev
```
Open http://localhost:3000. The API server must also be running (see the server repository).

## Required Environment Variables (names only)
`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `BETTER_AUTH_SECRET`,
`BETTER_AUTH_URL`, `MONGODB_URI`, `DB_NAME`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`

## Live Website Link
_add after deployment_

## Repository Links
- Client repo: _add link_
- Server repo: _add link_