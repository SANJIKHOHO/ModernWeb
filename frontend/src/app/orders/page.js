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

  if (loading || authLoading) return <p className="muted">Loading...</p>;

  return (
    <div>
      <h2>Order <strong>history</strong></h2>
      {orders.length === 0 && <p className="muted">No orders yet</p>}
      {orders.map((order) => (
        <div className="order" key={order.id}>
          <p className="order-date">
            Order #{order.id} · {new Date(order.created_at).toLocaleString('en-US')}
          </p>
          {order.items.map((item) => (
            <div className="order-item" key={item.id}>
              <img src={imageUrl(item.product.picture)} alt={item.product.title} />
              <p>{item.product.title} × {item.quantity}</p>
              <p>{item.price} KGS</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}