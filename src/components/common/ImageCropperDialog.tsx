import { useState, useRef, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Crop, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RefreshCw, 
  Check, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { exportCroppedFrame } from "@/utils/cropImage";

export interface ImageCropperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onCropComplete: (file: File) => void;
  aspectRatio?: number;
  targetWidth?: number;
  targetHeight?: number;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);

  const [containerSize, setContainerSize] = useState({ width: 500, height: 360 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const effectiveAspect = useMemo(() => {
    if (aspectRatio) return aspectRatio;
    if (targetWidth && targetHeight) return targetWidth / targetHeight;
    if (naturalSize.width > 0 && naturalSize.height > 0) {
      return naturalSize.width / naturalSize.height;
    }
    return 4 / 3;
  }, [aspectRatio, targetWidth, targetHeight, naturalSize]);

  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [saving, setSaving] = useState(false);

  const dragStartRef = useRef({ clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 });
  const touchStartRef = useRef<{
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    pinchDist?: number;
    startZoom?: number;
  }>({ clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 });

  const interactionTimerRef = useRef<any>(null);

  // Measure container dimensions on open and resize
  useEffect(() => {
    if (!open || !containerRef.current) return;
    const el = containerRef.current;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Load and measure natural dimensions of image
  useEffect(() => {
    if (!imageSrc || !open) {
      setImageLoaded(false);
      return;
    }

    let isCancelled = false;
    const img = new Image();
    img.onload = () => {
      if (isCancelled) return;
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setZoom(1.0);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setImageLoaded(true);
    };
    img.onerror = () => {
      if (!isCancelled) {
        toast.error("Failed to load selected image");
        onOpenChange(false);
      }
    };
    img.src = imageSrc;

    return () => {
      isCancelled = true;
    };
  }, [imageSrc, open]);

  // Compute fixed frame size to match exact target aspect ratio
  const frameSize = useMemo(() => {
    const pad = 24;
    const maxW = Math.max(160, containerSize.width - pad);
    const maxH = Math.max(160, containerSize.height - pad);

    let w = maxW;
    let h = w / effectiveAspect;

    if (h > maxH) {
      h = maxH;
      w = h * effectiveAspect;
    }

    return { width: Math.round(w), height: Math.round(h) };
  }, [containerSize, effectiveAspect]);

  // Rotated effective natural dimensions
  const isRotated = rotation % 180 !== 0;
  const effectiveNw = isRotated ? naturalSize.height : naturalSize.width;
  const effectiveNh = isRotated ? naturalSize.width : naturalSize.height;

  // Base scale so that image always covers the frame completely at zoom = 1
  const baseScale = useMemo(() => {
    if (effectiveNw <= 0 || effectiveNh <= 0 || frameSize.width <= 0 || frameSize.height <= 0) return 1;
    return Math.max(frameSize.width / effectiveNw, frameSize.height / effectiveNh);
  }, [effectiveNw, effectiveNh, frameSize]);

  // Rendered dimensions on screen
  const displayWidth = naturalSize.width * baseScale * zoom;
  const displayHeight = naturalSize.height * baseScale * zoom;

  const effectiveDisplayW = effectiveNw * baseScale * zoom;
  const effectiveDisplayH = effectiveNh * baseScale * zoom;

  // Maximum allowed panning offsets so image bounds cover frame
  const maxOffsetX = Math.max(0, (effectiveDisplayW - frameSize.width) / 2);
  const maxOffsetY = Math.max(0, (effectiveDisplayH - frameSize.height) / 2);

  const clampOffset = (x: number, y: number, maxX = maxOffsetX, maxY = maxOffsetY) => {
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  // Re-clamp offset if zoom, rotation, or frame size changes
  useEffect(() => {
    setOffset(prev => clampOffset(prev.x, prev.y, maxOffsetX, maxOffsetY));
  }, [maxOffsetX, maxOffsetY]);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setIsInteracting(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;
      setOffset(clampOffset(dragStartRef.current.offsetX + dx, dragStartRef.current.offsetY + dy));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsInteracting(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, maxOffsetX, maxOffsetY]);

  // Touch Pan and Pinch-to-zoom handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    if (e.touches.length === 1) {
      touchStartRef.current = {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        offsetX: offset.x,
        offsetY: offset.y,
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = {
        clientX: 0,
        clientY: 0,
        offsetX: offset.x,
        offsetY: offset.y,
        pinchDist: dist,
        startZoom: zoom,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !touchStartRef.current.pinchDist) {
      const dx = e.touches[0].clientX - touchStartRef.current.clientX;
      const dy = e.touches[0].clientY - touchStartRef.current.clientY;
      setOffset(clampOffset(touchStartRef.current.offsetX + dx, touchStartRef.current.offsetY + dy));
    } else if (e.touches.length === 2 && touchStartRef.current.pinchDist && touchStartRef.current.startZoom) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchStartRef.current.pinchDist;
      const newZoom = Math.max(1, Math.min(3, +(touchStartRef.current.startZoom * ratio).toFixed(2)));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsInteracting(false);
    touchStartRef.current.pinchDist = undefined;
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => Math.max(1, Math.min(3, +(prev + delta).toFixed(2))));
    setIsInteracting(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => setIsInteracting(false), 600);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
    setIsInteracting(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => setIsInteracting(false), 600);
  };

  const handleReset = () => {
    setZoom(1.0);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!imageElementRef.current || !imageLoaded) return;
    try {
      setSaving(true);
      const file = await exportCroppedFrame({
        image: imageElementRef.current,
        frameW: frameSize.width,
        frameH: frameSize.height,
        offsetX: offset.x,
        offsetY: offset.y,
        zoom,
        rotation,
        baseScale,
        targetWidth,
        targetHeight,
        fileName: "cropped-image.jpg",
      });
      onCropComplete(file);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Cropping failed:", err);
      toast.error("Failed to crop image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const shapeBadgeText = useMemo(() => {
    if (targetWidth && targetHeight) {
      if (Math.abs(targetWidth / targetHeight - 720 / 1280) < 0.05) return "Popup Ad (720 × 1280 Portrait)";
      if (Math.abs(targetWidth / targetHeight - 4 / 3) < 0.05) return "Property Frame (4:3)";
      if (Math.abs(targetWidth / targetHeight - 16 / 9) < 0.05) return "16:9 (1280 × 720)";
      if (Math.abs(targetWidth / targetHeight - 1) < 0.05) return "Square (1:1)";
      return `${targetWidth} × ${targetHeight} px`;
    }
    if (Math.abs(effectiveAspect - 720 / 1280) < 0.05) return "Popup Ad (Portrait 9:16)";
    if (Math.abs(effectiveAspect - 4 / 3) < 0.05) return "Live Listing Frame (4:3)";
    if (Math.abs(effectiveAspect - 16 / 9) < 0.05) return "Landscape (16:9)";
    if (Math.abs(effectiveAspect - 1) < 0.05) return "Square (1:1)";
    return `Fixed Frame (${Math.round(effectiveAspect * 100) / 100}:1)`;
  }, [effectiveAspect, targetWidth, targetHeight]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[94vh] flex flex-col p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="pb-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Crop className="h-5 w-5 text-primary" /> Crop & Frame Photo
            </DialogTitle>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {shapeBadgeText}
            </span>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Move and zoom inside the fixed frame matching live site display.
          </DialogDescription>
        </DialogHeader>

        {/* Viewport Frame Container */}
        <div 
          ref={containerRef}
          className="relative flex-1 min-h-[260px] max-h-[380px] w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center select-none"
        >
          {!imageLoaded ? (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs">Loading image...</span>
            </div>
          ) : (
            <div
              style={{
                width: frameSize.width,
                height: frameSize.height,
              }}
              className="relative shrink-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            >
              {/* Image underneath the frame */}
              {imageSrc && (
                <img
                  ref={imageElementRef}
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: `${displayWidth}px`,
                    height: `${displayHeight}px`,
                    maxWidth: "none",
                    maxHeight: "none",
                    transform: `translate(-50%, -50%) translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Instagram/WhatsApp Dark Mask Overlay outside the frame */}
              <div 
                className="absolute inset-0 pointer-events-none border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.72)]"
              />

              {/* Rule-of-thirds grid */}
              <div 
                className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
                  isInteracting ? "opacity-90" : "opacity-30"
                }`}
              >
                <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-white/60" />
                <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-white/60" />
                <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/60" />
                <div className="absolute left-0 right-0 top-2/3 h-[1px] bg-white/60" />
              </div>

              {/* L-shaped corner markers */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-[3px] border-l-[3px] border-white pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-[3px] border-r-[3px] border-white pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-[3px] border-l-[3px] border-white pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-[3px] border-r-[3px] border-white pointer-events-none" />

              {/* Subtle instruction badge */}
              {!isInteracting && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2.5 py-0.5 rounded-full pointer-events-none whitespace-nowrap shadow-sm">
                  Drag to move • Scroll to zoom
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zoom & Action Controls */}
        <div className="space-y-3 pt-3">
          {/* Zoom Slider Row */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => setZoom(prev => Math.max(1, +(prev - 0.1).toFixed(2)))}
              disabled={zoom <= 1}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.02}
              onValueChange={([val]) => setZoom(val)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => setZoom(prev => Math.min(3, +(prev + 0.1).toFixed(2)))}
              disabled={zoom >= 3}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono font-medium text-muted-foreground w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="h-8 text-xs gap-1.5"
                title="Rotate 90° clockwise"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                title="Reset position and zoom"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset
              </Button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                size="sm" 
                onClick={handleSave} 
                disabled={saving || !imageLoaded}
                className="h-8 text-xs font-semibold px-4 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" /> Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
