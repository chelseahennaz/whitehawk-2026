import { usePosts } from "@/hooks/useSupabase";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye,
  FileText,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Posts = () => {
  const { data: posts, isLoading, refetch } = usePosts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts?.filter((post) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted successfully");
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">News Posts</h1>
          <p className="text-muted-foreground text-sm">Manage all your hawks news articles here.</p>
        </div>
        <Link to="/admin/posts/new">
          <Button className="font-heading uppercase tracking-widest text-xs gap-2">
            <Plus size={16} /> New Post
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="text-muted-foreground" size={18} />
          <Input 
            placeholder="Search posts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 text-sm h-auto py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Title</th>
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Category</th>
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Published</th>
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Status</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts?.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                         {post.image_url ? (
                           <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <FileText size={18} className="text-muted-foreground" />
                         )}
                       </div>
                       <span className="text-sm font-medium line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-heading uppercase text-muted-foreground">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {format(new Date(post.published_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={post.featured ? "bg-club-gold/10 text-club-gold px-2 py-0.5 rounded text-[10px] font-heading uppercase font-bold" : "bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-heading uppercase"}>
                      {post.featured ? "Featured" : "Standard"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 font-heading uppercase text-[10px]">
                        <DropdownMenuItem asChild>
                          <Link to={`/news`} target="_blank" className="flex items-center gap-2">
                            <Eye size={14} /> View Live
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/posts/edit/${post.id}`} className="flex items-center gap-2">
                            <Edit2 size={14} /> Edit Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600 flex items-center gap-2"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredPosts?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No posts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Posts;
