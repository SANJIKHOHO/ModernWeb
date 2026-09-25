'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    getOrders().then(setOrders).finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  if (loading || authLoading) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>История покупок</h2>
      {orders.length === 0 && <p>Заказов пока нет</p>}
      {orders.map((order) => (
        <div className="order" key={order.id}>
          <p className="order-date">{new Date(order.created_at).toLocaleString()}</p>
          {order.items.map((item) => (
            <div className="order-item" key={item.id}>
              <img src={imageUrl(item.product.picture)} alt={item.product.title} />
              <p>{item.product.title} × {item.quantity}</p>
              <p>{item.price} сом</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}