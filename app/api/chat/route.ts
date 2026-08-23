import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  process.env.CHAT_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL ||
  "https://ahmed-21-00380.app.n8n.cloud/webhook/web-chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Format contextual message so n8n AI Agent always knows Dine-In table vs Online guest
    let messageToSend = body.message || "";
    const rawTableNumber = body.tableNumber ? String(body.tableNumber).trim() : "";

    if (rawTableNumber && rawTableNumber !== "undefined" && rawTableNumber !== "null") {
      const tableContext = `[سياق النظام: العميل جالس على طاولة رقم ${rawTableNumber} داخل الصالة (DINE-IN). TableId: ${body.tableId || "active"}, Session: ${body.tableSessionId || body.sessionId}]`;
      if (!messageToSend.includes("[سياق النظام:")) {
        messageToSend = `${tableContext}\n${messageToSend}`;
      }
    } else {
      const guestContext = `[سياق النظام: زائر أونلاين عبر الموقع بدون طاولة (تيك أواي / دليفري - OFF_PREMISE)]`;
      if (!messageToSend.includes("[سياق النظام:")) {
        messageToSend = `${guestContext}\n${messageToSend}`;
      }
    }

    const payloadToSend = {
      ...body,
      tableNumber: rawTableNumber,
      isTableDineIn: Boolean(rawTableNumber),
      fulfillmentMode: rawTableNumber ? "DINE_IN" : "OFF_PREMISE",
      message: messageToSend,
      chatInput: messageToSend,
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadToSend),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[api/chat] n8n responded with status ${response.status}:`, errorText);
      return NextResponse.json(
        {
          replyText: "عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.",
          error: `n8n webhook returned status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const rawText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { replyText: rawText };
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[api/chat] Proxy error:", error);
    return NextResponse.json(
      {
        replyText: "عذراً، لم نتمكن من الوصول إلى المساعد الذكي حالياً.",
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
