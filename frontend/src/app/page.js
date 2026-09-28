'use client';

import { useEffect, useState } from 'react';
import { getProducts, addToCart, getCart, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addingId, setAddingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setQuantities({});
      return;
    }
    getCart().then((items) => {
      const map = {};
      items.forEach((item) => {
        map[item.product.id] = item.quantity;
      });
      setQuantities(map);
    });
  }, [isAuthenticated]);

  async function handleAdd(productId) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setAddingId(productId);
    await addToCart(productId);

    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));

    setTimeout(() => setAddingId(null), 300);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid">
      {products.map((p) => (
        <div className="card" key={p.id}>
          <img src={imageUrl(p.picture)} alt={p.title} />
          <h3>{p.title}</h3>
          <p>{p.price} KGS</p>
          {quantities[p.id] > 0 && (
            <span className="in-cart-badge">In cart: {quantities[p.id]}</span>
          )}
          <button
            className={addingId === p.id ? 'btn-pop' : ''}
            onClick={() => handleAdd(p.id)}
          >
            Add to card
          </button>
        </div>
      ))}
    </div>
  );
}