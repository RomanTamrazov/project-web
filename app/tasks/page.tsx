'use client';
import { FormEvent, useEffect, useState } from 'react';
import withAuth from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface Task {
  id: number;
  title: string;
  description: string;
}

function TasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTasks(await res.json());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: '', description: '' });
      fetchTasks();
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={create}
        className="rounded-xl bg-white p-6 shadow-md space-y-4"
      >
        <h2 className="text-lg font-semibold">Новая задача</h2>
        <Input
          placeholder="Заголовок"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button type="submit">Создать</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-white p-4 shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-bold">{t.title}</h3>
            <p className="text-gray-600">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(TasksPage);