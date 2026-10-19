import logoUrl from "@/assets/logo.png";

let cachedLogoPromise: Promise<HTMLImageElement> | null = null;

function getLogoImage(): Promise<HTMLImageElement> {
  if (!cachedLogoPromise) {
    cachedLogoPromise = new Promise((resolve, reject) => {
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.onload = () => resolve(logo);
      logo.onerror = (e) => reject(e);
      logo.src = logoUrl;
    });
  }
  return cachedLogoPromise;
}

/**
 * Adds the Property For You logo as an automatic watermark:
 * - Position: Exactly centered in the middle of the image
 * - Size: ~30% of the image width, preserving logo aspect ratio
 * - Opacity: 40%
 * - Safe: Never applied twice
 */
export async function addWatermarkToImage(file: File): Promise<File> {
  // Never add it twice
  if (
    (file as any).__watermarked ||
    file.name.startsWith("wm_") ||
    file.name.includes("_watermarked")
  ) {
    return file;
  }

  try {
    const objectUrl = URL.createObjectURL(file);

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = objectUrl;
    });

    const logoImg = await getLogoImage();

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    if (!imgWidth || !imgHeight) {
      URL.revokeObjectURL(objectUrl);
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = imgWidth;
    canvas.height = imgHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return file;
    }

    // 1. Draw base cropped image
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

    // 2. Compute watermark dimensions: 30% of image width
    const targetWatermarkWidth = imgWidth * 0.3;
    const logoWidth = logoImg.naturalWidth || logoImg.width;
    const logoHeight = logoImg.naturalHeight || logoImg.height;
    const logoAspect = logoWidth > 0 && logoHeight > 0 ? logoWidth / logoHeight : 1;
    const targetWatermarkHeight = targetWatermarkWidth / logoAspect;

    // 3. Center horizontally and vertically in the middle of the image
    const x = (imgWidth - targetWatermarkWidth) / 2;
    const y = (imgHeight - targetWatermarkHeight) / 2;

    // 4. Apply 40% opacity
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.drawImage(logoImg, x, y, targetWatermarkWidth, targetWatermarkHeight);
    ctx.restore();

    URL.revokeObjectURL(objectUrl);

    // 5. Convert to File
    const mimeType = file.type && file.type.startsWith("image/") ? file.type : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, 0.92);
    });

    if (!blob) {
      return file;
    }

    const safeName = file.name.startsWith("wm_") ? file.name : `wm_${file.name}`;
    const watermarkedFile = new File([blob], safeName, {
      type: mimeType,
      lastModified: Date.now(),
    });
    (watermarkedFile as any).__watermarked = true;

    return watermarkedFile;
  } catch (err) {
    console.warn("Could not apply watermark, falling back to original image:", err);
    return file;
  }
}
