# 🎬 Movie Watchlist API

A RESTful API for managing personal movie watchlists with user authentication. Built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Live API

**Base URL:** `https://movie-watchlist-api-euko.onrender.com`

## ✨ Features

- **User Authentication** - Register, login, logout with JWT (httpOnly cookies)
- **Movie Management** - Full CRUD operations for movies
- **Personal Watchlist** - Add/remove movies, track status (Planned/Watching/Completed/Dropped)
- **Ratings & Notes** - Rate movies 1-10 and add personal notes
- **Input Validation** - Zod schemas for all endpoints
- **Error Handling** - Centralized error handling with Prisma-specific errors

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL (Neon Tech) |
| ORM | Prisma ORM v6 |
| Authentication | JWT + httpOnly cookies |
| Password Hashing | bcrypt |
| Validation | Zod |
| Dev Tools | Nodemon, dotenv |

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |

### Movies
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/movies` | Get all movies | No |
| GET | `/movies/:id` | Get single movie | No |
| POST | `/movies` | Create new movie | Yes |
| PUT | `/movies/:id` | Update movie | Yes (creator only) |
| DELETE | `/movies/:id` | Delete movie | Yes (creator only) |

### Watchlist (All require authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/watchlist` | Add movie to watchlist |
| PUT | `/watchlist/:id` | Update watchlist item (status/rating/notes) |
| DELETE | `/watchlist/:id` | Remove from watchlist |

## 🗄️ Database Schema

```prisma
model User {
  id            String         @id @default(uuid())
  name          String
  email         String         @unique
  password      String
  createdAt     DateTime       @default(now())
  movies        Movie[]        @relation("MovieCreator")
  watchlistItems WatchlistItem[]
}

model Movie {
  id            String         @id @default(uuid())
  title         String
  overview      String?
  releaseYear   Int
  genres        String[]
  runtime       Int?
  posterUrl     String?
  createdBy     String
  createdAt     DateTime       @default(now())
  creator       User           @relation("MovieCreator", fields: [createdBy], references: [id])
  watchlistItems WatchlistItem[]
}

model WatchlistItem {
  id            String         @id @default(uuid())
  userId        String
  movieId       String
  status        WatchlistStatus @default(PLANNED)
  rating        Int?
  notes         String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  user          User           @relation(fields: [userId], references: [id])
  movie         Movie          @relation(fields: [movieId], references: [id])

  @@unique([userId, movieId])
}

enum WatchlistStatus {
  PLANNED
  WATCHING
  COMPLETED
  DROPPED
}
🚀 Local Setup
Prerequisites
Node.js (v18 or higher)

PostgreSQL

Installation
bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/backend-course.git
cd backend-course

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed:movies

# Start development server
npm run dev
Environment Variables
env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=5001
📦 Deployment
This API is deployed on Render with Neon PostgreSQL.

Deployment Commands
bash
# Build command (Render)
npm install && npx prisma generate

# Start command
npm run start
🧪 Testing the API
Register a user
bash
curl -X POST https://movie-watchlist-api-euko.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'
Login
bash
curl -X POST https://movie-watchlist-api-euko.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
Get all movies
bash
curl https://movie-watchlist-api-euko.onrender.com/movies
Add to watchlist (requires login cookie)
bash
curl -X POST https://movie-watchlist-api-euko.onrender.com/watchlist \
  -H "Content-Type: application/json" \
  -d '{"movieId":"your-movie-id","status":"PLANNED"}'
