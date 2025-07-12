/* eslint-disable @typescript-eslint/no-explicit-any */
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
      console.log(err)
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-xl font-semibold">Вход</h2>
      <form onSubmit={submit} className="space-y-4">
        <Input
          placeholder="Логин"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
}