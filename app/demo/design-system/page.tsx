"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout";

export default function DesignSystemDemoPage() {
  const colorSwatches = [
    { name: "Primary Container (Amber)", hex: "#FF6B00", bg: "bg-primary-container", text: "text-white" },
    { name: "Primary Deep", hex: "#A04100", bg: "bg-primary", text: "text-white" },
    { name: "Primary Fixed Dim", hex: "#FFB693", bg: "bg-primary-fixed-dim", text: "text-on-primary-container" },
    { name: "Background (Warm Cream)", hex: "#FBF9F5", bg: "bg-background border border-surface-variant", text: "text-on-surface" },
    { name: "Surface (White)", hex: "#FFFFFF", bg: "bg-surface-container-lowest border border-surface-variant", text: "text-on-surface" },
    { name: "Surface Container", hex: "#EFEEEA", bg: "bg-surface-container", text: "text-on-surface" },
    { name: "Surface Container High", hex: "#EAE8E4", bg: "bg-surface-container-high", text: "text-on-surface" },
    { name: "Secondary Charcoal", hex: "#121212", bg: "bg-brand-charcoal", text: "text-white" },
    { name: "Error Red", hex: "#BA1A1A", bg: "bg-error", text: "text-white" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top Banner */}
      <div className="w-full bg-primary text-white text-xs px-4 py-1.5 flex justify-between items-center z-50">
        <span>🎨 Stitch Screen #3: <strong>Design System Living Catalog</strong></span>
        <Link href="/" className="underline text-xs hover:text-primary-fixed">
          ← Back to App
        </Link>
      </div>

      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-10 w-full space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
            Design System: <span className="text-primary-container">Warm & Welcoming Culinary</span>
          </h1>
          <p className="text-secondary mt-2 text-base">
            Tokens, typography, spacing, radii, elevation, and component primitives extracted from Stitch App ID: 17711231060904158057.
          </p>
        </div>

        {/* 1. Colors */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-surface-variant/40 pb-2">1. Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {colorSwatches.map((swatch) => (
              <div key={swatch.name} className="rounded-2xl overflow-hidden shadow-card-soft border border-surface-variant/40 bg-surface-container-lowest p-3 space-y-2">
                <div className={`h-16 rounded-xl ${swatch.bg} flex items-end p-2`}>
                  <span className={`text-xs font-mono font-bold ${swatch.text}`}>{swatch.hex}</span>
                </div>
                <div>
                  <p className="font-bold text-xs text-on-surface">{swatch.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-surface-variant/40 pb-2">2. Typography (Plus Jakarta Sans)</h2>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant/40 space-y-4">
            <div>
              <p className="text-xs text-secondary uppercase font-bold tracking-wider">Display / Headline LG (32px Bold)</p>
              <p className="text-3xl font-extrabold text-on-surface">Experience Smart Dining with ResBot</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase font-bold tracking-wider">Headline MD (24px SemiBold)</p>
              <p className="text-2xl font-bold text-on-surface">Fresh Mediterranean Sea Bass</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase font-bold tracking-wider">Body LG (18px Regular)</p>
              <p className="text-lg text-on-surface-variant">Browse our chef specials and easily order directly from your table.</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase font-bold tracking-wider">Body MD / Chat Text (15px-16px)</p>
              <p className="text-base text-on-surface">I recommend ordering the grilled scallops as a light starter.</p>
            </div>
          </div>
        </section>

        {/* 3. Component Primitives */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-surface-variant/40 pb-2">3. Component Primitives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant/40 space-y-3">
              <h3 className="font-bold text-sm text-secondary uppercase tracking-wider">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 bg-primary-container text-white rounded-full font-bold text-sm shadow-card-soft hover:scale-95 transition-transform">
                  Primary Button
                </button>
                <button className="px-5 py-2.5 bg-surface-container text-on-surface rounded-full font-bold text-sm border border-surface-variant hover:bg-surface-container-high transition-colors">
                  Secondary Button
                </button>
                <button className="px-5 py-2.5 bg-error text-white rounded-full font-bold text-sm shadow-card-soft">
                  Error Action
                </button>
              </div>
            </div>

            {/* Badges & Status */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant/40 space-y-3">
              <h3 className="font-bold text-sm text-secondary uppercase tracking-wider">Badges & Status</h3>
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="px-3 py-1 bg-primary-container/15 text-primary-container border border-primary-container/30 rounded-full text-xs font-bold">
                  PREPARING
                </span>
                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-container rounded-full text-xs font-bold">
                  RECEIVED
                </span>
                <span className="px-3 py-1 bg-surface-container text-secondary rounded-full text-xs font-bold">
                  TABLE 10
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-fixed text-primary rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  Live Session
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Quick Links to Demo Screens */}
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold border-b border-surface-variant/40 pb-2">4. Isolated Screen Demos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Screen #2: Welcome & Empty Chat (Desktop)", href: "/demo/welcome-desktop", tag: "Desktop 2560x2176" },
              { title: "Screen #1: Active AI Conversation (Desktop)", href: "/demo/active-chat-desktop", tag: "Desktop 2560x2048" },
              { title: "Screen #4: Active Chat (Mobile)", href: "/demo/active-chat-mobile", tag: "Mobile 390x884" },
              { title: "Screen #5: My Order Tracking (Mobile)", href: "/demo/order-tracking-mobile", tag: "Mobile 390x701" },
              { title: "Screen #6: Session Expired State", href: "/demo/session-expired", tag: "Responsive Modal" },
              { title: "Main Responsive App Experience", href: "/", tag: "Responsive Auto-Flow" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-5 bg-surface-container-lowest rounded-2xl border border-surface-variant/40 shadow-card-soft hover:border-primary-container hover:scale-[0.99] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-container">{link.tag}</span>
                  <h3 className="font-bold text-sm text-on-surface mt-1">{link.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-primary-container mt-4">
                  <span>Open Screen</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
