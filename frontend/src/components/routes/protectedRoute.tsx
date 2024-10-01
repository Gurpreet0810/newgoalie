import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false;
};

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
