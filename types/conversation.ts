export type MessageRole = "user" | "assistant" | "tool";
export type ArtifactType = "lead_list" | "icp_summary" | "email_sequence";

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  toolCallId?: string | null;
  artifactType?: ArtifactType | null;
  artifactData?: unknown;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  agentType: "prospecting" | "engagement";
  title?: string | null;
  icpId?: string | null;
  tokenCostInput: number;
  tokenCostOutput: number;
  blobUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
