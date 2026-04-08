"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Zap, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

type TextPart = { type: "text"; text: string };
type ToolPart = {
  type: string; // "tool-{toolName}"
  toolCallId: string;
  toolName?: string;
  input?: unknown;
  output?: unknown;
  state?: "input-streaming" | "input-available" | "output-available" | "output-error";
};
type MessagePart = TextPart | ToolPart | { type: string; [key: string]: unknown };

interface ChatUiMessage {
  id: string;
  role: string;
  parts?: MessagePart[];
  createdAt?: Date;
}

interface ChatMessageProps {
  message: ChatUiMessage;
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      result.push(
        <p key={key++} className="font-semibold text-sm mt-2 mb-0.5" style={{ color: "var(--color-ink)" }}>
          {line.slice(3)}
        </p>
      );
    } else if (line.startsWith("- ")) {
      result.push(
        <li key={key++} className="text-sm ml-4 list-disc" style={{ color: "var(--color-ink)" }}>
          {renderInline(line.slice(2))}
        </li>
      );
    } else if (line.trim() === "") {
      result.push(<div key={key++} className="h-1.5" />);
    } else {
      result.push(
        <p key={key++} className="text-sm leading-relaxed" style={{ color: "var(--color-ink)" }}>
          {renderInline(line)}
        </p>
      );
    }
  }
  return result;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--color-ink)" }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1 py-0.5 rounded text-[11px]"
          style={{
            fontFamily: "var(--font-mono)",
            background: "var(--color-s3)",
            color: "var(--color-ink2)",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

const TOOL_LABELS: Record<string, string> = {
  search_apollo: "Search Apollo",
  enrich_with_clay: "Enrich with Clay",
  qualify_leads: "Qualify Leads",
  create_lead_list: "Create Lead List",
  sync_to_hubspot: "Sync to HubSpot",
  load_lead_list: "Load Lead List",
  generate_email_sequence: "Generate Email Sequence",
  create_instantly_campaign: "Create Instantly Campaign",
  activate_campaign: "Activate Campaign",
};

function ToolCallBlock({ part }: { part: ToolPart }) {
  const [expanded, setExpanded] = useState(false);
  const toolName = part.toolName ?? part.type.slice(5);
  const label = TOOL_LABELS[toolName] ?? toolName.replace(/_/g, " ");
  const isDone = part.state === "output-available";
  const isError = part.state === "output-error";
  const isPending = !isDone && !isError;

  return (
    <div
      className="my-2 rounded-lg border overflow-hidden"
      style={{
        borderColor: isDone ? "var(--color-border)" : isError ? "var(--color-red)" : "var(--color-gold-l)",
        background: "var(--color-surface)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:opacity-80"
        style={{ background: isDone ? "var(--color-s2)" : isError ? "var(--color-red-bg)" : "var(--color-amber-bg)" }}
      >
        {isPending ? (
          <Loader2 size={13} className="animate-spin shrink-0" style={{ color: "var(--color-amber)" }} />
        ) : isDone ? (
          <CheckCircle size={13} className="shrink-0" style={{ color: "var(--color-green)" }} />
        ) : (
          <AlertCircle size={13} className="shrink-0" style={{ color: "var(--color-red)" }} />
        )}
        <Zap size={11} className="shrink-0" style={{ color: "var(--color-ink3)" }} />
        <span
          className="text-xs font-medium flex-1"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
        >
          {label}
        </span>
        <span className="text-[10px] shrink-0" style={{ color: "var(--color-ink4)" }}>
          {isDone ? "done" : isError ? "error" : "running…"}
        </span>
        {expanded ? (
          <ChevronDown size={12} style={{ color: "var(--color-ink3)" }} />
        ) : (
          <ChevronRight size={12} style={{ color: "var(--color-ink3)" }} />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          className="border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          {/* Input */}
          {part.input != null && (
            <div className="px-3 pt-2 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-ink3)" }}>
                Input
              </p>
              <pre
                className="text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-words rounded p-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--color-s2)",
                  color: "var(--color-ink2)",
                }}
              >
                {JSON.stringify(part.input, null, 2)}
              </pre>
            </div>
          )}

          {/* Output */}
          {part.output != null && (
            <div className="px-3 pt-1 pb-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-ink3)" }}>
                Output
              </p>
              <pre
                className="text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-words rounded p-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: isError ? "var(--color-red-bg)" : "var(--color-s2)",
                  color: isError ? "var(--color-red)" : "var(--color-ink2)",
                }}
              >
                {JSON.stringify(part.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    const text = message.parts
      ?.filter((p): p is TextPart => p.type === "text" && typeof (p as { text?: unknown }).text === "string")
      .map((p) => p.text)
      .join("") ?? "";

    return (
      <div className="flex items-end gap-2 py-1.5 animate-msg-in flex-row-reverse">
        <div
          className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
          style={{ background: "var(--color-gold)", color: "#fff" }}
        >
          U
        </div>
        <div
          className="max-w-[70%] px-3 py-2 text-sm leading-relaxed rounded-2xl rounded-br-sm"
          style={{ background: "var(--color-ink)", color: "#fff" }}
        >
          <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
          {message.createdAt && (
            <p className="text-[10px] mt-1 opacity-60">{formatRelativeTime(message.createdAt)}</p>
          )}
        </div>
      </div>
    );
  }

  // Assistant message — render parts
  return (
    <div className="flex items-start gap-2 py-1.5 animate-msg-in">
      <div
        className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
        style={{ background: "var(--color-s3)", color: "var(--color-ink3)" }}
      >
        AI
      </div>
      <div className="flex-1 min-w-0">
        {message.parts?.map((part, i) => {
          if (part.type === "text" && typeof (part as { text?: unknown }).text === "string") {
            return (
              <div key={i} className="leading-relaxed">
                {renderMarkdown((part as TextPart).text)}
              </div>
            );
          }
          if (part.type.startsWith("tool-")) {
            return <ToolCallBlock key={i} part={part as ToolPart} />;
          }
          return null;
        })}
        {message.createdAt && (
          <p className="text-[10px] mt-1.5" style={{ color: "var(--color-ink4)" }}>
            {formatRelativeTime(message.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
