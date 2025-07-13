'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/users/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Неверные учетные данные');
      const { token } = await res.json();
      login(token);
      router.push('/tasks');
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 flex flex-col items-center justify-center p-6">
      {/* Котик SVG с анимацией лапок */}
      <div className="mb-12 w-56 h-56 relative">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Тело */}
          <circle cx="100" cy="120" r="60" fill="#F4C2C2" />
          {/* Голова */}
          <circle cx="100" cy="60" r="50" fill="#F4C2C2" />
          {/* Уши */}
          <polygon points="60,25 80,5 90,45" fill="#F4C2C2" />
          <polygon points="140,25 120,5 110,45" fill="#F4C2C2" />
          {/* Глаза */}
          <circle cx="75" cy="60" r="12" fill="#5A3E36" />
          <circle cx="125" cy="60" r="12" fill="#5A3E36" />
          <circle cx="75" cy="60" r="6" fill="#FFF" />
          <circle cx="125" cy="60" r="6" fill="#FFF" />
          {/* Нос */}
          <polygon points="100,80 90,95 110,95" fill="#C26C4A" />
          {/* Рот */}
          <path d="M90 95 Q100 105 110 95" stroke="#C26C4A" strokeWidth="3" fill="none" />
          
          {/* Лапки с анимацией */}
          <g className="paw-left" style={{ transformOrigin: '70% 180%', transformBox: 'fill-box' }}>
            <ellipse cx="60" cy="170" rx="20" ry="12" fill="#F4C2C2" />
          </g>
          <g className="paw-right" style={{ transformOrigin: '130% 180%', transformBox: 'fill-box' }}>
            <ellipse cx="140" cy="170" rx="20" ry="12" fill="#F4C2C2" />
          </g>
        </svg>
      </div>

      {/* Форма входа */}
      <div className="w-full max-w-md rounded-3xl bg-white bg-opacity-90 p-10 shadow-2xl backdrop-blur-md">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">Вход</h2>
        <form onSubmit={submit} className="space-y-6">
          <Input
            placeholder="Логин"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border border-gray-300 focus:border-indigo-500"
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-gray-300 focus:border-indigo-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Войти
          </Button>
        </form>
      </div>

      {/* Стили анимации через style jsx */}
      <style jsx>{`
        .paw-left {
          animation: pawMove 2s ease-in-out infinite;
        }
        .paw-right {
          animation: pawMove 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes pawMove {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>
    </div>
  );
}
