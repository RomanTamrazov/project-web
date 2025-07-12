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
  nickname: string | null;
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
    return {
      role: json.role as string,
      nickname: json.nickname as string,
    };
  } catch {
    return { role: null, nickname: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    nickname: null,
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const { role, nickname } = parseToken(token);
    setState({ token, role, nickname });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({ token: null, role: null, nickname: null });
    router.push('/login');
  };

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const { role, nickname } = parseToken(stored);
      setState({ token: stored, role, nickname });
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