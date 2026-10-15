import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aplikasi Aspirasi Sekolah - MPS Adyaveda MAN IC Pekalongan",
  description: "Platform aspirasi resmi siswa MAN Insan Cendekia Pekalongan diawasi Komisi C MPS Adyaveda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
