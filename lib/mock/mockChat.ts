import { ChatMessage } from "@/types";

export const initialMockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Hello and welcome to Table 04! I'm your AI Waiter today. How can I help you? Feel free to ask about our menu, today's specials, or dietary options.",
    timestamp: "12:00 PM",
  },
];

export const quickPromptOptions = [
  "What are today's chef specials?",
  "Recommend popular seafood dishes",
  "Show vegetarian & vegan options",
  "What drinks & cocktails do you have?",
];
