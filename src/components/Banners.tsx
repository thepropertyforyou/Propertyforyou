import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  display_order: number;
}

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        setBanners(data || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <section className="py-8">
      <div className="w-full max-w-[1200px] mx-auto">
        <Carousel
          opts={{
            loop: banners.length > 1,
            align: "start",
          }}
          plugins={banners.length > 1 ? [autoplay.current] : []}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <a 
                  href={banner.link_url || "#"} 
                  target={banner.link_url ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                  className="block w-full h-[150px] md:h-[300px] overflow-hidden group relative"
                >
                  <img
                    src={banner.image_url}
                    alt="Banner"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {banner.link_url && (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  )}
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          {banners.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default Banners;
