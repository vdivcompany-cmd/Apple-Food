import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error";
}

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
}
