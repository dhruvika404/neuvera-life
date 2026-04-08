export type AgentType = "prospecting" | "engagement";
export type LeftTab = "history" | "library";

export interface LibraryItem {
  id: string;
  name: string;
  type: "folder" | "lead_list" | "sequence" | "report" | "icp";
  itemCount?: number;
  createdAt?: Date;
}

export interface LibraryFolder extends LibraryItem {
  type: "folder";
  children?: LibraryItem[];
}

export interface WorkspaceState {
  isOpen: boolean;
  activeAgent: AgentType | null;
  activeConversationId: string | null;
  activeLeftTab: LeftTab;
  libraryPath: string[];
}
