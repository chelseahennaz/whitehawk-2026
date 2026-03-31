import { usePosts, usePlayers, useSponsors } from "@/hooks/useSupabase";
import { 
  FileText, 
  Users, 
  Heart, 
  TrendingUp, 
  Clock,
  Plus,
  Settings as SettingsIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Dashboard = () => {
  const { data: posts } = usePosts();
  const { data: players } = usePlayers();
  const { data: sponsors } = useSponsors();

  const stats = [
    { label: "News Posts", value: posts?.length || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Squad Size", value: players?.length || 0, icon: Users, color: "text-red-600", bg: "bg-red-50" },
    { label: "Partners", value: sponsors?.length || 0, icon: Heart, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm">Welcome back to the Hawks FC control center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-6 rounded-xl shadow-sm">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
                   <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={stat.bg + " p-3 rounded-lg"}>
                   <stat.icon className={stat.color} size={24} />
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              Recent News
            </h2>
            <Link to="/admin/posts/new">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1 font-heading uppercase">
                <Plus size={14} /> New Post
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-0.5">
                    {format(new Date(post.published_at), "MMM d, yyyy")} • {post.category}
                  </p>
                </div>
                <Link to={`/admin/posts/edit/${post.id}`}>
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-heading">Edit</Button>
                </Link>
              </div>
            ))}
            {recentPosts.length === 0 && (
               <div className="p-8 text-center text-muted-foreground text-sm">No posts yet.</div>
            )}
          </div>
          <div className="p-4 bg-muted/20 text-center border-t border-border">
            <Link to="/admin/posts" className="text-xs font-heading uppercase tracking-wider text-primary hover:underline">
               View all posts
            </Link>
          </div>
        </div>

        {/* Quick Tips / Resources */}
        <div className="space-y-6">
           <div className="bg-club-dark text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-heading text-lg font-bold uppercase mb-2">Editor Tip</h3>
               <p className="text-white/70 text-sm leading-relaxed mb-4">
                 When uploading images for news posts, try to use high-quality landscape photos. The best size is 1200x600 pixels.
               </p>
               <div className="inline-flex items-center gap-2 text-primary text-xs font-heading font-bold uppercase tracking-widest cursor-pointer hover:translate-x-1 transition-transform">
                 Learn more <TrendingUp size={14} />
               </div>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10">
                <FileText size={120} />
             </div>
           </div>

           <div className="bg-white border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-heading text-sm font-bold uppercase mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                 <Link to="/admin/posts/new" className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors">
                    <FileText size={20} className="mx-auto mb-2 text-primary" />
                    <span className="text-[10px] font-heading uppercase">Add News</span>
                 </Link>
                 <Link to="/admin/squad" className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors">
                    <Users size={20} className="mx-auto mb-2 text-primary" />
                    <span className="text-[10px] font-heading uppercase">New Player</span>
                 </Link>
                 <Link to="/admin/settings" className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors">
                    <SettingsIcon size={20} className="mx-auto mb-2 text-primary" />
                    <span className="text-[10px] font-heading uppercase">Hero Settings</span>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
