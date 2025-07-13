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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-400 via-pink-400 to-red-400 p-0">
      <div className="w-full max-w-lg rounded-3xl bg-white bg-opacity-90 p-10 shadow-2xl backdrop-blur-md mx-0">
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

