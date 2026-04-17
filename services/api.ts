const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:1337';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string>) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  return res.json();
}

export interface FeedItem {
  id: string;
  type: 'memorial' | 'contribution';
  full_name?: string;
  slug?: string;
  template?: string;
  slogan?: string;
  profile_image?: { url: string; alternativeText?: string } | null;
  dates?: { birth: string; death: string } | null;
  content_type?: string;
  text_content?: string | null;
  author?: { username: string; first_name?: string; last_name?: string } | null;
  tombstone?: {
    full_name: string;
    slug: string;
    template: string;
    profile_image?: { url: string; alternativeText?: string } | null;
  } | null;
  timestamp: string;
}

export interface MemorialDetail {
  id: string;
  full_name: string;
  slogan: string | null;
  biography: string | null;
  dates: { birth: string; death: string } | null;
  template: 'classic' | 'elegant' | 'modern';
  slug: string;
  profile_image: { url: string; alternativeText?: string } | null;
  cover_image: { url: string; alternativeText?: string } | null;
  connections: Array<{
    relation_type: string;
    user: { username: string; first_name?: string; last_name?: string };
  }>;
  contributions: Array<{
    id: string;
    content_type: string;
    text_content: string | null;
    author: { username: string; first_name?: string; last_name?: string } | null;
    createdAt: string;
  }>;
  stats: { total: number; flowers: number; candles: number; memories: number };
}

export interface FeedResponse {
  data: FeedItem[];
  meta: { page: number; pageSize: number; total: number };
}

export const api = {
  getFeed: (page = 1, pageSize = 20) =>
    fetchApi<FeedResponse>(`/api/tombstones/feed?page=${page}&pageSize=${pageSize}`),

  getMemorial: (slug: string) =>
    fetchApi<{ data: MemorialDetail }>(`/api/tombstones/tombstone/${slug}`),

  createContribution: (slug: string, content_type: string, text_content?: string) =>
    fetchApi<{ data: any }>(`/api/tombstones/tombstone/${slug}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ content_type, text_content }),
    }),
};
