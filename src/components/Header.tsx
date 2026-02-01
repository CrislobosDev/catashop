"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/components/CartContext";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/carrito", label: "Carrito", isCart: true },
];

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
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
              className="relative transition-colors duration-300 hover:text-[var(--accent-strong)]"
            >
              {item.label}
              {item.isCart && count > 0 && (
                <span className="absolute -right-4 -top-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] tracking-normal text-white">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex flex-wrap items-center justify-center gap-8 border-t border-[var(--line)] px-6 py-5 text-xs uppercase tracking-[0.25em] text-[var(--muted)] md:hidden">
        {navItems.map((item) => (
          <Link
            key={`${item.href}-mobile`}
            href={item.href}
            className="relative transition-colors duration-300 hover:text-[var(--accent-strong)]"
          >
            {item.label}
            {item.isCart && count > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] tracking-normal text-white">
                {count}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
