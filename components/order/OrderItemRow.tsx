import React from "react";
import { OrderItem } from "@/types";

export function OrderItemRow({ item }: { item?: OrderItem }) {
  return <div>{item?.name}</div>;
}
