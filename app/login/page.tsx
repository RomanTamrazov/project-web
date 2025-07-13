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
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-400 via-pink-400 to-red-400 p-6">
      <div className="relative mb-8 w-40 h-40">
        {/* Котик с анимацией лапок */}
        <div className="cat">
          <div className="ear ear-left"></div>
          <div className="ear ear-right"></div>
          <div className="face">
            <div className="eye eye-left"></div>
            <div className="eye eye-right"></div>
            <div className="nose"></div>
            <div className="mouth"></div>
          </div>
          <div className="paw paw-left"></div>
          <div className="paw paw-right"></div>
        </div>
      </div>
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

      <style jsx>{`
        .cat {
          position: relative;
          width: 160px;
          height: 160px;
          background: #f3c6a5;
          border-radius: 50% 50% 50% 50% / 55% 55% 45% 45%;
          box-shadow: inset 0 10px 15px rgba(0,0,0,0.1);
          animation: breathe 4s ease-in-out infinite;
        }
        .ear {
          position: absolute;
          top: -30px;
          width: 50px;
          height: 50px;
          background: #f3c6a5;
          border-radius: 50% 50% 0 0;
          border: 2px solid #d2996e;
          box-shadow: inset 0 5px 8px rgba(0,0,0,0.1);
          transform-origin: bottom center;
          animation: paw-move 2s ease-in-out infinite;
        }
        .ear-left {
          left: 10px;
          transform-origin: bottom right;
          animation-delay: 0s;
        }
        .ear-right {
          right: 10px;
          transform-origin: bottom left;
          animation-delay: 1s;
        }
        .face {
          position: absolute;
          top: 40px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          background: #fce3d1;
          border-radius: 50% 50% 50% 50% / 65% 65% 35% 35%;
          box-shadow: inset 0 5px 8px rgba(0,0,0,0.05);
        }
        .eye {
          position: absolute;
          top: 40px;
          width: 24px;
          height: 24px;
          background: #6b4c3b;
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.6);
        }
        .eye-left {
          left: 40px;
        }
        .eye-right {
          right: 40px;
        }
        .nose {
          position: absolute;
          top: 80px;
          left: 50%;
          width: 16px;
          height: 12px;
          margin-left: -8px;
          background: #d2996e;
          border-radius: 50% / 70%;
          box-shadow: inset 0 3px 5px rgba(0,0,0,0.15);
        }
        .mouth {
          position: absolute;
          top: 95px;
          left: 50%;
          width: 36px;
          height: 20px;
          margin-left: -18px;
          border-bottom: 3px solid #a15e3e;
          border-radius: 0 0 18px 18px;
        }
        .paw {
          position: absolute;
          bottom: 10px;
          width: 60px;
          height: 40px;
          background: #f3c6a5;
          border-radius: 40% 40% 50% 50% / 60% 60% 50% 50%;
          border: 2px solid #d2996e;
          box-shadow: inset 0 5px 8px rgba(0,0,0,0.1);
          animation: paw-move 2s ease-in-out infinite;
        }
        .paw-left {
          left: 10px;
          animation-delay: 0s;
          transform-origin: top right;
        }
        .paw-right {
          right: 10px;
          animation-delay: 1s;
          transform-origin: top left;
        }

        @keyframes paw-move {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(15deg);
          }
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
