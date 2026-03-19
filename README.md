# DevLearn — Developer Learning Platform

> A full-stack AI-powered coding education platform where students learn through structured lessons, build real projects, and get instant AI code evaluation with detailed feedback.

---

## 🚀 Live Demo

- **Frontend:** https://dev-learn-nine.vercel.app (Vercel)
- **Backend:** https://devlearn-production.up.railway.app (Railway)
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

### 📚 Courses & Content
- **5 Complete Courses:** React, JavaScript Advanced, Node.js, TypeScript, Next.js
- **23 Modules** with structured learning paths
- **88 Detailed Lessons** with code examples and best practices
- **28 Real-World Projects** for hands-on practice
- Markdown lesson content with syntax highlighted code blocks

### 🎓 Learning
- Structured courses with modules and lessons
- Reading progress bar as you scroll
- Mark lessons as complete and track progress
- Dark mode lesson viewer
- Previous / Next lesson navigation
- Mobile responsive sidebar

### 🚀 Projects
- Submit projects via GitHub URL
- Submit projects via ZIP file upload (up to 100MB)
- AI evaluation of submitted code (Gemini powered)
- Track all submissions with attempt history

### 🏆 Achievements
- **Badge System** - Earn badges for completing courses and milestones
- **Certificates** - Generate certificates upon course completion
- **XP Points** - Gain experience points for completed lessons and projects

### 🤖 AI
- AI assistant powered by Google Gemini API
- Ask questions about React, JavaScript, Node.js, TypeScript, Next.js
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
- Achievement badges and certificates


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
| Bull | Job queue |
| Redis | Caching & queue |

### AI & External Services
| Technology | Purpose |
|---|---|
| Google Gemini API | AI assistant + code evaluation |
| Docker | Container support for code evaluation |
| GitHub API | Repository access for submissions |
| MongoDB Atlas | Cloud database |

### Development Tools
| Technology | Purpose |
|---|---|
| dotenv | Environment variables |
| CORS | Cross-origin requests |
| Morgan | Request logging |

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
    │   ├── project.controller.js
    │   ├── badge.controller.js
    │   ├── certificate.controller.js
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
    │   ├── Enrollment.model.js
    │   ├── Badge.model.js
    │   ├── UserBadge.model.js
    │   └── Certificate.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── course.routes.js
    │   ├── lesson.routes.js
    │   ├── progress.routes.js
    │   ├── profile.routes.js
    │   ├── submission.routes.js
    │   ├── project.routes.js
    │   ├── badge.routes.js
    │   ├── certificate.routes.js
    │   └── ai.routes.js
    ├── middleware/
    │   ├── auth.middleware.js
    │   └── upload.middleware.js
    ├── services/
    │   ├── ai.service.js
    │   ├── evaluation.service.js
    │   ├── github.service.js
    │   └── docker.service.js
    ├── data/
    │   ├── module1-8.lessons.js (React course)
    │   ├── nodejs-module1-3.lessons.js
    │   ├── js-adv-module1-4.lessons.js
    │   ├── ts-modules.lessons.js
    │   ├── nextjs-modules.lessons.js
    │   └── badgeDefinitions.js
    ├── seed.js
    ├── seed-*.js (individual course seeders)
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

## 🌐 Production Deployment

DevLearn is deployed using **free-tier services**:
- **Frontend:** Vercel (https://dev-learn-nine.vercel.app)
- **Backend:** Railway (https://devlearn-production.up.railway.app)
- **Database:** MongoDB Atlas Free Tier (5GB shared cluster)
- **Cache:** Railway Redis Add-on

### Deployment Setup Files
- `vercel.json` - Vercel build configuration
- `server/Procfile` - Railway start command
- `server/.env.example` - Environment variables template

### Production Environment Variables

**MongoDB Atlas:**
- Create free cluster on https://www.mongodb.com/cloud/atlas
- Get connection string: `MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/devlearn`

**Railway:**
- Create account at https://railway.app
- Connect GitHub repository
- Set `CLIENT_URL=https://dev-learn-nine.vercel.app` (your Vercel URL)
- Redis automatically added as add-on

**Vercel:**
- Create account at https://vercel.com
- Connect GitHub repository
- Set `VITE_API_URL=https://devlearn-production.up.railway.app/api`

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

### Badges
```
GET    /api/badges
GET    /api/user/badges
POST   /api/badges/:id/award
```

### Certificates
```
GET    /api/certificates
GET    /api/certificates/:id
POST   /api/certificates/generate/:courseId
```

### AI
```
POST   /api/ai/chat
POST   /api/ai/evaluate
```

---

## 📊 Current Database Content

| Metric | Count |
|--------|-------|
| Courses | 5 |
| Modules | 23 |
| Lessons | 88 |
| Projects | 28 |
| Badges | 8+ |
| Total Learning Hours | 100+ |

### Courses Available
1. **React Developer Complete Course** - 8 modules, 32 lessons, 10 projects
2. **JavaScript Advanced Concepts** - 4 modules, 16 lessons, 4 projects
3. **Node.js Backend Developer Complete Course** - 3 modules, 12 lessons, 3 projects
4. **TypeScript Mastery** - 3 modules, 12 lessons, 3 projects
5. **Next.js Full Stack Development** - 3 modules, 16 lessons, 8 projects

---

- [x] User authentication (register, login, JWT)
- [x] Course catalog with search and filter
- [x] Course detail with module accordion
- [x] Lesson page with dark mode and progress tracking
- [x] Student dashboard with progress rings
- [x] AI assistant (Gemini powered)
- [x] Profile page with avatar upload
- [x] Project submission (GitHub URL + ZIP)
- [x] 5 Complete courses with detailed lessons (React, JavaScript Advanced, Node.js, TypeScript, Next.js)
- [x] Badge & Certificate system with database models
- [x] Course thumbnails with error handling
- [x] AI code evaluation system (Gemini API integrated)
- [x] Submission score dashboard
- [x] Production deployment (Vercel + Railway + MongoDB Atlas)

---

## 👨‍💻 Author

**Manoj Thamke**
- GitHub: [@ManojThamke](https://github.com/ManojThamke)

---

## 📄 License

MIT License — feel free to use this project for learning and personal projects.