import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, Car, Package, Mail, LogOut, DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Deep Auto" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"bookings" | "rentals" | "orders" | "messages" | "products">("bookings");

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id);
      setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
      setReady(true);
    })();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md text-center rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl font-bold">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is signed in but hasn't been granted admin role. Ask a system administrator to
            add your user to <code className="text-primary">user_roles</code> with role <code className="text-primary">admin</code>.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button onClick={signOut} variant="outline" className="rounded-full">Sign out</Button>
            <Link to="/" className="btn-primary hover:btn-primary-hover">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border">
        <div className="container-x flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--gradient-primary)] grid place-items-center text-primary-foreground font-bold">D</div>
            <div>
              <div className="font-display font-bold">Deep Auto — Admin</div>
              <div className="text-xs text-muted-foreground">Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">View site</Link>
            <Button onClick={signOut} variant="outline" className="rounded-full" size="sm">
              <LogOut className="w-4 h-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container-x py-8">
        <Stats />

        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { k: "bookings", label: "Bookings", icon: Calendar },
            { k: "rentals", label: "Rentals", icon: Car },
            { k: "orders", label: "Orders", icon: Package },
            { k: "messages", label: "Messages", icon: Mail },
            { k: "products", label: "Products", icon: DollarSign },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                tab === t.k ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "bookings" && <BookingsTable />}
          {tab === "rentals" && <RentalsTable />}
          {tab === "orders" && <OrdersTable />}
          {tab === "messages" && <MessagesTable />}
          {tab === "products" && <ProductsAdmin />}
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [b, r, o, m] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("rentals").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      ]);
      const revenue = (o.data ?? []).reduce((s, x) => s + Number(x.total ?? 0), 0);
      return {
        bookings: b.count ?? 0,
        rentals: r.count ?? 0,
        orders: (o.data ?? []).length,
        messages: m.count ?? 0,
        revenue,
      };
    },
  });
  const cards = [
    { label: "Bookings", value: data?.bookings ?? "—", icon: Calendar },
    { label: "Rentals", value: data?.rentals ?? "—", icon: Car },
    { label: "Orders", value: data?.orders ?? "—", icon: Package },
    { label: "Messages", value: data?.messages ?? "—", icon: Mail },
    { label: "Revenue", value: data ? `$${data.revenue.toFixed(2)}` : "—", icon: DollarSign },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <c.icon className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display text-2xl font-bold mt-2">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function useTable<T>(table: string, order = "created_at") {
  return useQuery<T[]>({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from(table).select("*").order(order, { ascending: false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card overflow-x-auto"><table className="w-full text-sm">{children}</table></div>;
}

function BookingsTable() {
  const { data = [] } = useTable<any>("bookings");
  return (
    <TableWrap>
      <thead className="bg-muted/50 text-left">
        <tr>{["Customer", "Service", "Date/Time", "Contact", "Status", "Received"].map(h => <th key={h} className="p-3 font-semibold text-xs uppercase tracking-wider">{h}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((b) => (
          <tr key={b.id} className="border-t border-border">
            <td className="p-3">{b.customer_name}<div className="text-xs text-muted-foreground">{b.vehicle}</div></td>
            <td className="p-3">{b.service}</td>
            <td className="p-3">{b.booking_date} · {b.booking_time}</td>
            <td className="p-3">{b.customer_email}<div className="text-xs text-muted-foreground">{b.customer_phone}</div></td>
            <td className="p-3"><StatusBadge status={b.status} /></td>
            <td className="p-3 text-muted-foreground text-xs">{new Date(b.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
        {!data.length && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bookings yet.</td></tr>}
      </tbody>
    </TableWrap>
  );
}

function RentalsTable() {
  const { data = [] } = useTable<any>("rentals");
  return (
    <TableWrap>
      <thead className="bg-muted/50 text-left">
        <tr>{["Customer", "Vehicle", "Dates", "Contact", "Status"].map(h => <th key={h} className="p-3 font-semibold text-xs uppercase tracking-wider">{h}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id} className="border-t border-border">
            <td className="p-3">{r.customer_name}</td>
            <td className="p-3">{r.vehicle}</td>
            <td className="p-3">{r.start_date} → {r.end_date}</td>
            <td className="p-3">{r.customer_email}<div className="text-xs text-muted-foreground">{r.customer_phone}</div></td>
            <td className="p-3"><StatusBadge status={r.status} /></td>
          </tr>
        ))}
        {!data.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No rental requests yet.</td></tr>}
      </tbody>
    </TableWrap>
  );
}

function OrdersTable() {
  const { data = [] } = useTable<any>("orders");
  return (
    <TableWrap>
      <thead className="bg-muted/50 text-left">
        <tr>{["Customer", "Items", "Total", "Status", "Date"].map(h => <th key={h} className="p-3 font-semibold text-xs uppercase tracking-wider">{h}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((o) => (
          <tr key={o.id} className="border-t border-border">
            <td className="p-3">{o.customer_name}<div className="text-xs text-muted-foreground">{o.customer_email}</div></td>
            <td className="p-3 text-xs">{(o.items ?? []).map((i: any) => `${i.name} ×${i.qty}`).join(", ")}</td>
            <td className="p-3 font-semibold text-primary">${Number(o.total).toFixed(2)}</td>
            <td className="p-3"><StatusBadge status={o.status} /></td>
            <td className="p-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
        {!data.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No orders yet.</td></tr>}
      </tbody>
    </TableWrap>
  );
}

function MessagesTable() {
  const { data = [] } = useTable<any>("contact_messages");
  return (
    <div className="grid gap-3">
      {data.map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.email} {m.phone && `· ${m.phone}`}</div>
            </div>
            <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
          </div>
          <p className="mt-3 text-sm">{m.message}</p>
        </div>
      ))}
      {!data.length && <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">No messages yet.</div>}
    </div>
  );
}

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useTable<any>("products", "name");
  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await (supabase as any).from("products").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  }
  return (
    <TableWrap>
      <thead className="bg-muted/50 text-left">
        <tr>{["Name", "Price", "Stock", "Active"].map(h => <th key={h} className="p-3 font-semibold text-xs uppercase tracking-wider">{h}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((p) => (
          <tr key={p.id} className="border-t border-border">
            <td className="p-3">{p.name}</td>
            <td className="p-3">
              <input
                type="number"
                step="0.01"
                defaultValue={p.price}
                onBlur={(e) => Number(e.target.value) !== Number(p.price) && update(p.id, { price: Number(e.target.value) })}
                className="w-24 h-8 rounded-md border border-input bg-background px-2"
              />
            </td>
            <td className="p-3">
              <input
                type="number"
                defaultValue={p.stock}
                onBlur={(e) => Number(e.target.value) !== p.stock && update(p.id, { stock: Number(e.target.value) })}
                className="w-20 h-8 rounded-md border border-input bg-background px-2"
              />
            </td>
            <td className="p-3">
              <input type="checkbox" defaultChecked={p.active} onChange={(e) => update(p.id, { active: e.target.checked })} />
            </td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    new: "bg-blue-100 text-blue-800",
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-muted"}`}>{status}</span>;
}
