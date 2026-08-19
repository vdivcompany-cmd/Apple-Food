"use client";

import { useEffect, useRef } from "react";

export function usePolling(
  callback: () => Promise<void> | void,
  intervalMs: number = 5000,
  isEnabled: boolean = true
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isEnabled) return;

    // Call immediately on mount/enable
    savedCallback.current();

    const id = setInterval(() => {
      savedCallback.current();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, isEnabled]);
}
