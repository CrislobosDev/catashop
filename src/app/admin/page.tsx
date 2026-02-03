"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Order, Product } from "@/lib/types";
import { LogOut, LayoutDashboard, ShoppingBag, Package } from "lucide-react";

import DashboardStats from "@/components/admin/DashboardStats";
import ProductManager from "@/components/admin/ProductManager";
import OrderManager from "@/components/admin/OrderManager";

export default function AdminPage() {
  const [session, setSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const loadData = async () => {
    if (!supabase) return;
    const { data: productsData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((productsData ?? []) as Product[]);

    const { data: ordersData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((ordersData ?? []) as Order[]);
  };

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      setSession(Boolean(data.session));
      setLoading(false);
    };

    init();

    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(Boolean(newSession));
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    if (!supabase) return; // Should show setup error

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError("Credenciales inválidas.");
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--muted)] uppercase tracking-widest text-xs">Cargando panel...</div>;
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card p-8 text-center max-w-md">
          <p className="text-red-500 mb-4">Error de Configuración</p>
          <p className="text-sm text-[var(--muted)]">Configura las variables de Supabase en .env.local para habilitar el panel.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <section className="min-h-screen flex items-center justify-center p-6 bg-[var(--surface)]">
        <div className="w-full max-w-md bg-white border border-[var(--line)] rounded-[32px] p-10 shadow-xl">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] mb-3">Catashop</p>
            <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)]">Admin</h1>
          </div>

          <form className="flex flex-col gap-5" onSubmit={signIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            {authError && (
              <p className="text-xs uppercase tracking-[0.2em] text-red-600 text-center">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[var(--ink)] text-white rounded-full py-4 text-xs uppercase tracking-[0.3em] hover:bg-black transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] pb-20">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--line)] px-6 py-4 transition-colors">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span className="font-[var(--font-display)] text-xl text-[var(--ink)]">Panel de Control</span>
          <button onClick={signOut} className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-500 hover:text-red-700">
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-10 pb-2 border-b border-[var(--line)]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all ${activeTab === "dashboard" ? "bg-[var(--ink)] text-[var(--surface)] shadow-lg" : "text-[var(--muted)] hover:bg-[var(--line)]"}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all ${activeTab === "products" ? "bg-[var(--ink)] text-[var(--surface)] shadow-lg" : "text-[var(--muted)] hover:bg-[var(--line)]"}`}
          >
            <Package size={16} />
            <span>Productos</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all ${activeTab === "orders" ? "bg-[var(--ink)] text-[var(--surface)] shadow-lg" : "text-[var(--muted)] hover:bg-[var(--line)]"}`}
          >
            <ShoppingBag size={16} />
            <span>Pedidos</span>
          </button>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "dashboard" && <DashboardStats products={products} orders={orders} />}
          {activeTab === "products" && <ProductManager products={products} onRefresh={loadData} />}
          {activeTab === "orders" && <OrderManager orders={orders} onRefresh={loadData} />}
        </div>
      </main>
    </div>
  );
}
