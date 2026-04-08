# School Management API

A Node.js REST API for managing schools and finding the nearest ones to any location using the Haversine formula.

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 5.7

### Setup

```bash
# Clone & install
git clone
cd school-management-api
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Start development server
npm run dev
```

The server will auto-create the `school_management` database and `schools` table on first run.

---

## Environment Variables

| Variable      | Description    | Default             |
| ------------- | -------------- | ------------------- |
| `PORT`        | Server port    | `3000`              |
| `DB_HOST`     | MySQL host     | `localhost`         |
| `DB_USER`     | MySQL user     | `root`              |
| `DB_PASSWORD` | MySQL password | _(empty)_           |
| `DB_NAME`     | Database name  | `school_management` |

---

## API Endpoints

### Health Check

```
GET /
```

**Response:**

```json
{ "status": "ok", "message": "School Management API is running" }
```

---

### Add School

```
POST /api/addSchool
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi",
  "latitude": 28.5672,
  "longitude": 77.241
}
```

**Validation Rules:**

- `name` — required, non-empty string
- `address` — required, non-empty string
- `latitude` — required, number between −90 and 90
- `longitude` — required, number between −180 and 180

**Success (201):**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi",
    "latitude": 28.5672,
    "longitude": 77.241
  }
}
```

**Validation Error (400):**

```json
{
  "success": false,
  "errors": ["name is required"]
}
```

---

### List Schools (Sorted by Proximity)

```
GET /api/listSchools?latitude=28.6139&longitude=77.2090
```

**Query Parameters:**

- `latitude` — required, number between −90 and 90
- `longitude` — required, number between −180 and 180

**Success (200):**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi",
      "latitude": 28.5672,
      "longitude": 77.241,
      "distance": 5.94
    }
  ]
}
```

> `distance` is in **kilometres**, calculated using the Haversine formula.

---

## Project Structure

```
src/
├── app.js                    # Entry point — server, middleware, routes
├── config/
│   ├── db.js                 # MySQL connection pool
│   └── initDb.js             # Database & table auto-creation
├── controllers/
│   └── schoolController.js   # addSchool & listSchools logic
├── routes/
│   └── schoolRoutes.js       # Route definitions
└── utils/
    └── distance.js           # Haversine distance calculation
```

## Postman Collection

Import `postman_collection.json` from the project root into Postman to test all endpoints with pre-configured examples.

---

## Scripts

| Command       | Description                      |
| ------------- | -------------------------------- |
| `npm start`   | Start the server                 |
| `npm run dev` | Start with auto-reload (nodemon) |

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MySQL 2 (Promise API)
- **Dev Tooling:** Nodemon, dotenv
