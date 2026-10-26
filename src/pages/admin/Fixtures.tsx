import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Trophy, 
  Edit2, 
  Trash2, 
  Loader2, 
  Save, 
  Clock,
  Eye,
  EyeOff,
  Link as LinkIcon,
  PauseCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getFixtures } from "@/lib/fwp";

interface CustomFixture {
  id: string;
  date: string;
  time: string;
  home_team_name: string;
  home_team_score: number | null;
  away_team_name: string;
  away_team_score: number | null;
  venue: string;
  competition_name: string;
  status_short: string;
  status_full: string;
  attendance: number | null;
  fwp_id: string | null;
  is_hidden: boolean;
  match_report?: string;
}

const AdminFixtures = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingFixture, setEditingFixture] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Refs for the match report Quill editor and its hidden image file input
  const quillReportRef = useRef<ReactQuill>(null);
  const reportImageFileInputRef = useRef<HTMLInputElement>(null);

  // Upload an image and insert it at the current cursor position in the match report editor
  const uploadImageToReport = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated.");
      const response = await fetch("/upload.php", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Upload failed");
      const editor = quillReportRef.current?.getEditor();
      if (editor) {
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", data.url);
        editor.setSelection(range.index + 1, 0);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    }
  }, []);

  const reportImageHandler = useCallback(() => {
    reportImageFileInputRef.current?.click();
  }, []);

  const reportQuillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: reportImageHandler,
      },
    },
  };

  const { data: fwpFixtures, isLoading: isLoadingFWP } = useQuery({
    queryKey: ["admin-fwp-fixtures"],
    queryFn: async () => {
      try {
        const data = await getFixtures();
        console.log("Admin fetched FWP fixtures:", data?.length);
        return data || [];
      } catch (err: any) {
        console.error("Error fetching admin FWP fixtures:", err);
        toast.error("Failed to load FWP fixtures: " + err.message);
        return [];
      }
    }
  });

  const { data: customFixtures, isLoading: isLoadingCustom, refetch } = useQuery({
    queryKey: ["admin-custom-fixtures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_fixtures")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data as CustomFixture[];
    }
  });

  const isLoading = isLoadingFWP || isLoadingCustom;

  const allFixtures = (() => {
    const list: any[] = [];
    const customMap = new Map((customFixtures || []).filter(cf => cf.fwp_id).map(cf => [cf.fwp_id, cf]));
    const matchedFwpIds = new Set<string>();

    fwpFixtures?.forEach(f => {
      const override = customMap.get(String(f.id));
      if (override) {
        matchedFwpIds.add(String(f.id));
        list.push({ ...override, is_fwp: true, has_override: true, original_fwp_id: f.id });
      } else {
        list.push({
          id: `fwp-${f.id}`,
          date: f.date || "",
          time: f.time || "",
          home_team_name: f["home-team"]?.name || "Unknown",
          home_team_score: f["home-team"]?.score ?? null,
          away_team_name: f["away-team"]?.name || "Unknown",
          away_team_score: f["away-team"]?.score ?? null,
          venue: f.venue || "Unknown Venue",
          competition_name: f.competition?.name || "",
          status_short: f.status?.short || "Upcoming",
          status_full: f.status?.full || "Upcoming",
          attendance: f.attendance ?? null,
          is_hidden: false,
          is_fwp: true,
          has_override: false,
          original_fwp_id: f.id
        });
      }
    });

    customFixtures?.forEach(cf => {
      if (!cf.fwp_id) {
        list.push({ ...cf, is_fwp: false, has_override: false });
      } else if (!matchedFwpIds.has(cf.fwp_id)) {
        // Orphaned override (FWP fixture was removed)
        list.push({ ...cf, is_fwp: true, has_override: true, original_fwp_id: cf.fwp_id, is_orphan: true });
      }
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  const filteredFixtures = allFixtures.filter((f) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (f.home_team_name || "").toLowerCase().includes(search) ||
      (f.away_team_name || "").toLowerCase().includes(search) ||
      (f.competition_name || "").toLowerCase().includes(search)
    );
  });

  const handleEdit = (fixture: any) => {
    setEditingFixture({
      ...fixture,
      home_team_score: fixture.home_team_score ?? "",
      away_team_score: fixture.away_team_score ?? "",
      attendance: fixture.attendance ?? "",
      fwp_id: fixture.is_fwp ? fixture.original_fwp_id : (fixture.fwp_id || null),
      match_report: fixture.match_report || "",
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingFixture({
      date: format(new Date(), "yyyy-MM-dd"),
      time: "15:00",
      home_team_name: "Whitehawk",
      home_team_score: "",
      away_team_name: "",
      away_team_score: "",
      venue: "The Enclosed Ground",
      competition_name: "Pre-Season Friendly",
      status_short: "Upcoming",
      status_full: "Upcoming",
      attendance: "",
      fwp_id: null,
      is_hidden: false,
      is_fwp: false,
      has_override: false,
      match_report: "",
    });
    setIsEditing(true);
  };

  const handleToggleVisibility = async (fixture: any) => {
    setSaving(true);
    try {
      if (fixture.has_override || !fixture.is_fwp) {
        const { error } = await supabase
          .from("custom_fixtures")
          .update({ is_hidden: !fixture.is_hidden })
          .eq("id", fixture.id);
        if (error) throw error;
      } else {
        const payload = {
          date: fixture.date,
          time: fixture.time,
          home_team_name: fixture.home_team_name,
          home_team_score: fixture.home_team_score,
          away_team_name: fixture.away_team_name,
          away_team_score: fixture.away_team_score,
          venue: fixture.venue,
          competition_name: fixture.competition_name,
          status_short: fixture.status_short,
          status_full: fixture.status_full,
          attendance: fixture.attendance,
          fwp_id: String(fixture.original_fwp_id),
          is_hidden: true
        };
        const { error } = await supabase.from("custom_fixtures").insert([payload]);
        if (error) throw error;
      }
      toast.success(fixture.is_hidden ? "Fixture unhidden" : "Fixture hidden");
      queryClient.invalidateQueries({ queryKey: ["admin-custom-fixtures"] });
      queryClient.invalidateQueries({ queryKey: ["fwp-fixtures"] });
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update fixture visibility");
    } finally {
      setSaving(false);
    }
  };

  const handleSetStatus = async (fixture: any, statusShort: 'P-P' | 'CANC') => {
    const statusFull = statusShort === 'P-P' ? 'Postponed' : 'Cancelled';
    setSaving(true);
    try {
      if (fixture.has_override || !fixture.is_fwp) {
        // Existing custom fixture or override — just update status
        const { error } = await supabase
          .from("custom_fixtures")
          .update({ status_short: statusShort, status_full: statusFull })
          .eq("id", fixture.id);
        if (error) throw error;
      } else {
        // Pure FWP fixture — create an override with the new status
        const payload = {
          date: fixture.date,
          time: fixture.time,
          home_team_name: fixture.home_team_name,
          home_team_score: fixture.home_team_score,
          away_team_name: fixture.away_team_name,
          away_team_score: fixture.away_team_score,
          venue: fixture.venue,
          competition_name: fixture.competition_name,
          status_short: statusShort,
          status_full: statusFull,
          attendance: fixture.attendance,
          fwp_id: String(fixture.original_fwp_id),
          is_hidden: fixture.is_hidden || false,
        };
        const { error } = await supabase.from("custom_fixtures").insert([payload]);
        if (error) throw error;
      }
      toast.success(`Fixture marked as ${statusFull}`);
      queryClient.invalidateQueries({ queryKey: ["admin-custom-fixtures"] });
      queryClient.invalidateQueries({ queryKey: ["fwp-fixtures"] });
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update fixture status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (fixture: any) => {
    if (fixture.is_fwp && fixture.has_override) {
      if (!window.confirm("Are you sure you want to remove this override? The fixture will revert to the original FWP data.")) return;
    } else if (!fixture.is_fwp) {
      if (!window.confirm("Are you sure you want to delete this custom fixture?")) return;
    } else {
      toast.error("Cannot delete an original FWP fixture. You can hide it instead.");
      return;
    }

    const { error } = await supabase
      .from("custom_fixtures")
      .delete()
      .eq("id", fixture.id);

    if (error) {
      toast.error("Failed to delete fixture");
    } else {
      toast.success(fixture.is_fwp ? "Override removed" : "Fixture deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-custom-fixtures"] });
      queryClient.invalidateQueries({ queryKey: ["fwp-fixtures"] });
      refetch();
    }
  };

  const handleSave = async () => {
    if (!editingFixture.home_team_name || !editingFixture.away_team_name) {
      toast.error("Please enter both home and away team names");
      return;
    }
    if (!editingFixture.date || !editingFixture.time) {
      toast.error("Please enter match date and kickoff time");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        date: editingFixture.date,
        time: editingFixture.time,
        home_team_name: editingFixture.home_team_name,
        home_team_score: editingFixture.home_team_score === "" ? null : Number(editingFixture.home_team_score),
        away_team_name: editingFixture.away_team_name,
        away_team_score: editingFixture.away_team_score === "" ? null : Number(editingFixture.away_team_score),
        venue: editingFixture.venue,
        competition_name: editingFixture.competition_name,
        status_short: editingFixture.status_short,
        status_full: editingFixture.status_short === "FT" ? "Full Time" : editingFixture.status_short,
        attendance: editingFixture.attendance === "" ? null : Number(editingFixture.attendance),
        fwp_id: editingFixture.fwp_id ? String(editingFixture.fwp_id) : null,
        is_hidden: editingFixture.is_hidden || false,
        match_report: editingFixture.match_report || null,
      };

      if (editingFixture.has_override || (!editingFixture.is_fwp && editingFixture.id)) {
        const { error } = await supabase
          .from("custom_fixtures")
          .update(payload)
          .eq("id", editingFixture.id);
        if (error) throw error;
        toast.success("Fixture updated");
      } else {
        const { error } = await supabase
          .from("custom_fixtures")
          .insert([payload]);
        if (error) throw error;
        toast.success(editingFixture.is_fwp ? "FWP Fixture override created" : "Fixture added");
      }
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["admin-custom-fixtures"] });
      queryClient.invalidateQueries({ queryKey: ["fwp-fixtures"] });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save fixture");
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
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Fixtures & Results</h1>
          <p className="text-muted-foreground text-sm">Manage all fixtures including those synced from Football Web Pages.</p>
          <p className="text-xs text-muted-foreground mt-1">Diagnostics: FWP Fixtures: {fwpFixtures?.length || 0} | Custom Fixtures: {customFixtures?.length || 0}</p>
        </div>
        <Button onClick={handleAddNew} className="font-heading uppercase tracking-widest text-xs gap-2">
          <Plus size={16} /> Add Custom Match
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm bg-white border border-border rounded-lg px-3 py-1.5 shadow-sm">
        <Input 
          placeholder="Filter by opponent or competition..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none bg-transparent p-0 h-auto text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {filteredFixtures.map((fixture) => {
            const hasScore = fixture.home_team_score !== null && fixture.away_team_score !== null;
            return (
              <div key={fixture.id} className={`p-4 hover:bg-muted/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${fixture.is_hidden ? 'opacity-50 grayscale' : ''}`}>
                <div className="flex items-start md:items-center gap-4">
                  <div className={`${fixture.is_fwp ? 'bg-[#0f172a]' : 'bg-[#8e160b]/10 text-[#8e160b]'} text-white p-2.5 rounded-lg shrink-0 flex items-center justify-center`}>
                    {fixture.is_fwp ? <LinkIcon size={20} /> : <Calendar size={20} className="text-[#8e160b]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading text-sm font-bold uppercase tracking-wide">
                        {fixture.home_team_name} {hasScore ? `(${fixture.home_team_score})` : ""} vs {fixture.away_team_name} {hasScore ? `(${fixture.away_team_score})` : ""}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-heading uppercase font-bold tracking-widest ${
                        fixture.status_short === 'FT' ? 'bg-black text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {fixture.status_short}
                      </span>
                      {fixture.is_fwp && !fixture.has_override && (
                        <span className="px-2 py-0.5 rounded text-[8px] font-heading uppercase font-bold tracking-widest bg-blue-100 text-blue-800">
                          FWP
                        </span>
                      )}
                      {fixture.is_fwp && fixture.has_override && (
                        <span className="px-2 py-0.5 rounded text-[8px] font-heading uppercase font-bold tracking-widest bg-purple-100 text-purple-800">
                          OVERRIDDEN
                        </span>
                      )}
                      {fixture.is_hidden && (
                        <span className="px-2 py-0.5 rounded text-[8px] font-heading uppercase font-bold tracking-widest bg-gray-200 text-gray-800">
                          HIDDEN
                        </span>
                      )}
                      {fixture.status_short === 'P-P' && (
                        <span className="px-2 py-0.5 rounded text-[8px] font-heading uppercase font-bold tracking-widest bg-amber-100 text-amber-800">
                          POSTPONED
                        </span>
                      )}
                      {fixture.status_short === 'CANC' && (
                        <span className="px-2 py-0.5 rounded text-[8px] font-heading uppercase font-bold tracking-widest bg-red-100 text-red-800">
                          CANCELLED
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-muted-foreground uppercase font-medium">
                      <span className="flex items-center gap-1">
                        <Trophy size={11} className="text-amber-500" />
                        {fixture.competition_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {format(parseISO(fixture.date), "dd MMM yyyy")} • {fixture.time} KO
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {fixture.venue}
                      </span>
                      {fixture.attendance && (
                        <span>Att: {fixture.attendance}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button variant="outline" size="sm" onClick={() => handleToggleVisibility(fixture)} className="h-8 w-8 p-0" title={fixture.is_hidden ? "Show Fixture" : "Hide Fixture"}>
                    {fixture.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetStatus(fixture, 'P-P')}
                    className={`h-8 w-8 p-0 ${fixture.status_short === 'P-P' ? 'bg-amber-100 border-amber-400 text-amber-700' : 'text-amber-600 hover:bg-amber-50 hover:border-amber-400'}`}
                    title="Mark as Postponed"
                    disabled={saving}
                  >
                    <PauseCircle size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetStatus(fixture, 'CANC')}
                    className={`h-8 w-8 p-0 ${fixture.status_short === 'CANC' ? 'bg-red-100 border-red-400 text-red-700' : 'text-red-500 hover:bg-red-50 hover:border-red-400'}`}
                    title="Mark as Cancelled"
                    disabled={saving}
                  >
                    <XCircle size={14} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(fixture)} className="h-8 font-heading text-[10px] uppercase tracking-wider gap-1.5">
                    <Edit2 size={12} /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(fixture)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" disabled={fixture.is_fwp && !fixture.has_override}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredFixtures.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <Calendar size={40} className="opacity-15" />
              <p>No fixtures found.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[800px] font-body bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-tight">
              {editingFixture?.is_fwp ? "Override FWP Match" : (editingFixture?.id ? "Edit Custom Match" : "Add Custom Match")}
            </DialogTitle>
          </DialogHeader>
          
          {editingFixture && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Home Team</label>
                  <Input 
                    value={editingFixture.home_team_name}
                    onChange={(e) => setEditingFixture({...editingFixture, home_team_name: e.target.value})}
                    placeholder="e.g. Whitehawk"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Away Team</label>
                  <Input 
                    value={editingFixture.away_team_name}
                    onChange={(e) => setEditingFixture({...editingFixture, away_team_name: e.target.value})}
                    placeholder="e.g. Charlton Athletic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg border border-border/40">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Home Score (Optional)</label>
                  <Input 
                    type="number"
                    value={editingFixture.home_team_score}
                    onChange={(e) => setEditingFixture({...editingFixture, home_team_score: e.target.value})}
                    placeholder="e.g. 2"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Away Score (Optional)</label>
                  <Input 
                    type="number"
                    value={editingFixture.away_team_score}
                    onChange={(e) => setEditingFixture({...editingFixture, away_team_score: e.target.value})}
                    placeholder="e.g. 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Date</label>
                  <Input 
                    type="date"
                    value={editingFixture.date}
                    onChange={(e) => setEditingFixture({...editingFixture, date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Kickoff Time</label>
                  <Input 
                    value={editingFixture.time}
                    onChange={(e) => setEditingFixture({...editingFixture, time: e.target.value})}
                    placeholder="e.g. 15:00 or 19:45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Venue</label>
                  <Input 
                    value={editingFixture.venue}
                    onChange={(e) => setEditingFixture({...editingFixture, venue: e.target.value})}
                    placeholder="e.g. The Enclosed Ground"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Competition</label>
                  <Input 
                    value={editingFixture.competition_name}
                    onChange={(e) => setEditingFixture({...editingFixture, competition_name: e.target.value})}
                    placeholder="e.g. Pre-Season Friendly"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Status</label>
                  <select 
                    value={editingFixture.status_short}
                    onChange={(e) => setEditingFixture({...editingFixture, status_short: e.target.value})}
                    className="w-full bg-background border border-input rounded-md px-3 h-10 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-heading uppercase"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="FT">FT (Full Time)</option>
                    <option value="P-P">P-P (Postponed)</option>
                    <option value="CANC">CANC (Cancelled)</option>
                    <option value="HT">HT (Half Time)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Attendance (Optional)</label>
                  <Input 
                    type="number"
                    value={editingFixture.attendance}
                    onChange={(e) => setEditingFixture({...editingFixture, attendance: e.target.value})}
                    placeholder="e.g. 142"
                  />
                </div>
              </div>

              {editingFixture.status_short === "FT" && (
                <div className="grid gap-2 mt-4">
                  <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground">Match Report</label>
                  <div className="bg-white [&_.ql-container]:min-h-[200px] [&_.ql-editor]:text-sm">
                    {/* Hidden file input for inline image uploads in match report */}
                    <input
                      type="file"
                      ref={reportImageFileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImageToReport(file);
                        e.target.value = "";
                      }}
                    />
                    <ReactQuill 
                      ref={quillReportRef}
                      theme="snow"
                      value={editingFixture.match_report || ""}
                      onChange={(val) => setEditingFixture({...editingFixture, match_report: val})}
                      modules={reportQuillModules}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="font-heading uppercase tracking-widest text-xs">
               Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="font-heading uppercase tracking-widest text-xs gap-2">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
               Save Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFixtures;
