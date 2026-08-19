import React from "react";
import { ChatMessage } from "@/types";

export function ChatMessageItem({ message }: { message?: ChatMessage }) {
  return <div>{message?.text}</div>;
}
