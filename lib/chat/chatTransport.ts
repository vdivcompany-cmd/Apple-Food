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
      const searchRes = await apiClient.searchMenu({
        sessionId: sessionId || tableSessionId,
        query: message,
        topK: 5,
      }).catch((err) => {
        console.warn("[DirectSearchChatTransport] Search fallback:", err);
        return null;
      });

      const products: SearchedProduct[] = (searchRes && searchRes.data) ? searchRes.data : [];

      // Format natural reply in Arabic or English based on input language
      const isArabic = /[\u0600-\u06FF]/.test(message);

      if (products.length > 0) {
        if (isArabic) {
          const itemsList = products
            .slice(0, 3)
            .map((p) => `• *${p.name}* — ${p.price} EGP\n  ${p.description || ""}`)
            .join("\n\n");
          return {
            replyText: `لقيت لحضرتك الأصناف دي من المنيو ❤️:\n\n${itemsList}\n\nتحب تطلب إيه منهم أو تسأل عن تفاصيل أكتر؟`,
            products,
          };
        } else {
          const itemsList = products
            .slice(0, 3)
            .map((p) => `• *${p.name}* — $${p.price.toFixed(2)}\n  ${p.description || ""}`)
            .join("\n\n");
          return {
            replyText: `Here is what I found from our menu for you:\n\n${itemsList}\n\nWould you like to add any of these to your table order?`,
            products,
          };
        }
      }

      // Default conversational reply if search yielded no specific products
      if (isArabic) {
        return {
          replyText: `تمام يا فندم ❤️! أنا تحت أمرك. تحب تسأل عن أطباق معينة، مشروبات، أو تحب أرشحلك أفضل الأصناف؟`,
          products: [],
        };
      } else {
        return {
          replyText: `I'm here to help! Feel free to ask about specific dishes, fresh juices, chef specials, or dietary options.`,
          products: [],
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
 * WebhookChatTransport (Scaffolded for Future n8n Webhook Swap)
 * 
 * TODO: activate once n8n webhook is live
 * When n8n exposes a webhook endpoint for web chat, set NEXT_PUBLIC_CHAT_WEBHOOK_URL
 * and switch getChatTransport() to return an instance of this class.
 */
export class WebhookChatTransport implements ChatTransport {
  private webhookUrl: string;

  constructor(webhookUrl?: string) {
    this.webhookUrl =
      webhookUrl ||
      process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL ||
      "https://ahmed-21-00380.app.n8n.cloud/webhook/web-chat";
  }

  async sendMessage(input: ChatTransportInput): Promise<ChatTransportResponse> {
    const fallbackSessionId =
      input.sessionId ||
      input.tableSessionId ||
      `web_guest_${Date.now()}`;

    const payload = {
      sessionId: fallbackSessionId,
      tenantId: input.tenantId || "",
      branchId: input.branchId || "",
      tableId: input.tableId || "",
      tableSessionId: input.tableSessionId || fallbackSessionId,
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
 * Defaults to WebhookChatTransport connecting to n8n.
 */
export function getChatTransport(): ChatTransport {
  const webhookUrl =
    process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL ||
    "https://ahmed-21-00380.app.n8n.cloud/webhook/web-chat";
  return new WebhookChatTransport(webhookUrl);
}
