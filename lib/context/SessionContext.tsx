"use client";

import React, { createContext, useContext, useState } from "react";
import { TableSession } from "@/types";
import { defaultMockSession } from "@/lib/mock/mockSession";

interface SessionContextType {
  session: TableSession;
  setSession: React.Dispatch<React.SetStateAction<TableSession>>;
  expireSession: () => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<TableSession>(defaultMockSession);

  const expireSession = () => {
    setSession((prev) => ({ ...prev, isExpired: true }));
  };

  const resetSession = () => {
    setSession(defaultMockSession);
  };

  return (
    <SessionContext.Provider value={{ session, setSession, expireSession, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
