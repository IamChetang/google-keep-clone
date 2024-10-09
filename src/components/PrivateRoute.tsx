import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/googleStore';

const PrivateRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" /> ;
};

export default PrivateRoute;