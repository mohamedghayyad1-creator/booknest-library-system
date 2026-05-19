# BookNest - Smart Library and Reading Progress System

BookNest is a web-based CRUD application for managing a personal library.  
It helps users organize books, categories, reading progress, and borrowing records.

## Features

- Register and login system
- JWT authentication
- User-specific data isolation
- Add, view, update, and delete books
- Manage book categories
- Track reading progress
- Search and filter books
- Manage borrowing records
- Dashboard statistics
- Swagger API documentation
- Basic unit testing

## Technologies Used

- HTML
- CSS
- Vanilla JavaScript
- Node.js
- Express.js
- SQLite
- JWT
- Swagger
- Jest

## How to Run

Install dependencies:

```bash
npm.cmd install
```

Start the server:

```bash
npm.cmd start
```

Open the application:

```text
http://localhost:3000
```

Open Swagger documentation:

```text
http://localhost:3000/api-docs
```

Run tests:

```bash
npm test
```

## Authentication

The system uses JWT authentication.  
Users must register and login before using the library system.

After login, the frontend stores the JWT token and sends it with protected API requests.

## Data Isolation

Each user can only view and manage their own books, categories, and borrowing records.  
User data is separated using the user ID stored inside the JWT token.

## Project Structure

```text
booknest-library-system/
├── backend/
├── frontend/
├── README.md
├── package.json
└── .gitignore
```

## About

This project was developed for the System Analysis and Design course.
