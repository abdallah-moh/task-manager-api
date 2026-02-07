# Task Manager API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v18-blue)]()

A **Task Management REST API** built with **Node.js, Express, TypeScript, and PostgreSQL**.  

This project demonstrates **real backend engineering practices**: layered architecture, role-based authorization, validation, error handling, and type safety — not just CRUD functionality.

---

## 🚀 Features

- JWT-based authentication
- Role-based authorization (User / Admin)
- Task ownership rules
- Admin-only privileged actions
- Admin route to fetch all tasks for a specific user: `GET /tasks/user/:userId`
- PostgreSQL database with relational modeling
- Centralized error handling
- Request validation with **Joi**
- Clean separation of concerns (Routes → Controllers → Services)
- Fully type-safe Express setup with **TypeScript**
- Pagination and filtering of tasks

---

## 🏗 Architecture

Layered architecture ensures responsibilities are clear and code is maintainable:

```

Request
→ Middleware (Auth, Validation)
→ Controller
→ Service
→ Database (PostgreSQL)
← Service
← Controller
← Response

```

**Benefits:**

- Controllers stay thin
- Business rules centralized in services
- Database logic isolated
- Middleware handles cross-cutting concerns (auth, validation)
- Easier to test, extend, and refactor

---

## 📁 Project Structure

```

src/
├── controllers/        # HTTP request/response handling
├── services/           # Business logic & authorization rules
├── routes/             # Express route definitions
├── middleware/         # Auth, validation, error handling
├── validations/        # Joi schemas
├── config/             # PostgreSQL connection config
├── utils/              # Helpers (api error, catch-async, etc.)
├── repositories/       # Repositories to handle SQL queries
├── app.ts              # Express app setup
└── server.ts           # Server bootstrap

````

---

## 🗄 Database

**PostgreSQL** is used as the primary data store:

- Relational schema for users and tasks
- One-to-many relationship: User → Tasks
- Ownership rules enforced in services
- Database logic isolated in a dedicated data layer

---

## 🔐 Authentication & Authorization

**Authentication:**

- JWT-based, token required for all task routes
- Tokens signed using a server-side secret

**Authorization:**

- Users can access and modify **their own tasks only**
- Admins can access/manage **any task**
- Admins can fetch all tasks for a specific user: `GET /tasks/user/:id`
- Rules enforced **in the service layer**, not controllers

---

## 🧪 Validation

- Request body validation
- URL parameter validation
- Schema-driven approach with **Joi**
- Invalid requests are rejected **before hitting controllers**

---

## 🚨 Error Handling

- Centralized middleware handles all errors
- Services throw errors
- Controllers forward errors with `next(err)`
- Consistent response format
- No duplicated try/catch blocks

---

## 🛣 API Routes

### Users

| Method | Endpoint             | Description                      | Access        |
| ------ | ------------------ | -------------------------------- | ------------- |
| GET    | `/users`            | Get all users (for testing)       | User / Admin |
| POST   | `/users/signin`     | Login an existing user           | Any          |
| POST   | `/users/signup`     | Register a new user              | Any          |
| GET    | `/users/promote/:id`| Promote a user to Admin          | Admin        |

> Promotion route requires authentication

### Tasks

| Method | Endpoint          | Description                        | Access        |
| ------ | ---------------- | ----------------------------------- | ------------- |
| GET    | `/tasks`         | Get tasks for current user          | User         |
| POST   | `/tasks`         | Create task                         | User         |
| PATCH  | `/tasks/:taskId`     | Edit task                           | Owner/Admin  |
| GET    | `/tasks/user/:userId`| Admin: get all tasks for a user | Admin        |
| GET    | `/tasks/:taskId`     | Get task by ID                      | Owner/Admin  |
| POST   | `/tasks/user/:userId`     | Admin: create task for a user   | Admin        |

```sh
For getting tasks (GET /tasks or GET /tasks/user/:userId) they have the query options: 
    - search: Search title and description for specific text,
    - status:Tasks matching (TODO | IN_PROGRESS | DONE),
    - created_before: Tasks created before this date,
    - created_after: Tasks created after this date,
    - updated_after: Tasks updated after this date,
    - updated_before: Tasks updated before this date,
    - cursor: default 0
    - limit: default 10 max 50
```
> All task routes require authentication

---

## 🛠 Tech Stack

- **Node.js**  
- **Express.js**  
- **TypeScript**  
- **PostgreSQL**  
- **JWT** for authentication  
- **Joi** for request validation  

---


## 🐳 Running the Project with Docker

### Create a `.env` file:

```env
AUTHORIZATION_TOKEN_SECRET=your_secret_key
DB_USER=user
DB_PASSWORD=password
DB_NAME=name
PORT=3000
```

### Development

```bash
docker compose -f docker-compose-dev.yaml up --build
```

Stop:

```bash
docker compose -f docker-compose-dev.yaml down
```

---

### Production

```bash
docker compose -f docker-compose-prod.yaml up --build -d
```

Stop:

```bash
docker compose -f docker-compose-prod.yaml down
```

---

### Reset Database (⚠️ removes all data)

```bash
docker compose -f docker-compose-dev.yaml down -v
```

---

## ⚡ Getting Started with Node

### Install dependencies

```bash
npm install
````

### Environment variables

Create a `.env` file:

```env
AUTHORIZATION_TOKEN_SECRET=your_secret_key
DB_USER=user
DB_PASSWORD=password
DB_NAME=name
PORT=3000
```

### Run the server

```bash
npm run dev
```

Server will start at: `http://localhost:3000/api/v1`

## 🧠 What I Learned

* Designing APIs using **layered architecture**
* Working with **PostgreSQL**: schemas, relationships, constraints
* Separating HTTP concerns from business logic & database access
* Implementing **JWT authentication** & role-based authorization
* Writing reusable middleware for auth, validation, and errors
* Centralized error handling
* Validating requests before hitting services or DB
* Using **TypeScript** to enforce type safety
* Designing endpoints with **clear ownership and access rules**
* **Containerizing applications** with **Docker**
* Using **Docker Compose** to orchestrate multi-container applications (API + PostgreSQL)
* Enabling **hot-reloading** in containers with `tsx watch`
* Debugging and interacting with running containers via `docker exec`

---

## ⚡ Possible Improvements

* Automated tests (unit & integration)
* Refresh tokens
* Structured logging and monitoring

---

## 👤 Author

**Abdallah**
Computer Science & Engineering student @ GUC
Focused on Backend Engineering & Software Architecture

---

## 📄 License


MIT License
