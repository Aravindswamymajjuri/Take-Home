import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pastebin Lite",
  description: "Share text quickly and securely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
