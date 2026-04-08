"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useToastsStore } from "@/store/toasts.store";
import { nanoid } from "@/lib/utils/nanoid";
import { useCallback, useMemo, useRef } from "react";

interface UseNeuvéraChatOptions {
  agentType: "prospecting" | "engagement";
}

export function useNeuvéraChat({ agentType }: UseNeuvéraChatOptions) {
  const conversationIdRef = useRef<string>(nanoid());
  const conversationId = conversationIdRef.current;

  const setConversation = useWorkspaceStore((s) => s.setConversation);
  const addToast = useToastsStore((s) => s.addToast);

  // Stable transport — avoids re-creating the object on every render,
  // which would cause useChat to re-initialize the session.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { agentType, conversationId },
      }),
    // agentType and conversationId are stable for the lifetime of this hook instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [agentType, conversationId]
  );

  // Stable error handler — avoids a new function reference on every render.
  const handleError = useCallback(
    (error: Error) => {
      addToast({
        type: "error",
        title: "Chat error",
        description: error.message,
      });
    },
    [addToast]
  );

  const chat = useChat({
    transport,
    id: conversationId,
    onError: handleError,
  });

  return {
    ...chat,
    conversationId,
    agentType,
  };
}
