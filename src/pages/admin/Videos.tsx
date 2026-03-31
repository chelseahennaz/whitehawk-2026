import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsHiddenVideos, performVisibilityToggle } from "@/hooks/useSupabase";
import { Eye, EyeOff, Loader2, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

const fetchYoutubeFeed = async () => {
  const CHANNEL_ID = "UCley7B4XSy1S-bd7Sed-SEw";
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
  
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch videos from YouTube");
  const data = await response.json();
  
  return data.items.map((item: any) => {
    // Robust video ID extraction for standard videos and shorts
    const videoIdMatch = item.link.match(/(?:v=|\/shorts\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : item.link.split("/").pop()?.replace("watch?v=", "") || "";
    
    return {
      id: videoId,
      title: item.title,
      pubDate: new Date(item.pubDate),
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    };
  });
};

const AdminVideos = () => {
  const queryClient = useQueryClient();
  const { data: youtubeVideos, isLoading: loadingFeed } = useQuery({
    queryKey: ["admin-youtube-feed"],
    queryFn: fetchYoutubeFeed
  });

  const { data: hiddenVideos, isLoading: loadingSettings } = useSettingsHiddenVideos();

  const toggleMutation = useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) => 
      performVisibilityToggle(id, isHidden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hidden-videos-v2"] });
      toast.success("Video visibility updated");
    },
    onError: (err: any) => {
      console.error("TOGGLE_ERROR:", err);
      toast.error(`Error: ${err.message || "Failed to update"}`);
    }
  });

  if (loadingFeed || loadingSettings) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 text-white p-2 text-xs font-bold text-center rounded animate-pulse mb-4">
        CACHE-BUST: V4 READY (Shorts Support Added)
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Manage Videos</h1>
        <p className="text-muted-foreground text-sm">Toggle which videos appear on the homepage.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {youtubeVideos?.map((video: any) => {
            const isHidden = hiddenVideos?.includes(video.id);
            return (
              <div 
                key={video.id} 
                className={`relative group bg-muted/20 border rounded-xl overflow-hidden transition-all duration-300 ${
                  isHidden ? "opacity-50 border-dashed" : "border-border shadow-sm"
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-video relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  {isHidden && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <EyeOff size={10} /> Hidden
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] mb-3">{video.title}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {format(video.pubDate, "MMM d, yyyy")}
                    </span>
                    <Button 
                      size="sm" 
                      variant={isHidden ? "default" : "outline"}
                      className={`h-8 font-heading text-[10px] uppercase tracking-wider gap-2 ${
                        isHidden ? "bg-club-gold hover:bg-club-gold/90 border-none" : ""
                      }`}
                      onClick={() => toggleMutation.mutate({ id: video.id, isHidden: !!isHidden })}
                      disabled={toggleMutation.isPending}
                    >
                      {isHidden ? (
                        <>
                          <Eye size={14} /> Show Video
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} /> Hide Video
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-muted/30 border border-dashed border-border rounded-lg p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-club-dark text-white flex items-center justify-center shrink-0 shadow-lg">
          <Youtube size={24} />
        </div>
        <div>
          <p className="text-sm font-medium">Automatic Sync</p>
          <p className="text-xs text-muted-foreground">The list above is pulled directly from the Whitehawk FC YouTube channel. New uploads will appear here automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminVideos;
