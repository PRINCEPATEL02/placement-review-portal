import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import StudentHome from './pages/student/Home';
import StudentReview from './pages/student/Review';
import StudentProfile from './pages/student/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import AdminEditReview from './pages/admin/EditReview';
import AddUser from './pages/admin/AddUser';
import PendingRequests from './pages/admin/PendingRequests';
import MyPosts from './pages/student/MyPosts';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    if (loading) {
      return <Loader show={true} />;
    }
  }

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <StudentHome />
            </ProtectedRoute>
          } />
          <Route path="/add-review" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentReview />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/my-posts" element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyPosts />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEditReview />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-user" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/pending-requests" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PendingRequests />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;
