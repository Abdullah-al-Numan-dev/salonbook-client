# SalonBook Client

Frontend for **SalonBook**, a salon appointment booking platform. Customers browse
services, request appointments and pay securely through Stripe. The salon admin manages
services, appointments, customers and transactions.

## Live Website
- Live site: _add after deployment_
- Admin credentials are provided in the submission form.

## Repositories
- Client: _add link_
- Server: _add link_

## Important Features
- Browse services with search by name, category filter and price sorting
- Protected service details page and appointment booking with live time-slot availability
- Email/password and Google authentication (Better Auth) with server-side password rules
- Role-based customer and admin dashboards with route guards and server-side role checks
- Customer: view, cancel pending requests, pay confirmed appointments, payment history
- Admin: manage services with image upload, confirm or cancel appointments, block or
  unblock customers, view read-only transactions
- Stripe Checkout; payment status is changed only by a verified webhook on the server
- Toast notifications, loading states, custom 404 and error pages
- Fully responsive design

## Technology Stack
Next.js, TypeScript, Tailwind CSS, Better Auth (MongoDB adapter, JWT plugin, Google OAuth),
react-hot-toast, lucide-react. The API server uses Express.js, MongoDB, Stripe and ImgBB.

## Installation
```bash
git clone <client-repo-link>
cd salonbook-client
npm install
cp .env.example .env.local   # then fill in your values
```

## How to Run Locally
1. Start the API server (see the server repository).
2. Run the client:
```bash
npm run dev
```
Open http://localhost:3000

## Required Environment Variables (names only)
`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
`MONGODB_URI`, `DB_NAME`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Creating the Admin Account
Admins cannot register through the public form. After the first run, create one with:
```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='YourPassword1' node scripts/create-admin.mjs
```

## Scripts
`npm run dev`, `npm run build`, `npm start`, `npm run lint`