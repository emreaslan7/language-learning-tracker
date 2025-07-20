"use client";

import { useState, useEffect } from 'react';
import PinAuth from './PinAuth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already authenticated and session not expired
    const checkAuth = () => {
      const expirationTime = localStorage.getItem('pinAuthExpiration');
      
      if (expirationTime) {
        const now = Date.now();
        const expiry = parseInt(expirationTime);
        
        if (now < expiry) {
          setIsAuthenticated(true);
        } else {
          // Session expired, remove expired auth
          localStorage.removeItem('pinAuthExpiration');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }
  
  // Show PIN auth if not authenticated
  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={handleAuthenticated} />;
  }
  
  // Show main app if authenticated
  return <>{children}</>;
}
