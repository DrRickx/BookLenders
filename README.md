# BookLenders

REST API for a library lending system with members, books, loans, and reservations.

Tech stack: Node.js, Express, TypeScript (strict), PostgreSQL, Drizzle ORM, Zod, JWT, Swagger/OpenAPI, Vitest + Supertest, Docker, GitHub Actions.

![Swagger UI](docs/swagger.png)

## Features

- Member registration and login with JWT authentication.
- Role-based access control for member and librarian flows.
- Book CRUD with search, filtering, and pagination support.
- Borrow and return flows with due dates and overdue fee calculation.
- Request validation and consistent API error handling.
- OpenAPI/Swagger docs generated from the same validation layer.

## Engineering highlights

- Layered backend structure with routes, services, schemas, and middleware.
- Zod schemas are used for validation and to generate the OpenAPI contract.
- Borrowing uses a database transaction so the last available copy cannot be double-booked.
- Centralised error handling keeps the API responses consistent.
- Unit tests cover loan date and fee logic, and Supertest checks API-level behavior.

## Quick start

### Local

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

- App: http://localhost:3000
- Health: http://localhost:3000/health
- Swagger: http://localhost:3000/docs

### Docker

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

- This project uses Docker for the PostgreSQL database service.
- The app itself runs locally with the Node.js development server.

## Tests

```bash
npm test
```

## API overview

| Route                 | Method | Purpose                                |
| --------------------- | ------ | -------------------------------------- |
| /api/auth/register    | POST   | Create a member account                |
| /api/auth/login       | POST   | Authenticate a member and return a JWT |
| /api/books            | GET    | List books with search and pagination  |
| /api/books/:id        | GET    | Fetch a single book                    |
| /api/books            | POST   | Create a book (librarian only)         |
| /api/books/:id        | PATCH  | Update a book (librarian only)         |
| /api/books/:id        | DELETE | Delete a book (librarian only)         |
| /api/loans/me         | GET    | List current member loans              |
| /api/loans            | POST   | Borrow a book                          |
| /api/loans/:id/return | POST   | Return a borrowed book                 |

## Project structure

```text
.
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── db/
│   ├── docs/
│   ├── middleware/
│   ├── routes/
│   ├── schema/
│   ├── services/
│   └── utils/
├── tests/
├── drizzle/
├── docker.compose.yml
├── drizzle.config.ts
├── .env.example
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
└── [PLACEHOLDER: add screenshots or deployment files if needed]
```

## What I learned / next steps

- I learned how to model a small domain cleanly with a relational schema and enforce business rules in the service layer.
- I learned how to keep validation and API documentation aligned by generating the OpenAPI contract from the same Zod schemas.
- Next step: build the reservation workflow and reservation API.
- Next step: add refresh tokens and stronger session rotation.
- Next step: add rate limiting, audit logging, and production-ready monitoring.
- Next step: tighten CI/CD and deployment automation with GitHub Actions and environment checks.
