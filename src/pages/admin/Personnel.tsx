import { usePersonnel } from "@/hooks/useSupabase";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users,
  Loader2,
  Save,
  Image as ImageIcon,
  GripVertical,
  Info
} from "lucide-react";
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
import { updateItemsOrder } from "@/hooks/useSupabase";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const SortableRow = ({ member, handleEdit, handleDelete, dragDisabled }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: member.id, disabled: dragDisabled });

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
          className={`p-1 rounded text-muted-foreground/40 transition-colors ${
            dragDisabled
              ? "cursor-not-allowed opacity-20"
              : "cursor-grab active:cursor-grabbing hover:bg-muted hover:text-muted-foreground"
          }`}
        >
          <GripVertical size={16} />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <Users size={16} className="text-muted-foreground/40" />
              )}
           </div>
           <div>
              <p className="font-heading font-bold uppercase tracking-tight text-sm leading-none mb-1">{member.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-none">{member.role}</p>
           </div>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-medium">
        <span className="text-[10px] uppercase tracking-widest font-heading px-2 py-1 bg-muted rounded border border-border/50">
          {member.department}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`text-[9px] uppercase tracking-widest font-heading font-bold px-2 py-0.5 rounded border ${
          member.type === 'football' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'
        }`}>
          {member.type}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-heading uppercase font-bold ${
          member.is_active ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
        }`}>
           <div className={`w-1 h-1 rounded-full ${member.is_active ? 'bg-green-600' : 'bg-red-500'}`} />
           {member.is_active ? 'Active' : 'Hidden'}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="sm" onClick={() => handleEdit(member)} className="h-8 w-8 p-0">
             <Edit2 size={14} />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
             <Trash2 size={14} />
           </Button>
        </div>
      </td>
    </tr>
  );
};

const PersonnelAdmin = () => {
  const { data: personnel, isLoading, refetch } = usePersonnel();
  // Separate local state per type so their orderings are fully independent
  const [localClub, setLocalClub] = useState<any[]>([]);
  const [localFootball, setLocalFootball] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'club' | 'football'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (personnel) {
      setLocalClub(
        personnel.filter(m => m.type === 'club').sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      );
      setLocalFootball(
        personnel.filter(m => m.type === 'football').sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      );
    }
  }, [personnel]);

  // The active ordered list based on the selected tab
  const activeList = filterType === 'club'
    ? localClub
    : filterType === 'football'
    ? localFootball
    : [...localClub, ...localFootball];

  // Apply search filter on top
  const filteredPersonnel = activeList.filter((member) => {
    if (!searchTerm) return true;
    return (
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Drag only works on a single-type tab without an active search
  const dragEnabled = filterType !== 'all' && searchTerm === '';

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !dragEnabled) return;

    if (filterType === 'club') {
      const oldIndex = localClub.findIndex((m) => m.id === active.id);
      const newIndex = localClub.findIndex((m) => m.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const newOrder = arrayMove(localClub, oldIndex, newIndex);
      setLocalClub(newOrder);
      try {
        const updates = newOrder.map((member, index) => ({ id: member.id, order_index: index }));
        await updateItemsOrder("personnel", updates);
        toast.success("Club order updated");
        refetch();
      } catch {
        toast.error("Failed to save order");
        setLocalClub(personnel?.filter(m => m.type === 'club').sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)) || []);
      }
    } else if (filterType === 'football') {
      const oldIndex = localFootball.findIndex((m) => m.id === active.id);
      const newIndex = localFootball.findIndex((m) => m.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const newOrder = arrayMove(localFootball, oldIndex, newIndex);
      setLocalFootball(newOrder);
      try {
        const updates = newOrder.map((member, index) => ({ id: member.id, order_index: index }));
        await updateItemsOrder("personnel", updates);
        toast.success("Football staff order updated");
        refetch();
      } catch {
        toast.error("Failed to save order");
        setLocalFootball(personnel?.filter(m => m.type === 'football').sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)) || []);
      }
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingMember({
      name: "",
      role: "",
      department: "Club Leadership",
      type: filterType === 'football' ? 'football' : 'club',
      image_url: "",
      is_active: true,
      is_honorary: false,
      bio: "",
      order_index: (personnel?.length || 0) + 1
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    const member = personnel?.find(m => m.id === id);
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;

    const { error } = await supabase.from("personnel").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete staff member");
    } else {
      if (member?.image_url) {
        await deleteImageFromIonos(member.image_url);
      }
      toast.success("Staff member removed");
      refetch();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingMember.id) {
        const { error } = await supabase
          .from("personnel")
          .update(editingMember)
          .eq("id", editingMember.id);
        if (error) throw error;
        toast.success("Staff member updated");
      } else {
        const { error } = await supabase
          .from("personnel")
          .insert([editingMember]);
        if (error) throw error;
        toast.success("Staff member added");
      }
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save staff member");
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
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Club Personnel</h1>
          <p className="text-muted-foreground text-sm">Manage administrative and football staff members.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-border rounded-lg p-1">
             <Button 
               variant={filterType === 'all' ? 'default' : 'ghost'} 
               size="sm" 
               className="font-heading text-[10px] uppercase tracking-widest h-8"
               onClick={() => setFilterType('all')}
             >
               All
             </Button>
             <Button 
               variant={filterType === 'club' ? 'default' : 'ghost'} 
               size="sm" 
               className="font-heading text-[10px] uppercase tracking-widest h-8"
               onClick={() => setFilterType('club')}
             >
               Club
             </Button>
             <Button 
               variant={filterType === 'football' ? 'default' : 'ghost'} 
               size="sm" 
               className="font-heading text-[10px] uppercase tracking-widest h-8"
               onClick={() => setFilterType('football')}
             >
               Football
             </Button>
          </div>
          <Button onClick={handleAddNew} className="font-heading uppercase tracking-widest text-xs gap-2">
            <Plus size={16} /> Add Member
          </Button>
        </div>
      </div>

      {filterType === 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3 text-blue-800 text-xs">
          <Info size={16} />
          Switch to <strong className="mx-1">Club</strong> or <strong className="mx-1">Football</strong> tab to drag &amp; drop reorder each group independently.
        </div>
      )}
      {filterType !== 'all' && searchTerm !== '' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 text-amber-800 text-xs">
          <Info size={16} />
          Clear the search to enable drag &amp; drop reordering.
        </div>
      )}
      {dragEnabled && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3 text-green-800 text-xs">
          <GripVertical size={16} />
          Drag the handle to reorder {filterType === 'club' ? 'club' : 'football'} staff. Changes save automatically.
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden text-sm">
        <div className="p-4 border-b border-border flex items-center gap-2 bg-white">
          <Search className="text-muted-foreground" size={18} />
          <Input 
            placeholder="Search by name, role or department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 text-sm h-auto py-1"
          />
        </div>

        <div className="overflow-x-auto font-body">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="w-10"></th>
                  <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Staff Member</th>
                  <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Department</th>
                  <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Type</th>
                  <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                <SortableContext
                  items={filteredPersonnel.map(m => m.id)}
                  strategy={verticalListSortingStrategy}
                  disabled={!dragEnabled}
                >
                  {filteredPersonnel?.map((member) => (
                    <SortableRow 
                      key={member.id} 
                      member={member} 
                      handleEdit={handleEdit} 
                      handleDelete={handleDelete}
                      dragDisabled={!dragEnabled}
                    />
                  ))}
                </SortableContext>
                {filteredPersonnel?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      No staff members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </DndContext>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px] font-body bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-tight text-xl">
              {editingMember?.id ? "Edit Staff Member" : "Add Staff Member"}
            </DialogTitle>
          </DialogHeader>
          
          {editingMember && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Full Name</label>
                  <Input 
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                    placeholder="Enter name"
                    className="font-heading uppercase text-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Role</label>
                  <Input 
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                    placeholder="e.g. Chairman"
                    className="font-heading uppercase text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Department</label>
                  <select 
                    value={editingMember.department}
                    onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                    className="w-full bg-white border border-input rounded-md px-3 h-10 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading uppercase"
                  >
                    <option>Club Leadership</option>
                    <option>Club Officers</option>
                    <option>Commercial, Media & Events</option>
                    <option>Club & Ground Operations</option>
                    <option>Matchday Operations</option>
                    <option>Club Ambassadors</option>
                    <option>Team Staff</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Type</label>
                  <div className="flex gap-2">
                     <Button 
                       type="button"
                       variant={editingMember.type === 'club' ? 'default' : 'outline'}
                       size="sm"
                       className="flex-1 font-heading text-[10px] uppercase"
                       onClick={() => setEditingMember({...editingMember, type: 'club'})}
                     >
                       Club
                     </Button>
                     <Button 
                       type="button"
                       variant={editingMember.type === 'football' ? 'default' : 'outline'}
                       size="sm"
                       className="flex-1 font-heading text-[10px] uppercase"
                       onClick={() => setEditingMember({...editingMember, type: 'football'})}
                     >
                       Football
                     </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <ImageUpload 
                  label="Staff Photo (Saved to IONOS)"
                  value={editingMember.image_url}
                  onChange={(url) => setEditingMember({...editingMember, image_url: url})}
                  className="mb-1"
                />
                
                {editingMember.image_url && (
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground bg-muted/30 p-2 rounded border border-border/50">
                    <ImageIcon size={12} />
                    <span className="truncate max-w-[300px]">{editingMember.image_url}</span>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Biography</label>
                <Textarea 
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({...editingMember, bio: e.target.value})}
                  placeholder="Enter staff biography..."
                  className="min-h-[100px] text-sm"
                />
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-border mt-2">
                <div className="flex items-center gap-2">
                   <input 
                     type="checkbox"
                     id="is_active_member"
                     checked={editingMember.is_active}
                     onChange={(e) => setEditingMember({...editingMember, is_active: e.target.checked})}
                     className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                   />
                   <label htmlFor="is_active_member" className="text-xs font-heading uppercase tracking-widest cursor-pointer">
                     Visible on Site
                   </label>
                </div>
                <div className="flex items-center gap-2">
                   <input 
                     type="checkbox"
                     id="is_honorary_member"
                     checked={editingMember.is_honorary || false}
                     onChange={(e) => setEditingMember({...editingMember, is_honorary: e.target.checked})}
                     className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                   />
                   <label htmlFor="is_honorary_member" className="text-xs font-heading uppercase tracking-widest cursor-pointer text-amber-700">
                     Honorary Member
                   </label>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                   <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Sort Order</label>
                   <Input 
                     type="number"
                     value={editingMember.order_index}
                     onChange={(e) => setEditingMember({...editingMember, order_index: parseInt(e.target.value) || 0})}
                     className="w-16 h-8 text-xs font-mono text-center"
                   />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="font-heading uppercase tracking-widest text-[10px] h-10 px-6">
               Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="font-heading uppercase tracking-widest text-[10px] h-10 px-6 gap-2">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={14} />}
               Save Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonnelAdmin;
