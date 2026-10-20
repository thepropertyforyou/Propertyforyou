import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FilterDrawer } from "@/components/FilterDrawer";
import { Button } from "@/components/ui/button";
import { ListingSort } from "@/components/ListingSort";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Filter, X, Star } from "lucide-react";
import { statesAndDistricts } from "@/data/india-locations";
import { ListingCard } from "@/components/ListingCard";
import SponsoredAdsSidebar from "@/components/SponsoredAdsSidebar";
import { parsePriceToNumber } from "@/lib/priceUtils";
import { searchListings } from "@/utils/propertySearch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Listing {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  location_city: string;
  location_locality: string | null;
  is_featured: boolean;
  listing_id?: string | null;
  attributes: any;
  created_at: string;
  listing_images: { image_url: string; display_order?: number }[];
  categories?: { name: string } | null;
}

const ITEMS_PER_PAGE = 12;

const Properties = () => {
  const navigate = useNavigate();
  const { subCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    state: "",
    district: "",
    taluk: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    bedrooms: "",
    featuredOnly: searchParams.get("featured") === "true" || searchParams.get("featuredOnly") === "true",
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlFeatured = searchParams.get("featured") === "true" || searchParams.get("featuredOnly") === "true";
    setFilters((prev) => {
      const searchMatches = prev.search === urlSearch;
      const featuredMatches = Boolean(prev.featuredOnly) === urlFeatured;
      if (searchMatches && featuredMatches) return prev;
      return { ...prev, search: urlSearch, featuredOnly: urlFeatured };
    });
  }, [searchParams]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [listings, filters, sortBy, subCategory]);

  const fetchListings = async () => {
    try {
      const { data: categories } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "properties")
        .single();

      if (!categories) return;

      const { data, error } = await supabase
        .from("listings")
        .select(`
          id,
          title,
          description,
          price,
          location_city,
          location_locality,
          is_featured,
          listing_id,
          attributes,
          created_at,
          listing_images(image_url, display_order),
          categories(name)
        `)
        .eq("category_id", categories.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortListings = (list: Listing[], sortKey: string) => {
    return [...list].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;

      switch (sortKey) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  };

  const applyFiltersAndSort = () => {
    let filtered = [...listings];

    if (subCategory) {
      filtered = filtered.filter(
        (listing) => 
          listing.attributes?.subCategory?.toLowerCase() === subCategory.toLowerCase()
      );
    }

    if (filters.state && filters.state !== "all") {
      const stateDistricts = statesAndDistricts.find(s => s.state === filters.state)?.districts || [];
      filtered = filtered.filter(listing => 
        stateDistricts.some(d => d.name === listing.location_city)
      );
    }

    if (filters.district && filters.district !== "all") {
      filtered = filtered.filter(
        (listing) => listing.location_city.toLowerCase() === filters.district.toLowerCase()
      );
    }

    if (filters.taluk && filters.taluk !== "all") {
      filtered = filtered.filter(
        (listing) => 
          listing.location_locality?.toLowerCase() === filters.taluk.toLowerCase()
      );
    }

    if (filters.minPrice) {
      const min = parsePriceToNumber(filters.minPrice);
      if (min > 0) {
        filtered = filtered.filter((listing) => listing.price >= min);
      }
    }
    if (filters.maxPrice) {
      const max = parsePriceToNumber(filters.maxPrice);
      if (max > 0) {
        filtered = filtered.filter((listing) => listing.price <= max);
      }
    }

    if (filters.propertyType && filters.propertyType !== "all") {
      filtered = filtered.filter(
        (listing) =>
          listing.attributes?.propertyType?.toLowerCase() ===
          filters.propertyType.toLowerCase()
      );
    }

    if (filters.bedrooms && filters.bedrooms !== "all") {
      filtered = filtered.filter(
        (listing) => listing.attributes?.bedrooms === filters.bedrooms
      );
    }

    if (filters.featuredOnly) {
      filtered = filtered.filter((listing) => listing.is_featured);
    }

    let exactResults: Listing[] = [];
    let similarResults: Listing[] = [];

    if (filters.search && filters.search.trim()) {
      const searchResult = searchListings(filtered, filters.search);
      exactResults = searchResult.exactMatches;
      similarResults = searchResult.similarMatches;
    } else {
      exactResults = filtered;
      similarResults = [];
    }

    setFilteredListings(sortListings(exactResults, sortBy));
    setSimilarListings(sortListings(similarResults, sortBy));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "search") {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value && String(value).trim()) {
          next.set("search", value);
        } else {
          next.delete("search");
        }
        return next;
      }, { replace: true });
    }
    if (key === "featuredOnly") {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set("featured", "true");
        } else {
          next.delete("featured");
          next.delete("featuredOnly");
        }
        return next;
      }, { replace: true });
    }
  };

  const handleReset = () => {
    setFilters({
      search: "",
      state: "",
      district: "",
      taluk: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      bedrooms: "",
      featuredOnly: false,
    });
    setSimilarListings([]);
    setSearchParams({}, { replace: true });
  };

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentListings = filteredListings.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {subCategory 
              ? `Properties - ${subCategory.charAt(0).toUpperCase() + subCategory.slice(1).toLowerCase()}` 
              : "Properties"}
          </h1>
          <p className="text-muted-foreground">
            {subCategory 
              ? `Browse properties for ${subCategory.toLowerCase()}` 
              : "Find your dream property"}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Left: Listings */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-4">
              <Button onClick={() => setFilterOpen(true)} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full"
                />
                {Object.values(filters).some(v => v && v !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleReset}
                    className="shrink-0"
                    title="Clear all filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {filters.featuredOnly && (
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30 gap-1.5 py-1 px-2.5 text-xs font-medium cursor-pointer hover:bg-yellow-500/20 transition-colors"
                  onClick={() => handleFilterChange("featuredOnly", false)}
                  title="Click to remove filter"
                >
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  Featured Only
                  <X className="h-3 w-3 ml-0.5" />
                </Badge>
              </div>
            )}

            <FilterDrawer
              category="properties"
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              onSearch={applyFiltersAndSort}
              open={filterOpen}
              onOpenChange={setFilterOpen}
            />

            <ListingSort value={sortBy} onChange={setSortBy} />

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : currentListings.length === 0 && similarListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No properties found</p>
                {filters.search && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No properties matched or were similar to "{filters.search}".
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* When exact matches exist */}
                {currentListings.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {currentListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <Pagination className="mt-8">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              className={
                                currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}

                {/* Notice when 0 exact matches exist, but similar results DO exist */}
                {currentListings.length === 0 && similarListings.length > 0 && (
                  <div className="bg-muted/40 rounded-lg p-4 border border-border/60 mb-2">
                    <p className="text-sm text-muted-foreground">
                      No exact matches found for "<span className="font-medium text-foreground">{filters.search}</span>". Showing similar results below:
                    </p>
                  </div>
                )}

                {/* Similar Results Section */}
                {similarListings.length > 0 && (
                  <div className={currentListings.length > 0 ? "mt-12 pt-8 border-t border-border" : "mt-2"}>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-foreground">Similar results</h2>
                      <Badge variant="secondary" className="text-xs">
                        {similarListings.length}
                      </Badge>
                    </div>
                    {currentListings.length > 0 && (
                      <p className="text-sm text-muted-foreground mb-6">
                        Didn't find what you were looking for? Here are properties similar to your search:
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {similarListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Sponsored Ads */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SponsoredAdsSidebar />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
