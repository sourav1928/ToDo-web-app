# To-Do List App — Full Stack (React + Node.js + Express + MongoDB)

## Project Structure

```
todo-app/
├── backend/
│   ├── controllers/
│   │   └── todo.controller.js
│   ├── models/
│   │   └── todo.model.js
│   ├── routes/
│   │   └── todo.routes.js
│   ├── services/
│   │   └── todo.service.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/               ← Create React App / Vite project
    └── src/
        └── App.jsx         ← Main component (TodoApp.jsx)
```

---

## Backend Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`)

### Steps

```bash
cd backend
npm install
```

Create a `.env` file (already included):
```
MONGO_URI=mongodb://localhost:27017/todoapp
PORT=5000
```

Start the server:
```bash
npm run dev       # development (nodemon)
npm start         # production
```

Server will run at **http://localhost:5000**

---

## Frontend Setup

### Create a new React app (Vite recommended)

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios
```

Replace `src/App.jsx` with the provided `TodoApp.jsx` file.

Start:
```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all tasks (supports ?search=, ?status=, ?priority=, ?sortBy=) |
| GET | /api/todos/:id | Get single task |
| POST | /api/todos | Create new task |
| PUT | /api/todos/:id | Update task |
| PATCH | /api/todos/:id/status | Toggle completed status |
| DELETE | /api/todos/:id | Delete task |

### Example POST body
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "dueDate": "2024-12-31"
}
```

---

## Features

### Frontend
- Create, edit, delete tasks via modal forms
- Toggle complete/pending with checkbox
- Search tasks by title or description
- Filter by status (all / pending / completed)
- Filter by priority (low / medium / high)
- Sort by date, due date, priority, or title
- Stats dashboard (total, pending, done, overdue)
- Overdue task highlighting
- Success/error toast notifications
- Loading states and error messages

### Backend
- Controller → Service → Model architecture
- Input validation and error handling
- Full-text search via MongoDB regex
- Dynamic filtering and sorting
- Centralised error middleware

---

## Deployment

### Backend → Render
1. Push `backend/` folder to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set environment variable: `MONGO_URI=<your MongoDB Atlas URI>`
4. Build command: `npm install` | Start command: `npm start`

### Frontend → Netlify
1. In `App.jsx`, update the `baseURL` inside `axios.create(...)` to your Render backend URL
2. Push `frontend/` folder to GitHub
3. Deploy on [netlify.com](https://netlify.com)
4. Build command: `npm run build` | Publish directory: `dist`

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| CORS errors between frontend and backend | Added `cors` middleware in Express |
| MongoDB connection errors | Used `dotenv` for config + try/catch in service layer |
| Optimistic UI vs real data sync | Always re-fetch from server after mutations |
| Overdue tasks not highlighted | Compared `dueDate` to `new Date()` client-side |
| Delete confirmation UX | Two-step confirm button in TaskCard component |
