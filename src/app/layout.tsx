import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { ClerkProvider } from "@clerk/nextjs"; // TEMPORARILY DISABLED
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Receptionist - Your AI Employee for Calls & Texts",
  description: "AI handles calls, texts, follow-up, and appointment booking automatically like a real employee. Setup in under 3 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
