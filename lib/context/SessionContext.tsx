"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "6a85e588d0b508058fc5008c";
const DEFAULT_BRANCH_ID = process.env.NEXT_PUBLIC_DEFAULT_BRANCH_ID || "6a85e588d0b508058fc5008e";

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

function getOrCreateChatId(): string {
  if (typeof window === "undefined") return "browser-ssr-id";
  let id = localStorage.getItem("tablechat_client_chat_id");
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `web-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("tablechat_client_chat_id", id);
  }
  return id;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    chatId: "",
    tenantId: DEFAULT_TENANT_ID,
    branchId: DEFAULT_BRANCH_ID,
    tableId: "",
    tableSessionId: "",
    tableNumber: "10",
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

  useEffect(() => {
    const chatId = getOrCreateChatId();
    setSession((prev) => ({ ...prev, chatId }));

    // Check URL parameters for QR scan token or table
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const token = urlParams?.get("token");

    async function initSession() {
      try {
        const activeTenantId = DEFAULT_TENANT_ID;

        // 1. If QR token provided, resolve it
        if (token) {
          const res = await apiClient.resolveSession({
            token,
            channel: "web",
            channelUserId: chatId,
          }).catch((err) => {
            console.warn("[SessionProvider] resolveSession warning:", err);
            return null;
          });

          if (res && res.success && res.data) {
            const data = res.data;
            const newTableSessionId = data.tableSessionId || data.sessionId;

            await apiClient.saveTableSession({
              chatId,
              tableId: data.tableId,
              tenantId: data.tenantId,
              tableSessionId: newTableSessionId,
            }).catch(console.warn);

            setSession((prev) => ({
              ...prev,
              tenantId: data.tenantId,
              branchId: data.branchId,
              tableId: data.tableId,
              tableSessionId: newTableSessionId,
              tableNumber: data.tableNumber || prev.tableNumber,
              isExpired: false,
            }));
          }
        } else {
          // 2. Try fetching existing bound table context for this browser chatId
          const ctxRes = await apiClient.getSessionContext(chatId).catch(() => null);
          if (ctxRes && ctxRes.success && ctxRes.data) {
            setSession((prev) => ({
              ...prev,
              tenantId: ctxRes.data?.tenantId || prev.tenantId,
              branchId: ctxRes.data?.branchId || prev.branchId,
              tableId: ctxRes.data?.tableId || prev.tableId,
              tableSessionId: ctxRes.data?.tableSessionId || prev.tableSessionId,
              tableNumber: ctxRes.data?.tableNumber || prev.tableNumber,
            }));
          }
        }

        // 3. Load real public menu and Cloudinary menu documents from backend
        const [menuDocsRes, publicMenuRes, branchRes] = await Promise.allSettled([
          apiClient.getMenuSourceDocuments(activeTenantId),
          apiClient.getPublicMenu(activeTenantId),
          apiClient.getBranchInfo(activeTenantId, DEFAULT_BRANCH_ID),
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
  }, []);

  const resolveQrToken = async (token: string): Promise<boolean> => {
    try {
      setSession((prev) => ({ ...prev, isLoading: true, error: null }));
      const chatId = session.chatId || getOrCreateChatId();

      const res = await apiClient.resolveSession({
        token,
        channel: "web",
        channelUserId: chatId,
      });

      if (res.success && res.data) {
        const data = res.data;
        const newTableSessionId = data.tableSessionId || data.sessionId;

        await apiClient.saveTableSession({
          chatId,
          tableId: data.tableId,
          tenantId: data.tenantId,
          tableSessionId: newTableSessionId,
        }).catch(console.warn);

        setSession((prev) => ({
          ...prev,
          tenantId: data.tenantId,
          branchId: data.branchId,
          tableId: data.tableId,
          tableSessionId: newTableSessionId,
          tableNumber: data.tableNumber || prev.tableNumber,
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

  const expireSession = () => {
    setSession((prev) => ({ ...prev, isExpired: true }));
  };

  const resetSession = () => {
    setSession((prev) => ({ ...prev, isExpired: false, error: null }));
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
