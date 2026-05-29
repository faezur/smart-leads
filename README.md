# Smart Leads Dashboard

Full-stack Lead Management Dashboard built for the MERN Internship Assignment.

Live demo: https://smart-leads-gilt.vercel.app

## Features

- JWT authentication with register, login, protected routes, and bcrypt password hashing
- Role-based access control for Admin and Sales users
- Lead CRUD: create, view, update, delete, list, and single lead details
- Lead filters for status, source, search by name/email, and latest/oldest sorting
- Backend pagination with 10 records per page and pagination metadata
- Debounced search
- CSV export
- Responsive React dashboard with reusable components
- Loading, empty, validation, and error states
- Centralized backend error handling and clean API response format
- Docker setup
- Dark mode support

## Tech Stack

Frontend:
- React.js
- TypeScript
- TailwindCSS
- Zustand
- React Router
- Axios

Backend:
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Zod

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Docker Setup

Create a root `.env` from `.env.example`, then run:

```bash
docker-compose up --build
```

Docker URLs:
- Frontend: `http://localhost`
- Backend: `http://localhost:5000`

## Environment Variables

Backend `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Root `.env` for Docker:

```env
MONGODB_URI=mongodb://mongodb:27017/smart-leads
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

## API Documentation

Base URL:
- Local: `http://localhost:5000/api`

Auth:

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register sales user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Current user | Yes |

Leads:

| Method | Endpoint | Description | Auth | Role |
| --- | --- | --- | --- | --- |
| GET | `/leads` | List leads | Yes | Admin/Sales |
| GET | `/leads/:id` | Single lead details | Yes | Admin/Sales |
| POST | `/leads` | Create lead | Yes | Admin/Sales |
| PUT | `/leads/:id` | Update lead | Yes | Admin/Sales owner |
| DELETE | `/leads/:id` | Delete lead | Yes | Admin |
| GET | `/leads/export/csv` | Export CSV | Yes | Admin/Sales |

Lead list query params:

| Param | Description | Example |
| --- | --- | --- |
| `page` | Page number | `?page=1` |
| `limit` | Records per page | `?limit=10` |
| `status` | Filter by status | `?status=Qualified` |
| `source` | Filter by source | `?source=Instagram` |
| `search` | Search name/email | `?search=Rahul` |
| `sort` | `latest` or `oldest` | `?sort=latest` |

Success response:

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## RBAC Rules

| Feature | Admin | Sales |
| --- | --- | --- |
| View leads | All leads | Own leads |
| Create lead | Yes | Yes |
| Update lead | Yes | Own leads |
| Delete lead | Yes | No |
| Export CSV | All leads | Own leads |

## Submission

Required by assignment:
- GitHub repository URL
- Updated resume
- Proper README
- `.env.example`
- API documentation
- Setup instructions
- Deployment link

Author: Faiz Ansari
