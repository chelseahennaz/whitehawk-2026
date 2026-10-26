import { useSponsors } from "@/hooks/useSupabase";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Heart,
  Loader2,
  Save,
  Link as LinkIcon,
  Globe,
  GripVertical,
  Eye,
  EyeOff
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { deleteImageFromIonos } from "@/lib/imageHelpers";
import { Reorder, useDragControls } from "framer-motion";
import type { Sponsor } from "@/hooks/useSupabase";

const Sponsors = () => {
  const { data: sponsors, isLoading, refetch } = useSponsors();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [localSponsors, setLocalSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    if (sponsors) {
      setLocalSponsors(sponsors);
    }
  }, [sponsors]);

  const filteredSponsors = localSponsors.filter((s) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReorder = async (newOrder: Sponsor[]) => {
    setLocalSponsors(newOrder);
    
    // Auto-save the new positions
    try {
      const updates = newOrder.map((s, index) => ({
        id: s.id,
        name: s.name,
        logo_url: s.logo_url,
        tier: s.tier,
        website_url: s.website_url,
        is_visible: s.is_visible !== false,
        position: index + 1
      }));

      const { error } = await supabase
        .from("sponsors")
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error("Reorder failed:", error);
      toast.error("Failed to save new order");
      refetch(); // Rollback to actual database state
    }
  };

  const handleEdit = (sponsor: any) => {
    setEditingSponsor({
      ...sponsor,
      is_visible: sponsor.is_visible !== false
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingSponsor({
      name: "",
      tier: "Classic",
      logo_url: "",
      website_url: "",
      is_visible: true,
      position: (sponsors?.length || 0) + 1
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    const sponsor = localSponsors.find(s => s.id === id);
    if (!window.confirm("Are you sure you want to remove this sponsor?")) return;

    const { error } = await supabase.from("sponsors").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete sponsor");
    } else {
      if (sponsor?.logo_url) {
        await deleteImageFromIonos(sponsor.logo_url);
      }
      toast.success("Sponsor removed");
      refetch();
    }
  };



  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingSponsor.id) {
        const { error } = await supabase
          .from("sponsors")
          .update(editingSponsor)
          .eq("id", editingSponsor.id);
        if (error) throw error;
        toast.success("Sponsor details updated");
      } else {
        const { error } = await supabase
          .from("sponsors")
          .insert([editingSponsor]);
        if (error) throw error;
        toast.success("New sponsor added");
      }
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save sponsor");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleToggleVisibility = async (sponsor: Sponsor) => {
    try {
      const nextVisible = sponsor.is_visible === false;
      const { error } = await supabase
        .from("sponsors")
        .update({ is_visible: nextVisible })
        .eq("id", sponsor.id);

      if (error) throw error;
      toast.success(`${sponsor.name} is now ${nextVisible ? "visible" : "hidden"}`);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update visibility");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Our Partners</h1>
          <p className="text-muted-foreground text-sm">Manage the club&apos;s sponsors and their website links.</p>
        </div>
        <Button onClick={handleAddNew} className="font-heading uppercase tracking-widest text-xs gap-2">
          <Plus size={16} /> Add Sponsor
        </Button>
      </div>

      <Reorder.Group 
        axis="y" 
        values={localSponsors} 
        onReorder={handleReorder}
        className="grid grid-cols-1 gap-4"
      >
        {filteredSponsors.map((sponsor) => (
          <Reorder.Item 
            key={sponsor.id} 
            value={sponsor}
            className="w-full"
          >
            <SponsorCard 
              sponsor={sponsor} 
              onEdit={() => handleEdit(sponsor)} 
              onDelete={() => handleDelete(sponsor.id)} 
              onToggleVisibility={() => handleToggleVisibility(sponsor)}
            />
          </Reorder.Item>
        ))}

        {filteredSponsors.length === 0 && (
           <div className="col-span-full py-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <Heart size={40} className="opacity-10" />
              <p>No sponsors found. Add your first partner to get started.</p>
           </div>
        )}
      </Reorder.Group>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px] font-body bg-white">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-tight">
              {editingSponsor?.id ? "Edit Sponsor" : "Add Sponsor"}
            </DialogTitle>
          </DialogHeader>
          
          {editingSponsor && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Sponsor Name</label>
                <Input 
                  value={editingSponsor.name}
                  onChange={(e) => setEditingSponsor({...editingSponsor, name: e.target.value})}
                  placeholder="e.g. TerraPura Ground"
                />
              </div>
              
              <div className="grid gap-2">
                <ImageUpload 
                  label="Logo (Saved to IONOS)"
                  value={editingSponsor.logo_url}
                  onChange={(url) => setEditingSponsor({...editingSponsor, logo_url: url})}
                  className="mb-2"
                />
                
                {editingSponsor.logo_url && (
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground bg-muted/30 p-2 rounded border border-border/50">
                    <ImageIcon size={12} />
                    <span className="truncate max-w-[200px]">{editingSponsor.logo_url}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Sponsorship Tier</label>
                  <select 
                    value={editingSponsor.tier}
                    onChange={(e) => setEditingSponsor({...editingSponsor, tier: e.target.value})}
                    className="w-full bg-background border border-input rounded-md px-3 h-10 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading uppercase"
                  >
                    <option>Elite</option>
                    <option>Prestige</option>
                    <option>Signature</option>
                    <option>Classic</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Website URL (Optional)</label>
                  <Input 
                    placeholder="https://..."
                    value={editingSponsor.website_url}
                    onChange={(e) => setEditingSponsor({...editingSponsor, website_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg p-3 mt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="sponsor-visible" className="text-xs font-heading font-bold uppercase tracking-wider cursor-pointer">Visible on Website</Label>
                  <p className="text-[10px] text-muted-foreground leading-none font-body">Toggle if this partner shows on public pages.</p>
                </div>
                <Switch 
                  id="sponsor-visible"
                  checked={editingSponsor.is_visible !== false}
                  onCheckedChange={(checked) => setEditingSponsor({...editingSponsor, is_visible: checked})}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="font-heading uppercase tracking-widest text-xs">
               Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="font-heading uppercase tracking-widest text-xs gap-2">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
               Save Sponsor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SponsorCard = ({ 
  sponsor, 
  onEdit, 
  onDelete,
  onToggleVisibility
}: { 
  sponsor: Sponsor; 
  onEdit: () => void; 
  onDelete: () => void;
  onToggleVisibility: () => void;
}) => {
  const isHidden = sponsor.is_visible === false;

  return (
    <div className={`bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4 group cursor-default transition-all ${
      isHidden ? "bg-slate-50/50 border-dashed opacity-65" : ""
    }`}>
      <div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors p-1">
        <GripVertical size={20} />
      </div>

      <div className="w-20 h-12 flex items-center justify-center bg-muted/20 rounded border border-border/50 shrink-0">
        {sponsor.logo_url ? (
          <img src={sponsor.logo_url} alt={sponsor.name} className={`max-h-10 max-w-full object-contain ${isHidden ? "grayscale" : ""}`} />
        ) : (
          <Heart className="text-muted-foreground/10" size={20} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-heading text-sm font-bold uppercase tracking-tight truncate ${isHidden ? "text-slate-400 line-through" : ""}`}>{sponsor.name}</h3>
          <span className={`px-2 py-0.5 rounded text-[8px] font-heading uppercase font-bold tracking-widest shrink-0 ${
            isHidden ? "bg-slate-200 text-slate-400" :
            sponsor.tier === 'Elite' ? 'bg-club-dark text-primary-foreground' : 
            sponsor.tier === 'Prestige' ? 'club-gradient text-primary-foreground' :
            sponsor.tier === 'Signature' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
            {sponsor.tier}
          </span>
          {isHidden && (
            <span className="bg-red-50 text-red-600 border border-red-200 text-[8px] font-heading uppercase px-1.5 py-0.5 rounded tracking-wide">
              Hidden
            </span>
          )}
        </div>
        {sponsor.website_url && (
          <p className="text-[10px] text-muted-foreground truncate opacity-60">
            {sponsor.website_url}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleVisibility} 
          className={`h-8 w-8 p-0 ${isHidden ? "text-slate-400 hover:text-slate-600" : "text-slate-600 hover:text-primary"}`}
          title={isHidden ? "Show on website" : "Hide from website"}
        >
          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
          <Edit2 size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};

const ImageIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export default Sponsors;
