import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/hooks/useSupabase";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Save, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MenuPageItem {
  id: string;
  label: string;
  path: string;
  section: "left" | "right";
  children?: { id: string; label: string; path: string }[];
}

const allMenuPages: MenuPageItem[] = [
  // Left nav
  {
    id: "first-team",
    label: "First Team",
    path: "/teams",
    section: "left",
    children: [
      { id: "first-team-players", label: "Players & Staff", path: "/teams" },
      { id: "first-team-matches", label: "Matches", path: "/matches" },
      { id: "first-team-table", label: "Table", path: "/standings" },
    ],
  },
  {
    id: "teams",
    label: "Teams",
    path: "/teams",
    section: "left",
    children: [
      { id: "teams-women", label: "Whitehawk Women", path: "/teams/women" },
      { id: "teams-u18", label: "Whitehawk U18", path: "/teams/u18" },
      { id: "teams-youth", label: "Youth", path: "/teams/academy" },
    ],
  },
  {
    id: "club",
    label: "Club",
    path: "/club",
    section: "left",
    children: [
      { id: "club-personnel", label: "Club Personnel", path: "/personnel" },
      { id: "club-photos", label: "Match Photos", path: "/match-photos" },
      { id: "club-pitch", label: "Hire Our Pitch", path: "/hire-pitch" },
      { id: "club-clubhouse", label: "Hire Our Clubhouse", path: "/hire-clubhouse" },
    ],
  },
  { id: "fanzone", label: "Fanzone", path: "/fanzone", section: "left" },
  { id: "news", label: "News", path: "/news", section: "left" },

  // Right nav
  { id: "tickets", label: "Tickets", path: "https://whitehawkfc.ktckts.com/", section: "right" },
  { id: "hospitality", label: "Hospitality", path: "/hospitality", section: "right" },
  { id: "sponsor", label: "Sponsor", path: "/sponsor", section: "right" },
  { id: "shop", label: "Shop", path: "/shop", section: "right" },
  { id: "contact", label: "Contact", path: "/contact", section: "right" },
];

const MenuPages = () => {
  const { data: settings, isLoading } = useSettings("menu_visibility");
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (settings?.value?.hidden) {
      setHiddenItems(settings.value.hidden);
    }
  }, [settings]);

  const toggleItem = (id: string) => {
    setHiddenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key: "menu_visibility", value: { hidden: hiddenItems } },
          { onConflict: "key" }
        );

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["settings", "menu_visibility"] });

      toast({
        title: "Menu updated",
        description: "Menu visibility settings have been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const leftItems = allMenuPages.filter((i) => i.section === "left");
  const rightItems = allMenuPages.filter((i) => i.section === "right");

  const renderItem = (item: MenuPageItem) => {
    const isHidden = hiddenItems.includes(item.id);
    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
            isHidden
              ? "bg-red-50 border-red-200 opacity-60"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <GripVertical size={16} className="text-gray-300" />
            <div>
              <span className="font-heading text-sm uppercase tracking-wide font-semibold">
                {item.label}
              </span>
              <span className="text-xs text-muted-foreground ml-2">{item.path}</span>
            </div>
          </div>
          <button
            onClick={() => toggleItem(item.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-heading uppercase tracking-wide transition-all ${
              isHidden
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            {isHidden ? "Hidden" : "Visible"}
          </button>
        </div>

        {/* Child items */}
        {item.children && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => {
              const isChildHidden = hiddenItems.includes(child.id);
              return (
                <div
                  key={child.id}
                  className={`flex items-center justify-between p-3 rounded-md border transition-all ${
                    isChildHidden || isHidden
                      ? "bg-red-50/50 border-red-100 opacity-50"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-px bg-gray-300" />
                    <span className="font-heading text-xs uppercase tracking-wide">
                      {child.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{child.path}</span>
                  </div>
                  <button
                    onClick={() => toggleItem(child.id)}
                    disabled={isHidden}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-heading uppercase tracking-wide transition-all ${
                      isChildHidden || isHidden
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    } ${isHidden ? "cursor-not-allowed" : ""}`}
                  >
                    {isChildHidden || isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                    {isChildHidden || isHidden ? "Hidden" : "Visible"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">
            Menu Pages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Toggle which pages are visible in the site navigation menu.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="font-heading uppercase tracking-wider text-xs gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
          Save Changes
        </Button>
      </div>

      {/* Left Nav Section */}
      <div className="mb-10">
        <h2 className="font-heading text-lg uppercase tracking-wider text-muted-foreground mb-4 border-b pb-2">
          Left Navigation
        </h2>
        <div className="space-y-2">{leftItems.map(renderItem)}</div>
      </div>

      {/* Right Nav Section */}
      <div>
        <h2 className="font-heading text-lg uppercase tracking-wider text-muted-foreground mb-4 border-b pb-2">
          Right Navigation
        </h2>
        <div className="space-y-2">{rightItems.map(renderItem)}</div>
      </div>
    </div>
  );
};

export default MenuPages;
