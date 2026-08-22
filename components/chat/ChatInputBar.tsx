"use client";

import React, { useState } from "react";

interface ChatInputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  value?: string;
  onChange?: (text: string) => void;
}

export function ChatInputBar({ onSend, disabled, value, onChange }: ChatInputBarProps) {
  const [internalText, setInternalText] = useState("");
  const isControlled = value !== undefined;
  const currentText = isControlled ? value : internalText;

  const handleTextChange = (newVal: string) => {
    if (isControlled) {
      onChange?.(newVal);
    } else {
      setInternalText(newVal);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText.trim() || disabled) return;
    onSend(currentText);
    if (isControlled) {
      onChange?.("");
    } else {
      setInternalText("");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-surface/90 backdrop-blur-md border-t border-surface-variant/40 z-10 w-full max-w-4xl mx-auto self-center">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-surface-container-lowest rounded-full shadow-[0px_8px_30px_rgba(18,18,18,0.08)] border border-outline-variant/60 p-2 focus-within:border-primary-container transition-all min-h-[60px]">
        {/* Plus / Add Action */}
        <button
          type="button"
          aria-label="Add options"
          className="p-2.5 text-secondary hover:text-primary-container transition-colors rounded-full hover:bg-surface-container-low flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={currentText}
          onChange={(e) => handleTextChange(e.target.value)}
          disabled={disabled}
          placeholder="اكتب طلبك أو استفسارك هنا..."
          className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-on-surface placeholder:text-on-surface-variant/70 focus:ring-0 px-2"
        />

        {/* Microphone Voice Action */}
        <button
          type="button"
          aria-label="Voice input"
          className="p-2 text-secondary hover:text-primary-container transition-colors rounded-full hover:bg-surface-container-low flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-xl">mic</span>
        </button>

        {/* Send Action Button */}
        <button
          type="submit"
          disabled={!currentText.trim() || disabled}
          aria-label="Send message"
          className="p-3 bg-primary-container text-white rounded-full hover:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center w-11 h-11 shadow-sm flex-shrink-0"
        >
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </form>
    </div>
  );
}
