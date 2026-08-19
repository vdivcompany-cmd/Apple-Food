import { Order } from "@/types";

export const initialMockOrder: Order = {
  id: "ORD-8492",
  items: [
    { id: "item-1", name: "Grilled Mediterranean Sea Bass", quantity: 1, price: 28.5 },
    { id: "item-2", name: "Truffle Herb Fries", quantity: 1, price: 9.0 },
    { id: "item-3", name: "Sparkling Citrus Cooler", quantity: 2, price: 6.5 },
  ],
  totalAmount: 50.5,
  status: "preparing",
  estimatedMinutes: 18,
  createdAt: "12:15 PM",
};
