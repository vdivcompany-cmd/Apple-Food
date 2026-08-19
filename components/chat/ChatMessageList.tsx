import React from "react";
import { ChatMessage } from "@/types";

export function ChatMessageList({ messages }: { messages?: ChatMessage[] }) {
  return <div>{messages?.length ?? 0} messages</div>;
}
