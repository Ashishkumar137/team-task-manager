# 🚀 Team Task Manager

**User Preferences**: Light mode | Blue/Cyan palette | Fonts: Poppins (headings) + Nunito (body)

A full-stack web application for managing projects, teams, and tasks with role-based access control. Features include user authentication, project management, task assignment, and progress tracking.

## ✨ Features

- **User Authentication**: JWT-based signup and login
- **Project Management**: Create and manage projects with team collaboration
- **Task Management**: Create, assign, and track task progress
- **Role-Based Access Control**: Admin and Member roles with specific permissions
- **Dashboard**: Overview of tasks, projects, and progress statistics
- **Team Management**: Add team members to projects with role assignment
- **Status Tracking**: Multiple task statuses (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- **Priority Levels**: Task prioritization (LOW, MEDIUM, HIGH, URGENT)
- **Responsive UI**: Modern and user-friendly interface

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **API Client**: Axios
- **State Management**: Zustand
- **Styling**: CSS3

### Deployment
- **Platform**: Railway
- **Database**: Railway PostgreSQL Service
- **Environment**: Node.js runtime

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd team-task-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Example:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=team_task_manager
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your-super-secret-key
```

### 3. Database Setup

```bash
# Run database migrations
npm run migrate

# This will create all required tables:
# - users
# - projects
# - team_members
# - tasks
```

### 4. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Server runs on http://localhost:5000
```

### 5. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional, for custom API URL)
# VITE_API_URL=http://localhost:5000/api
```

### 6. Start Frontend Development Server

```bash
npm run dev

# Frontend runs on http://localhost:3000
```

## 🌐 Deployment on Railway

### Step 1: Create Railway Account
- Visit [railway.app](https://railway.app)
- Sign up or log in with GitHub

### Step 2: Connect Repository
- Create a new project
- Connect your GitHub repository

### Step 3: Add PostgreSQL Service
- Add a PostgreSQL plugin to your project
- Copy the connection string

### Step 4: Configure Environment Variables

In Railway's project settings, add:

```
NODE_ENV=production
PORT=5000
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your-secure-jwt-secret-key
FRONTEND_URL=your-frontend-railway-domain
```

### Step 5: Deploy Backend

The Procfile will automatically:
1. Install dependencies
2. Run database migrations
3. Start the server

### Step 6: Deploy Frontend

Create a separate Railway project for frontend:

1. Create new project
2. Deploy from your repository
3. Set build command: `npm run build`
4. Set start command: `npm run start`
5. Add environment variables:
   ```
   VITE_API_URL=your-backend-railway-domain/api
   ```

## 📚 API Documentation

### Authentication Routes

```
POST   /api/auth/signup           - User registration
POST   /api/auth/login            - User login
GET    /api/auth/me               - Get current user (requires auth)
```

### Project Routes

```
GET    /api/projects              - List user's projects
POST   /api/projects              - Create new project
GET    /api/projects/:projectId   - Get project details
PUT    /api/projects/:projectId   - Update project
DELETE /api/projects/:projectId   - Delete project
```

### Task Routes

```
GET    /api/projects/:projectId/tasks      - Get project tasks
POST   /api/projects/:projectId/tasks      - Create task
GET    /api/tasks/:taskId                  - Get task details
PUT    /api/tasks/:taskId                  - Update task
DELETE /api/tasks/:taskId                  - Delete task
GET    /api/my-tasks                       - Get assigned tasks
```

### Team Member Routes

```
GET    /api/projects/:projectId/members           - List members
POST   /api/projects/:projectId/members           - Add member
PUT    /api/projects/:projectId/members/:userId   - Update role
DELETE /api/projects/:projectId/members/:userId   - Remove member
```

## 🔐 Authentication & Authorization

### JWT Token
- Tokens are issued on login/signup
- Token includes user ID and email
- Valid for 7 days (configurable)

### Role-Based Access Control
- **ADMIN**: Can manage project, add/remove members, delete tasks
- **MEMBER**: Can view project, create/update tasks, view team members

### Protected Routes
- All API endpoints except `/auth/signup` and `/auth/login` require authentication
- Authentication token is sent via `Authorization: Bearer <token>` header

## 📊 Database Schema

### Users Table
```
- id (UUID)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- avatar_url (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Projects Table
```
- id (UUID)
- name (VARCHAR)
- description (TEXT)
- owner_id (UUID, FK: users.id)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Team Members Table
```
- id (UUID)
- project_id (UUID, FK: projects.id)
- user_id (UUID, FK: users.id)
- role (VARCHAR) - ADMIN or MEMBER
- joined_at (TIMESTAMP)
```

### Tasks Table
```
- id (UUID)
- project_id (UUID, FK: projects.id)
- title (VARCHAR)
- description (TEXT)
- status (VARCHAR) - TODO, IN_PROGRESS, IN_REVIEW, DONE
- priority (VARCHAR) - LOW, MEDIUM, HIGH, URGENT
- assigned_to (UUID, FK: users.id)
- assigned_by (UUID, FK: users.id)
- due_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🧪 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & error handling
│   │   ├── validators/        # Input validation
│   │   ├── db/               # Database connection & migrations
│   │   ├── config.js         # Configuration
│   │   └── index.js          # Server entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # Zustand stores
│   │   ├── styles/           # CSS files
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Procfile                   # Railway deployment config
├── railway.json              # Railway build config
└── README.md
```

## 🛠️ Development Tips

### Adding New API Endpoints

1. Create controller in `backend/src/controllers/`
2. Add validation in `backend/src/validators/`
3. Create/update model in `backend/src/models/`
4. Add routes in `backend/src/routes/`
5. Register routes in `backend/src/index.js`

### Adding New Pages/Components

1. Create component in `frontend/src/pages/` or `frontend/src/components/`
2. Add route in `frontend/src/App.jsx`
3. Create API service method if needed
4. Add styles in `frontend/src/styles/`

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` credentials match database
- Run `npm run migrate` to create tables

### CORS Error
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check Authorization header is properly set

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Run `npm run dev -- --port 3001`

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please create an issue in the repository.

---

**Happy Project Managing! 🎉**
