/**
 * ============================================================================
 * CHAT TRANSPORT ARCHITECTURE — WEBHOOK READY
 * ============================================================================
 * 
 * ARCHITECTURE NOTE:
 * Chat replies currently come directly from the Search Menu endpoint via DirectSearchChatTransport.
 * Once our n8n automation exposes a webhook that runs the full AI agent (the same agent
 * used for Telegram), swap getChatTransport() to return WebhookChatTransport and set
 * NEXT_PUBLIC_CHAT_WEBHOOK_URL in .env.local — NO OTHER FILE SHOULD NEED TO CHANGE.
 * 
 * ============================================================================
 */

import { apiClient, SearchedProduct, PlacedOrderData } from "@/lib/api/client";

export type { SearchedProduct, PlacedOrderData };

export interface ChatTransportInput {
  sessionId: string;
  tenantId: string;
  branchId: string;
  tableId: string;
  tableSessionId: string;
  tableNumber?: string;
  message: string;
}

export interface ChatTransportResponse {
  replyText: string;
  products?: SearchedProduct[];
  orderPlaced?: PlacedOrderData;
}

export interface ChatTransport {
  sendMessage(input: ChatTransportInput): Promise<ChatTransportResponse>;
}

/**
 * DirectSearchChatTransport
 * Phase 4 implementation: Calls backend menu search endpoint directly and builds
 * a natural, responsive conversational answer for the diner.
 */
export class DirectSearchChatTransport implements ChatTransport {
  async sendMessage(input: ChatTransportInput): Promise<ChatTransportResponse> {
    const { sessionId, tenantId, branchId, tableId, tableSessionId, message } = input;
    const lower = message.toLowerCase().trim();

    try {
      // 1. Check if user is placing an order directly (e.g. from an item button)
      // If the message contains explicit item tags or intent:
      if (lower.startsWith("/order ") || lower.startsWith("order:")) {
        const itemTag = message.replace(/^\/order\s+|^order:\s*/i, "").trim();
        return {
          replyText: `تمام يا فندم! جاري إضافة ${itemTag} لطلبك...`,
        };
      }

      // 2. Query the public menu search API
      const searchRes = await apiClient.searchMenu({
        sessionId: sessionId || tableSessionId,
        query: message,
        topK: 4,
      }).catch(() => null);

      if (searchRes && searchRes.success && searchRes.data && searchRes.data.length > 0) {
        const products: SearchedProduct[] = searchRes.data;
        const count = products.length;

        // Build a helpful Arabic response listing matched dishes
        let reply = `لقيت لحضرتك ${count} أصناف مميزة في المنيو:\n\n`;
        products.forEach((p: SearchedProduct, idx: number) => {
          reply += `${idx + 1}. **${p.name}** — ${p.price} EGP\n`;
          if (p.description) {
            reply += `   _${p.description}_\n`;
          }
        });
        reply += `\nتحب تضيف أي صنف منهم لطلبك يا فندم؟`;

        return {
          replyText: reply,
          products,
        };
      }

      // 3. Fallback friendly conversational replies
      if (lower.includes("أهلا") || lower.includes("مرحبا") || lower.includes("سلام") || lower.includes("مساء") || lower.includes("صباح")) {
        return {
          replyText: `أهلاً بحضرتك يا فندم في أبل فود! ❤️ أنا المساعد الذكي، تحت أمرك لمساعدتك في اختيار أشهى الأطباق والبيتزا أو طلب الأوردر. تحب تبدأ باقتراحات المنيو؟`,
          products: [],
        };
      } else if (lower.includes("شكرا") || lower.includes("تمام") || lower.includes("تسلم")) {
        return {
          replyText: `تمام يا فندم ❤️! أنا تحت أمرك. تحب تسأل عن أطباق معينة، مشروبات، أو تحب أرشحلك أفضل الأصناف؟`,
          products: [],
        };
      } else {
        return {
          replyText: `I'm at your service! Let me know what you'd like to taste today.`,
        };
      }
    } catch (error: any) {
      console.error("[DirectSearchChatTransport] Error:", error);
      return {
        replyText: `I'm at your service! Let me know what you'd like to taste today.`,
      };
    }
  }
}

/**
 * WebhookChatTransport
 * Transports chat messages to the n8n AI Agent webhook with explicit table context.
 */
export class WebhookChatTransport implements ChatTransport {
  private webhookUrl: string;

  constructor(webhookUrl: string = "/api/chat") {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(input: ChatTransportInput): Promise<ChatTransportResponse> {
    let activeSessionId = input.sessionId || input.tableSessionId;
    let tableNumber = input.tableNumber || "";
    let tableId = input.tableId || "";
    let tableSessionId = input.tableSessionId || "";
    let tenantId = input.tenantId || "";
    let branchId = input.branchId || "";

    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("tablechat_session_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!activeSessionId) activeSessionId = parsed.tableSessionId || parsed.chatId;
          if (!tableNumber && parsed.tableNumber) tableNumber = String(parsed.tableNumber);
          if (!tableId && parsed.tableId) tableId = parsed.tableId;
          if (!tableSessionId && parsed.tableSessionId) tableSessionId = parsed.tableSessionId;
          if (!tenantId && parsed.tenantId) tenantId = parsed.tenantId;
          if (!branchId && parsed.branchId) branchId = parsed.branchId;
        }
      } catch {}
    }

    if (!activeSessionId) {
      activeSessionId = `web_guest_${Date.now()}`;
    }

    const hasTable = Boolean(tableNumber && (tableSessionId || tableId));

    const payload = {
      sessionId: activeSessionId,
      tenantId,
      branchId,
      tableNumber,
      tableId,
      tableSessionId,
      isTableDineIn: hasTable,
      fulfillmentMode: hasTable ? "DINE_IN" : "OFF_PREMISE",
      message: input.message,
      channel: "web",
    };

    const res = await fetch(this.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Webhook chat error: status ${res.status}`);
    }

    const json = await res.json();
    return {
      replyText: json.replyText || json.text || json.output || "Message received",
      products: json.products || [],
      orderPlaced: json.orderPlaced,
    };
  }
}

/**
 * Factory function for chat transport dependency injection
 * 
 * Always routes through Next.js /api/chat proxy to eliminate CORS.
 */
export function getChatTransport(): ChatTransport {
  return new WebhookChatTransport("/api/chat");
}
