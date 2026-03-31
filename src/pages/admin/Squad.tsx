import { usePlayers } from "@/hooks/useSupabase";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Users,
  Loader2,
  Save,
  X,
  RefreshCw,
  Info
} from "lucide-react";
import { useFWPSync } from "@/hooks/useFWPSync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Squad = () => {
  const { data: players, isLoading, refetch } = usePlayers("mens-first-team");
  const { syncStats, isSyncing } = useFWPSync();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const filteredPlayers = players?.filter((player) => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (player: any) => {
    setEditingPlayer(player);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingPlayer({
      name: "",
      position: "MID",
      appearances: 0,
      goals: 0,
      assists: 0,
      team_slug: "mens-first-team"
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;

    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete player");
    } else {
      toast.success("Player removed from squad");
      refetch();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingPlayer.id) {
        const { error } = await supabase
          .from("players")
          .update(editingPlayer)
          .eq("id", editingPlayer.id);
        if (error) throw error;
        toast.success("Player updated");
      } else {
        const { error } = await supabase
          .from("players")
          .insert([editingPlayer]);
        if (error) throw error;
        toast.success("Player added to squad");
      }
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save player");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Squad Management</h1>
          <p className="text-muted-foreground text-sm">Update player stats, appearances and positions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={syncStats} 
            disabled={isSyncing}
            variant="outline"
            className="font-heading uppercase tracking-widest text-xs gap-2 border-primary/20 hover:border-primary/50"
          >
            {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Sync with FWP
          </Button>
          <Button onClick={handleAddNew} className="font-heading uppercase tracking-widest text-xs gap-2">
            <Plus size={16} /> Add Player
          </Button>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-4">
         <Info size={20} className="text-primary shrink-0 mt-0.5" />
         <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-primary uppercase font-heading text-[10px] tracking-widest block mb-1">FWP Sync Active</strong>
            Appearances and Goals can be updated automatically from the Football Web Pages API. New players will be added to the squad automatically. Manual edits to these stats will be overwritten on next sync.
         </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="text-muted-foreground" size={18} />
          <Input 
            placeholder="Search players..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 text-sm h-auto py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Name</th>
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Pos</th>
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Apps</th>
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Goals</th>
                <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Assists</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredPlayers?.map((player) => (
                <tr key={player.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 font-medium">{player.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-heading uppercase font-bold border border-border/50">
                      {player.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-xs">{player.appearances}</td>
                  <td className="px-6 py-4 text-center font-mono text-xs text-primary font-bold">{player.goals}</td>
                  <td className="px-6 py-4 text-center font-mono text-xs">{player.assists}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(player)} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                         <Edit2 size={14} />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleDelete(player.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600">
                         <Trash2 size={14} />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlayers?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px] font-body bg-white">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-tight">
              {editingPlayer?.id ? "Edit Player" : "Add New Player"}
            </DialogTitle>
          </DialogHeader>
          
          {editingPlayer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Full Name</label>
                <Input 
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                  className="font-heading uppercase text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Position</label>
                  <select 
                    value={editingPlayer.position}
                    onChange={(e) => setEditingPlayer({...editingPlayer, position: e.target.value})}
                    className="w-full bg-background border border-input rounded-md px-3 h-10 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading uppercase"
                  >
                    <option>GK</option>
                    <option>DEF</option>
                    <option>MID</option>
                    <option>FWD</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Appearances</label>
                  <Input 
                    type="number"
                    value={editingPlayer.appearances}
                    onChange={(e) => setEditingPlayer({...editingPlayer, appearances: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Goals</label>
                  <Input 
                    type="number"
                    value={editingPlayer.goals}
                    onChange={(e) => setEditingPlayer({...editingPlayer, goals: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Assists</label>
                  <Input 
                    type="number"
                    value={editingPlayer.assists}
                    onChange={(e) => setEditingPlayer({...editingPlayer, assists: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="font-heading uppercase tracking-widest text-xs">
               Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="font-heading uppercase tracking-widest text-xs gap-2">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
               Save Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Squad;
