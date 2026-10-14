import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Sponsorship {
  id: string;
  business_name: string;
  banner_url: string;
  destination_url: string;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
}

const SponsoredAdCard = ({
  sponsorships,
  onSponsorshipClick,
}: {
  sponsorships: Sponsorship[];
  onSponsorshipClick: (sponsorship: Sponsorship) => void;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 2 seconds, continuously, looping forever, and pause on hover
  const autoplay = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  useEffect(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Card className="p-4 overflow-hidden border rounded-2xl shadow-sm bg-card">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Sponsored</h3>

      {sponsorships.length === 1 ? (
        <a
          href={sponsorships[0].destination_url || "#"}
          target={sponsorships[0].destination_url ? "_blank" : "_self"}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (sponsorships[0].destination_url) {
              e.preventDefault();
              onSponsorshipClick(sponsorships[0]);
            }
          }}
          className="block w-full cursor-pointer group"
        >
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <img
              src={sponsorships[0].banner_url}
              alt={sponsorships[0].business_name || "Sponsored Ad"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {sponsorships[0].business_name && (
            <p className="mt-2 text-xs font-medium text-muted-foreground truncate">
              {sponsorships[0].business_name}
            </p>
          )}
        </a>
      ) : (
        <div>
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[autoplay.current]}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {sponsorships.map((sponsorship) => (
                <CarouselItem key={sponsorship.id}>
                  <a
                    href={sponsorship.destination_url || "#"}
                    target={sponsorship.destination_url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (sponsorship.destination_url) {
                        e.preventDefault();
                        onSponsorshipClick(sponsorship);
                      }
                    }}
                    className="block w-full cursor-pointer group"
                  >
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                      <img
                        src={sponsorship.banner_url}
                        alt={sponsorship.business_name || "Sponsored Ad"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    {sponsorship.business_name && (
                      <p className="mt-2 text-xs font-medium text-muted-foreground truncate">
                        {sponsorship.business_name}
                      </p>
                    )}
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 pt-2.5">
            {sponsorships.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const SponsoredAdsSidebar = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveSponsorships = async () => {
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from("sponsorships")
        .select("id, business_name, banner_url, destination_url, start_date, end_date, status, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter only currently active sponsorships
      const active = (data || []).filter((s) => {
        if (!s.banner_url) return false;
        if (s.start_date && new Date(s.start_date) > now) return false;
        if (s.end_date && new Date(s.end_date) < now) return false;
        return true;
      });

      setSponsorships(active);
    } catch (error) {
      console.error("Error fetching active sponsorships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSponsorships();

    // Subscribe to live postgres changes so admin updates reflect immediately
    const channel = supabase
      .channel("public:sponsorships:sidebar")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sponsorships" },
        () => {
          fetchActiveSponsorships();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClick = async (sponsorship: Sponsorship) => {
    if (!sponsorship.destination_url) return;

    try {
      const { data: currentData } = await supabase
        .from("sponsorships")
        .select("clicks")
        .eq("id", sponsorship.id)
        .single();

      if (currentData) {
        await supabase
          .from("sponsorships")
          .update({ clicks: (currentData.clicks || 0) + 1 })
          .eq("id", sponsorship.id);
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    } finally {
      const targetUrl = sponsorship.destination_url.startsWith("http")
        ? sponsorship.destination_url
        : `https://${sponsorship.destination_url}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Only show when at least one sponsorship exists (replaces Ad Space placeholder completely)
  if (loading || sponsorships.length === 0) {
    return null;
  }

  // Each card holds up to 3 images; 4th goes into next card below (stacked line by line)
  const cardChunks: Sponsorship[][] = [];
  for (let i = 0; i < sponsorships.length; i += 3) {
    cardChunks.push(sponsorships.slice(i, i + 3));
  }

  return (
    <div className="space-y-6">
      {cardChunks.map((chunk, index) => (
        <SponsoredAdCard
          key={`sponsored-card-${index}`}
          sponsorships={chunk}
          onSponsorshipClick={handleClick}
        />
      ))}
    </div>
  );
};

export default SponsoredAdsSidebar;
