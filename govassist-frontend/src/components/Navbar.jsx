import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-base">🏛️</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold text-gray-800">GovAssist</div>
            <div className="text-xs text-blue-600 font-medium -mt-0.5">AI</div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/schemes" active={isActive('/schemes')}>All Schemes</NavLink>
              <NavLink to="/profile" active={isActive('/profile')}>Profile</NavLink>
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" active={isActive('/admin')}>Admin</NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/" active={isActive('/')}>Home</NavLink>
              <NavLink to="/schemes" active={isActive('/schemes')}>Schemes</NavLink>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              <button onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}>
      {children}
    </Link>
  )
}
