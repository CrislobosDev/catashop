import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import SearchableProductGrid from "@/components/SearchableProductGrid";

export default function Home() {
  return (
    <div className="fade-in">
      <section className="section px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col justify-center gap-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
              Catashop · Santo Domingo · Chile
            </p>
            <h1 className="font-[var(--font-display)] text-4xl leading-tight text-[var(--ink)] md:text-5xl">
              Todo lo esencial para tu día a día, con envío a todo Chile.
            </h1>
            <p className="max-w-xl text-lg text-[var(--muted)]">
              Variedad práctica y bonita en un solo lugar. Coordinamos pago y
              entrega por WhatsApp en minutos.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/galeria"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-[0_18px_40px_rgba(197,131,75,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              >
                Explorar productos
              </Link>
              <Link
                href="/ofertas"
                className="rounded-full border border-[var(--line)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
              >
                Ver ofertas
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Envíos a todo Chile
              </span>
              <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Cambios coordinados por WhatsApp
              </span>
              <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Respuesta rápida
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              <a
                href="https://wa.me/56973283737"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp directo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[var(--surface)] px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <SearchableProductGrid
            mode="all"
            title="Encuentra tu próximo esencial"
            description="Productos útiles y con estilo, listos para coordinar tu compra."
          />
        </div>
      </section>

      <section className="section px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Destacados
              </p>
              <h2 className="font-[var(--font-display)] text-3xl text-[var(--ink)]">
                Lo más solicitado
              </h2>
            </div>
            <Link
              href="/productos"
              className="text-xs uppercase tracking-[0.3em] text-[var(--accent-strong)]"
            >
              Ver todo
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid mode="featured" />
          </div>
        </div>
      </section>

      <section className="section bg-[var(--surface)] px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Cómo comprar
              </p>
              <h2 className="font-[var(--font-display)] text-3xl text-[var(--ink)]">
                Así de simple
              </h2>
              <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
                Agrega productos al carrito y finaliza por WhatsApp para
                coordinar pago y envío en minutos.
              </p>
            </div>
            <div className="grid w-full gap-4 md:max-w-md">
              {[
                "Explora y agrega al carrito",
                "Revisa tu selección",
                "Finaliza por WhatsApp",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center justify-between rounded-[22px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-5 py-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)] backdrop-blur"
                >
                  <span>
                    {index + 1}. {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
          {[
            {
              title: "Stock real y actualizado",
              text: "Confirmamos disponibilidad antes de coordinar tu envío.",
            },
            {
              title: "Atención local en Santo Domingo",
              text: "Cercanía y rapidez en cada coordinación por WhatsApp.",
            },
            {
              title: "Envíos a todo Chile",
              text: "Despachamos a la región que necesites con seguimiento.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <h3 className="font-[var(--font-display)] text-xl text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
