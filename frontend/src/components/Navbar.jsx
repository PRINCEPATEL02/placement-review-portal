import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, PlusCircle, ShieldCheck, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname.toLowerCase();
  const hiddenRoutes = ['/login', '/register', '/forgot-password'];

  if (!user || hiddenRoutes.some(route => path === route || path.startsWith(`${route}/`))) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `px-3 md:px-4 py-2 rounded-t-lg transition-all text-sm font-medium uppercase tracking-wider flex items-center gap-2 border-b-4 ${isActive
      ? "bg-white/10 border-vgec-orange text-white shadow-inner font-bold"
      : "border-transparent hover:bg-white/5 text-blue-100 hover:text-white"
      }`;
  };

  return (
    <header className="shadow-md">
      {/* Top Branding Bar */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-6 flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 p-2">
            <img src="/favicon.ico" alt="VGEC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-vgec-blue font-serif tracking-wide">
              Vishwakarma Government Engineering College
            </h1>
            <p className="text-sm text-gray-600 font-medium">Placement & Review Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-vgec-blue text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 h-14 flex justify-between items-center">
          {/* Links */}
          <div className="flex items-center gap-1 md:gap-4 overflow-x-auto h-full">
            <Link to="/" className={getLinkClass('/')}>
              <Home size={18} /> Home
            </Link>

            {user.role === 'admin' ? (
              <>
                <Link to="/admin" className={getLinkClass('/admin')}>
                  <ShieldCheck size={18} /> Admin Panel
                </Link>
                <Link to="/admin/add-user" className={getLinkClass('/admin/add-user')}>
                  <PlusCircle size={18} /> Add User
                </Link>
                <Link to="/admin/pending-requests" className={getLinkClass('/admin/pending-requests')}>
                  <User size={18} /> Approvals
                </Link>
                <Link to="/admin/profile" className={getLinkClass('/admin/profile')}>
                  <User size={18} /> Profile
                </Link>

              </>
            ) : (
              <>
                <Link to="/add-review" className={getLinkClass('/add-review')}>
                  <PlusCircle size={18} /> Add Review
                </Link>
                <Link to="/my-posts" className={getLinkClass('/my-posts')}>
                  <ShieldCheck size={18} /> My Posts
                </Link>
                <Link to="/profile" className={getLinkClass('/profile')}>
                  <User size={18} /> Profile
                </Link>
              </>
            )}
          </div>

          {/* Logout & User Info */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-blue-200">Welcome,</p>
                <p className="text-sm font-semibold truncate max-w-[150px]">{user.enrollment}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-vgec-orange border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.enrollment ? user.enrollment.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <LogOut size={16} /> <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
