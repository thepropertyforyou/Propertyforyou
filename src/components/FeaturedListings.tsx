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
          is_featured,
          category_id,
          attributes,
          categories (name, slug),
          listing_images (image_url, display_order)
        `)
        .eq("is_featured", true)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);

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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                ⭐ Featured Listings
              </h2>
              <p className="text-muted-foreground text-lg">
                Premium verified listings across all categories
              </p>
            </div>
            <Link
              to="/properties?featured=true"
              className="text-primary hover:text-primary/80 font-semibold inline-flex items-center justify-center gap-1 text-sm sm:text-base hover:underline self-center sm:self-end"
            >
              View all →
            </Link>
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
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing as any} />
                ))}
              </div>
              <div className="text-center pt-2">
                <Link to="/properties?featured=true">
                  <Button variant="outline" className="rounded-full px-6">
                    View all →
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
