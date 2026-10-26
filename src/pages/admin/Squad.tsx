import { usePlayers, usePersonnel, updateItemsOrder, useSettings } from "@/hooks/useSupabase";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users,
  Loader2,
  Save,
  RefreshCw,
  Info,
  Shield,
  User as UserIcon,
  Image as ImageIcon,
  GripVertical
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ImageUpload } from "@/components/admin/ImageUpload";
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
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { deleteImageFromIonos } from "@/lib/imageHelpers";

const SortablePlayerRow = ({ player, handleEdit, handleDelete, handleToggleActive }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: 'relative' as any,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-muted/30 transition-colors group ${isDragging ? "bg-white shadow-lg z-50" : ""}`}
    >
      <td className="w-10 px-0 pl-4 py-4">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <GripVertical size={16} />
        </div>
      </td>
      <td className="px-6 py-4 font-medium">
        <div className="flex items-center gap-2">
          {player.name}
          {player.is_captain && (
            <span className="bg-[#8e160b] text-white text-[9px] font-heading font-bold px-1.5 py-0.5 rounded-sm" title="Captain">C</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-heading uppercase font-bold border border-border/50">
          {player.position}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button 
          onClick={() => handleToggleActive(player.id, player.is_active, true)}
          className={`px-2 py-0.5 rounded text-[9px] font-heading uppercase font-bold border transition-colors ${
            player.is_active 
              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
          }`}
        >
          {player.is_active ? 'Active' : 'Hidden'}
        </button>
      </td>
      <td className="px-6 py-4 text-center font-mono text-xs">{player.appearances}</td>
      <td className="px-6 py-4 text-center font-mono text-xs text-primary font-bold">{player.goals}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="sm" onClick={() => handleEdit(player)} className="h-8 w-8 p-0">
             <Edit2 size={14} />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => handleDelete(player.id, true)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
             <Trash2 size={14} />
           </Button>
        </div>
      </td>
    </tr>
  );
};

const SortableStaffRow = ({ s, handleEdit, handleDelete, handleToggleActive }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: s.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: 'relative' as any,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-muted/30 transition-colors group ${isDragging ? "bg-white shadow-lg z-50" : ""}`}
    >
      <td className="w-10 px-0 pl-4 py-4">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <GripVertical size={16} />
        </div>
      </td>
      <td className="px-6 py-4">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden border border-border/50">
               {s.image_url ? (
                 <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
               ) : (
                 <UserIcon size={14} className="text-muted-foreground/30" />
               )}
            </div>
            <div>
               <p className="font-heading font-bold uppercase text-xs leading-none mb-1">{s.name}</p>
               <p className="text-[9px] uppercase tracking-widest text-muted-foreground leading-none">{s.role}</p>
            </div>
         </div>
      </td>
      <td className="px-6 py-4 text-center">
        <button 
          onClick={() => handleToggleActive(s.id, s.is_active, false)}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-heading uppercase font-bold border transition-colors ${
            s.is_active 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
           <div className={`w-1 h-1 rounded-full ${s.is_active ? 'bg-green-600' : 'bg-red-600'}`} />
           {s.is_active ? 'Active' : 'Hidden'}
        </button>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="sm" onClick={() => handleEdit(s)} className="h-8 w-8 p-0">
             <Edit2 size={14} />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id, false)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
             <Trash2 size={14} />
           </Button>
        </div>
      </td>
    </tr>
  );
};

