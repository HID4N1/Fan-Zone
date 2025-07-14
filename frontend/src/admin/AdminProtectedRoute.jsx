import React from 'react';
import { Navigate } from 'react-router-dom';

// Helper function to decode JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const AdminProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');
  const isAdminAuth = localStorage.getItem('isAdminAuth') === 'true';

  if (!isAdminAuth || !accessToken) {
    // Not authenticated
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isAdminAuth');
    localStorage.removeItem('rememberAdmin');
    return <Navigate to="/admin/login" replace />;
  }

  const decodedToken = parseJwt(accessToken);
  if (!decodedToken || !decodedToken.exp) {
    // Invalid token
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isAdminAuth');
    localStorage.removeItem('rememberAdmin');
    return <Navigate to="/admin/login" replace />;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (decodedToken.exp < currentTime) {
    // Token expired
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isAdminAuth');
    localStorage.removeItem('rememberAdmin');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
