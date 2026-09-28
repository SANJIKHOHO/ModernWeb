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
      setError('Could not log in');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Log <strong>in</strong></h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Log in</button>
    </form>
  );
}