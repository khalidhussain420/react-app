import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../storage/Storage"; // Assuming getUserRole fetches the user's role

function NotFoundWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const token = await getToken();
      if (token) {
          navigate("/dashboard");
      } else {
        // If not authenticated, redirect to the landing page
        navigate("/");
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  return null; // No content needed since we are redirecting
}

export default NotFoundWrapper;
