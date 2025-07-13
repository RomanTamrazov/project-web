'use client';
import { FormEvent, useEffect, useState } from 'react';
import withAuth from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Загружаем пользователей при монтировании
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    };
    fetchUsers();
  }, [token]);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    const res = await fetch('/api/users/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        confirm_password: form.confirmPassword,
        email: form.email,
      }),
    });
    if (res.ok) {
      setForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      // Обновим список пользователей после создания нового
      const usersRes = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data);
      }
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Ошибка при создании пользователя');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Форма создания пользователя */}
      <form
        onSubmit={create}
        className="bg-white rounded-2xl p-8 shadow-lg space-y-6"
        noValidate
      >
        <h2 className="text-2xl font-semibold text-gray-900 text-center">Создать пользователя</h2>
        <Input
          placeholder="Логин"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
          autoComplete="username"
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
          autoComplete="email"
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
          autoComplete="new-password"
          minLength={6}
        />
        <Input
          type="password"
          placeholder="Подтвердите пароль"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
          autoComplete="new-password"
          minLength={6}
        />
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl transition-shadow shadow-md hover:shadow-lg"
        >
          Создать
        </Button>
      </form>

      {/* Список пользователей */}
      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Пользователи</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-500">Пользователи не найдены</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center py-3 hover:bg-indigo-50 rounded-lg px-3 transition"
              >
                <div>
                  <span className="block font-medium text-gray-800">{u.username}</span>
                  <span className="text-sm text-gray-500">{u.email}</span>
                </div>
                <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-semibold select-none">
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default withAuth(UsersPage, ['ROLE_ADMIN']);
