"use client";

import { useMemo } from "react";
import { Package, ShoppingBag, AlertTriangle, DollarSign } from "lucide-react";
import type { Order, Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";

type DashboardStatsProps = {
    products: Product[];
    orders: Order[];
};

export default function DashboardStats({ products, orders }: DashboardStatsProps) {
    const stats = useMemo(() => {
        const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
        const lowStockCount = products.filter((p) => p.stock < 3).length;
        const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

        return {
            sales: totalSales,
            products: products.length,
            stock: totalStock,
            lowStock: lowStockCount,
        };
    }, [products, orders]);

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Ventas Totales
                        </p>
                        <h3 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--ink)]">
                            {formatCLP(stats.sales)}
                        </h3>
                    </div>
                    <div className="rounded-full bg-[var(--sand)] p-3 text-[var(--accent-strong)]">
                        <DollarSign size={20} />
                    </div>
                </div>
            </div>

            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Productos
                        </p>
                        <h3 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--ink)]">
                            {stats.products}
                        </h3>
                    </div>
                    <div className="rounded-full bg-[var(--sand)] p-3 text-[var(--accent-strong)]">
                        <Package size={20} />
                    </div>
                </div>
            </div>

            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Stock Total
                        </p>
                        <h3 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--ink)]">
                            {stats.stock}
                        </h3>
                    </div>
                    <div className="rounded-full bg-[var(--sand)] p-3 text-[var(--accent-strong)]">
                        <ShoppingBag size={20} />
                    </div>
                </div>
            </div>

            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Stock Bajo
                        </p>
                        <h3 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--ink)]">
                            {stats.lowStock}
                        </h3>
                    </div>
                    <div className="rounded-full bg-red-50 p-3 text-red-500">
                        <AlertTriangle size={20} />
                    </div>
                </div>
                {stats.lowStock > 0 && (
                    <p className="mt-2 text-xs text-red-500">
                        {stats.lowStock} productos requieren atención.
                    </p>
                )}
            </div>
        </div>
    );
}
