import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";

interface Listing {
  id: string;
  title: string;
  price: number;
  location_city: string;
  location_locality: string | null;
  category_id: string;
  listing_images: { image_url: string }[];
  categories: { name: string; slug: string } | null;
}

const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("listings")
        .select(`
          id,
          title,
          price,
          location_city,
          location_locality,
          category_id,
          categories (name, slug),
          listing_images (image_url)
        `)
        .eq("is_featured", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });



      const { data, error } = await query;

      if (error) throw error;

      setListings(data as any || []);
    } catch (error) {
      console.error("Error loading featured listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              ⭐ Featured Listings
            </h2>
            <p className="text-muted-foreground text-lg">
              Premium verified listings across all categories
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-muted-foreground text-lg">
                No featured listings available
              </p>
              <Link to="/post-ad">
                <Button className="rounded-full">
                  List Your Item as Featured
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
