/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FormEvent, useEffect, useState } from 'react';
import withAuth from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface Task {
  id: number;
  title?: string;
  description?: string;
  imageUrls?: string[];
  user_id: number;
  json_data: Record<string, any>;
  category: string;
}

// Замените этот enum на реальные значения из backend/tasks-api/database/enums.py
const TasksCategoryEnum = [
  'GENERAL',
  'URGENT',
  'IMPORTANT',
];

type Tab = 'text' | 'images';

function TasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    user_id: '',
    json_data: '',
    category: TasksCategoryEnum[0],
  });
  const [tab, setTab] = useState<Tab>('text');
  const [images, setImages] = useState<{ required: File | null; optional: File | null }>(
    { required: null, optional: null }
  );

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
    if (tab === 'text') {
      const payload = {
        title: form.title,
        description: form.description,
        user_id: Number(form.user_id),
        json_data: JSON.parse(form.json_data || '{}'),
        category: form.category,
      };
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({ ...form, title: '', description: '', user_id: '', json_data: '' });
        fetchTasks();
      }
    } else {
      const formData = new FormData();
      if (images.required) formData.append('file', images.required);
      if (images.optional) formData.append('second_file', images.optional);
      formData.append('user_id', form.user_id);
      formData.append('json_data', form.json_data);
      formData.append('category', form.category);
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setImages({ required: null, optional: null });
        setForm({ ...form, user_id: '', json_data: '' });
        fetchTasks();
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <Button onClick={() => setTab('text')} className={tab === 'text' ? 'bg-blue-700' : ''}>
          Текстовая задача
        </Button>
        <Button onClick={() => setTab('images')} className={tab === 'images' ? 'bg-blue-700' : ''}>
          Задача с картинками
        </Button>
      </div>

      <form
        onSubmit={create}
        className="rounded-xl bg-white p-6 shadow-md space-y-4"
      >
        {tab === 'text' ? (
          <>
            <h2 className="text-lg font-semibold">Новая текстовая задача</h2>
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
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Новая задача с картинками</h2>
            <div>
              <label className="block mb-1">Обязательная картинка</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  setImages({ ...images, required: e.target.files?.[0] || null })
                }
              />
            </div>
            <div>
              <label className="block mb-1">Опциональная картинка</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImages({ ...images, optional: e.target.files?.[0] || null })
                }
              />
            </div>
          </>
        )}

        <Input
          placeholder="User ID"
          type="number"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        />
        <textarea
          placeholder="JSON data"
          className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          value={form.json_data}
          onChange={(e) => setForm({ ...form, json_data: e.target.value })}
        />
        <select
          className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {TasksCategoryEnum.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <Button type="submit">Создать</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-white p-4 shadow hover:shadow-lg"
          >
            {t.title && <h3 className="text-lg font-bold">{t.title}</h3>}
            {t.description && <p className="text-gray-600">{t.description}</p>}
            {t.imageUrls?.map((url, i) => (
              <img key={i} src={url} alt="task image" className="mt-2 w-full rounded" />
            ))}
            <p className="mt-2 text-sm text-gray-500">Assigned to: {t.user_id}</p>
            <p className="text-sm text-gray-500">Category: {t.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(TasksPage);
