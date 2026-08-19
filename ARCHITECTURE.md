# TableChat AI Waiter — Architecture & Integration Guide

## 1. Backend Integration & Overview
* **Live Production Backend:** `https://restaurant-saas-platform-backend.vercel.app`
* **Tenant / Brand:** Versai (`6a7602ce3fe906bfc78c3b15`)
* **Default Branch:** Cairo Branch (`6a7602d13fe906bfc78c3b17`)
* **Menu Document Cloudinary URL:** `https://res.cloudinary.com/qi9jxr5f/image/upload/v1786119532/SaaS_Restaurants/6a7602ce3fe906bfc78c3b15/menu-docs/versai_coffe.png`

---

## 2. API Endpoints Integrated (`lib/api/client.ts`)

| # | Operation | Method & Endpoint | Payload / Params |
|---|---|---|---|
| 1 | **Resolve QR Session** | `POST /api/v1/chat-sessions/resolve` | `{ token, channel: "web", channelUserId }` |
| 2 | **Get Session Context** | `GET /api/v1/chat-sessions/context/{chatId}` | `chatId` (UUID in localStorage) |
| 3 | **Save Table Session** | `POST /api/v1/chat-sessions/save-table` | `{ chatId, tableId, tenantId, tableSessionId }` |
| 4 | **Search Menu (RAG)** | `POST /api/v1/chat-sessions/search` | `{ sessionId, query, topK }` |
| 5 | **Menu Documents** | `GET /api/v1/menu/source-documents/{tenantId}` | Source Cloudinary PDF/Images |
| 6 | **Branch Branding** | `GET /api/v1/tenants/{tenantId}/branches/{branchId}/info` | Restaurant & Branch metadata |
| 7 | **Table History** | `GET /api/v1/tables/{tableId}/history?tenantId={tenantId}&limit=50&channel=DINE_IN` | Past and active orders |
| 8 | **Place Order** | `POST /api/v1/orders/qr` | `{ tenantId, branchId, tableId, tableSessionId, items }` |
| 9 | **Get Order Status** | `GET /api/v1/orders/{orderId}?tenantId={tenantId}` | Single order live status |

---

## 3. Order Placement & Price Integrity Rules
Carried over directly from the n8n AI agent:
1. **Never send `price` from the frontend.** The backend calculates all item prices and order totals server-side to prevent tampering.
2. **Never invent `productId` or `variantId`.** Only IDs surfaced from `searchMenu` or past order history are transmitted.

---

## 4. Chat Transport Layer — Future Webhook Swap

The chat architecture in `lib/chat/chatTransport.ts` decouples UI components from the transport mechanism:

```ts
// lib/chat/chatTransport.ts

export interface ChatTransport {
  sendMessage(input: ChatTransportInput): Promise<ChatTransportResponse>;
}

export function getChatTransport(): ChatTransport {
  // Phase 4 implementation:
  return new DirectSearchChatTransport();

  // Future n8n Webhook swap (1-line change):
  // return new WebhookChatTransport();
}
```

### 🔄 How to perform the future webhook swap:
1. When your n8n workflow exposes a webhook endpoint for web chat (running Gemini / NVIDIA Nemotron AI Agent), set `NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://your-n8n.app/webhook/...` in `.env.local`.
2. In `lib/chat/chatTransport.ts`, change `return new DirectSearchChatTransport()` to `return new WebhookChatTransport()`.
3. **No other file or component in the frontend needs to change.**
