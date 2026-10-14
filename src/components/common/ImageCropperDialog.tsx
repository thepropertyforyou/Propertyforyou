import { useState, useRef, useEffect } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/utils/cropImage";

interface ImageCropperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onCropComplete: (file: File) => void;
  aspectRatio?: number;
  targetWidth?: number;
  targetHeight?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function ImageCropperDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspectRatio,
  targetWidth,
  targetHeight,
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);

  const effectiveAspect = aspectRatio || (targetWidth && targetHeight ? targetWidth / targetHeight : undefined);

  // Reset crop when new image is loaded
  useEffect(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [imageSrc]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (effectiveAspect) {
      const { width, height } = e.currentTarget;
      const initialCrop = centerAspectCrop(width, height, effectiveAspect);
      setCrop(initialCrop);
      // Immediately set completed pixel crop so auto-crop is available even without dragging
      const cropW = initialCrop.width ? (initialCrop.width / 100) * width : width;
      const cropH = initialCrop.height ? (initialCrop.height / 100) * height : height;
      const cropX = initialCrop.x ? (initialCrop.x / 100) * width : 0;
      const cropY = initialCrop.y ? (initialCrop.y / 100) * height : 0;
      setCompletedCrop({
        unit: 'px',
        x: cropX,
        y: cropY,
        width: cropW,
        height: cropH,
      });
    }
  }

  const handleSave = async () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedFile = await getCroppedImg(
        imageRef.current,
        completedCrop,
        'cropped-image.jpg',
        targetWidth,
        targetHeight,
      );
      onCropComplete(croppedFile);
      onOpenChange(false);
    } else if (imageRef.current && imageSrc) {
      // Auto crop from natural image dimensions if not yet set
      const { naturalWidth, naturalHeight } = imageRef.current;
      let cropX = 0;
      let cropY = 0;
      let cropW = naturalWidth;
      let cropH = naturalHeight;
      if (effectiveAspect) {
        if (naturalWidth / naturalHeight > effectiveAspect) {
          cropW = naturalHeight * effectiveAspect;
          cropX = (naturalWidth - cropW) / 2;
        } else {
          cropH = naturalWidth / effectiveAspect;
          cropY = (naturalHeight - cropH) / 2;
        }
      }
      const fullCrop: PixelCrop = { unit: 'px', x: cropX, y: cropY, width: cropW, height: cropH };
      const croppedFile = await getCroppedImg(
        imageRef.current,
        fullCrop,
        'cropped-image.jpg',
        targetWidth,
        targetHeight,
      );
      onCropComplete(croppedFile);
      onOpenChange(false);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Crop & Preview Image</DialogTitle>
          <DialogDescription>
            {targetWidth && targetHeight
              ? `Auto-cropped to ${targetWidth} × ${targetHeight} px (object-cover). You can adjust the framing below before saving.`
              : "Adjust the framing of your image before uploading."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 overflow-auto py-2 flex-1">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={effectiveAspect}
            >
              <img
                ref={imageRef}
                alt="Crop preview"
                src={imageSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: '55vh', width: 'auto', maxWidth: '100%' }}
              />
            </ReactCrop>
          )}
        </div>

        {targetWidth && targetHeight && (
          <div className="flex items-center justify-between text-xs text-muted-foreground px-2 py-1 bg-muted/40 rounded border">
            <span>Required size: <strong className="text-foreground">{targetWidth} × {targetHeight} px</strong></span>
            <span className="text-primary font-medium">Auto-fitted (object-cover, no stretching)</span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Crop & Save Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
