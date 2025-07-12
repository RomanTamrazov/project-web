import { ButtonHTMLAttributes } from 'react';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50 ${props.className}`}
    />
  );
}