import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { useAdmin } from '../../hooks/useAdmin';

export function AdminRoute() {
  const { isAuthenticated } = useAdmin();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    setShowDashboard(isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowDashboard(true);
  };

  // If user is authenticated, show dashboard
  if (isAuthenticated && showDashboard) {
    return <AdminDashboard />;
  }

  // If user is not authenticated, show login
  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}