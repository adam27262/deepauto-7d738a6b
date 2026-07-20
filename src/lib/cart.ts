import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

const KEY = "das_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:update"));
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = read();
  const existing = items.find((i) => i.id === item.id);
  if (existing) existing.qty += qty;
  else items.push({ ...item, qty });
  write(items);
}
export function removeFromCart(id: string) {
  write(read().filter((i) => i.id !== id));
}
export function updateQty(id: string, qty: number) {
  const items = read().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  write(items);
}
export function clearCart() {
  write([]);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(read());
    const h = () => setItems(read());
    window.addEventListener("cart:update", h);
    return () => window.removeEventListener("cart:update", h);
  }, []);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, total, count };
}
