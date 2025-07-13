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

const TasksCategoryEnum = ['GENERAL', 'URGENT', 'IMPORTANT'] as const;

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
  const [images, setImages] = useState<{ required: File | null; optional: File | null }>({
    required: null,
    optional: null,
  });

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
    try {
      if (tab === 'text') {
        const payload = {
          title: form.title.trim(),
          description: form.description.trim(),
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Tabs */}
      <div className="flex space-x-3 mb-4">
        {(['text', 'images'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg font-semibold transition
              ${
                tab === t
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            type="button"
          >
            {t === 'text' ? 'Текстовая задача' : 'Задача с картинками'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={create}
        className="bg-white rounded-xl p-6 shadow-md space-y-4"
        noValidate
      >
        {tab === 'text' ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Новая текстовая задача</h2>

            <Input
              placeholder="Заголовок"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              maxLength={100}
            />

            <Input
              placeholder="Описание"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              maxLength={250}
            />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Новая задача с картинками</h2>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col text-gray-700 font-medium">
                Обязательная картинка
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setImages({ ...images, required: e.target.files?.[0] || null })
                  }
                  className="mt-1"
                />
              </label>

              <label className="flex flex-col text-gray-700 font-medium">
                Опциональная картинка
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImages({ ...images, optional: e.target.files?.[0] || null })
                  }
                  className="mt-1"
                />
              </label>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="User ID"
            type="number"
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min={1}
          />

          <select
            className="rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {TasksCategoryEnum.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="JSON data"
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
          value={form.json_data}
          onChange={(e) => setForm({ ...form, json_data: e.target.value })}
          spellCheck={false}
          rows={5}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Создать
        </Button>
      </form>

      {/* Задачи */}
      <div className="grid gap-6 md:grid-cols-2">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition"
          >
            {t.title && <h3 className="text-lg font-bold mb-1">{t.title}</h3>}
            {t.description && <p className="text-gray-700 mb-2">{t.description}</p>}

            {t.imageUrls?.length ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {t.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`task image ${i + 1}`}
                    className="rounded-md max-h-40 object-cover"
                  />
                ))}
              </div>
            ) : null}

            <p className="text-sm text-gray-500">User ID: {t.user_id}</p>
            <p className="text-sm text-gray-500">Категория: {t.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(TasksPage);

