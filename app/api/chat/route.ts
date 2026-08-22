import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  process.env.CHAT_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL ||
  "https://ahmed-21-00380.app.n8n.cloud/webhook/web-chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

    const data = await response.json();
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
