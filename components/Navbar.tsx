'use client'
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { token, role, nickname, logout } = useAuth();

  return (
    <header className="mb-6 flex items-center justify-between rounded-b-xl bg-white p-4 shadow">
      <h1 className="text-2xl font-bold">TaskManager</h1>
      {token ? (
        <nav className="flex items-center gap-4">
          <Link href="/tasks" className="hover:underline">
            Задачи
          </Link>
          {role === 'admin' && (
            <Link href="/users" className="hover:underline">
              Пользователи
            </Link>
          )}
          <span className="text-gray-600">{nickname}</span>
          <Button onClick={logout}>Выйти</Button>
        </nav>
      ) : (
        <Link href="/login" className="hover:underline">
          Войти
        </Link>
      )}
    </header>
  );
}