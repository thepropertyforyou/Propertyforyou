import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  image_url: string;
  link_url?: string | null;
}

const Banners = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setBanner(data[0]);
        } else {
          const fallback = await supabase
            .from("banners")
            .select("*")
            .eq("is_active", true)
            .limit(1);
          if (fallback.data && fallback.data.length > 0) {
            setBanner(fallback.data[0]);
          } else {
            setBanner(null);
          }
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading || !banner) return null;

  return (
    <section className="py-8">
      <div className="w-full">
        <a 
          href={banner.link_url || "#"} 
          target={banner.link_url ? "_blank" : "_self"} 
          rel="noopener noreferrer"
          className="block w-full h-[150px] md:h-[300px] overflow-hidden group relative"
        >
          <img
            src={banner.image_url}
            alt="Homepage Banner"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {banner.link_url && (
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          )}
        </a>
      </div>
    </section>
  );
};

export default Banners;