const Squad = () => {
  const { data: players, isLoading: loadingPlayers, refetch: refetchPlayers } = usePlayers("mens-first-team");
  const { data: staff, isLoading: loadingStaff, refetch: refetchStaff } = usePersonnel("football");
  const { data: visibilitySettings, refetch: refetchSettings } = useSettings("squad_visibility");
  const { syncStats, isSyncing } = useFWPSync();
  
  const squadComingSoon = visibilitySettings?.value?.squad_coming_soon ?? false;
  const staffComingSoon = visibilitySettings?.value?.staff_coming_soon ?? false;
  
  const [localPlayers, setLocalPlayers] = useState<any[]>([]);
  const [localStaff, setLocalStaff] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'players' | 'staff'>('players');
  const [searchTerm, setSearchTerm] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // Can be Player or Personnel
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (players) setLocalPlayers(players);
  }, [players]);

  useEffect(() => {
    if (staff) setLocalStaff(staff);
  }, [staff]);

  const handleToggleVisibility = async (type: 'squad' | 'staff', currentVal: boolean) => {
    try {
      const newValue = {
        squad_coming_soon: type === 'squad' ? !currentVal : squadComingSoon,
        staff_coming_soon: type === 'staff' ? !currentVal : staffComingSoon
      };

      const { data, error } = await supabase
        .from("site_settings")
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq("key", "squad_visibility")
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "squad_visibility", value: newValue });
        if (insertError) throw insertError;
      }

      toast.success(`${type === 'squad' ? 'Squad' : 'Staff'} visibility updated`);
      refetchSettings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update visibility");
    }
  };

  const filteredPlayers = localPlayers?.filter((player) => 
    (showHidden || player.is_active) &&
    (player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStaff = localStaff?.filter((s) => 
    (showHidden || s.is_active) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDragEndPlayers = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const player = localPlayers.find(p => p.id === active.id);
    if (!player) return;
    const position = player.position;

    const positionGroup = localPlayers.filter(p => p.position === position).sort((a,b) => (a.order_index || 0) - (b.order_index || 0));

    const oldIndex = positionGroup.findIndex((m) => m.id === active.id);
    const newIndex = positionGroup.findIndex((m) => m.id === over.id);

    const newGroupOrder = arrayMove(positionGroup, oldIndex, newIndex);

    const newLocalPlayers = localPlayers.map(p => {
       const newP = newGroupOrder.find(ng => ng.id === p.id);
       if (newP) {
          return { ...p, order_index: newGroupOrder.indexOf(newP) };
       }
       return p;
    });

    setLocalPlayers(newLocalPlayers);

    try {
      const updates = newGroupOrder.map((m, index) => ({
        id: m.id,
        order_index: index,
      }));
      await updateItemsOrder("players", updates);
      toast.success("Player order updated");
      refetchPlayers();
    } catch (error) {
      toast.error("Failed to save player order");
      setLocalPlayers(players || []);
    }
  };

  const handleDragEndStaff = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localStaff.findIndex((m) => m.id === active.id);
    const newIndex = localStaff.findIndex((m) => m.id === over.id);

    const newOrder = arrayMove(localStaff, oldIndex, newIndex);
    setLocalStaff(newOrder);

    try {
      const updates = newOrder.map((m, index) => ({
        id: m.id,
        order_index: index,
      }));
      await updateItemsOrder("personnel", updates);
      toast.success("Staff order updated");
      refetchStaff();
    } catch (error) {
      toast.error("Failed to save staff order");
      setLocalStaff(staff || []);
    }
  };

  const isReorderingEnabled = searchTerm === "";

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    if (activeTab === 'players') {
      setEditingItem({
        name: "",
        position: "MID",
        appearances: 0,
        goals: 0,
        assists: 0,
        team_slug: "mens-first-team",
        is_active: true,
        is_captain: false,
        order_index: (players?.length || 0) + 1
      });
    } else {
      setEditingItem({
        name: "",
        role: "",
        department: "Team Staff",
        type: "football",
        image_url: "",
        is_active: true,
        order_index: (staff?.length || 0) + 1
      });
    }
    setIsEditing(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean, isPlayer: boolean) => {
    try {
      const table = isPlayer ? "players" : "personnel";
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success(`${isPlayer ? 'Player' : 'Staff'} marked as ${!currentStatus ? 'active' : 'hidden'}`);
      isPlayer ? refetchPlayers() : refetchStaff();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string, isPlayer: boolean) => {
    const item = isPlayer ? localPlayers.find(p => p.id === id) : localStaff.find(s => s.id === id);
    if (!window.confirm(`Are you sure you want to delete this ${isPlayer ? 'player' : 'staff member'}?`)) return;

    const table = isPlayer ? "players" : "personnel";
    const { error } = await supabase.from(table).delete().eq("id", id);
    
    if (error) {
      toast.error(`Failed to delete ${isPlayer ? 'player' : 'staff'}`);
    } else {
      if (!isPlayer && item?.image_url) {
        await deleteImageFromIonos(item.image_url);
      }
      toast.success(`${isPlayer ? 'Player' : 'Staff'} removed`);
      isPlayer ? refetchPlayers() : refetchStaff();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isPlayer = activeTab === 'players';
      const table = isPlayer ? "players" : "personnel";
      
      if (editingItem.id) {
        const { error } = await supabase
          .from(table)
          .update(editingItem)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success(`${isPlayer ? 'Player' : 'Staff'} updated`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert([editingItem]);
        if (error) throw error;
        toast.success(`${isPlayer ? 'Player' : 'Staff'} added`);
      }
      setIsEditing(false);
      isPlayer ? refetchPlayers() : refetchStaff();
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPlayers || loadingStaff) {
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
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Squad & Staff</h1>
          <p className="text-muted-foreground text-sm">Manage the first team players and coaching staff.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
             <Button 
               variant={activeTab === 'players' ? 'default' : 'ghost'} 
               size="sm" 
               className="font-heading text-[10px] uppercase tracking-widest h-8 px-4"
               onClick={() => setActiveTab('players')}
             >
               Players
             </Button>
             <Button 
               variant={activeTab === 'staff' ? 'default' : 'ghost'} 
               size="sm" 
               className="font-heading text-[10px] uppercase tracking-widest h-8 px-4"
               onClick={() => setActiveTab('staff')}
             >
               Staff
             </Button>
          </div>

          {activeTab === 'players' && (
            <Button 
              onClick={syncStats} 
              disabled={isSyncing}
              variant="outline"
              className="font-heading uppercase tracking-widest text-xs gap-2 border-primary/20 hover:border-primary/50"
            >
              {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Sync FWP
            </Button>
          )}
          
          <Button onClick={handleAddNew} className="font-heading uppercase tracking-widest text-xs gap-2">
            <Plus size={16} /> Add {activeTab === 'players' ? 'Player' : 'Staff'}
          </Button>
        </div>
      </div>

      {activeTab === 'players' ? (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold uppercase tracking-tight">Squad Status</h3>
              <p className="text-xs text-muted-foreground font-body">
                At the end of the season, enable "Coming Soon" mode to display a placeholder page on the website.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-muted/40 px-4 py-2.5 rounded-lg border border-border/50 self-start sm:self-center">
              <Label htmlFor="squad-coming-soon" className="font-heading text-xs uppercase tracking-widest cursor-pointer select-none">
                {squadComingSoon ? (
                  <span className="text-amber-600 font-bold">Coming Soon Mode (Hidden)</span>
                ) : (
                  <span className="text-green-600 font-bold">Displaying Players (Active)</span>
                )}
              </Label>
              <Switch 
                id="squad-coming-soon"
                checked={squadComingSoon}
                onCheckedChange={() => handleToggleVisibility('squad', squadComingSoon)}
              />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-4">
             <Info size={20} className="text-primary shrink-0 mt-0.5" />
             <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-primary uppercase font-heading text-[10px] tracking-widest block mb-1">FWP Sync Active</strong>
                Appearances and Goals for players are updated automatically from the Football Web Pages API.
             </p>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold uppercase tracking-tight">Staff Status</h3>
            <p className="text-xs text-muted-foreground font-body">
              Enable "Coming Soon" mode to hide staff members on the website (e.g. before pre-season appointments).
            </p>
          </div>
          <div className="flex items-center gap-3 bg-muted/40 px-4 py-2.5 rounded-lg border border-border/50 self-start sm:self-center">
            <Label htmlFor="staff-coming-soon" className="font-heading text-xs uppercase tracking-widest cursor-pointer select-none">
              {staffComingSoon ? (
                <span className="text-amber-600 font-bold">Coming Soon Mode (Hidden)</span>
              ) : (
                <span className="text-green-600 font-bold">Displaying Staff (Active)</span>
              )}
            </Label>
            <Switch 
              id="staff-coming-soon"
              checked={staffComingSoon}
              onCheckedChange={() => handleToggleVisibility('staff', staffComingSoon)}
            />
          </div>
        </div>
      )}

      {!isReorderingEnabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 text-amber-800 text-xs">
           <Search size={16} />
           Drag and drop reordering is disabled while searching.
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
            <Search className="text-muted-foreground" size={18} />
            <Input 
              placeholder={`Search ${activeTab}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 text-sm h-auto py-1"
            />
          </div>
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md border border-border/50">
            <Label htmlFor="show-hidden" className="text-xs text-muted-foreground cursor-pointer whitespace-nowrap">Show Hidden</Label>
            <Switch 
              id="show-hidden" 
              checked={showHidden} 
              onCheckedChange={setShowHidden} 
              className="scale-75 data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'players' ? (
            <div className="space-y-8 pb-8">
              {["GK", "DEF", "MID", "FWD"].map(pos => {
                const posPlayers = filteredPlayers.filter(p => p.position === pos).sort((a,b) => (a.order_index || 0) - (b.order_index || 0));
                if (posPlayers.length === 0) return null;
                return (
                  <div key={pos}>
                    <h4 className="font-heading font-bold uppercase px-4 py-2 bg-muted/20 text-muted-foreground text-xs">{pos === "GK" ? "Goalkeepers" : pos === "DEF" ? "Defenders" : pos === "MID" ? "Midfielders" : "Forwards"}</h4>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEndPlayers}
                      modifiers={[restrictToVerticalAxis]}
                    >
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="w-10"></th>
                            <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Name</th>
                            <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Pos</th>
                            <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Status</th>
                            <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Apps</th>
                            <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Goals</th>
                            <th className="px-6 py-3 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white text-sm">
                          <SortableContext
                            items={posPlayers.map(p => p.id)}
                            strategy={verticalListSortingStrategy}
                            disabled={!isReorderingEnabled}
                          >
                            {posPlayers.map((player) => (
                              <SortablePlayerRow 
                                key={player.id} 
                                player={player} 
                                handleEdit={handleEdit} 
                                handleDelete={handleDelete} 
                                handleToggleActive={handleToggleActive}
                              />
                            ))}
                          </SortableContext>
                        </tbody>
                      </table>
                    </DndContext>
                  </div>
                );
              })}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndStaff}
              modifiers={[restrictToVerticalAxis]}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="w-10"></th>
                    <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Staff Member</th>
                    <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Status</th>
                    <th className="px-6 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white text-sm">
                  <SortableContext
                    items={filteredStaff.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={!isReorderingEnabled}
                  >
                    {filteredStaff?.map((s) => (
                      <SortableStaffRow 
                        key={s.id} 
                        s={s} 
                        handleEdit={handleEdit} 
                        handleDelete={handleDelete} 
                        handleToggleActive={handleToggleActive}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </DndContext>
          )}
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px] font-body bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-tight">
              {editingItem?.id ? `Edit ${activeTab === 'players' ? 'Player' : 'Staff'}` : `Add New ${activeTab === 'players' ? 'Player' : 'Staff'}`}
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && activeTab === 'players' ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Full Name</label>
                <Input 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="font-heading uppercase text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Position</label>
                  <select 
                    value={editingItem.position}
                    onChange={(e) => setEditingItem({...editingItem, position: e.target.value})}
                    className="w-full bg-white border border-input rounded-md px-3 h-10 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading uppercase"
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
                    value={editingItem.appearances}
                    onChange={(e) => setEditingItem({...editingItem, appearances: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Goals</label>
                  <Input 
                    type="number"
                    value={editingItem.goals}
                    onChange={(e) => setEditingItem({...editingItem, goals: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Assists</label>
                  <Input 
                    type="number"
                    value={editingItem.assists}
                    onChange={(e) => setEditingItem({...editingItem, assists: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <ImageUpload 
                  label="Photo (Saved to IONOS)"
                  value={editingItem.photo_url}
                  onChange={(url) => setEditingItem({...editingItem, photo_url: url})}
                  className="mb-2"
                />
                
                {editingItem.photo_url && (
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground bg-muted/30 p-2 rounded border border-border/50">
                    <ImageIcon size={12} />
                    <span className="truncate max-w-[200px]">{editingItem.photo_url}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 bg-muted/40 px-3 py-2.5 rounded-lg border border-border/50">
                <Label htmlFor="player-is-captain" className="font-heading text-[10px] uppercase tracking-widest cursor-pointer select-none">
                  Is Captain?
                </Label>
                <Switch 
                  id="player-is-captain"
                  checked={editingItem.is_captain || false}
                  onCheckedChange={(checked) => setEditingItem({...editingItem, is_captain: checked})}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Biography</label>
                <textarea 
                  value={editingItem.bio || ''}
                  onChange={(e) => setEditingItem({...editingItem, bio: e.target.value})}
                  className="w-full bg-white border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none font-body min-h-[100px] resize-y"
                  placeholder="Enter player biography..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Sort Order</label>
                <Input 
                  type="number"
                  value={editingItem.order_index}
                  onChange={(e) => setEditingItem({...editingItem, order_index: parseInt(e.target.value) || 0})}
                  className="w-16 h-8 text-xs font-mono text-center"
                />
              </div>
            </div>
          ) : editingItem && (
            <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Full Name</label>
                <Input 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="font-heading uppercase text-sm"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Role</label>
                <Input 
                  value={editingItem.role}
                  onChange={(e) => setEditingItem({...editingItem, role: e.target.value})}
                  placeholder="e.g. First Team Coach"
                  className="font-heading uppercase text-sm"
                />
              </div>
              <div className="grid gap-2">
                <ImageUpload 
                  label="Photo (Saved to IONOS)"
                  value={editingItem.image_url}
                  onChange={(url) => setEditingItem({...editingItem, image_url: url})}
                  className="mb-2"
                />
                
                {editingItem.image_url && (
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground bg-muted/30 p-2 rounded border border-border/50">
                    <ImageIcon size={12} />
                    <span className="truncate max-w-[200px]">{editingItem.image_url}</span>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Biography</label>
                <textarea 
                  value={editingItem.bio || ''}
                  onChange={(e) => setEditingItem({...editingItem, bio: e.target.value})}
                  className="w-full bg-white border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none font-body min-h-[100px] resize-y"
                  placeholder="Enter staff biography..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Sort Order</label>
                <Input 
                  type="number"
                  value={editingItem.order_index}
                  onChange={(e) => setEditingItem({...editingItem, order_index: parseInt(e.target.value) || 0})}
                  className="w-16 h-8 text-xs font-mono text-center"
                />
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-border mt-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="font-heading uppercase tracking-widest text-[10px] flex-1 h-10">
               Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="font-heading uppercase tracking-widest text-[10px] flex-1 h-10 gap-2">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={14} />}
               Save {activeTab === 'players' ? 'Player' : 'Staff'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Squad;
