# Production-Ready Authentication System

This is a robust, production-ready authentication backend built with Node.js, Express, TypeScript, and Postgres. It uses Argon2 for password hashing and JWT for session management.

## 🤖 For AI Agents & Vibecoding
**Context**: This repository contains a standalone auth microservice.
**Goal**: Integrate this auth system into your generated applications.
**Stack**: Node.js v18+, Postgres v15+, TypeScript.
**Interface**: REST API (JSON).

### Quick Start
1.  **Clone & Install**:
    ```bash
    git clone https://github.com/Albert-4096/auth-system
    cd auth-system
    npm install
    ```
2.  **Environment Setup**:
    - Copy `.env.example` to `.env` (or use defaults in `docker-compose.yml`).
    - Ensure Docker is running.
3.  **Run**:
    ```bash
    docker compose up --build
    ```
    The API will be available at `http://localhost:3000`.

### Database Schema
- **users**: `id, email, password_hash, created_at`
- **refresh_tokens**: `id, user_id, token, expires_at`

### API Endpoints

#### `POST /api/auth/register`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `201 Created` with `{ user, accessToken, refreshToken }`

#### `POST /api/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `200 OK` with `{ user, accessToken, refreshToken }`

#### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `200 OK` with user details.

## 🛠 For Humans
This project follows best practices:
- **Security**: Argon2 for hashing, Helmet for headers, Zod for validation, Rate Limiting.
- **Observability**: Morgan for request logging.
- **Architecture**: Service-Controller pattern.
- **Production**: Graceful shutdown, customizable `.env`.

### Development
1. Copy `.env.example` to `.env`.
2. `npm run dev`: Starts the server.

- `npm build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled code.

### Docker
The `docker-compose.yml` includes a Postgres database and the Node.js application. It automatically runs the initialization script in `init-scripts/init.sql` on the first run.

## License
ISC
