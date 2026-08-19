import React from "react";

export function DesktopSplitLayout({
  children,
  sidebar,
}: {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
      <div>{sidebar}</div>
    </div>
  );
}
