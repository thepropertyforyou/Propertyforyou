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
}: ImageCropperDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset crop when new image is loaded
  useEffect(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [imageSrc]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  }

  const handleSave = async () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedFile = await getCroppedImg(
        imageRef.current,
        completedCrop,
        'cropped-image.jpg'
      );
      onCropComplete(croppedFile);
      onOpenChange(false);
    } else if (imageRef.current && !completedCrop && imageSrc) {
      // If no crop was made, we just use the original bounds
      const { naturalWidth: width, naturalHeight: height } = imageRef.current;
      const fullCrop: PixelCrop = { unit: 'px', x: 0, y: 0, width, height };
      const croppedFile = await getCroppedImg(
        imageRef.current,
        fullCrop,
        'cropped-image.jpg'
      );
      onCropComplete(croppedFile);
      onOpenChange(false);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the framing of your image before uploading.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 overflow-auto py-2">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
            >
              <img
                ref={imageRef}
                alt="Crop preview"
                src={imageSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: '60vh', width: 'auto', maxWidth: '100%' }}
              />
            </ReactCrop>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Crop & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
