# 🚗 AutoVault — Car Dealership Inventory System

A full-stack Car Dealership Inventory System built with **Node.js + Express + TypeScript** (backend) and **React + Vite + Tailwind CSS** (frontend), following **Test-Driven Development (TDD)** principles.

[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/atlas)
[![Jest](https://img.shields.io/badge/Tests-Jest-orange)](https://jestjs.io/)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [API Reference](#api-reference)
- [Test Report](#test-report)
- [My AI Usage](#my-ai-usage)

---

## Overview

AutoVault is a complete inventory management system for a car dealership. It allows:
- **Customers** to browse, search, filter, and purchase vehicles
- **Admins** to add, update, delete, and restock vehicles
- **JWT-based authentication** with role-based access control

---

## Features

### Backend
- ✅ User registration & login with JWT authentication
- ✅ Role-based access control (user / admin)
- ✅ Full vehicle CRUD (Admin protected)
- ✅ Vehicle search with filters (brand, model, category, price range, fuel type)
- ✅ Sorting and pagination
- ✅ Purchase endpoint (decrements stock, prevents out-of-stock purchases)
- ✅ Restock endpoint (Admin only)
- ✅ Dedicated `/api/vehicles/search` endpoint
- ✅ MongoDB persistence via Mongoose

### Frontend (React SPA)
- ✅ Login & Registration forms
- ✅ Dashboard with vehicle grid and pagination
- ✅ Real-time search & filter by brand, category, fuel type, price range
- ✅ Purchase button (disabled when out of stock)
- ✅ Admin panel: Add, Edit, Delete, Restock vehicles
- ✅ JWT persisted in localStorage with auto-logout on expiry
- ✅ Protected routes (user/admin)
- ✅ Dark automotive theme with glassmorphism UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Runtime | Node.js + TypeScript |
| Backend Framework | Express v5 |
| Database | MongoDB (Atlas in prod, Memory Server in tests) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Testing | Jest + Supertest + mongodb-memory-server |

---

## Project Structure

```
car-dealership-backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.ts
│   │   └── vehicle.controller.ts
│   ├── middleware/         # JWT auth & admin guard
│   │   └── auth.middleware.ts
│   ├── models/             # Mongoose schemas
│   │   ├── user.model.ts
│   │   └── vehicle.model.ts
│   ├── routes/             # Express routers
│   │   ├── auth.routes.ts
│   │   └── vehicle.routes.ts
│   ├── tests/              # TDD test suites
│   │   ├── setup.ts
│   │   ├── auth.register.test.ts
│   │   ├── auth.login.test.ts
│   │   ├── auth.middleware.test.ts
│   │   ├── user.model.test.ts
│   │   ├── vehicle.model.test.ts
│   │   └── vehicle.routes.test.ts
│   ├── app.ts
│   └── server.ts
├── frontend/               # React SPA
│   ├── src/
│   │   ├── api/            # Axios + API functions
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context (JWT)
│   │   ├── pages/          # Page-level components
│   │   ├── App.tsx         # Routing
│   │   └── main.tsx
│   └── index.html
├── PROMPTS.md
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/ShahKrish25/car-dealership-inventory-system.git
cd car-dealership-inventory-system
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in:
# MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/car-dealership
# JWT_SECRET=your_super_secret_key_here
# PORT=5000

# Run development server
npm run dev

# Run tests
npm test
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env (optional — defaults to localhost:5000)
echo "VITE_API_URL=http://localhost:5000" > .env

# Run development server
npm run dev
# → Opens at http://localhost:5173
```

### 4. Creating an Admin User

After registering, update your user role in MongoDB:
```
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, receive JWT | No |

### Vehicles
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/vehicles` | List vehicles (paginated, filterable) | No |
| GET | `/api/vehicles/search` | Search vehicles | No |
| POST | `/api/vehicles` | Create vehicle | Admin |
| PUT | `/api/vehicles/:id` | Update vehicle | Admin |
| DELETE | `/api/vehicles/:id` | Delete vehicle | Admin |
| POST | `/api/vehicles/:id/purchase` | Purchase (qty -1) | User |
| POST | `/api/vehicles/:id/restock` | Restock (qty +n) | Admin |

#### Query Parameters (GET /api/vehicles)
| Param | Type | Description |
|---|---|---|
| `search` | string | Search brand or model |
| `brand` | string | Filter by exact brand |
| `category` | string | Filter by category |
| `fuelType` | string | Filter by fuel type |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `sortBy` | string | Field to sort by |
| `order` | `asc` / `desc` | Sort direction |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

---

## Test Report

Run the full suite with coverage:

```bash
npm run test:coverage
```

Latest saved report: [`docs/coverage-report.txt`](./docs/coverage-report.txt)

### Coverage Summary
| Metric | Coverage |
|---|---|
| Statements | **90.64%** |
| Branches | **76.92%** |
| Functions | **100%** |
| Lines | **90.38%** |

### Test Suites
| Suite | Tests | Description |
|---|---|---|
| `auth.register.test.ts` | Registration success / failures |
| `auth.login.test.ts` | Login success / invalid credentials |
| `auth.middleware.test.ts` | JWT verification, admin guard |
| `user.model.test.ts` | Password hashing |
| `vehicle.model.test.ts` | Schema validation |
| `vehicle.routes.test.ts` | CRUD, pagination, filters, purchase, restock |
| `applyVehicleFilters.test.ts` | Filter reset / clear-on-All behavior |
| `sanity.test.ts` | Sanity check |

**Total: 34 tests — all passing**

HTML report (local): after `npm run test:coverage`, open `coverage/lcov-report/index.html`

---

## 🤖 My AI Usage

### Tools Used
- **Antigravity (Google DeepMind)** — My primary AI coding assistant for the frontend and debugging.
- **ChatGPT (OpenAI GPT-4)** — Used for the initial backend scaffolding and schema design.

### How I Used AI

#### Backend Development
- **ChatGPT** generated the initial Express app skeleton, the Mongoose schemas, and some boilerplate controllers. I had to manually jump in to fix MongoDB DNS issues, add the `isAdmin` middleware, and tweak the validation rules (like preventing negative car quantities!).
- **Antigravity** helped me write the complex pagination and filtering logic for the vehicles, and it generated the entire TDD test suite for the vehicle routes.

#### Frontend Development
- **Antigravity** was amazing for designing the React frontend. It built the component architecture, the protected routing, and the sleek dark glassmorphism theme.
- **Human Intervention:** The AI actually introduced a bug where it tried to use a React Context state function to make a backend API call (`Expected 1 arguments, but got 2`). I had to manually debug this, import the correct Axios API function, fetch the token, and then pass it to the Context. I also fixed the registration form to include the required "Name" field that the AI forgot.

### AI Impact on Workflow
Using AI tools was a game-changer. It handled the tedious boilerplate and CSS styling, allowing me to focus entirely on the core business logic, the system architecture, and fixing the tricky bugs. The TDD approach (having the AI write tests first, then generating code to pass them) was super effective.

---

*Built with ❤️ (and a little AI help) as part of a TDD assessment*
