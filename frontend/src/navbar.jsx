import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-rose-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl animate-float">🌸</span>
          <div>
            <span className="font-display font-bold text-xl text-rose-700">She Can</span>
            <span className="font-display text-xl text-gray-500 ml-1">Foundation</span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
          >
            Home
          </Link>
          {admin ? (
            <>
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
              >
                Admin Panel
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-full transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-full transition-colors shadow-sm"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}