import React, { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Check, AlertCircle, Crop } from "lucide-react";
import { toast } from "sonner";
import { getCroppedImg } from "@/lib/cropImage";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  enableCrop?: boolean;
  defaultAspect?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  label = "Upload Image",
  className = "",
  enableCrop = true,
  defaultAspect = 3 / 2 // Standard rectangular sponsor layout
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [customW, setCustomW] = useState(16);
  const [customH, setCustomH] = useState(9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("image.jpg");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate locally
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (max 5MB).");
      return;
    }

    setSelectedFileName(file.name);

    // Read file as Data URL to show in Cropper
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      if (enableCrop) {
        setIsCropOpen(true);
      } else {
        // Direct upload if crop is disabled
        uploadFile(file);
      }
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    setIsCropOpen(false);

    try {
      // Get cropped image as a Blob
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Create a file from the blob
      // Change file extension to .webp for better compression
      const newFileName = selectedFileName.replace(/\.[^/.]+$/, "") + ".webp";
      const croppedFile = new File([croppedBlob], newFileName, {
        type: "image/webp",
        lastModified: Date.now()
      });

      await uploadFile(croppedFile);
    } catch (error: any) {
      console.error("Failed to crop image:", error);
      toast.error("Failed to crop image.");
      setIsUploading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Get the current Supabase session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      const response = await fetch('/upload.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("PHP upload endpoint returned invalid JSON");
      }

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data.success && data.url) {
        onChange(data.url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Invalid server response");
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[10px] uppercase tracking-widest font-heading text-muted-foreground block">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <Input 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL or Upload..."
            className="text-xs h-10 pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {value ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-muted-foreground/30" />
            )}
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          className="h-10 w-10 shrink-0 border-primary/20 hover:border-primary/50"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Upload new image"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
        
        {value && enableCrop && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 border-primary/20 hover:border-primary/50"
            onClick={() => {
              setImageSrc(value);
              setIsCropOpen(true);
            }}
            disabled={isUploading}
            title="Crop current image"
          >
            <Crop className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Crop Dialog */}
      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="sm:max-w-[550px] font-body bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-tight flex items-center gap-2">
              <Crop size={18} className="text-primary" /> Crop Partner Logo
            </DialogTitle>
          </DialogHeader>

          {imageSrc && (
            <div className="space-y-6">
              <div className="relative w-full h-[320px] bg-slate-100 rounded-lg overflow-hidden border border-border">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  restrictPosition={false}
                  minZoom={0.1}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-heading uppercase text-muted-foreground shrink-0">Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={0.1}
                    max={3}
                    step={0.05}
                    aria-label="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading uppercase text-muted-foreground">Aspect Ratio</span>
                    <div className="flex gap-2">
                      {[
                        { label: "Free", value: undefined },
                        { label: "1:1", value: 1 },
                        { label: "3:2", value: 3 / 2 },
                        { label: "16:9", value: 16 / 9 },
                      ].map((opt) => (
                        <Button
                          key={opt.label}
                          type="button"
                          variant={aspect === opt.value ? "default" : "outline"}
                          className="h-8 text-[10px] font-heading uppercase tracking-wider px-3"
                          onClick={() => setAspect(opt.value)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                    <span className="text-[10px] font-heading uppercase text-muted-foreground">Custom Ratio</span>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        min={1}
                        value={customW} 
                        onChange={(e) => {
                          const val = Number(e.target.value) || 1;
                          setCustomW(val);
                          setAspect(val / customH);
                        }}
                        className="w-16 h-7 text-xs bg-white text-center"
                      />
                      <span className="text-muted-foreground text-xs font-bold">:</span>
                      <Input 
                        type="number" 
                        min={1}
                        value={customH} 
                        onChange={(e) => {
                          const val = Number(e.target.value) || 1;
                          setCustomH(val);
                          setAspect(customW / val);
                        }}
                        className="w-16 h-7 text-xs bg-white text-center"
                      />
                      <Button
                        type="button"
                        variant={aspect === (customW / customH) ? "default" : "outline"}
                        className="h-7 text-[10px] font-heading uppercase px-3 ml-2"
                        onClick={() => setAspect(customW / customH)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCropOpen(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="font-heading uppercase tracking-widest text-xs h-10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropSave}
              className="font-heading uppercase tracking-widest text-xs h-10 gap-2"
            >
              Crop & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
