import React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function Avatar({ fallback, className, ...props }: AvatarProps) {
  return (
    <div className={className} {...props}>
      <span>{fallback || "AI"}</span>
    </div>
  );
}
