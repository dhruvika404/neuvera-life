import { create } from "zustand";

export type AgentType = "prospecting" | "engagement";
export type LeftTab = "history" | "library";

interface WorkspaceState {
  isOpen: boolean;
  activeAgent: AgentType | null;
  activeConversationId: string | null;
  activeLeadId: string | null;
  activeCampaignId: string | null;
  activeIcpId: string | null;
  activeLeftTab: LeftTab;
  libraryPath: string[];
}

interface WorkspaceActions {
  openWorkspace: (
    agent: AgentType,
    conversationId?: string,
    context?: { leadId?: string; campaignId?: string; icpId?: string }
  ) => void;
  closeWorkspace: () => void;
  setConversation: (id: string, context?: { leadId?: string; campaignId?: string; icpId?: string }) => void;
  setLeftTab: (tab: LeftTab) => void;
  navigateLibrary: (folder: string) => void;
  navigateLibraryBack: () => void;
  resetLibraryPath: () => void;
}

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>((set) => ({
  isOpen: false,
  activeAgent: null,
  activeConversationId: null,
  activeLeadId: null,
  activeCampaignId: null,
  activeIcpId: null,
  activeLeftTab: "history",
  libraryPath: [],

  openWorkspace: (agent, conversationId, context) =>
    set({
      isOpen: true,
      activeAgent: agent,
      activeConversationId: conversationId ?? null,
      activeLeadId: context?.leadId ?? null,
      activeCampaignId: context?.campaignId ?? null,
      activeIcpId: context?.icpId ?? null,
    }),

  closeWorkspace: () =>
    set({
      isOpen: false,
      activeAgent: null,
      activeConversationId: null,
      activeLeadId: null,
      activeCampaignId: null,
      activeIcpId: null,
    }),

  setConversation: (id, context) =>
    set({
      activeConversationId: id,
      activeLeadId: context?.leadId ?? null,
      activeCampaignId: context?.campaignId ?? null,
      activeIcpId: context?.icpId ?? null,
    }),

  setLeftTab: (tab) => set({ activeLeftTab: tab }),

  navigateLibrary: (folder) =>
    set((s) => ({ libraryPath: [...s.libraryPath, folder] })),

  navigateLibraryBack: () =>
    set((s) => ({ libraryPath: s.libraryPath.slice(0, -1) })),

  resetLibraryPath: () => set({ libraryPath: [] }),
}));
