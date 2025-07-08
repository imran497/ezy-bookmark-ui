import { APITool, CreateToolDto, Bookmark, ToolsResponse, QueryParams } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getTokenFunction: (() => Promise<string | null>) | null = null;

  setTokenFunction(tokenFn: () => Promise<string | null>) {
    this.getTokenFunction = tokenFn;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      if (this.getTokenFunction) {
        const token = await this.getTokenFunction();
        if (token) {
          return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          };
        }
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    
    return {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(url, {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If we can't parse the error response, use the default message
      }
      
      // Handle authentication errors specifically
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          // Redirect to sign-in page on authentication failure
          window.location.href = '/sign-in';
        }
        throw new Error('Authentication required. Please sign in again.');
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Tools API
  async getTools(params: QueryParams = {}): Promise<ToolsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<ToolsResponse>(`/tools${query ? `?${query}` : ''}`);
  }

  async getTool(id: string): Promise<APITool> {
    return this.request<APITool>(`/tools/${id}`);
  }

  async createTool(tool: CreateToolDto): Promise<APITool> {
    return this.request<APITool>('/tools', {
      method: 'POST',
      body: JSON.stringify(tool),
    });
  }

  async updateTool(id: string, tool: Partial<CreateToolDto>): Promise<APITool> {
    return this.request<APITool>(`/tools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(tool),
    });
  }

  async deleteTool(id: string): Promise<void> {
    return this.request<void>(`/tools/${id}`, {
      method: 'DELETE',
    });
  }

  async incrementToolUsage(id: string): Promise<void> {
    return this.request<void>(`/tools/${id}/visit`, {
      method: 'POST',
    });
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/tools/categories');
  }

  async getPopularTools(): Promise<APITool[]> {
    return this.request<APITool[]>('/tools/popular');
  }

  async getToolsByCategories(limit: number = 8): Promise<Record<string, APITool[]>> {
    return this.request<Record<string, APITool[]>>(`/tools/by-category?limit=${limit}`);
  }

  // Bookmarks API (now uses authenticated endpoints)
  async getUserBookmarks(): Promise<Bookmark[]> {
    return this.request<Bookmark[]>('/bookmarks');
  }

  async getUserPinnedTools(): Promise<Bookmark[]> {
    return this.request<Bookmark[]>('/bookmarks/pinned');
  }

  async createBookmark(toolId: string, isPinned: boolean = false): Promise<Bookmark> {
    return this.request<Bookmark>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ toolId, isPinned }),
    });
  }

  async togglePin(toolId: string, isPinned: boolean): Promise<Bookmark> {
    return this.request<Bookmark>(`/bookmarks/${toolId}/pin`, {
      method: 'PATCH',
      body: JSON.stringify({ isPinned }),
    });
  }

  async bulkTogglePin(toolIds: string[], isPinned: boolean): Promise<Bookmark[]> {
    // Since the backend doesn't support bulk operations yet, we'll do individual calls
    const promises = toolIds.map(toolId => this.togglePin(toolId, isPinned));
    return Promise.all(promises);
  }

  async removeBookmark(toolId: string): Promise<void> {
    return this.request<void>(`/bookmarks/${toolId}`, {
      method: 'DELETE',
    });
  }

  async getBookmarkStatus(toolId: string): Promise<{ isBookmarked: boolean; isPinned: boolean }> {
    return this.request<{ isBookmarked: boolean; isPinned: boolean }>(`/bookmarks/status?toolId=${toolId}`);
  }
}

export const apiClient = new ApiClient();