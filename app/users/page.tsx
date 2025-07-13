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
    confirmPassword: '', // Added confirm password field
  });

  const create = async (e: FormEvent) => {
    e.preventDefault();
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
        confirmPassword: '', // Reset confirm password too
      });
      // fetchUsers(); // Uncomment if you want to refresh the user list
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={create}
        className="rounded-xl bg-white p-6 shadow-md space-y-4"
      >
        <h2 className="text-lg font-semibold">Создать пользователя</h2>
        <Input
          placeholder="Логин"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Подтвердите пароль"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        {/* <select
          className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select> */}
        <Button type="submit">Создать</Button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Пользователи</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="flex justify-between items-center rounded-lg p-2 hover:bg-gray-50">
              <div>
                <span className="block font-medium">{u.username}</span>
                <span className="text-sm text-gray-600">{u.email}</span>
              </div>
              <span className="rounded-full bg-gray-200 px-2 text-sm">{u.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(UsersPage, ['ROLE_ADMIN']);