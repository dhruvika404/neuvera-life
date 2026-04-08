"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useToastsStore } from "@/store/toasts.store";
import { createClient } from "@/lib/supabase/client";
import { generateUUID } from "@/lib/utils/uuid";
import { useCallback, useEffect, useMemo, useState } from "react";

// Use 'any' for now to bypass strict AI SDK type issues in recent versions
// while ensuring the functionality remains intact.
type Message = any;

interface UseNeuveraChatOptions {
  agentType: "prospecting" | "engagement";
  initialConversationId?: string | null;
  leadId?: string | null;
  campaignId?: string | null;
  icpId?: string | null;
}

export function useNeuveraChat({ agentType, initialConversationId, leadId, campaignId, icpId }: UseNeuveraChatOptions) {
  const [conversationId, setConversationId] = useState<string>(() => initialConversationId || generateUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [status, setStatus] = useState<"idle" | "streaming" | "submitted" | "waiting">("idle");

  const addToast = useToastsStore((s) => s.addToast);

  // Sync conversationId with prop change
  useEffect(() => {
    if (initialConversationId) {
      setConversationId(initialConversationId);
    } else {
      // If we're starting fresh, generate a new ID
      setConversationId(generateUUID());
    }
  }, [initialConversationId]);

  // Fetch history and Realtime Subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    async function fetchHistory() {
      setIsLoadingHistory(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedMessages: Message[] = data.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content || "",
            createdAt: new Date(m.created_at),
            parts: m.role === "assistant" && m.metadata?.tool_calls 
              ? [
                  { type: "text", text: m.content || "" },
                  ...m.metadata.tool_calls.map((tc: any) => ({
                    type: `tool-${tc.name}`,
                    toolCallId: tc.toolCallId || `tc_${Math.random().toString(36).slice(2, 10)}`,
                    toolName: tc.name,
                    state: "output-available"
                  }))
                ]
              : [{ type: "text", text: m.content || "" }]
          }));
          setMessages(formattedMessages);
        } else {
          console.log("[useNeuveraChat] No history found (new conversation)");
          setMessages([]);
        }
      } catch (err: any) {
        console.error("[useNeuveraChat] Failed to fetch history:", err);
        addToast({
          type: "error",
          title: "Session Error",
          description: "Could not load prior message history.",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    }

    fetchHistory();
  }, [conversationId, addToast]);

  // Phase 2: Dynamic Polling Fallback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === "waiting") {
      console.log("[useNeuveraChat] Waiting for AI generation (initial 5s gap)...");
      
      // Start polling after a short initial delay
      const startPolling = () => {
        interval = setInterval(async () => {
          console.log("[useNeuveraChat] Dynamic poll: Checking for AI response in DB...");
          const supabase = createClient();
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

          if (!error && data) {
            const hasAssistant = data.some(m => m.role === "assistant");
            if (hasAssistant) {
              console.log("[useNeuveraChat] AI response found! Updating UI now.");
              
              const formattedMessages: Message[] = data.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content || "",
                createdAt: new Date(m.created_at),
                parts: m.role === "assistant" && m.metadata?.tool_calls 
                  ? [
                      { type: "text", text: m.content || "" },
                      ...m.metadata.tool_calls.map((tc: any) => ({
                        type: `tool-${tc.name}`,
                        toolCallId: tc.toolCallId || `tc_${Math.random().toString(36).slice(2, 10)}`,
                        toolName: tc.name,
                        state: "output-available"
                      }))
                    ]
                  : [{ type: "text", text: m.content || "" }]
              }));
              
              setMessages(formattedMessages);
              setStatus("idle");
              clearInterval(interval);
            }
          }
        }, 3000);
      };

      // Initial 5s delay before first poll, then poll every 3s
      const initialTimeout = setTimeout(startPolling, 5000);

      return () => {
        clearTimeout(initialTimeout);
        if (interval) clearInterval(interval);
      };
    }
  }, [status, conversationId]);

  // Realtime Subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    console.log("[useNeuveraChat] Setting up Realtime sync for messages in:", conversationId);
    const supabase = createClient();
    const subscription = supabase
      .channel(`chat_sync_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for both INSERT and UPDATE
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          console.log("[useNeuveraChat] Realtime message event:", payload.eventType, newMessage.role);

          setMessages((prev) => {
            const existingIndex = prev.findIndex((m) => m.id === newMessage.id);
            
            const formatted: Message = {
              id: newMessage.id,
              role: newMessage.role,
              content: newMessage.content || "",
              createdAt: new Date(newMessage.created_at),
              parts: [{ type: "text", text: newMessage.content || "" }]
            };

            // If assistant message arrived or was updated, stop the loading status
            if (newMessage.role === "assistant") {
              setStatus("idle");
            }

            if (existingIndex > -1) {
              // Update existing message
              const next = [...prev];
              next[existingIndex] = formatted;
              return next;
            } else {
              // Append new message
              return [...prev, formatted];
            }
          });
        }
      )
      .subscribe();

    return () => {
      console.log("[useNeuveraChat] Cleaning up Realtime message subscription");
      supabase.removeChannel(subscription);
    };
  }, [conversationId]);

  const sendMessage = useCallback(async ({ text }: { text: string }) => {
    if (!text.trim()) return;

    setStatus("submitted");
    const userMessage: Message = {
      id: generateUUID(),
      role: "user",
      content: text,
      createdAt: new Date(),
      parts: [{ type: "text", text }]
    };

    // Optimistic update
    setMessages(prev => [...prev, userMessage]);

    try {
      const supabase = createClient();
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthenticated. Please sign in again.");

      // 1. Try to get orgId from organization_memberships
      const { data: orgMemberData } = await supabase
        .from("organization_memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      
      let orgId = orgMemberData?.organization_id;

      // 2. Fallback: Try to get orgId from profiles (org_id column)
      if (!orgId) {
        const { data: profileData }: any = await supabase
          .from("profiles")
          .select("org_id")
          .eq("id", user.id)
          .maybeSingle();
        orgId = profileData?.org_id;
      }

      if (!orgId) {
        console.error("[useNeuveraChat] No organization ID found for user:", user.id);
        throw new Error("Your account is not associated with an organization. Please contact support.");
      }

      console.log("[useNeuveraChat] Using Organization ID:", orgId);

      // Always UPSERT the conversation record to ensure it exists before message insertion.
      // This prevents Foreign Key violations (23503) if local state and DB are out of sync.
      const convData: any = {
        id: conversationId,
        organization_id: orgId,
        agent_type: agentType,
        user_id: user.id,
        lead_id: leadId,
        campaign_id: campaignId,
        icp_id: icpId,
        status: "open",
        updated_at: new Date().toISOString(),
      };

      // Only set title if it's the first message or if it's a new conversation
      // To preserve manually changed titles (if any), but here we use the first message
      if (messages.length === 0) {
        convData.title = text.slice(0, 60);
      }

      const { error: convError } = await supabase
        .from("conversations")
        .upsert(convData, { onConflict: "id" });

      if (convError) {
        console.error("[useNeuveraChat] Conversation storage failed:", convError);
        throw convError;
      }

      // 2. Handle Message Entry (ID based)
      const msgData: any = {
        id: userMessage.id,
        conversation_id: conversationId,
        organization_id: orgId,
        user_id: user.id,
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      };

      const { error: msgError } = await supabase
        .from("messages")
        .insert(msgData);

      if (msgError) {
        console.error("[useNeuveraChat] Message storage failed:", msgError);
        throw msgError;
      }

      // Transition to waiting status for AI response
      setStatus("waiting");

    } catch (err: any) {
      console.error("[useNeuveraChat] Failed to send message:", err);
      addToast({
        type: "error",
        title: "Send Error",
        description: err.message || "Failed to save message to database.",
      });
      setStatus("idle");
    }
  }, [conversationId, agentType, leadId, campaignId, icpId, messages.length, addToast]);

  return {
    messages,
    sendMessage,
    setMessages,
    conversationId,
    agentType,
    isLoadingHistory,
    status,
    isLoading: false,
    input: "",
    setInput: () => {},
    handleSubmit: () => {},
  };
}
