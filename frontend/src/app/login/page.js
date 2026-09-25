'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(name);
      router.push('/');
    } catch {
      setError('Не удалось войти');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <input
        type="text"
        placeholder="Введи своё имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Войти</button>
    </form>
  );
}