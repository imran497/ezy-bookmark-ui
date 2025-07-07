export interface APITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  favicon?: string;
  addedBy: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateToolDto {
  url: string;
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  favicon?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  toolId: string;
  isPinned: boolean;
  createdAt: string;
  tool?: APITool;
}

export interface ToolsResponse {
  data: APITool[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}