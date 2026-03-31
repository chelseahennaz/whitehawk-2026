import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Loader2, 
  X,
  Type,
  Link as LinkIcon,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>(["News", "Match Report", "Men's Team", "Women's Team", "Youth", "Club"]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    category: "News",
    featured: false,
    image_url: "",
    published_at: new Date().toISOString(),
  });

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Failed to load post");
          navigate("/admin/posts");
        } else {
          setFormData({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || "",
            body: data.body || "",
            category: data.category || "News",
            featured: data.featured || false,
            image_url: data.image_url || "",
            published_at: data.published_at || data.created_at,
          });
        }
        setFetching(false);
      };
      fetchPost();
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("category");
      
      if (!error && data) {
        const unique = Array.from(new Set(data.map(d => d.category))).filter(Boolean);
        setExistingCategories(prev => Array.from(new Set([...prev, ...unique])));
      }
    };
    fetchCategories();
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: id ? prev.slug : generateSlug(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `post-headers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("news-images")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFormData = { ...formData };

      // Handle slug de-duplication for NEW posts
      if (!id) {
        let isUnique = false;
        let counter = 0;
        let testSlug = formData.slug;

        while (!isUnique) {
          const currentSlug = counter === 0 ? testSlug : `${testSlug}-${counter}`;
          const { data: existingPost } = await supabase
            .from("posts")
            .select("id")
            .eq("slug", currentSlug)
            .maybeSingle();

          if (!existingPost) {
            finalFormData.slug = currentSlug;
            isUnique = true;
          } else {
            counter++;
            if (counter > 100) throw new Error("Too many duplicate titles/slugs.");
          }
        }
      }

      if (id) {
        const { error } = await supabase
          .from("posts")
          .update(finalFormData)
          .eq("id", id);
        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase
          .from("posts")
          .insert([finalFormData]);
        if (error) throw error;
        toast.success("Post created successfully");
      }
      navigate("/admin/posts");
    } catch (error: any) {
      toast.error(error.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/admin/posts")}
          className="rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">
            {id ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {id ? "Modify your existing hawks news article." : "Draft a new announcement for the hawks family."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Article Title</Label>
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter title..."
                required
                className="text-lg font-bold font-heading h-12"
              />
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Permalink / Slug</Label>
               <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md text-xs font-mono text-muted-foreground overflow-hidden">
                 <Globe size={14} className="shrink-0" />
                 <span className="truncate">whitehawkfc.com/news/{formData.slug || "..."}</span>
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Excerpt (Short Summary)</Label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Briefly describe what this article is about..."
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[80px] focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm">
            <div className="p-4 border-b border-border bg-muted/10 font-heading text-[10px] uppercase tracking-widest font-bold">
              Article Body
            </div>
            <div className="p-0 post-editor">
               <ReactQuill
                theme="snow"
                value={formData.body}
                onChange={(content) => setFormData(p => ({ ...p, body: content }))}
                modules={quillModules}
                placeholder="Start writing your story..."
                className="border-none min-h-[400px]"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Space */}
        <div className="space-y-6">
          {/* Publish Box */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest pb-3 border-b border-border mb-4">Publishing</h3>
            
            <div className="space-y-4">
               <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="featured" 
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(p => ({ ...p, featured: !!checked }))}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">Post to Featured Section</Label>
               </div>

               <div className="space-y-2">
                 <Label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Category</Label>
                 {!isCustomCategory ? (
                   <select 
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === "ADD_NEW") {
                          setIsCustomCategory(true);
                          setFormData(p => ({ ...p, category: "" }));
                        } else {
                          setFormData(p => ({ ...p, category: e.target.value }));
                        }
                      }}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading uppercase"
                   >
                      {existingCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="ADD_NEW" className="text-primary font-bold">+ ADD NEW...</option>
                   </select>
                 ) : (
                   <div className="flex gap-2">
                     <Input 
                       value={formData.category}
                       onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                       placeholder="Enter new category..."
                       className="text-xs uppercase font-heading h-9"
                       autoFocus
                     />
                     <Button 
                       type="button"
                       variant="outline" 
                       size="sm"
                       onClick={() => setIsCustomCategory(false)}
                       className="h-9 px-3 text-[10px] uppercase tracking-widest font-heading"
                     >
                       List
                     </Button>
                   </div>
                 )}
               </div>

               <div className="space-y-2">
                 <Label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Published Publication Date</Label>
                 <Input 
                   type="datetime-local"
                   value={formData.published_at ? format(parseISO(formData.published_at), "yyyy-MM-dd'T'HH:mm") : ""}
                   onChange={(e) => {
                     const date = e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString();
                     setFormData(p => ({ ...p, published_at: date }));
                   }}
                   className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading"
                 />
                 <p className="text-[9px] text-muted-foreground italic">Update this to backdate or schedule a post.</p>
               </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full font-heading uppercase tracking-widest text-xs h-11 gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
              {id ? "Update Post" : "Publish Post"}
            </Button>
          </div>

          {/* Featured Image Box */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest pb-3 border-b border-border mb-4">Featured Image</h3>
            
            <div className="relative group">
              {formData.image_url ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                  <img src={formData.image_url} alt="Featured" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setFormData(p => ({ ...p, image_url: "" }))}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  ) : (
                    <>
                      <ImageIcon className="text-muted-foreground mb-2" size={32} />
                      <span className="text-[10px] font-heading uppercase text-muted-foreground">Select Image</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Images will be automatically hosted on Supabase Storage. Recommended size: 1200x600.
            </p>
          </div>
        </div>
      </form>

      <style>{`
        .post-editor .ql-container {
          font-family: var(--font-body);
          font-size: 16px;
        }
        .post-editor .ql-editor {
          min-height: 400px;
        }
        .post-editor .ql-toolbar.ql-snow {
          border: none;
          background: #f8f9fa;
          padding: 8px 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .post-editor .ql-container.ql-snow {
          border: none;
        }
      `}</style>
    </div>
  );
};

export default EditPost;
