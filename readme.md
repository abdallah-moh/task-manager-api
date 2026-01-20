# Task Manager API

A **production-style Task Management REST API** built with **Node.js, Express, and TypeScript**, following clean Software Engineering principles such as **layered architecture**, **centralized error handling**, **role-based authorization**, and **request validation**.

This project is designed to demonstrate **backend engineering best practices**, not just CRUD functionality.

---

## ✨ Features

* JWT-based authentication
* Role-based authorization (User / Admin)
* Task management with ownership rules
* Admin-only privileged actions
* Admin route to fetch all tasks for a specific user: `GET /tasks/user/:userId`
* Centralized error handling middleware
* Request validation layer
* Clean separation of concerns (Routes → Controllers → Services)
* Type-safe Express setup (TypeScript)

---

## 🏗 Architecture Overview

The API follows a **layered architecture**:

```
Request
  → Middleware (Auth, Validation)
    → Controller (HTTP handling)
      → Service (Business logic)
        → Data layer
      ← Service
    ← Controller
  ← Response
```

### Why this matters

* Controllers stay thin and readable
* Business logic is reusable and testable
* Middleware handles cross-cutting concerns
* Easy to scale and maintain

---

## 📁 Project Structure

```
src/
 ├── controllers/        # HTTP request/response handling
 ├── services/           # Business logic
 ├── routes/             # Route definitions
 ├── middleware/         # Auth, validation, error handling
 ├── validations/        # Request schemas
 ├── utils/              # Helpers (tokens, hashing, etc.)
 ├── app.ts              # Express app setup
 └── server.ts           # Server bootstrap
```

---

## 🔐 Authentication & Authorization

### Authentication

* JWT-based
* Token required for all task routes

### Authorization

* **Users** can access and modify their own tasks
* **Admins** can access and manage any task
* **Admins can fetch all tasks for a specific user** via: `GET /tasks/user/:userId`

Authorization logic is enforced in the **service layer**, not controllers.

---

## 🧪 Validation

All incoming requests are validated using a dedicated validation middleware:

* Request body validation
* URL parameter validation
* Schema-driven approach

Invalid requests never reach controllers.

---

## 🚨 Error Handling

The API uses a **centralized error handling middleware**:

* No duplicated try/catch responses
* Services throw errors
* Controllers forward errors using `next(err)`
* Consistent error response format

This pattern keeps the codebase clean and scalable.

---

## 🛣 API Routes

### Tasks

| Method | Endpoint              | Description                              | Access        |
| ------ | --------------------- | ---------------------------------------- | ------------- |
| GET    | `/tasks`              | Get tasks for current user               | User          |
| POST   | `/tasks`              | Create task                              | User          |
| PATCH  | `/tasks/:id`          | Edit task                                | Owner / Admin |
| GET    | `/tasks/user/:userId` | Admin: get all tasks for a specific user | Admin         |
| GET    | `/tasks/:id`          | Get task by ID                           | Admin         |
| POST   | `/tasks/:id`          | Create task for user                     | Admin         |

> All routes require authentication

---

## 🛠 Tech Stack

* **Node.js**
* **Express.js**
* **TypeScript**
* **JWT** for authentication
* **Zod / Joi** (or similar) for validation

---

## ▶️ Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the server

```bash
npm run dev
```

Server will start on:

```
http://localhost:3000
```

---

## 🧠 What I Learned

Through building this project, I gained hands-on experience with **real-world backend software engineering practices**, beyond basic CRUD APIs:

* **Layered Architecture**: How to separate concerns properly using Routes, Controllers, Services, and Middleware, and why this separation matters for scalability and maintainability.
* **Controller vs Service Responsibility**: Keeping controllers thin and pushing all business rules into services.
* **Authentication & Authorization**: Implementing JWT-based authentication and enforcing role-based access control (User vs Admin).
* **Middleware Design**: Writing reusable middleware for authentication, authorization, validation, and error handling.
* **Centralized Error Handling**: Designing a global error handler and using error propagation (`next(err)`) instead of scattered try/catch blocks.
* **Validation-First Approach**: Validating request bodies and parameters before they reach controllers to prevent invalid states.
* **Type-Safe Express with TypeScript**: Using Express generics and custom types to keep request handling type-safe.
* **API Design Principles**: Applying REST conventions correctly (GET, POST, PATCH) and designing clean, predictable endpoints.
* **Thinking Like a Backend Engineer**: Designing features by identifying data, rules, and responsibilities before writing code.

This project helped bridge the gap between **academic knowledge** and **industry-level backend engineering practices**.

---

## 🚀 Possible Improvements

* Add automated tests (unit & integration)
* Add Swagger / OpenAPI documentation
* Add pagination & filtering
* Add refresh tokens
* Add database transactions

---

## 👤 Author

**Abdallah**
Computer Science & Engineering student @ GUC
Focused on Backend Engineering & Software Architecture

---

## 📄 License

MIT License
