import { Platform } from 'react-native';
import { storage } from './storage';

const API_BASE = Platform.OS === 'web' 
  ? 'http://127.0.0.1:1337' 
  : (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:1337');


async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = await storage.getItem('userToken');
  const fullUrl = `${API_BASE}${endpoint}`;


  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`💥 [API] Error ${res.status} on ${fullUrl}:`, text);
      throw new Error(`API Error ${res.status}: ${text}`);
    }
    return res.json();
  } catch (err: any) {
    console.error(`❌ [API] Connection failed to ${fullUrl}:`, err.message);
    throw err;
  }
}

export function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buongiorno';
  if (h < 18) return 'Buon pomeriggio';
  return 'Buonasera';
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
  city?: string | null;
  memorial_type?: string | null;
  animal_type?: string | null;
  content_type?: string;
  text_content?: string | null;
  author?: { username: string; first_name?: string; last_name?: string } | null;
  is_anonymous?: boolean;
  tombstone?: {
    full_name: string;
    slug: string;
    template: string;
    profile_image?: { url: string; alternativeText?: string } | null;
  } | null;
  timestamp: string;
}

export interface CustomizationData {
  primary_color?: string;
  background_color?: string;
  font_family?: string;
  hide_stats?: boolean;
  hide_biography?: boolean;
  border_radius?: string;
  card_bg_color?: string;
}

export interface MemorialDetail {
  id: string;
  full_name: string;
  slogan: string | null;
  biography: string | null;
  dates: { birth: string; death: string } | null;
  template: 'classic' | 'elegant' | 'modern';
  customization: CustomizationData | null;
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
    is_anonymous?: boolean;
    createdAt: string;
    event_date: string | null;
  }>;
  stats: { total: number; flowers: number; candles: number; memories: number };
  city: string | null;
  type: 'persona' | 'animale';
  animal_type: string | null;
  funeral_home: string | null;
}

export interface FeedResponse {
  data: FeedItem[];
  meta: { page: number; pageSize: number; total: number };
}

export interface ExploreResponse {
  data: MemorialDetail[];
}

export const api = {
  getFeed: (page = 1, pageSize = 20) =>
    fetchApi<FeedResponse>(`/api/tombstones/feed?page=${page}&pageSize=${pageSize}`),

  getMemorial: (slug: string) =>
    fetchApi<{ data: MemorialDetail }>(`/api/tombstones/tombstone/${slug}`),

  getMemorials: async (filters?: { type?: string; city?: string; search?: string }): Promise<MemorialDetail[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.city) params.set('city', filters.city);
    if (filters?.search) params.set('search', filters.search);
    const res = await fetchApi<ExploreResponse>(`/api/tombstones/explore?${params.toString()}`);
    return res.data || [];
  },

  createContribution: (slug: string, content_type: string, text_content?: string, event_date?: string, is_anonymous?: boolean) =>
    fetchApi<{ data: any }>(`/api/tombstones/tombstone/${slug}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ content_type, text_content, event_date, is_anonymous }),
    }),

  login: (data: any) =>
    fetchApi<{ jwt: string; user: any }>('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: any) =>
    fetchApi<{ jwt: string; user: any }>('/api/auth/local/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: (token?: string) =>
    fetchApi<any>('/api/users/me', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    }),
};
