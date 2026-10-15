import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PopupAdItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  isCustom: boolean;
  listingId?: string | null;
}

// Get today's date formatted as YYYY-MM-DD in Indian Standard Time (IST, UTC+05:30)
const getTodayIndiaDate = (): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  } catch {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (3600000 * 5.5));
    const year = ist.getFullYear();
    const month = String(ist.getMonth() + 1).padStart(2, '0');
    const day = String(ist.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

const FeaturedPopupAds = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ads, setAds] = useState<PopupAdItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Live fetch today's approved popup ads every time site is opened or refreshed
    fetchScheduledPopupAds();

    // Re-check periodically every 5 minutes in case a new ad is scheduled for the current day
    const interval = setInterval(() => {
      fetchScheduledPopupAds();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Prevent body scroll when popup is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Auto-slide every 5 seconds if multiple ads

      return () => clearInterval(interval);
    }
  }, [isOpen, ads.length]);

  const fetchScheduledPopupAds = async () => {
    try {
      const today = getTodayIndiaDate();

      // Fetch today's approved popup ads live from database
      let rows: any[] = [];
      const { data, error } = await supabase
        .from("popup_ad_schedules")
        .select(`
          id,
          listing_id,
          schedule_date,
          selected_dates,
          slot_number,
          image_url,
          link_url,
          title,
          admin_approved,
          listings (
            id,
            title,
            description,
            price,
            location_city,
            seller_phone,
            listing_images (image_url)
          )
        `)
        .eq("admin_approved", true)
        .order("slot_number", { ascending: true });

      if (error) {
        console.warn("Retrying popup ads query without listings join:", error.message);
        // Fallback without relation join in case listings table RLS or relation restricts read
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("popup_ad_schedules")
          .select("id, listing_id, schedule_date, selected_dates, slot_number, image_url, link_url, title, admin_approved")
          .eq("admin_approved", true)
          .order("slot_number", { ascending: true });

        if (fallbackError) throw fallbackError;
        rows = fallbackData || [];
      } else {
        rows = data || [];
      }

      if (rows && rows.length > 0) {
        // Filter ads matching today's date in Indian Standard Time (IST)
        const todayScheduledAds = rows.filter((item: any) => {
          const itemScheduleDate = item.schedule_date ? String(item.schedule_date).split('T')[0] : '';
          const selectedDates = (item.selected_dates || []).map((d: any) => String(d).split('T')[0]);
          return itemScheduleDate === today || selectedDates.includes(today);
        });

        const formattedAds: PopupAdItem[] = todayScheduledAds
          .map((item: any) => {
            if (item.image_url) {
              return {
                id: item.id,
                title: item.title || item.listings?.title || "Featured Ad",
                imageUrl: item.image_url,
                linkUrl: item.link_url || null,
                isCustom: !item.listing_id,
                listingId: item.listing_id || null,
              };
            } else if (item.listings) {
              const img = item.listings.listing_images?.[0]?.image_url;
              return {
                id: item.listings.id,
                title: item.listings.title || "Featured Property",
                imageUrl: img || "",
                linkUrl: item.link_url || null,
                isCustom: false,
                listingId: item.listings.id,
              };
            }
            return null;
          })
          .filter((ad): ad is PopupAdItem => Boolean(ad && ad.imageUrl))
          .slice(0, 3); // Top 3 slots

        if (formattedAds.length > 0) {
          setAds(formattedAds);
          setCurrentIndex(0);
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error fetching popup ads:", error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAdClick = (ad: PopupAdItem) => {
    handleClose();
    if (ad.linkUrl) {
      const trimmed = ad.linkUrl.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        window.open(trimmed, "_blank", "noopener,noreferrer");
      } else if (trimmed.startsWith("/")) {
        navigate(trimmed);
      } else {
        window.open(`https://${trimmed}`, "_blank", "noopener,noreferrer");
      }
    } else if (ad.listingId) {
      navigate(`/listing/${ad.listingId}`);
    }
  };

  if (!isOpen || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className="relative bg-background rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col mx-4"
        style={{
          width: 'min(90vw, calc(85vh * 9 / 16), 460px)',
          aspectRatio: '9 / 16',
          maxHeight: '85vh',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg transition-all"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Featured Badge */}
        <Badge variant="featured" className="absolute top-3 left-3 z-20 text-xs px-2 py-1 shadow-md">
          Featured
        </Badge>

        {/* Image Only - Full Click Area */}
        <div 
          className="relative w-full h-full bg-muted cursor-pointer flex-1"
          onClick={() => handleAdClick(currentAd)}
        >
          {currentAd.imageUrl ? (
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image Available
            </div>
          )}
        </div>

        {/* Indicator Dots - Only if multiple ads */}
        {ads.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-white shadow-md"
                    : "w-2 bg-white/60 shadow-sm"
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedPopupAds;
