import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppProviders } from "@/lib/context";

export const metadata: Metadata = {
  title: "TableChat AI Waiter",
  description: "AI-powered dining assistant and smart ordering app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
