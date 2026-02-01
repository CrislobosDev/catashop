import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import RouteTransition from "@/components/RouteTransition";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catashop - Tienda de Variedad",
  description:
    "Catashop: tienda de variedad con estilo minimalista, ofertas cálidas y compra rápida por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <CartProvider>
          <div className="page-shell">
            <Header />
            <main className="flex-1">
              <RouteTransition>{children}</RouteTransition>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
