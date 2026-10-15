import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PopupAdItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  isCustom: boolean;
  listingId?: string | null;
}

const FeaturedPopupAds = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ads, setAds] = useState<PopupAdItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial fetch to show popup on website load
    fetchScheduledPopupAds();

    // Set up 5-minute interval for reappearance
    const interval = setInterval(() => {
      fetchScheduledPopupAds();
    }, 5 * 60 * 1000); // 5 minutes

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
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isOpen, ads.length]);

  const fetchScheduledPopupAds = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch all approved and paid popup ads
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
        .eq("payment_status", "paid")
        .order("slot_number", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Filter ads where today's date matches schedule_date or is in selected_dates
        const todayScheduledAds = data.filter((item: any) => {
          const selectedDates = item.selected_dates || [];
          return selectedDates.includes(today) || item.schedule_date === today;
        });

        const formattedAds: PopupAdItem[] = todayScheduledAds
          .map((item: any) => {
            if (item.listings) {
              const img = item.listings.listing_images?.[0]?.image_url;
              return {
                id: item.listings.id,
                title: item.listings.title || "Featured Property",
                imageUrl: img || "",
                linkUrl: null,
                isCustom: false,
                listingId: item.listings.id,
              };
            } else if (item.image_url) {
              return {
                id: item.id,
                title: item.title || "Featured Ad",
                imageUrl: item.image_url,
                linkUrl: item.link_url || null,
                isCustom: true,
                listingId: null,
              };
            }
            return null;
          })
          .filter((ad): ad is PopupAdItem => Boolean(ad && ad.imageUrl))
          .slice(0, 3); // Limit to 3 ads
        
        if (formattedAds.length > 0) {
          setAds(formattedAds);
          setIsOpen(true);
        }
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
    if (ad.isCustom) {
      if (ad.linkUrl) {
        if (ad.linkUrl.startsWith("http://") || ad.linkUrl.startsWith("https://")) {
          window.open(ad.linkUrl, "_blank", "noopener,noreferrer");
        } else {
          navigate(ad.linkUrl);
        }
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
          className="absolute top-3 right-3 z-20 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg transition-all"
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

