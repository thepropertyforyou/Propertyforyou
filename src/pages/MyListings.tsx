import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Listing {
  id: string;
  title: string;
  price: number;
  location_city: string;
  location_locality: string | null;
  is_featured: boolean;
  status: string;
  attributes?: any;
  listing_id?: string;
  customer_id?: string;
  listing_images: { image_url: string }[];
  categories: { name: string; slug: string } | null;
  invoices?: { id: string; file_url: string; invoice_number: string }[];
}

const MyListings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view your listings");
      navigate("/auth?redirect=/my-listings");
    } else if (user) {
      checkAdminStatus();
      fetchMyListings();
    }
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchMyListings = async () => {
    try {
      // Fetch Customer ID from profile if exists
      if (user?.id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("customer_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileData?.customer_id) {
          setCustomerId(profileData.customer_id);
        }
      }

      const { data, error } = await supabase
        .from("listings")
        .select(`
          id,
          title,
          price,
          location_city,
          location_locality,
          is_featured,
          status,
          attributes,
          listing_id,
          customer_id,
          listing_images(image_url),
          categories(name, slug)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      let finalData = data || [];
      
      try {
        const { data: invoicesData, error: invoicesError } = await supabase
          .from("invoices")
          .select("id, file_url, invoice_number, listing_id")
          .eq("user_id", user?.id);
          
        if (!invoicesError && invoicesData) {
          finalData = (finalData as any[]).map(listing => ({
            ...listing,
            invoices: invoicesData.filter(inv => inv.listing_id === listing.id)
          }));
        }
      } catch (invError) {
        console.error("Could not fetch invoices relation, ignoring for now", invError);
      }

      setListings(finalData as any);
    } catch (error: any) {
      console.error("Error fetching my listings:", error);
      toast.error(`Failed to load your listings: ${error?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
      toast.success("Listing deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading your listings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Listings</h1>
            <p className="text-muted-foreground">
              Manage your posted ads
            </p>
          </div>
          {customerId && (
            <div className="bg-card border border-border/80 rounded-xl px-4 py-3 shadow-xs flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                CUS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Customer ID:</span>
                  <Badge variant="outline" className="font-mono font-bold text-primary border-primary/40 bg-background text-xs">
                    {customerId}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Quote this ID when contacting support or reporting an error</p>
              </div>
            </div>
          )}
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't posted any ads yet</p>
            <Button onClick={() => navigate("/post-ad")}>Post Your First Ad</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="aspect-video bg-muted relative cursor-pointer"
                  onClick={() => navigate(`/listing/${listing.id}`)}
                >
                  {listing.listing_images?.[0] ? (
                    <img
                      src={listing.listing_images[0].image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  {listing.listing_id && (
                    <Badge variant="secondary" className="absolute top-2 right-2 font-mono text-[11px] font-bold bg-background/90 backdrop-blur-xs text-foreground shadow-xs border">
                      {listing.listing_id}
                    </Badge>
                  )}
                  {listing.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                  {listing.status !== "active" && (
                    <Badge className="absolute bottom-2 left-2 bg-destructive">
                      {listing.status}
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      {listing.listing_id || "Listing ID"}
                    </span>
                    {listing.categories?.name && (
                      <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                        {listing.categories.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-1.5 line-clamp-1">
                    <span className="truncate">{listing.title}</span>
                    {listing.attributes?.verificationStatus === 'verified' && (
                      <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-[10px] font-semibold px-1.5 py-0.5 rounded-full select-none shrink-0" title="Verified by Admin">
                        ✓ Verified
                      </span>
                    )}
                  </h3>
                  <p className="text-xl font-bold text-primary mb-2">
                    {listing.attributes?.priceUnit 
                      ? `₹${listing.price.toLocaleString()} / ${listing.attributes.priceUnit === 'sqft' ? 'Sq Ft' : listing.attributes.priceUnit === 'acre' ? 'Acre' : 'Unit'}`
                      : `₹${listing.price.toLocaleString()}`}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="line-clamp-1">
                      {listing.location_locality
                        ? `${listing.location_locality}, ${listing.location_city}`
                        : listing.location_city}
                    </span>
                  </div>
                  
                  {listing.invoices && listing.invoices.length > 0 && (
                    <div className="mb-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(listing.invoices![0].file_url, '_blank');
                        }}
                      >
                        Download Invoice
                      </Button>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-listing/${listing.id}`);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(listing.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListings;
