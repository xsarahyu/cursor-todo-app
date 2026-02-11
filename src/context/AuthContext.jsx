import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'todo_token';
const USER_KEY = 'todo_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (stored && storedUser) {
      try {
        setTokenState(stored);
        setUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const setToken = (newToken, newUser) => {
    if (newToken && newUser) {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setTokenState(newToken);
      setUser(newUser);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setTokenState(null);
      setUser(null);
    }
  };

  const logout = () => setToken(null, null);

  return (
    <AuthContext.Provider value={{ user, token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
