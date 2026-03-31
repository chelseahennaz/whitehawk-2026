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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/hooks/useSupabase";
import { toast } from "sonner";

const Settings = () => {
  const { data: heroSettings, isLoading: isHeroLoading, refetch: refetchHero } = useSettings("homepage_hero");
  const { data: tickerSettings, isLoading: isTickerLoading, refetch: refetchTicker } = useSettings("fixtures_ticker");
  const { data: brandSettings, isLoading: isBrandLoading, refetch: refetchBrand } = useSettings("club_brand");
  
  const [mode, setMode] = useState<string>("match");
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [bgType, setBgType] = useState<"image" | "color">("image");
  const [bgColor, setBgColor] = useState<string>("#8e160b");
  const [imagePosition, setImagePosition] = useState<number>(50);
  const [heroSize, setHeroSize] = useState<"compact" | "standard" | "large" | "fullscreen">("standard");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [tickerEnabled, setTickerEnabled] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (heroSettings?.value) {
      setMode(heroSettings.value.mode || "match");
      setCustomImageUrl(heroSettings.value.custom_image_url || "");
      setBgType(heroSettings.value.background_type || "image");
      setBgColor(heroSettings.value.background_color || "#8e160b");
      setImagePosition(heroSettings.value.image_position !== undefined ? heroSettings.value.image_position : 50);
      setHeroSize(heroSettings.value.hero_size || "standard");
    }
  }, [heroSettings]);

  useEffect(() => {
    if (tickerSettings?.value !== undefined) {
      setTickerEnabled(tickerSettings.value.enabled ?? true);
    }
  }, [tickerSettings]);

  useEffect(() => {
    if (brandSettings?.value) {
      setLogoUrl(brandSettings.value.logo_url || "");
    }
  }, [brandSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const newValue = {
        mode,
        custom_image_url: customImageUrl || null,
        background_type: bgType,
        background_color: bgColor,
        image_position: imagePosition,
        hero_size: heroSize
      };

      // Try update first and select the result to verify
      const { data: heroUpdateData, error: updateError } = await supabase
        .from("site_settings")
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq("key", "homepage_hero")
        .select();

      if (updateError) throw updateError;

      if (!heroUpdateData || heroUpdateData.length === 0) {
        // Fallback: insert if row does not exist
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert({ key: "homepage_hero", value: newValue });
        if (insertError) throw insertError;
      }

      // Save ticker setting
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

      // Save brand setting
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

      toast.success("Settings updated successfully");
      refetchHero();
      refetchTicker();
      refetchBrand();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-bg-${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('club-assets')
        .getPublicUrl(filePath);

      setCustomImageUrl(publicUrl);
      toast.success("Background image uploaded");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Specifically check for PNG (allowed png files)
    if (file.type !== "image/png") {
      toast.error("Please upload a PNG logo for transparency support.");
      return;
    }

    setUploadingLogo(true);
    try {
      const fileName = `branded-logo-${Date.now()}.png`;
      const filePath = `branding/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('club-assets')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast.success("Club logo uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  if (isHeroLoading || isTickerLoading || isBrandLoading) {
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
          {/* Brand Identity Configuration */}
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
                    <div className="flex items-center justify-center p-8 bg-black rounded-xl border border-border aspect-square relative group overflow-hidden">
                       {logoUrl ? (
                         <img src={logoUrl} alt="Club Logo Preview" className="h-4/5 w-4/5 object-contain" />
                       ) : (
                         <div className="text-muted-foreground/30 font-heading text-xs uppercase text-center">No custom logo set</div>
                       )}
                       
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label htmlFor="logo-upload" className="cursor-pointer">
                             <Button variant="secondary" size="sm" className="text-xs h-8 h-8 pointer-events-none">
                                Change
                             </Button>
                          </label>
                          {logoUrl && (
                            <Button variant="destructive" size="sm" onClick={() => setLogoUrl("")} className="text-xs h-8 h-8">
                               Reset
                            </Button>
                          )}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <Label className="text-sm font-heading font-bold uppercase tracking-wider">Logo Guidelines</Label>
                       <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 font-body">
                          <li>Use high-resolution **PNG** files.</li>
                          <li>Ensure the background is **transparent**.</li>
                          <li>Square or circular aspect ratios work best.</li>
                       </ul>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 hover:border-primary/40 transition-colors bg-muted/20">
                         <Upload className="h-8 w-8 text-muted-foreground/40 mb-3" />
                         <label htmlFor="logo-upload" className="relative cursor-pointer rounded-md font-bold text-primary hover:text-primary/80">
                            <span className="text-sm">{uploadingLogo ? "Uploading..." : "Upload New Logo"}</span>
                            <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} disabled={uploadingLogo} accept="image/png" />
                         </label>
                         <p className="text-[10px] text-muted-foreground mt-1">PNG only for transparency.</p>
                    </div>

                    <div className="space-y-2 pt-2">
                       <Label className="text-[10px] font-heading uppercase tracking-widest font-bold">Logo URL (External)</Label>
                       <Input 
                         placeholder="https://..." 
                         value={logoUrl} 
                         onChange={(e) => setLogoUrl(e.target.value)}
                         className="font-body text-[11px] h-9"
                       />
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Hero Configuration */}
          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Layout size={20} />
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
                       <span className="font-heading text-sm font-bold block mb-1">MATCH ONLY</span>
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
                       <span className="font-heading text-sm font-bold block mb-1">LATEST POSTS</span>
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
                       <span className="font-heading text-sm font-bold block mb-1">COMBINED</span>
                       <span className="text-[10px] text-muted-foreground leading-tight block">Match first, then slides to posts.</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Hero Height Configuration */}
          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Layout size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Hero Size</CardTitle>
                  <CardDescription className="text-xs">Adjust the overall height of the homepage hero section.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <RadioGroup value={heroSize} onValueChange={(v: "compact"|"standard"|"large"|"fullscreen") => setHeroSize(v)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div>
                  <RadioGroupItem value="compact" id="size-compact" className="peer sr-only" />
                  <Label
                    htmlFor="size-compact"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover py-4 px-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary transition-all cursor-pointer h-full"
                  >
                    <span className="font-heading text-sm font-bold block mb-1">COMPACT</span>
                    <span className="text-[10px] text-muted-foreground">Shorter height</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="standard" id="size-standard" className="peer sr-only" />
                  <Label
                    htmlFor="size-standard"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover py-4 px-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary transition-all cursor-pointer h-full"
                  >
                    <span className="font-heading text-sm font-bold block mb-1">STANDARD</span>
                    <span className="text-[10px] text-muted-foreground">Default layout</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="large" id="size-large" className="peer sr-only" />
                  <Label
                    htmlFor="size-large"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover py-4 px-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary transition-all cursor-pointer h-full"
                  >
                    <span className="font-heading text-sm font-bold block mb-1">LARGE</span>
                    <span className="text-[10px] text-muted-foreground">Immersive tall</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="fullscreen" id="size-fullscreen" className="peer sr-only" />
                  <Label
                    htmlFor="size-fullscreen"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover py-4 px-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary transition-all cursor-pointer h-full"
                  >
                    <span className="font-heading text-sm font-bold block mb-1">FULLSCREEN</span>
                    <span className="text-[10px] text-muted-foreground">Takes full screen</span>
                  </Label>
                </div>

              </RadioGroup>
            </CardContent>
          </Card>

          {/* Global Components */}
          <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Global Components</CardTitle>
                  <CardDescription className="text-xs">Toggle site-wide elements like the ticker bar.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="flex items-center justify-between">
                 <div className="space-y-1">
                   <Label className="text-base font-heading font-bold uppercase tracking-wider">Fixtures Ticker Bar</Label>
                   <p className="text-sm text-muted-foreground font-body">
                     Displays the upcoming match and countdown in a scrolling ticker across the top of the site.
                   </p>
                 </div>
                 <Switch 
                   checked={tickerEnabled} 
                   onCheckedChange={setTickerEnabled} 
                 />
               </div>
            </CardContent>
          </Card>

          {/* Background Image Upload */}
          <Card className="border-border/50 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl font-bold uppercase tracking-tight">Hero Background</CardTitle>
                  <CardDescription className="text-xs">Customize the background of the Match Hero section.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-6">
                  <RadioGroup value={bgType} onValueChange={(v: "image" | "color") => setBgType(v)} className="flex gap-6 mb-2 border-b border-border/40 pb-6">
                    <div className="flex items-center space-x-2">
                       <RadioGroupItem value="image" id="bg-image" />
                       <Label htmlFor="bg-image" className="font-heading uppercase tracking-widest text-sm cursor-pointer">Layout Image</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                       <RadioGroupItem value="color" id="bg-color" />
                       <Label htmlFor="bg-color" className="font-heading uppercase tracking-widest text-sm cursor-pointer">Solid Color</Label>
                    </div>
                  </RadioGroup>

                  {bgType === "color" && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <Label className="text-xs font-heading font-bold uppercase tracking-widest">Select Background Color</Label>
                        <div className="flex flex-wrap items-center gap-4">
                           <Button 
                             variant={bgColor === "#8e160b" ? "default" : "outline"} 
                             className="gap-2 font-heading uppercase tracking-widest text-[10px]" 
                             onClick={() => setBgColor("#8e160b")}
                           >
                              <div className="w-3 h-3 rounded-full bg-[#8e160b]" /> Whitehawk Red
                           </Button>
                           <Button 
                             variant={bgColor === "#141b2b" ? "default" : "outline"} 
                             className="gap-2 font-heading uppercase tracking-widest text-[10px]" 
                             onClick={() => setBgColor("#141b2b")}
                           >
                              <div className="w-3 h-3 rounded-full bg-[#141b2b]" /> Club Black
                           </Button>
                           <div className="flex items-center gap-3 border border-border rounded-md px-3 py-1.5 h-10 bg-muted/20">
                              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Custom Hex:</span>
                              <input 
                                type="color" 
                                value={bgColor} 
                                onChange={(e) => setBgColor(e.target.value)} 
                                className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent shadow-none appearance-none" 
                              />
                           </div>
                        </div>
                     </div>
                  )}

                  {bgType === "image" && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        {customImageUrl && (
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                            <img src={customImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button variant="secondary" size="sm" onClick={() => setCustomImageUrl("")} className="text-xs font-heading">
                                Remove Image
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-12 hover:border-primary/40 transition-colors bg-muted/20">
                           <div className="text-center">
                              <Upload className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
                              <div className="flex text-sm text-muted-foreground">
                                <label htmlFor="image-upload" className="relative cursor-pointer rounded-md font-bold text-primary hover:text-primary/80">
                                  <span>{uploading ? "Uploading..." : "Upload a photo"}</span>
                                  <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">PNG, JPG, WEBP up to 5MB</p>
                           </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-heading uppercase tracking-widest font-bold">Image URL (Optional Override)</Label>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            value={customImageUrl} 
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            className="font-body text-sm bg-muted/20"
                          />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/40">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-heading uppercase tracking-widest font-bold">Image Vertical Positioning</Label>
                            <span className="text-xs font-body text-muted-foreground">{imagePosition}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={imagePosition} 
                            onChange={(e) => setImagePosition(parseInt(e.target.value))}
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
