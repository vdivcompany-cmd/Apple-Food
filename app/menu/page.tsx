"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { useSession } from "@/lib/context/SessionContext";

export default function MenuPage() {
  const { session } = useSession();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const menuImageUrl =
    session.menuDocuments && session.menuDocuments.length > 0
      ? session.menuDocuments[0].url
      : "https://res.cloudinary.com/qi9jxr5f/image/upload/v1787161427/SaaS_Restaurants/6a85e588d0b508058fc5008c/menu-docs/menu.jpg";

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="h-full min-h-screen bg-background text-on-surface flex flex-col antialiased font-arabic">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 md:px-8 py-6 w-full space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-surface-variant/40 shadow-card-soft">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">
                قائمة طعام {session.restaurantName || "بيتزا وكريب توفيق"}
              </h1>
            </div>
            <p className="text-xs md:text-sm text-secondary mt-1">
              صورة المنيو الأصلية المعتمدة من المطعم (مستضافة عبر Cloudinary)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={menuImageUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-surface-container text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center gap-1.5 border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>فتح بجودة كاملة</span>
            </a>

            <Link
              href="/"
              className="px-4 py-2 bg-primary-container text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>اطلب مع الويتر الذكي</span>
            </Link>
          </div>
        </div>

        {/* Interactive Image Viewer Canvas */}
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-variant/40 shadow-card-elevated overflow-hidden relative flex flex-col">
          {/* Viewer Toolbar */}
          <div className="px-4 py-3 bg-surface-container-low border-b border-surface-variant/40 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-secondary">
                مستوى التكبير: {Math.round(zoomLevel * 100)}%
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomIn}
                title="تكبير"
                className="w-9 h-9 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-primary transition-colors flex items-center justify-center font-bold text-sm"
              >
                <span className="material-symbols-outlined text-base">zoom_in</span>
              </button>
              <button
                onClick={handleZoomOut}
                title="تصغير"
                className="w-9 h-9 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-primary transition-colors flex items-center justify-center font-bold text-sm"
              >
                <span className="material-symbols-outlined text-base">zoom_out</span>
              </button>
              <button
                onClick={handleResetZoom}
                title="إعادة ضبط"
                className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-primary transition-colors text-xs font-bold"
              >
                100%
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                title="ملء الشاشة"
                className="w-9 h-9 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-primary transition-colors flex items-center justify-center font-bold text-sm"
              >
                <span className="material-symbols-outlined text-base">
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            className={`flex items-center justify-center p-4 md:p-8 overflow-auto bg-black/5 ${
              isFullscreen ? "fixed inset-0 z-50 bg-black/90 p-4" : "min-h-[500px] max-h-[750px]"
            }`}
          >
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-lg font-bold hover:bg-white/40"
              >
                ✕
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={menuImageUrl}
              alt="Restaurant Menu"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center top" }}
              className="max-w-full h-auto rounded-2xl shadow-2xl transition-transform duration-200 object-contain"
            />
          </div>
        </div>

        {/* Quick Menu Categories Summary Cards */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-extrabold text-on-surface">أقسام منيو المطعم المتاحة للطلب الفوري:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: "🍕 البيتزات", count: "16 صنف", prompt: "عايز أشوف أنواع البيتزات المتوفرة" },
              { name: "🍔 برجاريزا", count: "2 صنف", prompt: "إيه هي وجبات البرجاريزا وأسعارها؟" },
              { name: "🍝 المعجنات", count: "4 أصناف", prompt: "عايز أطلب مكرونة بشاميل أو نجرسكو" },
              { name: "🥗 السلطات والصوصات", count: "15 صنف", prompt: "إيه أنواع السلطات والصوصات المتاحة؟" },
              { name: "🌿 الصيامي", count: "5 أصناف", prompt: "إيه الأكل الصيامي والكريب المتوفر؟" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href="/"
                className="p-4 bg-surface-container-lowest rounded-2xl border border-surface-variant/40 shadow-card-soft hover:border-primary-container hover:scale-[0.98] transition-all flex flex-col justify-between text-right group"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-on-surface group-hover:text-primary-container transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-secondary font-semibold mt-1 block">{cat.count}</span>
                </div>
                <span className="text-[11px] font-bold text-primary-container mt-3 flex items-center justify-end gap-1">
                  <span>اطلب الآن</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
