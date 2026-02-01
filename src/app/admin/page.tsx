"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Order, Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { uploadProductImage } from "@/lib/supabase/storage";

type ProductFormState = {
  id?: string;
  name: string;
  price: string;
  stock: string;
  category: string;
  code: string;
  detail: string;
  image_url: string;
  is_featured: boolean;
  is_offer: boolean;
};

const categoryOptions = [
  "Hogar",
  "Jardín",
  "Tecnología",
  "Escolar",
  "Regalos",
  "Cuidado personal",
  "Mascotas",
  "Cocina",
  "Decoración",
  "Otro",
] as const;

const emptyForm: ProductFormState = {
  name: "",
  price: "",
  stock: "",
  category: "",
  code: "",
  detail: "",
  image_url: "",
  is_featured: false,
  is_offer: false,
};

export default function AdminPage() {
  const [session, setSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);

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
    if (!session) return;
    const loadData = async () => {
      if (!supabase) return;
      const client = supabase;
      const { data: productsData } = await client
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts((productsData ?? []) as Product[]);

      const { data: ordersData } = await client
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders((ordersData ?? []) as Order[]);
    };

    loadData();
  }, [session]);

  const resetForm = () => setForm(emptyForm);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage("Configura Supabase antes de guardar productos.");
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      code: form.code || null,
      detail: form.detail,
      image_url: form.image_url || null,
      is_featured: form.is_featured,
      is_offer: form.is_offer,
    };

    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      setMessage("Error al guardar el producto.");
      return;
    }

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((productsData ?? []) as Product[]);
    resetForm();
    setMessage("Producto guardado.");
  };

  const onDelete = async (productId: string) => {
    if (!supabase) return;
    await supabase.from("products").delete().eq("id", productId);
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      const url = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      setMessage("Imagen subida.");
    } catch {
      setMessage("No se pudo subir la imagen.");
    }
  };


  const productCount = useMemo(
    () => products.reduce((acc, item) => acc + item.stock, 0),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFeatured = !onlyFeatured || Boolean(product.is_featured);
      const matchesOffers = !onlyOffers || Boolean(product.is_offer);
      return matchesCategory && matchesSearch && matchesFeatured && matchesOffers;
    });
  }, [products, categoryFilter, searchTerm, onlyFeatured, onlyOffers]);

  const availableCategories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category).filter(Boolean));
    return ["all", ...Array.from(unique)];
  }, [products]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    if (!supabase) {
      setAuthError("Configura Supabase para iniciar sesión.");
      return;
    }
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
    return (
      <section className="section px-6 sm:px-10">
        <div className="mx-auto w-full max-w-5xl text-sm text-[var(--muted)]">
          Cargando panel...
        </div>
      </section>
    );
  }

  if (!supabase) {
    return (
      <section className="section px-6 sm:px-10">
        <div className="mx-auto w-full max-w-md card p-8 text-sm text-[var(--muted)]">
          Configura las variables de Supabase en .env.local para habilitar el
          panel.
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="section px-6 sm:px-10">
        <div className="mx-auto w-full max-w-md card p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Acceso administrador
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-2xl text-[var(--ink)]">
            Iniciar sesión
          </h1>
          <form className="mt-6 flex flex-col gap-4" onSubmit={signIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-full border border-[var(--line)] px-4 py-3 text-sm"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-full border border-[var(--line)] px-4 py-3 text-sm"
            />
            {authError && (
              <p className="text-xs uppercase tracking-[0.2em] text-red-600">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white"
            >
              Entrar
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="section px-6 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Panel administrativo
            </p>
            <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)]">
              Gestión de productos
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Stock total: {productCount} · Productos: {products.length}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--ink)]"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card p-6">
            <h2 className="font-[var(--font-display)] text-xl text-[var(--ink)]">
              Crear o editar producto
            </h2>
            {message && (
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {message}
              </p>
            )}
            <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="rounded-full border border-[var(--line)] px-4 py-3 text-sm"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="number"
                  placeholder="Precio"
                  value={form.price}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, price: event.target.value }))
                  }
                  className="rounded-full border border-[var(--line)] px-4 py-3 text-sm"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, stock: event.target.value }))
                  }
                  className="rounded-full border border-[var(--line)] px-4 py-3 text-sm"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  list="category-options"
                  placeholder="Categoría"
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className="rounded-full border border-[var(--line)] px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  placeholder="Código de producto"
                  value={form.code}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, code: event.target.value }))
                  }
                  className="rounded-full border border-[var(--line)] px-4 py-3 text-sm"
                />
              </div>
              <datalist id="category-options">
                {categoryOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
              <textarea
                placeholder="Detalle"
                value={form.detail}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, detail: event.target.value }))
                }
                className="min-h-[120px] rounded-[20px] border border-[var(--line)] px-4 py-3 text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleUpload(event.target.files?.[0])}
                className="text-sm text-[var(--muted)]"
              />
              <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--muted)]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        is_featured: event.target.checked,
                      }))
                    }
                  />
                  Destacado
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_offer}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        is_offer: event.target.checked,
                      }))
                    }
                  />
                  Oferta
                </label>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[var(--line)] px-6 py-3 text-xs uppercase tracking-[0.3em]"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          <div className="card p-6">
            <h2 className="font-[var(--font-display)] text-xl text-[var(--ink)]">
              Productos activos
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              <span>Filtrar:</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-full border border-[var(--line)] bg-transparent px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink)]"
              >
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas" : category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="rounded-full border border-[var(--line)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink)]"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(event) => setOnlyFeatured(event.target.checked)}
                />
                Destacados
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(event) => setOnlyOffers(event.target.checked)}
                />
                Ofertas
              </label>
            </div>
            <div className="mt-4 max-h-[520px] overflow-y-auto pr-2">
              <div className="flex flex-col gap-4">
              {filteredProducts.length === 0 && (
                <p className="text-sm text-[var(--muted)]">
                  Aún no hay productos cargados.
                </p>
              )}
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 border-b border-[var(--line)] pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-14 w-14 rounded-[16px] object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-dashed border-[var(--line)] text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                          Sin imagen
                        </div>
                      )}
                      <div>
                        <p className="font-[var(--font-display)] text-lg text-[var(--ink)]">
                          {product.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                          {product.category}
                        </p>
                        {product.code && (
                          <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">
                            Código: {product.code}
                          </p>
                        )}
                        {product.created_at && (
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            Subido:{" "}
                            {new Date(product.created_at).toLocaleDateString(
                              "es-CL",
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-[var(--accent-strong)]">
                      {formatCLP(product.price)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    <span>Stock: {product.stock}</span>
                    {product.is_featured && <span>Destacado</span>}
                    {product.is_offer && <span>Oferta</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em]">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          id: product.id,
                          name: product.name,
                          price: String(product.price),
                          stock: String(product.stock),
                          category: product.category,
                          code: product.code ?? "",
                          detail: product.detail ?? "",
                          image_url: product.image_url ?? "",
                          is_featured: Boolean(product.is_featured),
                          is_offer: Boolean(product.is_offer),
                        })
                      }
                      className="text-[var(--accent-strong)]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="text-[var(--muted)] hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 card p-6">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--ink)]">
            Pedidos recientes
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {orders.length === 0 && (
              <p className="text-sm text-[var(--muted)]">
                Aún no hay pedidos registrados.
              </p>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 border-b border-[var(--line)] pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">
                    {new Date(order.created_at).toLocaleString("es-CL")}
                  </span>
                  <span className="text-[var(--accent-strong)]">
                    {formatCLP(order.total)}
                  </span>
                </div>
                <ul className="flex flex-col gap-2 text-sm text-[var(--muted)]">
                  {order.items?.map((item) => (
                    <li
                      key={`${order.id}-${item.id}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-10 w-10 rounded-[12px] object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-dashed border-[var(--line)] text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                            Sin
                          </div>
                        )}
                        <span>{item.name}</span>
                      </div>
                      <span>x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
