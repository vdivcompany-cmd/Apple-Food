"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "@/lib/context/SessionContext";

export function SessionExpiredView() {
  const { resetSession } = useSession();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-surface overflow-hidden p-4">
      {/* Warm Ambient Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface-container to-background opacity-90 z-0" />
      <div className="absolute inset-0 bg-on-background/20 backdrop-blur-md z-0" />

      {/* Centered Modal Card */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-card-elevated flex flex-col items-center text-center border border-outline-variant/30">
          {/* Animated Expired QR Icon Area */}
          <div className="mb-6 relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-error/15 rounded-full animate-pulse" />
            <div className="relative bg-surface rounded-full p-4 shadow-sm z-10 border border-error/20">
              <span className="material-symbols-outlined text-4xl text-error">
                qr_code_scanner
              </span>
            </div>
            {/* Alert Badge */}
            <div className="absolute bottom-0 right-0 bg-error text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white z-20 shadow-sm">
              <span className="material-symbols-outlined text-sm font-bold">warning</span>
            </div>
          </div>

          {/* Headline & Body */}
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Your session expired
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant mb-8 max-w-xs leading-relaxed">
            Your table connection timed out. Please rescan the table QR code to start a new dining session.
          </p>

          {/* Primary Action Button */}
          <Link
            href="/"
            onClick={() => resetSession()}
            className="w-full bg-primary-container text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 hover:scale-[0.98] transition-all shadow-card-soft text-base"
          >
            <span className="material-symbols-outlined text-xl">qr_code_2</span>
            <span>Rescan QR Code</span>
          </Link>

          {/* Manual PIN Fallback */}
          <div className="mt-6 pt-4 border-t border-surface-variant/40 w-full">
            <p className="text-xs text-secondary mb-2">Can&apos;t scan? Enter table PIN</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Table PIN (e.g. 10)"
                className="flex-1 px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/60 text-sm text-center font-bold tracking-widest outline-none focus:border-primary-container"
              />
              <Link
                href="/"
                onClick={() => resetSession()}
                className="px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/80 transition-colors flex items-center"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
