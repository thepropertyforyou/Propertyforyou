import { PixelCrop } from 'react-image-crop';

const TO_RADIANS = Math.PI / 180;

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0,
  targetWidth?: number,
  targetHeight?: number,
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // When exact target dimensions are requested, render directly to those dimensions
  if (targetWidth && targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );
    return;
  }

  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();
}

export async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  targetWidth?: number,
  targetHeight?: number,
): Promise<File> {
  const canvas = document.createElement('canvas');
  await canvasPreview(image, canvas, crop, 1, 0, targetWidth, targetHeight);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() }));
    }, 'image/jpeg', 0.92);
  });
}

export interface FrameCropParams {
  image: HTMLImageElement;
  frameW: number;
  frameH: number;
  offsetX: number;
  offsetY: number;
  zoom: number;
  rotation: number;
  baseScale: number;
  targetWidth?: number;
  targetHeight?: number;
  fileName?: string;
}

export async function exportCroppedFrame({
  image,
  frameW,
  frameH,
  offsetX,
  offsetY,
  zoom,
  rotation,
  baseScale,
  targetWidth,
  targetHeight,
  fileName = 'cropped-image.jpg',
}: FrameCropParams): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context available');
  }

  const aspect = frameW / frameH;

  // Determine output resolution
  let outW = targetWidth;
  let outH = targetHeight;
  if (!outW || !outH) {
    const isRotated90 = rotation % 180 !== 0;
    const effectiveNw = isRotated90 ? image.naturalHeight : image.naturalWidth;
    outW = Math.max(800, Math.min(effectiveNw, 1920));
    outH = Math.round(outW / aspect);
  }

  canvas.width = outW;
  canvas.height = outH;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Ratio from on-screen frame coordinate system to canvas coordinate system
  const scale = outW / frameW;

  // Move to center of canvas + scaled user offset
  ctx.translate(outW / 2 + offsetX * scale, outH / 2 + offsetY * scale);

  // Rotate if needed
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Draw image centered
  const drawW = image.naturalWidth * baseScale * zoom * scale;
  const drawH = image.naturalHeight * baseScale * zoom * scale;

  ctx.drawImage(
    image,
    -drawW / 2,
    -drawH / 2,
    drawW,
    drawH
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas export failed'));
        return;
      }
      resolve(new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() }));
    }, 'image/jpeg', 0.92);
  });
}


