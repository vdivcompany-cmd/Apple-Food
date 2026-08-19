import React from "react";
import { OrderStatus } from "@/types";

export function OrderStatusStepper({ status }: { status?: OrderStatus }) {
  return <div>Order Status Stepper: {status}</div>;
}
