'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  token: string | null;
  role: string | null;
  username: string | null;
}

interface AuthContextProps extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const parseToken = (jwt: string) => {
  try {
    const base64 = jwt.split('.')[1];
    const json = JSON.parse(atob(base64));
    // Handle both array and string roles
    const role = Array.isArray(json.roles) 
      ? json.roles[0] 
      : json.role || json.roles;
    return {
      role: role?.toUpperCase(), // Standardize to uppercase
      username: json.username,
    };
  } catch {
    return { role: null, username: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    username: null,
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const { role, username } = parseToken(token);
    setState({ token, role, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({ token: null, role: null, username: null });
    router.push('/login');
  };

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const { role, username } = parseToken(stored);
      setState({ token: stored, role, username });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};