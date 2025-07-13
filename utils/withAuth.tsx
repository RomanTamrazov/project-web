/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (Component: any, allowed: string[] = []) => {
  return function Wrapped(props: any) {
    const { token, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!token) router.replace('/login');
      else if (allowed.length && !allowed.some(allowedRole => role?.endsWith(allowedRole)))
        router.replace('/');
    }, [token, role]);

    if (!token) return null;
    if (allowed.length && !allowed.some(allowedRole => role?.endsWith(allowedRole))) return null;

    return <Component {...props} />;
  };
};

export default withAuth;