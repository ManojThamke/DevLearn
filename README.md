# DevLearn — Developer Learning Platform

> A full-stack AI-powered coding education platform where students learn through structured lessons, build real projects, and get instant AI code evaluation with detailed feedback.

---

## 🚀 Live Demo

- **Frontend:** Coming soon (Vercel)
- **Backend:** Coming soon (Railway)
- **GitHub:** https://github.com/ManojThamke/DevLearn

---

## 📸 Screenshots

| Landing Page | Course Detail | Lesson Page |
|---|---|---|
| Dark hero with animations | Module accordion with progress | Dark mode with sidebar |

| Dashboard | Profile Page | Submit Project |
|---|---|---|
| Progress rings and stats | Avatar upload, edit profile | GitHub URL and ZIP upload |

---

## ✨ Features

### 🎓 Learning
- Structured courses with modules and lessons
- Markdown lesson content with syntax highlighted code blocks
- Reading progress bar as you scroll
- Mark lessons as complete and track progress
- Dark mode lesson viewer
- Previous / Next lesson navigation
- Mobile responsive sidebar

### 🚀 Projects
- Submit projects via GitHub URL
- Submit projects via ZIP file upload (up to 100MB)
- AI evaluation of submitted code
- Track all submissions with attempt history

### 🤖 AI
- AI assistant powered by Google Gemini 2.5 Flash
- Ask questions about React, JavaScript, Node.js
- Get code reviews and interview prep help
- Quick prompt suggestions for common questions

### 👤 User
- Register and login with JWT authentication
- Edit profile name and email
- Choose from 8 default emoji avatars
- Upload custom avatar image
- Set avatar via image URL
- Change password with strength meter
- View learning stats and XP points

### 📊 Dashboard
- Enrolled courses with progress bars
- Lessons completed counter
- Animated progress rings per course
- Quick action buttons

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | UI framework |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| React Router v6 | Navigation |
| Axios | HTTP requests |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File uploads |

### AI & Services
| Technology | Purpose |
|---|---|
| Google Gemini 2.5 Flash | AI assistant + code evaluation |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure
```
DevLearn/
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── AIAssistant.jsx
│       │   │   └── Spinner.jsx
│       │   └── layout/
│       │       ├── Navbar.jsx
│       │       └── Footer.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── CourseCatalog.jsx
│       │   ├── CourseDetail.jsx
│       │   ├── LessonPage.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── ProjectSubmitPage.jsx
│       │   └── NotFound.jsx
│       └── services/
│           └── api.js
│
└── server/                    # Node.js backend
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── course.controller.js
    │   ├── lesson.controller.js
    │   ├── progress.controller.js
    │   ├── profile.controller.js
    │   ├── submission.controller.js
    │   └── ai.controller.js
    ├── models/
    │   ├── User.model.js
    │   ├── Course.model.js
    │   ├── Module.model.js
    │   ├── Lesson.model.js
    │   ├── Project.model.js
    │   ├── Submission.model.js
    │   ├── Score.model.js
    │   ├── Progress.model.js
    │   └── Enrollment.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── course.routes.js
    │   ├── lesson.routes.js
    │   ├── progress.routes.js
    │   ├── profile.routes.js
    │   ├── submission.routes.js
    │   ├── project.routes.js
    │   └── ai.routes.js
    ├── middleware/
    │   ├── auth.middleware.js
    │   └── upload.middleware.js
    ├── services/
    │   └── ai.service.js
    ├── data/
    │   └── lessons.js
    ├── seed.js
    └── index.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key (free at aistudio.google.com)

### 1. Clone the repository
```bash
git clone https://github.com/ManojThamke/DevLearn.git
cd DevLearn
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Seed the database:
```bash
node seed.js
```

Start the server:
```bash
node --watch index.js
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🗺️ API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Courses
```
GET    /api/courses
GET    /api/courses/:slug
GET    /api/courses/id/:id
POST   /api/courses/:id/enroll
```

### Lessons
```
GET    /api/lessons/:id
POST   /api/lessons/:id/complete
```

### Progress
```
GET    /api/progress
GET    /api/progress/:courseId
```

### Profile
```
GET    /api/profile
PUT    /api/profile/update
PUT    /api/profile/change-password
PUT    /api/profile/avatar
```

### Submissions
```
POST   /api/submissions
POST   /api/submissions/upload-zip
GET    /api/submissions/my
GET    /api/submissions/project/:projectId
GET    /api/submissions/:id
```

### Projects
```
GET    /api/projects/:id
GET    /api/projects/module/:moduleId
```

### AI
```
POST   /api/ai/chat
```

---

## 📋 Roadmap

- [x] User authentication (register, login, JWT)
- [x] Course catalog with search and filter
- [x] Course detail with module accordion
- [x] Lesson page with dark mode and progress tracking
- [x] Student dashboard with progress rings
- [x] AI assistant (Gemini powered)
- [x] Profile page with avatar upload
- [x] Project submission (GitHub URL + ZIP)
- [ ] AI code evaluation system
- [ ] Submission score dashboard
- [ ] Certificate of completion
- [ ] More courses (Node.js, TailwindCSS, JavaScript)
- [ ] Deploy to Vercel + Railway

---

## 👨‍💻 Author

**Manoj Thamke**
- GitHub: [@ManojThamke](https://github.com/ManojThamke)

---

## 📄 License

MIT License — feel free to use this project for learning and personal projects.