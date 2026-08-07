import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ideia de Melhoria",
  description: "Registre sua ideia de melhoria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-colibri-bg font-display antialiased">
        {children}
      </body>
    </html>
  );
}
