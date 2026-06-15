import type { Metadata } from "next";
import "./globals.css";
import "98.css"; // Global retro design stylesheet

export const metadata: Metadata = {
  title: "Ian Finley - Desktop Portfolio",
  description: "Computer Engineering portfolio styled after a classic operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden select-none bg-[#000080] antialiased">
        {children}
      </body>
    </html>
  );
}