import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatListingPrice } from "@/lib/priceUtils";

export interface ShareListingData {
  id: string;
  title: string;
  price: number;
  location_city: string;
  location_locality?: string | null;
  deposit?: number | null;
  listing_images?: { image_url: string; display_order?: number }[];
  images?: string[];
  attributes?: any;
  listing_id?: string | null;
  description?: string | null;
}

interface ShareListingButtonProps {
  listing: ShareListingData;
  variant?: "icon" | "outline" | "default" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const ShareListingButton: React.FC<ShareListingButtonProps> = ({
  listing,
  variant = "ghost",
  size = "icon",
  showLabel = false,
  className = "",
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Derive thumbnail image
  const thumbnail =
    listing.images?.[0] ||
    listing.listing_images?.[0]?.image_url ||
    "https://thepropertyforyou.com/Asset%203.png";

  // Derive price label
  const formattedPrice = formatListingPrice(
    listing.price,
    listing.attributes?.priceUnit,
    listing.deposit ?? listing.attributes?.deposit,
    listing.attributes?.displayPrice
  );

  // Derive location
  const location = [listing.location_locality, listing.location_city]
    .filter(Boolean)
    .join(", ");

  // Formulate canonical share URL
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://thepropertyforyou.com";
  const shareUrl = `${origin}/listing/${listing.id}`;

  const cleanDescription = listing.description
    ? listing.description.replace(/[\r\n]+/g, " ").slice(0, 140)
    : "";
  const shortSummary = `${formattedPrice}${location ? ` in ${location}` : ""}${
    cleanDescription ? ` — ${cleanDescription}` : ""
  }`;

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if Web Share API is available (primarily mobile phones)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setIsSharing(true);
      try {
        let fileToShare: File | null = null;

        // Attempt to fetch thumbnail file if navigator.canShare supports files
        if (thumbnail && typeof navigator.canShare === "function") {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1200);
            const response = await fetch(thumbnail, {
              signal: controller.signal,
              mode: "cors",
            });
            clearTimeout(timeoutId);

            if (response.ok) {
              const blob = await response.blob();
              const ext = blob.type.includes("png") ? "png" : "jpg";
              const safeName =
                listing.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20) ||
                "property";
              const testFile = new File([blob], `${safeName}.${ext}`, {
                type: blob.type || "image/jpeg",
              });

              if (navigator.canShare({ files: [testFile] })) {
                fileToShare = testFile;
              }
            }
          } catch {
            // Ignore thumbnail file fetch error and proceed with text share
          }
        }

        const sharePayload: ShareData = {
          title: listing.title,
          text: `${listing.title}\n${shortSummary}`,
          url: shareUrl,
        };

        if (fileToShare) {
          try {
            await navigator.share({
              ...sharePayload,
              files: [fileToShare],
            });
            setIsSharing(false);
            return;
          } catch (fileShareErr: any) {
            if (fileShareErr?.name === "AbortError") {
              setIsSharing(false);
              return;
            }
            // If sharing with file failed on this specific device, fallback to without file
          }
        }

        await navigator.share(sharePayload);
        setIsSharing(false);
        return;
      } catch (err: any) {
        setIsSharing(false);
        if (err?.name === "AbortError") {
          // User closed share sheet intentionally
          return;
        }
      }
    }

    // Fallback modal (desktop or unsupported mobile browsers)
    setIsOpen(true);
  };

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareTextEncoded = encodeURIComponent(
    `${listing.title}\n${shortSummary}\n\n${shareUrl}`
  );
  const shareUrlEncoded = encodeURIComponent(shareUrl);
  const titleEncoded = encodeURIComponent(`${listing.title} - ${shortSummary}`);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareTextEncoded}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${titleEncoded}&url=${shareUrlEncoded}`;
  const telegramUrl = `https://t.me/share/url?url=${shareUrlEncoded}&text=${titleEncoded}`;

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={showLabel ? "default" : size}
        onClick={handleShareClick}
        disabled={isSharing}
        title="Share property"
        aria-label="Share property"
        className={
          showLabel
            ? `${fullWidth ? "w-full" : ""} ${className}`
            : `h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/80 hover:bg-background/95 text-foreground backdrop-blur-md shadow-xs transition-transform active:scale-95 ${className}`
        }
      >
        <Share2 className={`h-4 w-4 ${showLabel ? "mr-2" : ""}`} />
        {showLabel && <span>Share</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Share Property</DialogTitle>
            <DialogDescription>
              Share this verified listing with your network
            </DialogDescription>
          </DialogHeader>

          {/* Property Snippet Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/40">
            <img
              src={thumbnail}
              alt={listing.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0 border"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm line-clamp-1 text-foreground">
                {listing.title}
              </h4>
              <p className="text-sm font-bold text-primary">{formattedPrice}</p>
              {location && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {location}
                </p>
              )}
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Share via
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all text-[#25D366] text-xs font-medium group"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">
                  WhatsApp
                </span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-all text-[#1877F2] text-xs font-medium group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">
                  Facebook
                </span>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 transition-all text-foreground text-xs font-medium group"
              >
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">X</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-[#229ED9]/30 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-all text-[#229ED9] text-xs font-medium group"
              >
                <div className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-foreground">
                  Telegram
                </span>
              </a>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Page Link
            </p>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="font-mono text-xs h-10 select-all bg-muted/50"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                type="button"
                onClick={handleCopy}
                className="shrink-0 h-10 px-4 font-medium rounded-lg gap-1.5"
                variant={copied ? "default" : "secondary"}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ShareListingButton;
