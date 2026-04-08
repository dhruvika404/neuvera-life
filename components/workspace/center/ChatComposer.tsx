"use client";
import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isStreaming: boolean;
  placeholder?: string;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  isStreaming,
  placeholder = "Ask the agent to find leads, create a campaign...",
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      if (form) form.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="px-4 py-3 border-t flex flex-col gap-2"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
    >
      <div
        className="flex items-end gap-2 rounded-lg border px-3 py-2 focus-within:border-gold transition-colors"
        style={{ borderColor: "var(--color-border)", background: "var(--color-s2)" }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 bg-transparent outline-none text-sm resize-none leading-relaxed min-h-[20px] max-h-32"
          style={{ color: "var(--color-ink)", fontFamily: "var(--font-sans)" }}
          placeholder={placeholder}
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={!value.trim() || isStreaming}
          className={cn(
            "w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors",
            value.trim() && !isStreaming
              ? "opacity-100"
              : "opacity-30"
          )}
          style={{
            background: "var(--color-ink)",
            color: "#fff",
          }}
        >
          <Send size={12} />
        </button>
      </div>
      <p className="text-[11px] text-center" style={{ color: "var(--color-ink4)" }}>
        Press Enter to send · Shift+Enter for new line
      </p>
    </form>
  );
}
