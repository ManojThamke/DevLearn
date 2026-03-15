import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CourseCatalog from './pages/CourseCatalog'
import CourseDetail from './pages/CourseDetail'
import Dashboard from './pages/Dashboard'
import LessonPage from './pages/LessonPage'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/ProfilePage'
import ProjectSubmitPage from './pages/ProjectSubmitPage'
import SubmissionsPage from './pages/SubmissionPage'
import SubmissionDetailPage from './pages/SubmissionDetailPage'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Spinner from './components/common/Spinner'
import AIAssistant from './components/common/AIAssistant'

// ── Protected Route ────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

// ── Main App ───────────────────────────────────────────────────────
const App = () => {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <Routes>

          {/* ── Public Routes ──────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />

          {/* ── Protected Routes ───────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:id"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit/:projectId"
            element={
              <ProtectedRoute>
                <ProjectSubmitPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submissions/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetailPage />
              </ProtectedRoute>
            }
          />

          {/* ── 404 ────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      <Footer />

      {/* AI Assistant — on all pages */}
      <AIAssistant />
    </div>
  )
}

export default App