import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../storage/Storage";

const ProtectedRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = await getToken();
        if (token) {
          setIsAuthenticated(true); 
        }
        else {
          setIsAuthenticated(false); // Not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, []); // Add dependency array

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to sign-in page if not authenticated
  }

  return <Component />; 
};

export default ProtectedRoute;
