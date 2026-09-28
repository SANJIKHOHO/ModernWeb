'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { name, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLink = (href, label) => (
    <Link href={href} className={pathname === href ? 'active' : ''}>
      {label}
    </Link>
  );

  return (
    <header className="header">
      <Link href="/" className="logo">
        E-Commerce<span>.</span>
      </Link>

      <nav className="nav">
        {navLink('/', 'Products')}
        {isAuthenticated && navLink('/cart', 'Cart')}
        {isAuthenticated && navLink('/orders', 'Orders')}
      </nav>

      <div className="header-right">
        {isAuthenticated ? (
          <>
            <span className="user-pill">{name}</span>
            <button className="btn-ghost" onClick={logout}>Log out</button>
          </>
        ) : (
          <Link href="/login" className="btn-pill">Log in</Link>
        )}
      </div>
    </header>
  );
}