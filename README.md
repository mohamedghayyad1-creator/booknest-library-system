# BookNest - Smart Library and Reading Progress System

BookNest is a full-stack CRUD web application for managing a personal or study library. Users can manage books, categories, borrowing records, reading progress, and dashboard statistics.

## Technologies

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: SQLite
- API: REST API with JSON request/response
- Documentation: Swagger UI
- Testing: Jest

## Features

- Add, view, update, and delete books
- Manage book categories
- Track reading status and progress percentage
- Track borrowing records
- Search books by title, author, or ISBN
- Filter books by category, status, and priority
- Dashboard statistics
- Frontend and backend validation
- Swagger interactive API documentation
- Unit tests for business logic

## Project Structure

```text
booknest-library-system/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── swagger.js
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── database/
│   ├── utils/
│   └── tests/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── package.json
├── README.md
└── .gitignore
```

## Installation

1. Install Node.js.
2. Open the project folder in VS Code.
3. Run:

```bash
npm install
```

## Run the Project

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Swagger API Documentation

After running the project, open:

```text
http://localhost:3000/api-docs
```

## Run Tests

```bash
npm test
```

## Main API Endpoints

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get one book |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Add a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Borrowings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/borrowings` | Get all borrowing records |
| POST | `/api/borrowings` | Add borrowing record |
| PUT | `/api/borrowings/:id` | Update borrowing record |
| DELETE | `/api/borrowings/:id` | Delete borrowing record |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get dashboard statistics |

## Example Book JSON

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "categoryId": 1,
  "isbn": "9780132350884",
  "totalPages": 464,
  "currentPage": 120,
  "status": "Reading",
  "priority": "High",
  "rating": 5,
  "notes": "Important programming book",
  "startDate": "2026-05-10",
  "finishDate": ""
}
```
