import React, { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let token = localStorage.getItem("userToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    children
  ) : (
    <div>You are not authorized to access this page</div>
  );
};

export default ProtectedRoute;