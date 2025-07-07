export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  addedBy: string;
  addedAt: Date;
  usageCount: number;
  isPinned?: boolean;
  favicon?: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  toolId: string;
  isPinned: boolean;
  addedAt: Date;
}

export interface ToolStats {
  toolId: string;
  totalUsers: number;
  totalBookmarks: number;
  categoryRank: number;
}