# TaskFlow

> Simple, focused task management for teams and individuals.

TaskFlow is a full-stack task management application built with Vue 3 and Express. It provides a clean, responsive workspace for creating, organizing, and tracking tasks with search, filtering, sorting, and priority management.

## Features

- **Authentication** — Email/password registration and login with JWT cookie-based sessions
- **Task Management** — Create, read, update, delete, and toggle tasks
- **Priority & Due Dates** — Assign low/medium/high priority and optional due dates
- **Search** — Instant debounced search across task titles and descriptions
- **Filtering** — Filter by status, priority, due date (today/overdue/upcoming)
- **Sorting** — Sort by newest, oldest, priority, due date, or title
- **Workspace Insights** — At-a-glance stats for overdue, due today, high priority tasks, and overall progress
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Accessibility** — Keyboard navigation, ARIA labels, focus management, screen reader support

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 (Options API), Vue Router, Vite |
| Backend | Express.js, Mongoose ODM |
| Database | MongoDB |
| Authentication | JWT (httpOnly cookies), bcrypt |
| Styling | CSS custom properties (design tokens) |
| HTTP Client | Axios |

## Architecture

```
taskflow/
├── client/                  # Vue 3 frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Logo
│   │   │   ├── dashboard/   # TaskCard, Sidebar, SearchBar, etc.
│   │   │   ├── layout/      # Navbar
│   │   │   └── ui/          # Button
│   │   ├── composables/     # Shared reactive state (useAuth, useTasks)
│   │   ├── pages/           # Home, Login, Register, Dashboard
│   │   ├── router/          # Route definitions + guards
│   │   ├── services/        # Axios instance with interceptors
│   │   └── styles/          # CSS design system (variables, base, components)
│   └── index.html
│
└── server/                  # Express API server
    ├── config/              # Database connection
    ├── controllers/         # Route handlers (auth, task, health)
    ├── middleware/           # JWT authentication middleware
    ├── models/              # Mongoose schemas (User, Task)
    ├── routes/              # Express router definitions
    └── server.js            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/taskflow.git
cd taskflow

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create `server/.env` using the example file:

```bash
cp server/.env.example server/.env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret key for signing JWT tokens | (generate a random string) |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

### Running Locally

Start both servers concurrently in separate terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

### Backend (Render / Railway / Fly.io)

1. Set the environment variables listed above on your hosting platform
2. Ensure `NODE_ENV=production` and `CLIENT_URL` points to your frontend domain
3. Set `JWT_SECRET` to a cryptographically random string
4. Point `MONGO_URI` to your MongoDB Atlas cluster

The start command is `npm start` in the `server/` directory.

### Frontend (Vercel / Netlify)

1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `client/dist/` directory
3. Set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-api.com/api`)

Alternatively, you can serve the built frontend from the Express server in production by configuring a static file middleware.

## API Overview

All API endpoints are prefixed with `/api`.

### Health

```
GET /api/health
```

### Authentication

```
POST /api/auth/register    # { name, email, password }
POST /api/auth/login       # { email, password }
POST /api/auth/logout
GET  /api/auth/me          # (requires auth)
```

### Tasks (all endpoints require auth)

```
GET    /api/tasks          # ?search=&status=&priority=&due=&sort=
GET    /api/tasks/stats
POST   /api/tasks          # { title, description, priority, dueDate }
PUT    /api/tasks/:id      # { title, description, completed, priority, dueDate }
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/toggle
```

## Design System

TaskFlow uses CSS custom properties for consistent theming:

- **Colors** — Gray scale (50–900), primary (#6c63ff), success, error, warning
- **Typography** — System font stack, scale from xs to 5xl
- **Spacing** — 1–24 (0.25rem–6rem) based on 4px grid
- **Radii** — sm (4px) to full (circle)
- **Shadows** — sm, md, lg, xl
- **Transitions** — Fast (150ms), base (200ms), slow (300ms) with standard easing

## Screenshots

<!-- Add screenshots here -->
<!-- ![Dashboard](screenshots/dashboard.png) -->
<!-- ![Task Creation](screenshots/create-task.png) -->

## License

MIT
