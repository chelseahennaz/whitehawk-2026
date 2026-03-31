import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image_url: string;
  category: string;
  featured: boolean;
  published_at: string;
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
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  tier: string;
  website_url: string;
  position: number;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

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
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Player[];
    },
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
