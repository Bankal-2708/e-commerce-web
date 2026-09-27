import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
        });

        if (!res.ok) {
          if (isMounted) setUser(null);
          return;
        }

        const data = await res.json();
        if (isMounted && data.success) {
          setUser(data.user);
          setUserRole(data.user.userRole || 'customer');
        }
      } catch (err) {
        console.error('Auth check failed:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      setUserRole(data.user.userRole || 'customer');
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ fullName, email, password, userRole: role }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName, email, password, userRole: role }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data.user);
      setUserRole(data.user.userRole || 'customer');
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      setUser(null);
      setUserRole('customer');
      setError(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userRole,
        setUserRole,
        loading,
        error,
        setError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };