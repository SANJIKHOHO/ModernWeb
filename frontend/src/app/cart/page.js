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
    alert('Заказ оформлен');
    router.push('/orders');
  }

  if (loading || authLoading) return <p>Загрузка...</p>;

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div>
      <h2>Корзина</h2>
      {items.length === 0 && <p>Корзина пуста</p>}
      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={imageUrl(item.product.picture)} alt={item.product.title} />
          <div>
            <p>{item.product.title}</p>
            <p>{item.product.price} сом × {item.quantity}</p>
          </div>
          <button onClick={() => handleRemove(item.id)}>Удалить</button>
        </div>
      ))}
      {items.length > 0 && (
        <div className="cart-footer">
          <p>Итого: {total} сом</p>
          <button onClick={handleCheckout}>Купить</button>
        </div>
      )}
    </div>
  );
}