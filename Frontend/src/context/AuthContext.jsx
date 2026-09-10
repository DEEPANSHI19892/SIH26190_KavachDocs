import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

const AuthContext = createContext(null);

const TOKEN_KEY = "kavachdocs_token";
const USER_KEY = "kavachdocs_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // VERIFY EXISTING LOGIN SESSION
  // --------------------------------------------------

  useEffect(() => {
    const verifyUser = async () => {
      // No token = user is not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          ENDPOINTS.AUTH.ME
        );

        const currentUser = response.data;

        setUser(currentUser);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Session verification failed:",
          error
        );

        clearSession();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // --------------------------------------------------
  // REAL BACKEND LOGIN
  // --------------------------------------------------

  const login = async (email, password) => {
    const response = await api.post(
      ENDPOINTS.AUTH.LOGIN,
      {
        email,
        password,
      }
    );

    const receivedToken =
      response.data?.access_token ||
      response.data?.token;

    if (!receivedToken) {
      throw new Error(
        "Login successful, but no authentication token was received."
      );
    }

    // Save JWT token
    localStorage.setItem(
      TOKEN_KEY,
      receivedToken
    );

    setToken(receivedToken);

    // Some backends return user information
    // directly with the login response.
    let receivedUser =
      response.data?.user || null;

    // If user isn't returned by login,
    // get the current user from /auth/me.
    if (!receivedUser) {
      try {
        const meResponse = await api.get(
          ENDPOINTS.AUTH.ME
        );

        receivedUser = meResponse.data;
      } catch (error) {
        console.error(
          "Could not fetch current user:",
          error
        );
      }
    }

    // Save user information
    if (receivedUser) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(receivedUser)
      );

      setUser(receivedUser);
    }

    return {
      ...response.data,
      user: receivedUser,
    };
  };

  // --------------------------------------------------
  // CLEAR SESSION
  // --------------------------------------------------

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const logout = () => {
    clearSession();

    window.location.href = "/login";
  };

  // --------------------------------------------------
  // AUTH HELPERS
  // --------------------------------------------------

  const isAuthenticated = () => {
    return Boolean(token);
  };

  const getRole = () => {
    return user?.role?.toUpperCase();
  };

  const isAdmin = () => {
    return getRole() === "ADMIN";
  };

  const isOfficer = () => {
    return getRole() === "INVESTIGATION_OFFICER";
  };

  const isLegalOfficer = () => {
    return getRole() === "LEGAL_OFFICER";
  };

  const isViewer = () => {
    return getRole() === "VIEWER";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,
        logout,
        clearSession,

        isAuthenticated,
        getRole,

        isAdmin,
        isOfficer,
        isLegalOfficer,
        isViewer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// CUSTOM HOOK
// --------------------------------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};