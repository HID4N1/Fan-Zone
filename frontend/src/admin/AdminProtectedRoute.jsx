import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isAdminAuth = localStorage.getItem('isAdminAuth') === 'true';
  if (!isAdminAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminProtectedRoute; 