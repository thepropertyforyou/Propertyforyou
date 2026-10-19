import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageCropperDialog } from "@/components/common/ImageCropperDialog";
import { addWatermarkToImage } from "@/utils/watermark";

interface ImageUploadProps {
  bucket: string;
  onUploadComplete: (url: string) => void;
  defaultValue?: string;
  label?: string;
  aspectRatio?: number;
  targetWidth?: number;
  targetHeight?: number;
  recommendedSize?: string;
  watermark?: boolean;
}

const ImageUpload = ({
  bucket,
  onUploadComplete,
  defaultValue,
  label = "Upload Image",
  aspectRatio,
  targetWidth,
  targetHeight,
  recommendedSize,
  watermark = false,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const effectiveAspect = aspectRatio || (targetWidth && targetHeight ? targetWidth / targetHeight : undefined);
  const effectiveRecommendedSize =
    recommendedSize ||
    (targetWidth && targetHeight ? `Recommended: ${targetWidth} × ${targetHeight} px` : undefined);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    // Reset input
    event.target.value = '';
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const finalFile = watermark ? await addWatermarkToImage(file) : file;

      const localPreview = URL.createObjectURL(finalFile);
      setPreview(localPreview);

      const fileExt = finalFile.name.split(".").pop() || 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, finalFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      setPreview(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setPreview(defaultValue || null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUploadComplete("");
  };

  const containerWidthClass =
    effectiveAspect && effectiveAspect > 2.5
      ? "w-full max-w-lg"
      : effectiveAspect === 1
      ? "w-44 max-w-full"
      : effectiveAspect && effectiveAspect < 1
      ? "w-48 max-w-full"
      : "w-full max-w-sm";

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col items-center gap-2">
        {preview ? (
          <div
            className={`relative group ${containerWidthClass} rounded-lg overflow-hidden border bg-muted`}
            style={{ aspectRatio: effectiveAspect ? `${effectiveAspect}` : '16/9' }}
          >
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            {!uploading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center ${containerWidthClass} border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20 border-muted p-4`}
            style={{ aspectRatio: effectiveAspect ? `${effectiveAspect}` : '16/9' }}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className="w-7 h-7 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-muted-foreground font-semibold">Click to upload</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        )}

        {effectiveRecommendedSize && (
          <p className="text-xs text-muted-foreground font-medium text-center">
            {effectiveRecommendedSize}
          </p>
        )}
      </div>

      <ImageCropperDialog
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={rawImageSrc}
        onCropComplete={handleUpload}
        aspectRatio={effectiveAspect}
        targetWidth={targetWidth}
        targetHeight={targetHeight}
      />
    </div>
  );
};

export default ImageUpload;
