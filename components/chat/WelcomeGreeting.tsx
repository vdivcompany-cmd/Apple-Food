import React from "react";

export function WelcomeGreeting({ tableNumber }: { tableNumber?: string }) {
  return <div>Welcome to Table {tableNumber}</div>;
}
