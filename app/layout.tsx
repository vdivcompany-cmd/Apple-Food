import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppProviders } from "@/lib/context";

export const metadata: Metadata = {
  title: "TableChat AI Waiter - Apple Food",
  description: "AI-powered dining assistant and smart ordering app",
  icons: {
    icon: "/icons8-hamburger-48.png",
    shortcut: "/icons8-hamburger-48.png",
    apple: "/icons8-hamburger-48.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icons8-hamburger-48.png" />
        <link rel="apple-touch-icon" href="/icons8-hamburger-48.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
