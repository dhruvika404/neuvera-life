"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { WorkspaceTopBar } from "./WorkspaceTopBar";
import { ChatMessage } from "./center/ChatMessage";
import { ChatComposer } from "./center/ChatComposer";
import { TypingIndicator } from "./center/TypingIndicator";
import { useNeuveraChat } from "@/hooks/useNeuveraChat";
import { MessageSquare, FolderOpen, Zap, CheckCircle, Loader2, AlertCircle, Plus } from "lucide-react";
import { LibraryPanel } from "./left/LibraryPanel";
import { createClient } from "@/lib/supabase/client";
import { generateUUID } from "@/lib/utils/uuid";
import { LibraryCanvas, CanvasState } from "./center/LibraryCanvas";

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

interface ToolActivity {
  toolCallId: string;
  toolName: string;
  state: "running" | "done" | "error";
  startedAt: number;
}

export function WorkspaceOverlay() {
  const { 
    closeWorkspace, 
    activeAgent, 
    activeConversationId, 
    setConversation, 
    activeLeftTab, 
    setLeftTab,
    activeLeadId,
    activeCampaignId,
    activeIcpId
  } = useWorkspaceStore();
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistoryList, setIsLoadingHistoryList] = useState(false);
  const [activeCanvas, setActiveCanvas] = useState<CanvasState | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toolPanelEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, isLoadingHistory } = useNeuveraChat({
    agentType: activeAgent ?? "prospecting",
    initialConversationId: activeConversationId,
    leadId: activeLeadId,
    campaignId: activeCampaignId,
    icpId: activeIcpId,
  });

  const fetchHistoryList = useCallback(async () => {
    if (activeLeftTab !== "history" || !activeAgent) return;
    setIsLoadingHistoryList(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("agent_type", activeAgent)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("History list error:", error);
        throw error;
      }
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch history list:", err);
    } finally {
      setIsLoadingHistoryList(false);
    }
  }, [activeLeftTab, activeAgent]);

  // Initial fetch and Realtime Subscription
  useEffect(() => {
    fetchHistoryList();

    if (activeLeftTab !== "history" || !activeAgent) return;

    const supabase = createClient();
    const subscription = supabase
      .channel(`conversations_sync_${activeAgent}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `agent_type=eq.${activeAgent}`,
        },
        (payload) => {
          fetchHistoryList();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeLeftTab, activeAgent, fetchHistoryList]);

  const isStreaming = status === "streaming" || status === "submitted" || status === "waiting";

  // Auto-scroll chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Collect all tool parts across all messages for the right panel
  const toolActivities: ToolActivity[] = [];
  for (const msg of messages) {
    if (msg.role !== "assistant") continue;
    for (const part of msg.parts ?? []) {
      if (!part.type.startsWith("tool-")) continue;
      const p = part as { type: string; toolCallId: string; toolName?: string; state?: string };
      const toolName = p.toolName ?? p.type.slice(5);
      const existing = toolActivities.find((t) => t.toolCallId === p.toolCallId);
      if (existing) {
        existing.state = p.state === "output-available" ? "done" : p.state === "output-error" ? "error" : "running";
      } else {
        toolActivities.push({
          toolCallId: p.toolCallId,
          toolName,
          state: p.state === "output-available" ? "done" : p.state === "output-error" ? "error" : "running",
          startedAt: 0,
        });
      }
    }
  }

  // Auto-scroll tool panel when new tools appear
  useEffect(() => {
    toolPanelEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [toolActivities.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;
    const text = inputValue;
    setInputValue("");
    await sendMessage({ text });
  };

  return (
    <div 
      className="flex flex-1 flex-col overflow-hidden animate-workspace-in"
      style={{
        height: "calc(100vh - var(--topbar-h))",
        background: "var(--color-surface)",
      }}
    >
      <WorkspaceTopBar />

      {/* Three-column content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — History / Library */}
        <div
          className="shrink-0 border-r flex flex-col overflow-hidden"
          style={{
            width: 210,
            background: "var(--color-s2)",
            borderColor: "var(--color-border)",
          }}
        >
          {/* Tab headers */}
          <div className="flex border-b shrink-0" style={{ borderColor: "var(--color-border)" }}>
            {(["history", "library"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium capitalize transition-colors border-b-2"
                style={{
                  borderBottomColor: activeLeftTab === tab ? "var(--color-gold)" : "transparent",
                  color: activeLeftTab === tab ? "var(--color-ink)" : "var(--color-ink3)",
                  background: "transparent",
                }}
              >
                {tab === "history" ? <MessageSquare size={12} /> : <FolderOpen size={12} />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeLeftTab === "history" ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-3 pb-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                <button
                  onClick={() => {
                    setConversation(generateUUID());
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all hover:bg-[var(--color-s2)] active:scale-[0.98]"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-ink)",
                  }}
                >
                  <Plus size={14} />
                  New Agent Run
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {isLoadingHistoryList ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--color-ink4)" }} />
                    <span className="text-[10px]" style={{ color: "var(--color-ink4)" }}>Loading history...</span>
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: "var(--color-ink4)" }}>
                    No conversations yet
                  </p>
                ) : (
                  history.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setConversation(conv.id, { 
                          leadId: conv.lead_id, 
                          campaignId: conv.campaign_id, 
                          icpId: conv.icp_id 
                        })}
                        className={`rounded-md px-2.5 py-2 cursor-pointer transition-all border ${
                          isActive ? "shadow-sm" : ""
                        }`}
                        style={{ 
                          background: isActive ? "var(--color-surface)" : "transparent",
                          borderColor: isActive ? "var(--color-gold-l)" : "transparent"
                        }}
                      >
                        <p 
                          className="text-[11px] font-medium truncate" 
                          style={{ color: isActive ? "var(--color-ink)" : "var(--color-ink3)" }}
                        >
                          {conv.title || "Untitled Run"}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{ color: "var(--color-ink4)" }}>
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              <LibraryPanel 
                agentType={(activeAgent ?? "prospecting") as "prospecting" | "engagement"} 
                onSelect={(folderId, fileId) => {
                  console.log("[WorkspaceOverlay] Library item selected:", { folderId, fileId });
                  setActiveCanvas({ folderId, fileId });
                }}
              />
            </div>
          )}
        </div>

        {activeLeftTab === "history" ? (
          <>
            {/* Center — Chat */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: "#1E1C18", border: "0.5px solid #3A3530" }}
                    >
                      <Zap size={24} style={{ color: "var(--color-gold)" }} />
                    </div>
                    <div>
                      <p
                        className="text-base font-semibold"
                        style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
                      >
                        {activeAgent === "prospecting" ? "Prospecting Agent" : "Engagement Agent"}
                      </p>
                      <p className="text-sm mt-1 max-w-xs" style={{ color: "var(--color-ink3)" }}>
                        {activeAgent === "prospecting"
                          ? "I discover leads from Apollo.io filtered by your active ICP, build lead lists, and queue them for enrichment."
                          : "I manage outreach via Instantly.ai and HeyReach, enrich contacts through Clay, and sync qualified leads into HubSpot CRM."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-sm">
                      {(activeAgent === "prospecting"
                        ? [
                            "Find skincare founders in US with $2M+ ARR",
                            "Create an ICP lead list — 50 contacts",
                            "Show leads discovered in the last 24 hours",
                            "Filter leads by Series A funding stage",
                          ]
                        : [
                            "Show reply rate for Sequence #4",
                            "Create a new 3-step email sequence",
                            "Which leads opened but have not replied in 48h?",
                            "Push enriched leads from Clay to HubSpot",
                          ]
                      ).map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            sendMessage({ text: suggestion });
                          }}
                          className="px-4 py-2 text-[12px] transition-all hover:shadow-sm"
                          style={{
                            background: "var(--color-surface)",
                            border: "0.5px solid var(--color-border)",
                            borderRadius: "20px",
                            color: "var(--color-ink2)",
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isStreaming && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="shrink-0 px-4 pt-3 pb-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                {/* Quick hint pills */}
                <div className="flex gap-1.5 pb-2 flex-wrap">
                  {(activeAgent === "prospecting"
                    ? [
                        { label: "ICP list · 50 founders", text: "Create ICP list of 50 DTC beauty founders" },
                        { label: "Enrich top 20", text: "Enrich top 20 leads from Skincare Founders ICP" },
                        { label: "Filter Series A", text: "Filter leads by Series A funding stage" },
                        { label: "Export CSV", text: "Export current lead list to CSV" },
                      ]
                    : [
                        { label: "Reply rate today", text: "Show reply rate breakdown for today" },
                        { label: "New sequence", text: "Create a new 3-step email sequence" },
                        { label: "Follow-up 48h", text: "Send follow-ups to leads who opened but did not reply in 48h" },
                        { label: "→ HubSpot", text: "Push enriched leads to HubSpot CRM" },
                      ]
                  ).map((hint) => (
                    <button
                      key={hint.label}
                      onClick={() => {
                        setInputValue(hint.text);
                      }}
                      className="px-2.5 py-1 text-[10.5px] rounded-md transition-colors hover:opacity-80"
                      style={{
                        background: "var(--color-s3)",
                        color: "var(--color-ink3)",
                        border: "0.5px solid var(--color-border)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {hint.label}
                    </button>
                  ))}
                </div>

                <ChatComposer
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSubmit}
                  isStreaming={isStreaming}
                  placeholder={
                    activeAgent === "prospecting"
                      ? "Describe your ideal customer..."
                      : "Describe the campaign you want to run..."
                  }
                />
              </div>
            </div>

            {/* Right panel — Tool Activity */}
            <div
              className="w-64 shrink-0 border-l flex flex-col overflow-hidden"
              style={{
                background: "var(--color-s2)",
                borderColor: "var(--color-border)",
              }}
            >
              <div
                className="px-4 py-3 border-b shrink-0 flex items-center gap-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Zap size={13} style={{ color: "var(--color-ink3)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-ink)" }}>
                  Tool Activity
                </span>
                {toolActivities.length > 0 && (
                  <span
                    className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--color-s3)", color: "var(--color-ink3)" }}
                  >
                    {toolActivities.length}
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {toolActivities.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: "var(--color-ink4)" }}>
                    Tool calls appear here during execution
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {toolActivities.map((tool, i) => {
                      const label = TOOL_LABELS[tool.toolName] ?? tool.toolName.replace(/_/g, " ");
                      return (
                        <div
                          key={tool.toolCallId}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg border"
                          style={{
                            background: "var(--color-surface)",
                            borderColor:
                              tool.state === "done"
                                ? "var(--color-border)"
                                : tool.state === "error"
                                ? "var(--color-red)"
                                : "var(--color-gold-l)",
                          }}
                        >
                          <span
                            className="text-[10px] font-mono shrink-0 w-4 text-right"
                            style={{ color: "var(--color-ink4)" }}
                          >
                            {i + 1}
                          </span>
                          {tool.state === "running" ? (
                            <Loader2
                              size={12}
                              className="animate-spin shrink-0"
                              style={{ color: "var(--color-amber)" }}
                            />
                          ) : tool.state === "done" ? (
                            <CheckCircle size={12} className="shrink-0" style={{ color: "var(--color-green)" }} />
                          ) : (
                            <AlertCircle size={12} className="shrink-0" style={{ color: "var(--color-red)" }} />
                          )}
                          <span className="text-[11px] leading-tight truncate" style={{ color: "var(--color-ink)" }}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                    {isStreaming && (
                      <div
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
                        style={{ background: "var(--color-s3)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                          style={{ background: "var(--color-gold)" }}
                        />
                        <span className="text-[11px]" style={{ color: "var(--color-ink3)" }}>
                          Agent thinking…
                        </span>
                      </div>
                    )}
                    <div ref={toolPanelEndRef} />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <LibraryCanvas 
              canvas={activeCanvas || { folderId: "root" }} 
              onBack={() => setLeftTab("history")} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
