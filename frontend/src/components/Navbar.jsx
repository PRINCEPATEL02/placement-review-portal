import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, PlusCircle, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="shadow-md">
      {/* Top Branding Bar */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-6 flex items-center gap-4">
          {/* Logo Placeholder - You can add an img tag here if you have the logo */}
          <div className="h-12 w-12 bg-vgec-blue rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
            V
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
          <div className="flex items-center gap-1 md:gap-6 overflow-x-auto">
            <Link to="/" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-sm font-medium uppercase tracking-wider flex items-center gap-2">
              Home
            </Link>

            {user.role === 'admin' ? (
              <>
                <Link to="/admin" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} /> Admin Panel
                </Link>
                <Link to="/admin/profile" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-sm font-medium uppercase tracking-wider">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/add-review" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <PlusCircle size={16} /> Add Review
                </Link>
                <Link to="/profile" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <User size={16} /> Profile
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
