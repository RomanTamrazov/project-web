import { InputHTMLAttributes } from 'react';

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className}`}
    />
  );
}