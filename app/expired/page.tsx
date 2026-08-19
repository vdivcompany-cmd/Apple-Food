"use client";

import React from "react";
import { SessionExpiredView } from "@/components/session/SessionExpiredView";

export default function ExpiredPage() {
  return (
    <main className="min-h-screen">
      <SessionExpiredView />
    </main>
  );
}
