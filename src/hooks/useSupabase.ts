import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/Product";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image_url: string;
  image_offset?: number;
  category: string;
  featured: boolean;
  published_at: string;
  status?: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  appearances: number;
  goals: number;
  assists: number;
  team_slug: string;
  photo_url: string;
  is_active: boolean;
  order_index: number;
  bio?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  tier: string;
  website_url: string;
  position: number;
  is_visible: boolean;
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  department: string;
  type: 'football' | 'club';
  image_url: string;
  is_active: boolean;
  is_honorary?: boolean;
  order_index: number;
  bio?: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}

export const usePosts = (publishedOnly: boolean = false) => {
  return useQuery({
    queryKey: ["posts", publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("id, title, slug, excerpt, image_url, image_offset, category, featured, published_at, status")
        .order("published_at", { ascending: false });

      if (publishedOnly) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Post[];
    },
  });
};

export const usePlayers = (teamSlug: string = "mens-first-team") => {
  return useQuery({
    queryKey: ["players", teamSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("team_slug", teamSlug)
        .order("order_index", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Player[];
    },
  });
};

export const usePlayerById = (id: string) => {
  return useQuery({
    queryKey: ["player", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Player;
    },
    enabled: !!id,
  });
};

export const useSponsors = () => {
  return useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Sponsor[];
    },
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["posts", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Post;
    },
    enabled: !!slug,
  });
};

export const useSettings = (key: string) => {
  return useQuery({
    queryKey: ["settings", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return data as SiteSettings;
    },
  });
};

export const useSettingsHiddenVideos = () => {
  return useQuery({
    queryKey: ["hidden-videos-v3"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_visibility")
        .select("id");

      if (error) throw error;
      return data.map((v) => v.id) as string[];
    },
  });
};

export const performVisibilityToggle = async (videoId: string, isCurrentlyHidden: boolean) => {
  if (isCurrentlyHidden) {
    const { error } = await supabase
      .from("video_visibility")
      .delete()
      .eq("id", videoId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("video_visibility")
      .upsert({ id: videoId });
    if (error) throw error;
  }
};

export const usePersonnel = (type?: 'football' | 'club') => {
  return useQuery({
    queryKey: ["personnel", type],
    queryFn: async () => {
      let query = supabase
        .from("personnel")
        .select("*")
        .order("order_index", { ascending: true })
        .order("name", { ascending: true });

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Personnel[];
    },
  });
};

export const usePersonnelById = (id: string) => {
  return useQuery({
    queryKey: ["personnel-member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personnel")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Personnel;
    },
    enabled: !!id,
  });
};

export const updateItemsOrder = async (table: string, updates: { id: string; order_index: number }[]) => {
  // Perform individual updates to avoid overwriting other columns.
  const promises = updates.map((item) =>
    supabase.from(table).update({ order_index: item.order_index }).eq('id', item.id)
  );
  const results = await Promise.all(promises);
  const error = results.find((r) => r.error);
  if (error) throw error.error;
  return true;
};

export const fetchAdminUsers = async () => {
  const { data, error } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addAdminUser = async (email: string, roles: string[]) => {
  const { data, error } = await supabase.from('admin_users').insert({ email, roles });
  if (error) throw error;
  return data;
};

export const updateAdminRoles = async (id: string, roles: string[]) => {
  const { error } = await supabase.from('admin_users').update({ roles }).eq('id', id);
  if (error) throw error;
};

export const deleteAdminUser = async (id: string) => {
  const { error } = await supabase.from('admin_users').delete().eq('id', id);
  if (error) throw error;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        category: item.category,
        image: item.image,
        description: item.description,
        badge: item.badge || undefined,
        sizes: item.sizes || [],
        stripeMockUrl: item.stripe_mock_url || undefined,
      })) as Product[];
    },
  });
};
