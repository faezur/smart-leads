# 🎯 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and modern best practices.

## 🚀 Live Demo Link

- [https://smart-leads-gilt.vercel.app]

## ✨ Features

- 🔐 JWT-based Authentication (Register, Login, Protected Routes)
- 👥 Role-Based Access Control (Admin & Sales)
- 📋 Lead Management (Create, Read, Update, Delete)
- 🔍 Advanced Filtering (Status, Source, Search, Sort)
- 📄 Backend Pagination (10 records/page)
- 📊 CSV Export
- 🔎 Debounced Search
- 🌙 Dark Mode
- 🐳 Docker Support
- 📱 Responsive Design

## 🛠️ Tech Stack

### Frontend
- React.js + TypeScript
- TailwindCSS
- Zustand (State Management)
- React Router DOM
- Axios

### Backend
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing
- Zod Validation
- json2csv


## ⚙️ Local Setup (Without Docker)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend Setup

```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your values in .env

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

## 🐳 Docker Setup

```bash
# Make sure Docker Desktop is running

# Create root .env file
cp .env.example .env
# Fill in your values

# Build and start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost
# Backend:  http://localhost:5000
```

## 📡 API Documentation

### Base URL
Local:      http://localhost:5000/api
Production: https://your-render-url.onrender.com/api

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login user | No |
| GET | /auth/me | Get current user | Yes |

### Lead Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | /leads | Get all leads | Yes | All |
| GET | /leads/:id | Get single lead | Yes | All |
| POST | /leads | Create lead | Yes | All |
| PUT | /leads/:id | Update lead | Yes | All |
| DELETE | /leads/:id | Delete lead | Yes | Admin |
| GET | /leads/export/csv | Export CSV | Yes | All |

### Query Parameters (GET /leads)

| Param | Type   | Description      | Example |
|-------|------  |-------------     |---------|
| page  | number | Page number      | ?page=1 |
| limit | number | Records per page | ?limit=10 |
| status| string | Filter by status | ?status=New |
| source| string | Filter by source | ?source=Instagram |
| search| string | Search name/email| ?search=Rahul |
| sort  | string | Sort order       | ?sort=latest |

### Sample API Response

**Success:**
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

**Error:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

## 🔐 Role Based Access Control

| Feature | Admin | Sales |
|---------|-------|-------|
| View all leads | ✅ | ❌ (own only) |
| Create lead    | ✅ | ✅ |
| Update lead    | ✅ | ✅ (own only) |
| Delete lead    | ✅ | ❌ |
| Export CSV     | ✅ | ✅ |

## 🌍 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leads
JWT_SECRET=I_CANT_TELL_YOU
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## 👨‍💻 Author

**Faiz Ansari**
- GitHub: [@faezur](https://github.com/faezur)
- Email: faezur@gmail.com

## 📝 License

MIT License
