const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
}

export function login(name) {
  return apiFetch('/users/login/', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function getProducts() {
  return apiFetch('/products/');
}

export function getCart() {
  return apiFetch('/cart/');
}

export function addToCart(productId, quantity = 1) {
  return apiFetch('/cart/', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

export function removeFromCart(itemId) {
  return apiFetch(`/cart/${itemId}/`, { method: 'DELETE' });
}

export function checkout() {
  return apiFetch('/orders/', { method: 'POST' });
}

export function getOrders() {
  return apiFetch('/orders/');
}