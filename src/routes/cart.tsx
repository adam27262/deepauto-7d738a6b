import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart, updateQty, removeFromCart, clearCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar, Footer } from "@/components/site/Nav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { Trash2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Deep Auto Service" }] }),
  component: CartPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  customer_email: z.string().trim().email(),
  customer_phone: z.string().trim().max(30).optional(),
  shipping_address: z.string().trim().min(5).max(500),
});

function CartPage() {
  const { items, total } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length) return;
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      ...parsed.data,
      items: items as never,
      total,
    });
    setLoading(false);
    if (error) {
      toast.error("Order failed. Please try again.");
      return;
    }
    clearCart();
    toast.success("Order placed! We'll email confirmation shortly.");
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 container-x">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue shopping
        </Link>
        <h1 className="font-display text-4xl font-bold mb-8">Your Cart</h1>
        {!items.length ? (
          <div className="rounded-2xl border border-border p-12 text-center bg-card">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/" className="btn-primary hover:btn-primary-hover mt-4 inline-flex">Shop products</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-4 items-center p-4 rounded-xl border border-border bg-card">
                  <img src={i.image} alt={i.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold">{i.name}</div>
                    <div className="text-sm text-muted-foreground">${i.price.toFixed(2)}</div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={i.qty}
                    onChange={(e) => updateQty(i.id, Number(e.target.value))}
                    className="w-16 h-9 rounded-md border border-input bg-background px-2 text-sm text-center"
                  />
                  <div className="w-20 text-right font-semibold">${(i.price * i.qty).toFixed(2)}</div>
                  <button onClick={() => removeFromCart(i.id)} className="p-2 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={checkout} className="rounded-2xl border border-border bg-card p-6 h-fit space-y-4 sticky top-24">
              <h2 className="font-display text-xl font-semibold">Checkout</h2>
              <div className="grid gap-2"><Label>Name</Label><Input name="customer_name" required /></div>
              <div className="grid gap-2"><Label>Email</Label><Input name="customer_email" type="email" required /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input name="customer_phone" /></div>
              <div className="grid gap-2"><Label>Shipping address</Label><Textarea name="shipping_address" required rows={3} /></div>
              <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
                <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
                {loading ? "Placing..." : "Place Order"}
              </Button>
              <p className="text-xs text-muted-foreground">Payment processed on delivery. Stripe integration coming soon.</p>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
