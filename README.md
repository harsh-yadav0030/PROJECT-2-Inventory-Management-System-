# Inventory Management System

## Overview

Inventory Management System is a backend application built with Node.js, Express.js, MongoDB, and JWT authentication. It helps organizations manage warehouses, products, inventory operations, and user access through role-based authorization.

The system supports multiple user roles, warehouse/location management, product management, and inventory tracking through stock-in and stock-out operations.

---

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Access Token & Refresh Token
* Protected Routes
* Role-Based Access Control (RBAC)

### User Roles

* SUPER_ADMIN
* MANAGER
* EMPLOYEE

### Location Management

* Create Location
* Get All Locations
* Get Location By ID
* Update Location
* Deactivate/Delete Location

### Product Management

* Create Product
* Get All Products
* Get Product By ID
* Update Product
* Deactivate Product

### Inventory Management

* Stock In Products
* Stock Out Products
* Inventory Tracking
* Warehouse-wise Inventory Management

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcrypt

### Other Libraries

* Cookie Parser
* CORS
* Morgan
* Express Validator
* Multer

---

## Project Structure

```text
backend/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── db/
│
├── .env
├── package.json
└── server.js
```

---

## API Endpoints

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/current-user
```

### Locations

```http
POST   /api/v1/locations
GET    /api/v1/locations
GET    /api/v1/locations/:id
PATCH  /api/v1/locations/:id
DELETE /api/v1/locations/:id
```

### Products

```http
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

### Inventory

```http
POST /api/v1/inventory/stock-in
POST /api/v1/inventory/stock-out
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:3000
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to project directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

## Future Enhancements

* Inventory Transfer Between Warehouses
* Low Stock Alerts
* Inventory Analytics Dashboard
* AI-Powered Warehouse Summary
* AI-Based Reorder Recommendations
* Sales & Purchase Reports
* Audit Logs
* Demand Forecasting

---

## Learning Outcomes

This project demonstrates:

* REST API Development
* Authentication & Authorization
* Role-Based Access Control
* MongoDB Data Modeling
* JWT Security
* Middleware Architecture
* Inventory Management Logic
* Backend System Design

---

## Author

Harsh Yadav
