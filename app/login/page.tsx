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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-400 via-pink-400 to-red-400 p-6">
      {/* Анимированный котик */}
      <div className="relative mb-10 w-40 h-40 animate-breathe rounded-full bg-[#f3c6a5] shadow-inner">
        {/* Уши */}
        <div
          className="absolute top-[-30px] left-4 w-12 h-12 rounded-tl-full rounded-tr-full bg-[#f3c6a5] border-2 border-[#d2996e] shadow-inner
            origin-bottom-right animate-paw-move"
          style={{ transformOrigin: 'bottom right' }}
        ></div>
        <div
          className="absolute top-[-30px] right-4 w-12 h-12 rounded-tl-full rounded-tr-full bg-[#f3c6a5] border-2 border-[#d2996e] shadow-inner
            origin-bottom-left animate-paw-move-delayed"
          style={{ transformOrigin: 'bottom left' }}
        ></div>
        {/* Лицо */}
        <div className="absolute top-10 left-5 right-5 bottom-5 rounded-full bg-[#fce3d1] shadow-inner"></div>
        {/* Глаза */}
        <div className="absolute top-20 left-12 w-6 h-6 rounded-full bg-[#6b4c3b] shadow-inner"></div>
        <div className="absolute top-20 right-12 w-6 h-6 rounded-full bg-[#6b4c3b] shadow-inner"></div>
        {/* Нос */}
        <div className="absolute top-[80px] left-1/2 w-4 h-3 rounded-full bg-[#d2996e] shadow-inner" style={{ marginLeft: '-0.5rem' }}></div>
        {/* Рот */}
        <div
          className="absolute top-[95px] left-1/2 w-9 h-5 border-b-2 border-[#a15e3e] rounded-b-full"
          style={{ marginLeft: '-1.125rem' }}
        ></div>
        {/* Лапки */}
        <div
          className="absolute bottom-2 left-4 w-14 h-10 rounded-b-full rounded-t-[40%] bg-[#f3c6a5] border-2 border-[#d2996e] shadow-inner
          origin-top-right animate-paw-move"
        ></div>
        <div
          className="absolute bottom-2 right-4 w-14 h-10 rounded-b-full rounded-t-[40%] bg-[#f3c6a5] border-2 border-[#d2996e] shadow-inner
          origin-top-left animate-paw-move-delayed"
        ></div>
      </div>

      {/* Форма входа */}
      <div className="w-full max-w-md rounded-3xl bg-white bg-opacity-90 p-10 shadow-2xl backdrop-blur-md">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">Вход</h2>
        <form onSubmit={submit} className="space-y-6">
          <Input
            placeholder="Логин"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border border-gray-300 focus:border-purple-500"
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-gray-300 focus:border-purple-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
