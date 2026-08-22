"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient, BranchInfoData, MenuSourceDocument, PublicMenuData } from "@/lib/api/client";

export interface SessionState {
  chatId: string;
  tenantId: string;
  branchId: string;
  tableId: string;
  tableSessionId: string;
  tableNumber: string;
  isExpired: boolean;
  restaurantName: string;
  branchName: string;
  currency: string;
  branchInfo: BranchInfoData | null;
  menuDocuments: MenuSourceDocument[];
  publicMenu: PublicMenuData | null;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "6a7602ce3fe906bfc78c3b15";
const DEFAULT_BRANCH_ID = process.env.NEXT_PUBLIC_DEFAULT_BRANCH_ID || "6a7602d13fe906bfc78c3b17";
const SESSION_STORAGE_KEY = "tablechat_session_state";

interface SessionContextType {
  session: SessionState;
  setSession: React.Dispatch<React.SetStateAction<SessionState>>;
  resolveQrToken: (token: string) => Promise<boolean>;
  expireSession: () => void;
  resetSession: () => void;
  refreshMenuDocuments: () => Promise<void>;
  refreshPublicMenu: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    chatId: "",
    tenantId: DEFAULT_TENANT_ID,
    branchId: DEFAULT_BRANCH_ID,
    tableId: "",
    tableSessionId: "",
    tableNumber: "",
    isExpired: false,
    restaurantName: "بيتزا وكريب توفيق",
    branchName: "الفرع الرئيسي",
    currency: "EGP",
    branchInfo: null,
    menuDocuments: [],
    publicMenu: null,
    isLoading: true,
    error: null,
  });

  const expireSession = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setSession((prev) => ({ ...prev, isExpired: true }));
  }, []);

  const resetSession = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setSession((prev) => ({
      ...prev,
      chatId: "",
      tableSessionId: "",
      tableNumber: "",
      isExpired: false,
      error: null,
    }));
  }, []);

  // Global session expiration listener
  useEffect(() => {
    const handleExpiredEvent = () => expireSession();
    if (typeof window !== "undefined") {
      window.addEventListener("tablechat:session-expired", handleExpiredEvent);
      return () => window.removeEventListener("tablechat:session-expired", handleExpiredEvent);
    }
  }, [expireSession]);

  useEffect(() => {
    // Check URL parameters for QR scan token (?token=..., ?s=..., ?t=...)
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const token = urlParams?.get("token") || urlParams?.get("s") || urlParams?.get("t") || urlParams?.get("tableToken");

    async function initSession() {
      try {
        let activeTenantId = DEFAULT_TENANT_ID;
        let activeBranchId = DEFAULT_BRANCH_ID;
        let activeChatId = "";
        let activeTableId = "";
        let activeTableSessionId = "";
        let activeTableNumber = "";

        // 1. If customer just landed with a QR scan token
        if (token) {
          try {
            const res = await apiClient.resolveSession({
              token,
              channel: "web",
            });

            if (res && res.success && res.data) {
              const data = res.data;
              activeChatId = data.chatId;
              activeTenantId = data.tenantId || activeTenantId;
              activeBranchId = data.branchId || activeBranchId;
              activeTableId = data.tableId || "";
              activeTableSessionId = data.tableSessionId || data.sessionId || "";
              activeTableNumber = data.tableNumber !== undefined ? String(data.tableNumber) : "";

              // Save in tab-scoped sessionStorage (never in permanent localStorage)
              if (typeof window !== "undefined") {
                sessionStorage.setItem(
                  SESSION_STORAGE_KEY,
                  JSON.stringify({
                    chatId: activeChatId,
                    tenantId: activeTenantId,
                    branchId: activeBranchId,
                    tableId: activeTableId,
                    tableSessionId: activeTableSessionId,
                    tableNumber: activeTableNumber,
                  })
                );

                // Strip token from browser URL cleanly
                window.history.replaceState({}, "", window.location.pathname);
              }
            }
          } catch (err: any) {
            console.warn("[SessionProvider] resolveSession error:", err);
          }
        } else if (typeof window !== "undefined") {
          // 2. Restore active tab session from sessionStorage if present
          const savedJson = sessionStorage.getItem(SESSION_STORAGE_KEY);
          if (savedJson) {
            try {
              const saved = JSON.parse(savedJson);
              if (saved.chatId && saved.tenantId) {
                activeChatId = saved.chatId;
                activeTenantId = saved.tenantId;
                activeBranchId = saved.branchId || activeBranchId;
                activeTableId = saved.tableId || "";
                activeTableSessionId = saved.tableSessionId || "";
                activeTableNumber = saved.tableNumber ? String(saved.tableNumber) : "";

                // Revalidate with backend in background
                apiClient.revalidateSession(saved.chatId, "web").then((rev) => {
                  if (rev && rev.success && rev.data) {
                    setSession((prev) => ({
                      ...prev,
                      tableSessionId: rev.data?.sessionId || prev.tableSessionId,
                      tableNumber: rev.data?.tableNumber !== undefined ? String(rev.data.tableNumber) : prev.tableNumber,
                    }));
                  }
                }).catch(() => {
                  // If backend says session is dead, trigger expiry
                  expireSession();
                });
              }
            } catch {
              sessionStorage.removeItem(SESSION_STORAGE_KEY);
            }
          }
        }

        // 3. Load live public menu catalog, Cloudinary documents, and branch info
        const [menuDocsRes, publicMenuRes, branchRes] = await Promise.allSettled([
          apiClient.getMenuSourceDocuments(activeTenantId),
          apiClient.getPublicMenu(activeTenantId),
          apiClient.getBranchInfo(activeTenantId, activeBranchId),
        ]);

        let menuDocs: MenuSourceDocument[] = [];
        let publicMenuData: PublicMenuData | null = null;
        let branchData: BranchInfoData | null = null;

        if (menuDocsRes.status === "fulfilled" && menuDocsRes.value.success && menuDocsRes.value.data) {
          menuDocs = menuDocsRes.value.data;
        }

        if (publicMenuRes.status === "fulfilled" && publicMenuRes.value.success && publicMenuRes.value.data) {
          publicMenuData = publicMenuRes.value.data;
        }

        if (branchRes.status === "fulfilled" && branchRes.value.success && branchRes.value.data) {
          branchData = branchRes.value.data;
        }

        setSession((prev) => ({
          ...prev,
          chatId: activeChatId || prev.chatId,
          tenantId: activeTenantId,
          branchId: activeBranchId,
          tableId: activeTableId || prev.tableId,
          tableSessionId: activeTableSessionId || prev.tableSessionId,
          tableNumber: activeTableNumber,
          menuDocuments: menuDocs,
          publicMenu: publicMenuData,
          branchInfo: branchData,
          restaurantName: branchData?.tenant?.brandName || branchData?.tenant?.name || prev.restaurantName,
          branchName: branchData?.branch?.name || prev.branchName,
          currency: branchData?.tenant?.currency || "EGP",
          isLoading: false,
        }));
      } catch (err: any) {
        console.error("[SessionProvider] Initialization error:", err);
        setSession((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message,
        }));
      }
    }

    initSession();
  }, [expireSession]);

  const resolveQrToken = async (token: string): Promise<boolean> => {
    try {
      setSession((prev) => ({ ...prev, isLoading: true, error: null }));

      const res = await apiClient.resolveSession({
        token,
        channel: "web",
      });

      if (res.success && res.data) {
        const data = res.data;
        const newTableSessionId = data.tableSessionId || data.sessionId;

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify({
              chatId: data.chatId,
              tenantId: data.tenantId,
              branchId: data.branchId,
              tableId: data.tableId,
              tableSessionId: newTableSessionId,
              tableNumber: data.tableNumber !== undefined ? String(data.tableNumber) : "",
            })
          );
          window.history.replaceState({}, "", window.location.pathname);
        }

        setSession((prev) => ({
          ...prev,
          chatId: data.chatId,
          tenantId: data.tenantId,
          branchId: data.branchId,
          tableId: data.tableId,
          tableSessionId: newTableSessionId,
          tableNumber: data.tableNumber !== undefined ? String(data.tableNumber) : prev.tableNumber,
          isExpired: false,
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (err: any) {
      setSession((prev) => ({ ...prev, isLoading: false, error: err.message }));
      return false;
    }
  };

  const refreshMenuDocuments = async () => {
    try {
      const res = await apiClient.getMenuSourceDocuments(session.tenantId);
      if (res.success && res.data) {
        setSession((prev) => ({ ...prev, menuDocuments: res.data || [] }));
      }
    } catch (err) {
      console.warn("[SessionProvider] Refresh menu documents error:", err);
    }
  };

  const refreshPublicMenu = async () => {
    try {
      const res = await apiClient.getPublicMenu(session.tenantId);
      if (res.success && res.data) {
        setSession((prev) => ({ ...prev, publicMenu: res.data || null }));
      }
    } catch (err) {
      console.warn("[SessionProvider] Refresh public menu error:", err);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        resolveQrToken,
        expireSession,
        resetSession,
        refreshMenuDocuments,
        refreshPublicMenu,
      }}
    >
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
