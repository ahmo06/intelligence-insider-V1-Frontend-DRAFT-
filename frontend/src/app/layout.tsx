import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agents",
  description: "Exact capture of cursor.com agents UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
