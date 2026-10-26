import { useState, useEffect } from "react";
import { 
  Layout, 
  Image as ImageIcon, 
  Save, 
  Loader2, 
  Upload,
  LayoutDashboard,
  Megaphone,
  Settings as SettingsIcon,
  CheckCircle2,
  Share2,
  Smartphone,
  Monitor,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const SECTION_LABELS: Record<string, string> = {
  "fixtures": "Results & Fixtures",
  "news": "Latest News",
  "table": "League Table",
  "videos": "Videos Section",
  "discover": "Discover Section",
  "sponsors": "Sponsors Bar"
};

const SortableSectionRow = ({ id, label }: { id: string, label: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: 'relative' as any,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center gap-3 p-3 bg-white border border-border rounded-lg mb-2 ${isDragging ? 'shadow-md ring-2 ring-primary/20' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground transition-colors">
        <GripVertical size={18} />
      </div>
      <span className="font-heading uppercase tracking-widest text-sm">{label}</span>
    </div>
  );
};
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface HeroDeviceSettings {
  background_type: "image" | "color";
  background_color: string;
  custom_image_url: string;
  image_position: number;
  hero_size: "compact" | "standard" | "large" | "fullscreen";
}

const Settings = () => {
  const { data: heroSettings, isLoading: isHeroLoading, refetch: refetchHero } = useSettings("homepage_hero");
  const { data: tickerSettings, isLoading: isTickerLoading, refetch: refetchTicker } = useSettings("fixtures_ticker");
  const { data: brandSettings, isLoading: isBrandLoading, refetch: refetchBrand } = useSettings("club_brand");
  const { data: socialsSettings, isLoading: isSocialsLoading, refetch: refetchSocials } = useSettings("club_socials");
  const { data: shopSettings, isLoading: isShopLoading, refetch: refetchShop } = useSettings("shop_settings");
  const { data: layoutSettings, isLoading: isLayoutLoading, refetch: refetchLayout } = useSettings("homepage_layout");
  
  const defaultLayout = ["fixtures", "news", "table", "videos", "discover", "sponsors"];
  const [layoutOrder, setLayoutOrder] = useState<string[]>(defaultLayout);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndLayout = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLayoutOrder((items) => {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      return arrayMove(items, oldIndex, newIndex);
    });
  };
  
  const [mode, setMode] = useState<string>("match");
  
  const [mobileHero, setMobileHero] = useState<HeroDeviceSettings>({
    background_type: "image",
    background_color: "#8e160b",
    custom_image_url: "",
    image_position: 50,
    hero_size: "compact"
  });

  const [desktopHero, setDesktopHero] = useState<HeroDeviceSettings>({
    background_type: "image",
    background_color: "#8e160b",
    custom_image_url: "",
    image_position: 50,
    hero_size: "standard"
  });

  const [logoUrl, setLogoUrl] = useState<string>("");
  const [tickerEnabled, setTickerEnabled] = useState<boolean>(true);
  const [shopComingSoon, setShopComingSoon] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const [socials, setSocials] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
  });

  useEffect(() => {
    if (heroSettings?.value) {
      setMode(heroSettings.value.mode || "match");
      
      const migrate = (source: any): HeroDeviceSettings => ({
        background_type: source.background_type || "image",
        background_color: source.background_color || "#8e160b",
        custom_image_url: source.custom_image_url || "",
        image_position: source.image_position !== undefined ? source.image_position : 50,
        hero_size: source.hero_size || "standard"
      });

      if (heroSettings.value.mobile) {
        setMobileHero(migrate(heroSettings.value.mobile));
      } else {
        setMobileHero(migrate(heroSettings.value));
      }

      if (heroSettings.value.desktop) {
        setDesktopHero(migrate(heroSettings.value.desktop));
      } else {
        setDesktopHero(migrate(heroSettings.value));
      }
    }
  }, [heroSettings]);

  useEffect(() => {
    if (tickerSettings?.value !== undefined) {
      setTickerEnabled(tickerSettings.value.enabled ?? true);
    }
  }, [tickerSettings]);

  useEffect(() => {
    if (shopSettings?.value !== undefined) {
      setShopComingSoon(shopSettings.value.coming_soon ?? false);
    }
  }, [shopSettings]);

  useEffect(() => {
    if (brandSettings?.value) {
      setLogoUrl(brandSettings.value.logo_url || "");
    }
  }, [brandSettings]);

  useEffect(() => {
    if (socialsSettings?.value) {
      setSocials({
        facebook: socialsSettings.value.facebook || "",
        instagram: socialsSettings.value.instagram || "",
        twitter: socialsSettings.value.twitter || "",
        youtube: socialsSettings.value.youtube || "",
        tiktok: socialsSettings.value.tiktok || "",
        linkedin: socialsSettings.value.linkedin || "",
      });
    }
  }, [socialsSettings]);

  useEffect(() => {
    if (layoutSettings?.value && Array.isArray(layoutSettings.value)) {
      const savedLayout = layoutSettings.value;
      const validSaved = savedLayout.filter(id => defaultLayout.includes(id));
      const missing = defaultLayout.filter(id => !validSaved.includes(id));
      setLayoutOrder([...validSaved, ...missing]);
    } else {
      setLayoutOrder(defaultLayout);
    }
  }, [layoutSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const newValue = {
        mode,
        mobile: mobileHero,
        desktop: desktopHero
      };

      const { data: heroUpdateData, error: updateError } = await supabase
        .from("site_settings")
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq("key", "homepage_hero")
        .select();

      if (updateError) throw updateError;

      if (!heroUpdateData || heroUpdateData.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "homepage_hero", value: newValue });
        if (insertError) throw insertError;
      }

      const newTickerValue = { enabled: tickerEnabled };
      const { data: tickerUpdateData, error: tickerUpdateError } = await supabase
        .from("site_settings")
        .update({ value: newTickerValue, updated_at: new Date().toISOString() })
        .eq("key", "fixtures_ticker")
        .select();

      if (tickerUpdateError) throw tickerUpdateError;

      if (!tickerUpdateData || tickerUpdateData.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "fixtures_ticker", value: newTickerValue });
        if (insertError) throw insertError;
      }

      const newShopValue = { coming_soon: shopComingSoon };
      const { data: shopUpdateData, error: shopUpdateError } = await supabase
        .from("site_settings")
        .update({ value: newShopValue, updated_at: new Date().toISOString() })
        .eq("key", "shop_settings")
        .select();

      if (shopUpdateError) throw shopUpdateError;

      if (!shopUpdateData || shopUpdateData.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "shop_settings", value: newShopValue });
        if (insertError) throw insertError;
      }

      const newBrandValue = { logo_url: logoUrl || null };
      const { data: brandUpdateData, error: brandUpdateError } = await supabase
        .from("site_settings")
        .update({ value: newBrandValue, updated_at: new Date().toISOString() })
        .eq("key", "club_brand")
        .select();

      if (brandUpdateError) throw brandUpdateError;

      if (!brandUpdateData || brandUpdateData.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "club_brand", value: newBrandValue });
        if (insertError) throw insertError;
      }

      const { data: socialsUpdateData, error: socialsUpdateError } = await supabase
        .from("site_settings")
        .update({ value: socials, updated_at: new Date().toISOString() })
        .eq("key", "club_socials")
        .select();

      if (socialsUpdateError) throw socialsUpdateError;

      if (!socialsUpdateData || socialsUpdateData.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "club_socials", value: socials });
        if (insertError) throw insertError;
      }

      const { data: layoutUpdateData, error: layoutUpdateError } = await supabase
        .from("site_settings")
        .update({ value: layoutOrder, updated_at: new Date().toISOString() })
        .eq("key", "homepage_layout")
        .select();

      if (layoutUpdateError) throw layoutUpdateError;

      if (!layoutUpdateData || layoutUpdateData.length === 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "homepage_layout", value: layoutOrder });
        if (insertError) throw insertError;
      }

      toast.success("Settings updated successfully");
      refetchHero();
      refetchTicker();
      refetchLayout();
      refetchShop();
      refetchBrand();
      refetchSocials();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (isHeroLoading || isTickerLoading || isBrandLoading || isSocialsLoading || isShopLoading || isLayoutLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary">
          <SettingsIcon size={20} />
          <span className="font-heading text-sm uppercase tracking-widest font-bold">System Configuration</span>
        </div>
        <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-foreground">
          Site Settings
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl font-body">
          Manage your homepage appearance, hero layouts, and global branding assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Brand Identity</CardTitle>
                  <CardDescription className="text-xs">Manage your club badge and branding assets.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <Label className="text-xs font-heading uppercase tracking-widest font-bold">Current Club Badge</Label>
                    <div className="grid gap-2">
                      <ImageUpload 
                        label="Club Logo (Saved to IONOS)"
                        value={logoUrl}
                        onChange={setLogoUrl}
                      />
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Homepage Hero Mode</CardTitle>
                  <CardDescription className="text-xs">Choose what your fans see first when they land on the site.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <RadioGroup value={mode} onValueChange={setMode} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <RadioGroupItem value="match" id="match" className="peer sr-only" />
                  <Label
                    htmlFor="match"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer h-full"
                  >
                    <LayoutDashboard className="mb-4 h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                       <span className="font-heading text-sm font-bold block mb-1 uppercase">Match Only</span>
                       <span className="text-[10px] text-muted-foreground leading-tight block">Next fixture & countdown timer.</span>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="posts" id="posts" className="peer sr-only" />
                  <Label
                    htmlFor="posts"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer h-full"
                  >
                    <Megaphone className="mb-4 h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                       <span className="font-heading text-sm font-bold block mb-1 uppercase">Latest Posts</span>
                       <span className="text-[10px] text-muted-foreground leading-tight block">Auto-sliding post carousel.</span>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="combined" id="combined" className="peer sr-only" />
                  <Label
                    htmlFor="combined"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer h-full"
                  >
                    <div className="flex gap-2 mb-4">
                       <LayoutDashboard className="h-6 w-6 text-muted-foreground/50" />
                       <Megaphone className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <div className="text-center">
                       <span className="font-heading text-sm font-bold block mb-1 uppercase">Combined</span>
                       <span className="text-[10px] text-muted-foreground leading-tight block">Match first, then slides to posts.</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Layout size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Hero Customization</CardTitle>
                  <CardDescription className="text-xs">Adjust layout and appearance for mobile and desktop independently.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <Tabs defaultValue="desktop" className="w-full">
                 <div className="bg-muted/10 border-b border-border/40 px-8 py-2">
                    <TabsList className="bg-transparent gap-4">
                      <TabsTrigger value="mobile" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-heading text-[10px] uppercase tracking-widest gap-2">
                        <Smartphone size={14} /> Mobile
                      </TabsTrigger>
                      <TabsTrigger value="desktop" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-heading text-[10px] uppercase tracking-widest gap-2">
                        <Monitor size={14} /> Desktop
                      </TabsTrigger>
                    </TabsList>
                 </div>
                 
                 {(["mobile", "desktop"] as const).map((device) => {
                    const heroData = device === "mobile" ? mobileHero : desktopHero;
                    const setHeroData = device === "mobile" ? setMobileHero : setDesktopHero;
                    
                    return (
                      <TabsContent key={device} value={device} className="p-8 space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-4">
                          <Label className="text-xs font-heading font-bold uppercase tracking-widest flex items-center gap-2">
                            Hero Vertical Size <span className="text-[10px] text-muted-foreground lowercase font-normal italic">({device} only)</span>
                          </Label>
                          <RadioGroup 
                            value={heroData.hero_size} 
                            onValueChange={(v: any) => setHeroData(prev => ({ ...prev, hero_size: v }))} 
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                          >
                            {(["compact", "standard", "large", "fullscreen"] as const).map((size) => (
                              <div key={size}>
                                <RadioGroupItem value={size} id={`${device}-size-${size}`} className="peer sr-only" />
                                <Label
                                  htmlFor={`${device}-size-${size}`}
                                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover py-4 px-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary transition-all cursor-pointer h-full"
                                >
                                  <span className="font-heading text-sm font-bold block mb-1 uppercase">{size}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-border/40">
                          <RadioGroup 
                            value={heroData.background_type} 
                            onValueChange={(v: "image" | "color") => setHeroData(prev => ({ ...prev, background_type: v }))} 
                            className="flex gap-6 mb-2"
                          >
                            <div className="flex items-center space-x-2">
                               <RadioGroupItem value="image" id={`${device}-bg-image`} />
                               <Label htmlFor={`${device}-bg-image`} className="font-heading uppercase tracking-widest text-sm cursor-pointer">Photo Background</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                               <RadioGroupItem value="color" id={`${device}-bg-color`} />
                               <Label htmlFor={`${device}-bg-color`} className="font-heading uppercase tracking-widest text-sm cursor-pointer">Solid Color</Label>
                            </div>
                          </RadioGroup>

                          {heroData.background_type === "color" && (
                             <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <Label className="text-xs font-heading font-bold uppercase tracking-widest">Select Background Color</Label>
                                <div className="flex flex-wrap items-center gap-4">
                                   <Button 
                                     variant={heroData.background_color === "#8e160b" ? "default" : "outline"} 
                                     className="gap-2 font-heading uppercase tracking-widest text-[10px]" 
                                     onClick={() => setHeroData(prev => ({ ...prev, background_color: "#8e160b" }))}
                                   >
                                      <div className="w-3 h-3 rounded-full bg-[#8e160b]" /> Whitehawk Red
                                   </Button>
                                   <Button 
                                     variant={heroData.background_color === "#141b2b" ? "default" : "outline"} 
                                     className="gap-2 font-heading uppercase tracking-widest text-[10px]" 
                                     onClick={() => setHeroData(prev => ({ ...prev, background_color: "#141b2b" }))}
                                   >
                                      <div className="w-3 h-3 rounded-full bg-[#141b2b]" /> Club Black
                                   </Button>
                                   <div className="flex items-center gap-3 border border-border rounded-md px-3 py-1.5 h-10 bg-muted/20">
                                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Custom Hex:</span>
                                      <input 
                                        type="color" 
                                        value={heroData.background_color} 
                                        onChange={(e) => setHeroData(prev => ({ ...prev, background_color: e.target.value }))} 
                                        className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent shadow-none appearance-none" 
                                      />
                                   </div>
                                </div>
                             </div>
                          )}

                          {heroData.background_type === "image" && (
                             <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                <div className="grid gap-2">
                                  <ImageUpload 
                                    label="Custom Background (Saved to IONOS)"
                                    value={heroData.custom_image_url || ""}
                                    onChange={(url) => setHeroData(prev => ({ ...prev, custom_image_url: url }))}
                                  />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/40">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-xs font-heading uppercase tracking-widest font-bold">Image Vertical Positioning</Label>
                                    <span className="text-xs font-body text-muted-foreground">{heroData.image_position}%</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={heroData.image_position} 
                                    onChange={(e) => setHeroData(prev => ({ ...prev, image_position: parseInt(e.target.value) }))}
                                    className="w-full accent-[#8e160b]"
                                  />
                                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-heading tracking-widest">
                                    <span>Top</span>
                                    <span>Center</span>
                                    <span>Bottom</span>
                                  </div>
                                </div>
                             </div>
                          )}
                        </div>
                      </TabsContent>
                    );
                 })}
               </Tabs>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Layout size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Homepage Section Order</CardTitle>
                  <CardDescription className="text-xs">Drag and drop to reorder sections on the public homepage.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndLayout} modifiers={[restrictToVerticalAxis]}>
                <SortableContext items={layoutOrder} strategy={verticalListSortingStrategy}>
                  {layoutOrder.map((id) => (
                    <SortableSectionRow key={id} id={id} label={SECTION_LABELS[id] || id} />
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Global Components</CardTitle>
                  <CardDescription className="text-xs">Toggle global design elements across the public site.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-heading font-bold uppercase tracking-wider">Fixtures Ticker Bar</Label>
                  <p className="text-xs text-muted-foreground font-body leading-tight">Shows next match and club shouts scrolling at the top.</p>
                </div>
                <Switch 
                  checked={tickerEnabled} 
                  onCheckedChange={setTickerEnabled} 
                />
              </div>

              <div className="border-t border-border/40 pt-6 flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-heading font-bold uppercase tracking-wider">Shop Coming Soon</Label>
                  <p className="text-xs text-muted-foreground font-body leading-tight">Enables a coming soon page overlay on the public shop page.</p>
                </div>
                <Switch 
                  checked={shopComingSoon} 
                  onCheckedChange={setShopComingSoon} 
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Share2 size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Social Media</CardTitle>
                  <CardDescription className="text-xs">Links appear in the footer. Leave blank to hide an icon.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {([
                  { key: "facebook",  label: "Facebook",  placeholder: "https://facebook.com/whitehawkfc" },
                  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/whitehawkfc" },
                  { key: "twitter",   label: "X / Twitter", placeholder: "https://x.com/whitehawkfc" },
                  { key: "youtube",   label: "YouTube",   placeholder: "https://youtube.com/@whitehawkfc" },
                  { key: "tiktok",    label: "TikTok",    placeholder: "https://tiktok.com/@whitehawkfc" },
                  { key: "linkedin",  label: "LinkedIn",  placeholder: "https://linkedin.com/company/whitehawk-fc" },
                ] as { key: keyof typeof socials; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-[10px] font-heading uppercase tracking-widest font-bold">{label}</Label>
                    <Input
                      placeholder={placeholder}
                      value={socials[key]}
                      onChange={(e) => setSocials((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="font-body text-sm h-10"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 sticky top-24">
             <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="font-heading text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                   <Save size={16} /> Actions
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving} 
                  className="w-full font-heading uppercase tracking-widest text-xs h-12 gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  Save All Changes
                </Button>
                <div className="rounded-lg bg-muted/50 p-4 border border-border">
                   <div className="flex gap-3">
                      <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={16} />
                      <div>
                         <p className="font-heading text-[10px] font-bold uppercase tracking-widest mb-1">Live Status</p>
                         <p className="text-[11px] text-muted-foreground font-body leading-tight">These settings are applied instantly to the production website after saving.</p>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
