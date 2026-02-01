import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/galeria", label: "Galería" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/carrito", label: "Carrito" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
            Cata
          </span>
          <span className="font-[var(--font-display)] text-xl text-[var(--ink)]">
            Shop
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.2em] text-[var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-[var(--accent-strong)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/carrito"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Ir al carrito
          </Link>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Link
            href="/carrito"
            className="rounded-full border border-[var(--line)] px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Carrito
          </Link>
        </div>
      </div>
      <nav className="flex items-center justify-center gap-6 border-t border-[var(--line)] px-6 py-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)] md:hidden">
        {navItems.map((item) => (
          <Link
            key={`${item.href}-mobile`}
            href={item.href}
            className="transition-colors duration-300 hover:text-[var(--accent-strong)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
