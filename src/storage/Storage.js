//------------------------- Token -------------------------//
export const setToken = async (token) => {
  try {
    localStorage.setItem("access_token", token);
  } catch (error) {
    console.log("Error setting token", error);
  }
};

export const getToken = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    // Decode JWT to extract expiry time
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now(); // Convert to milliseconds and compare
    if (isExpired) {
      localStorage.removeItem("access_token"); // Clear expired token
      console.log("Token expired. Clearing localStorage.");
      return null;
    }

    return token;
  } catch (error) {
    console.log("Error getting or validating token", error);
    return null;
  }
};

