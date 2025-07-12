import { FormEvent, useEffect, useState } from 'react';
import withAuth from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface User {
  id: number;
  username: string;
  role: string;
}

function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });

  const fetchUsers = async () => {
    const res = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ username: '', password: '', role: 'user' });
      fetchUsers();
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
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <Button type="submit">Создать</Button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Пользователи</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="flex justify-between rounded-lg p-2 hover:bg-gray-50">
              <span>{u.username}</span>
              <span className="rounded-full bg-gray-200 px-2 text-sm">{u.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(UsersPage, ['admin']);