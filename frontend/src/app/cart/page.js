'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, checkout, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    getCart().then(setItems).finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  async function handleRemove(itemId) {
    await removeFromCart(itemId);
    setItems(items.filter((i) => i.id !== itemId));
  }

  async function handleCheckout() {
    await checkout();
    router.push('/orders');
  }

  if (loading || authLoading) return <p className="muted">Loading...</p>;

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div>
      <h2>Your <strong>cart</strong></h2>
      {items.length === 0 && <p className="muted">Your cart is empty</p>}
      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={imageUrl(item.product.picture)} alt={item.product.title} />
          <div>
            <p>{item.product.title}</p>
            <p className="muted">{item.product.price} KGS × {item.quantity}</p>
          </div>
          <button className="btn-ghost" onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
      {items.length > 0 && (
        <div className="cart-footer">
          <p>Total: <span>{total.toFixed(2)} KGS</span></p>
          <button onClick={handleCheckout}>Buy</button>
        </div>
      )}
    </div>
  );
}