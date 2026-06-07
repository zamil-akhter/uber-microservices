# Uber Microservices

This repository contains a simple microservices setup with three projects:

- `gateway` - API gateway that proxies requests to backend microservices
- `users` - user authentication and profile service
- `captains` - captain authentication and profile service

## Services

### Gateway

- Runs on `http://localhost:3000`
- Routes:
  - `/api/users/*` → forwarded to users service
  - `/api/captains/*` → forwarded to captains service

### Users

- Runs on `http://localhost:3001`
- Endpoints:
  - `POST /api/users/signup`
  - `POST /api/users/login`
  - `GET /api/users/profile`

### Captains

- Runs on `http://localhost:3002`
- Endpoints:
  - `POST /api/captains/signup`
  - `POST /api/captains/login`
  - `GET /api/captains/profile`

## Setup

Each service has its own `package.json` and `.env` file.

### 1. Install dependencies

```bash
cd users
npm install

cd ../captains
npm install

cd ../gateway
npm install
```

### 2. Start services

Use separate terminals for each service.

```bash
cd users
npm run dev
```

```bash
cd ../captains
npm run dev
```

```bash
cd ../gateway
npm run dev
```

## Notes

- The gateway proxies requests to the backend services and keeps the API surface consistent.
- Make sure MongoDB is running locally before starting `users` and `captains`.
- Protect your JWT secrets and do not commit `.env` files to source control.

## Troubleshooting

- If `npm run dev` fails, make sure `nodemon` is installed and the `dev` script exists in the service's `package.json`.
- If the gateway returns `Cannot GET /profile`, verify the gateway route and proxy configuration in `gateway/app.js`.
