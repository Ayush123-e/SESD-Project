import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Fallback mapping before user hydrates
  }

  // Resilient session verification including localStorage fallback to prevent login-redirect race conditions
  const activeToken = token || localStorage.getItem('token');
  const activeUser = user || JSON.parse(localStorage.getItem('user') || 'null');

  if (!activeToken || !activeUser) {
    // If explicit session variables absent, redirect sequentially out
    return <Navigate to="/login" replace />;
  }

  // Cross-reference implicit bounds checking against component definitions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
