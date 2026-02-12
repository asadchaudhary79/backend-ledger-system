# Backend Ledger System

A robust, **production-grade** backend service for managing accounts, balances, and transactions with double-entry ledger principles. Built with Node.js, Express, and MongoDB — with a strong focus on **security** and **reliability**.

## Features

- **Authentication**: JWT-based authentication with registration, login, and logout.
- **Account Management**: Create and manage multiple accounts per user.
- **Transaction Processing**: Secure fund transfers with idempotency support.
- **Double-Entry Ledger**: Every transaction is recorded as DEBIT and CREDIT entries for accuracy.
- **Email Notifications**: Automated emails for registration and transaction status using Nodemailer (OAuth2).
- **Concurrency Control**: MongoDB sessions and transactions ensure ACID compliance.

## Security Features

| Layer                          | Description                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| **Helmet**                     | Sets secure HTTP headers (XSS, CSP, HSTS, etc.)                                           |
| **CORS**                       | Restricts cross-origin access with configurable origins                                   |
| **Rate Limiting**              | Separate limits for auth (10/15min), transactions (30/15min), and general API (100/15min) |
| **NoSQL Injection Prevention** | `express-mongo-sanitize` strips `$` and `.` from user input                               |
| **Input Validation**           | `express-validator` sanitizes and validates all request bodies and params                 |
| **Password Hashing**           | `bcryptjs` with 10 salt rounds                                                            |
| **JWT Token Blacklisting**     | Logged-out tokens are blacklisted and auto-expire in 3 days                               |
| **Payload Size Limiting**      | Request body limited to 10KB to prevent large-payload attacks                             |
| **Global Error Handler**       | Prevents stack trace leakage in production                                                |
| **404 Handler**                | Returns clean JSON for unmatched routes                                                   |

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit, express-mongo-sanitize, express-validator
- **Email**: Nodemailer with Google OAuth2

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance running (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/asadchaudhary79/backend-ledger-system.git
   cd backend-ledger
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

### Environment Variables

| Variable        | Description                                     | Default       |
| --------------- | ----------------------------------------------- | ------------- |
| `NODE_ENV`      | Environment mode (`development` / `production`) | `development` |
| `PORT`          | Server port                                     | `3000`        |
| `MONGO_URI`     | MongoDB connection string                       | —             |
| `JWT_SECRET`    | Secret key for signing JWT tokens               | —             |
| `CORS_ORIGIN`   | Allowed CORS origin (`*` or specific URL)       | `*`           |
| `EMAIL_USER`    | Gmail address for sending emails                | —             |
| `CLIENT_ID`     | Google OAuth2 Client ID                         | —             |
| `CLIENT_SECRET` | Google OAuth2 Client Secret                     | —             |
| `REFRESH_TOKEN` | Google OAuth2 Refresh Token                     | —             |

### Running the Application

- **Development mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

## API Documentation

### Auth Endpoints

| Method | Endpoint             | Description                | Auth |
| ------ | -------------------- | -------------------------- | ---- |
| `POST` | `/api/auth/register` | Register a new user        | ❌   |
| `POST` | `/api/auth/login`    | Login and get JWT token    | ❌   |
| `POST` | `/api/auth/logout`   | Logout and blacklist token | ❌   |

**Register Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Account Endpoints

| Method | Endpoint                           | Description           | Auth |
| ------ | ---------------------------------- | --------------------- | ---- |
| `POST` | `/api/accounts/`                   | Create a new account  | ✅   |
| `GET`  | `/api/accounts/`                   | Get all user accounts | ✅   |
| `GET`  | `/api/accounts/balance/:accountId` | Get account balance   | ✅   |

### Transaction Endpoints

| Method | Endpoint                                 | Description                          | Auth        |
| ------ | ---------------------------------------- | ------------------------------------ | ----------- |
| `POST` | `/api/transactions/`                     | Transfer funds between accounts      | ✅          |
| `POST` | `/api/transactions/system/initial-funds` | Add initial funds (system user only) | ✅ (System) |

**Transaction Body:**

```json
{
  "fromAccount": "ACCOUNT_ID",
  "toAccount": "ACCOUNT_ID",
  "amount": 100,
  "idempotencyKey": "unique-key-123"
}
```

**Initial Funds Body:**

```json
{
  "toAccount": "ACCOUNT_ID",
  "amount": 1000,
  "idempotencyKey": "system-key-123"
}
```

## Project Structure

```text
├── server.js                  # Entry point
├── .env.example               # Environment variables template
├── postman_collection.json    # Postman API collection
└── src/
    ├── app.js                 # Express app with security middleware
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── account.controller.js
    │   └── transaction.controller.js
    ├── middleware/
    │   ├── auth.middleware.js           # JWT auth & system user checks
    │   ├── rateLimiter.middleware.js    # Rate limiting configs
    │   ├── validators.middleware.js     # Input validation rules
    │   └── errorHandler.middleware.js   # Global error handler
    ├── models/
    │   ├── user.model.js
    │   ├── account.model.js
    │   ├── ledger.model.js
    │   ├── transaction.model.js
    │   └── blackList.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── account.routes.js
    │   └── transaction.routes.js
    └── services/
        └── email.service.js   # Nodemailer email service
```

## API Response Format

### Success Response

```json
{
  "message": "Transaction completed successfully",
  "transaction": { ... }
}
```

### Validation Error (422)

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Unauthorized access, token is missing"
}
```

## HTTP Status Codes

| Code  | Meaning                                                |
| ----- | ------------------------------------------------------ |
| `200` | Success                                                |
| `201` | Resource created                                       |
| `400` | Bad request / invalid data                             |
| `401` | Unauthorized — missing or invalid token                |
| `403` | Forbidden — not a system user                          |
| `404` | Route or resource not found                            |
| `409` | Conflict — duplicate value (e.g. email already exists) |
| `422` | Validation error — input did not pass validation rules |
| `429` | Too many requests — rate limit exceeded                |
| `500` | Internal server error                                  |

## Testing

A Postman collection is provided: `postman_collection.json`. Import it into Postman to test the endpoints.

1. Import `postman_collection.json` into Postman.
2. Set the `base_url` variable to your local server URL (default: `http://localhost:3000`).
3. **Register** a user using the Register endpoint.
4. Copy the `token` from the response and paste it into the collection's `token` variable.
5. Now all protected endpoints (Accounts, Transactions) will work automatically.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC
