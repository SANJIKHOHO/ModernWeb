'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { name, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <Link href="/" className="logo">E-Commerce</Link>
      <nav className="nav">
        <Link href="/">Товары</Link>
        {isAuthenticated && <Link href="/cart">Корзина</Link>}
        {isAuthenticated && <Link href="/orders">История</Link>}
        {isAuthenticated ? (
          <>
            <span className="user-name">{name}</span>
            <button onClick={logout}>Выйти</button>
          </>
        ) : (
          <Link href="/login">Войти</Link>
        )}
      </nav>
    </header>
  );
}