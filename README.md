# Event Ticketing API

A RESTful API for an event ticketing system where organizers can create and manage events, and attendees can browse events and book tickets. Built with Node.js, Express, PostgreSQL, and Prisma ORM.

🔗 **Live API URL:** [https://ticketing-api-4wve.onrender.com](https://ticketing-api-4wve.onrender.com)

## 🚀 Tech Stack

- **Runtime:** Node.js 20 LTS
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication & Security:** JWT (`jsonwebtoken`), bcryptjs, Helmet, CORS
- **Validation:** Zod

---

## 📁 Project Structure

```text
src/
├── controllers/      # Request handlers & request validation
├── lib/              # Shared library clients (Prisma client instance)
├── middlewares/      # JWT authentication, authorization & error handling
├── routes/           # API route definitions
├── utils/            # Shared utilities (AppError class)
├── app.js            # Express app configuration & middleware staging
└── server.js         # Entry point of the application
prisma/
├── schema.prisma     # Database schema design
└── seed.js           # Seed script for development data
```

---

## 🛠️ Local Setup

### 1. Prerequisites

- Node.js 20+ installed on your local machine.
- PostgreSQL database running locally (or using a cloud provider like Neon).

_If you prefer running PostgreSQL via Docker, you can start a container using:_

```bash
docker run --name ticketing-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ticketing_dev -p 5432:5432 -d postgres:16
```

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/ngovanduong-dev/ticketing-api.git
cd ticketing-api
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticketing_dev?schema=public"
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

### 4. Database Setup & Migrations

Run the database migrations and seed the initial development database:

```bash
# Run migrations to create database tables
npm run db:migrate

# Seed database with initial categories, users, and events
npm run db:seed
```

### 5. Running the Application

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

The API server will be available at `http://localhost:3000`. You can check the server health by sending a GET request to `/health`:

```bash
curl http://localhost:3000/health
```

---

## ⚙️ Available Scripts

- `npm run dev` - Starts the development server with `nodemon`.
- `npm start` - Starts the production server.
- `npm run db:migrate` - Applies Prisma database migrations.
- `npm run db:seed` - Seeds the database with mock data.
- `npm run db:studio` - Opens Prisma Studio GUI to view/edit database records.

---

## 🔑 Seed Accounts (For Testing)

| Role          | Email                | Password      |
| :------------ | :------------------- | :------------ |
| **ORGANIZER** | `organizer@test.com` | `password123` |
| **ATTENDEE**  | `attendee@test.com`  | `password123` |

---

## 📡 API Endpoints

- **Production Base URL:** `https://ticketing-api-4wve.onrender.com/api/v1`
- **Local Base URL:** `http://localhost:3000/api/v1`

All API endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint         | Auth   | Description                          |
| :----- | :--------------- | :----- | :----------------------------------- |
| `POST` | `/auth/register` | Public | Register a new user                  |
| `POST` | `/auth/login`    | Public | Authenticate a user and return a JWT |
| `GET`  | `/auth/me`       | User   | Get current logged-in user details   |

### Events Management

| Method   | Endpoint      | Auth     | Role                | Description                                               |
| :------- | :------------ | :------- | :------------------ | :-------------------------------------------------------- |
| `GET`    | `/events`     | Public   | All                 | List all published events (supports pagination & filters) |
| `GET`    | `/events/:id` | Public   | All                 | Get detailed information of a specific event              |
| `POST`   | `/events`     | Required | `ORGANIZER`         | Create a new event                                        |
| `PATCH`  | `/events/:id` | Required | `ORGANIZER` (Owner) | Update an event (only before event date)                  |
| `DELETE` | `/events/:id` | Required | `ORGANIZER` (Owner) | Cancel/Soft-delete an event                               |

### Ticket Bookings

| Method   | Endpoint        | Auth     | Role               | Description                 |
| :------- | :-------------- | :------- | :----------------- | :-------------------------- |
| `POST`   | `/bookings`     | Required | `ATTENDEE`         | Book tickets for an event   |
| `GET`    | `/bookings/me`  | Required | `ATTENDEE`         | Retrieve my booking history |
| `DELETE` | `/bookings/:id` | Required | `ATTENDEE` (Owner) | Cancel a booking            |
