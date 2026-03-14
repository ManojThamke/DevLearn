import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold text-blue-600">DevLearn</span>
            <p className="text-sm text-gray-500 mt-1">
              Learn React, Node.js and TailwindCSS
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/courses"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Courses
            </Link>
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Register
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 DevLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer