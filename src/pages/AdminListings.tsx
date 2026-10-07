import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Eye, Plus, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Listing {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  categories: { name: string; slug: string };
  profiles: { name: string; email: string };
  attributes?: any;
}

const AdminListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  useEffect(() => {
    setSelectedSubCategory("all");
  }, [selectedCategory]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchListings();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/admin");
      return;
    }

    try {
      const { data: hasAdminRole, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin"
      });

      if (error) throw error;

      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You are not authorized to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          id,
          title,
          price,
          status,
          created_at,
          is_featured,
          payment_proof,
          attributes,
          categories(name, slug),
          profiles(name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: "active" })
        .eq("id", listingId);

      if (error) throw error;

      // Find the listing details from state
      const listing = listings.find(l => l.id === listingId);

      // Check if there's an invoice for this listing and send it
      if (listing) {
        const { data: invoices } = await supabase
          .from("invoices")
          .select("*")
          .eq("listing_id", listingId);

        if (invoices && invoices.length > 0) {
          const invoice = invoices[0];
          
          try {
            await supabase.functions.invoke("send-invoice", {
              body: {
                email: listing.profiles?.email,
                phone: null, // Phone might not be readily available in this simple interface, could fetch if needed
                invoiceUrl: invoice.file_url,
                userName: listing.profiles?.name,
                invoiceNumber: invoice.invoice_number,
              },
            });
          } catch (err) {
            console.error("Error sending invoice:", err);
          }
        }
      }

      toast({
        title: "Success",
        description: "Listing approved and published successfully",
      });

      fetchListings();
    } catch (error) {
      console.error("Error approving listing:", error);
      toast({
        title: "Error",
        description: "Failed to approve listing",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: "rejected" })
        .eq("id", listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing rejected successfully",
      });

      fetchListings();
    } catch (error) {
      console.error("Error rejecting listing:", error);
      toast({
        title: "Error",
        description: "Failed to reject listing",
        variant: "destructive",
      });
    }
  };

  if (authLoading || !isAdmin || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  const filteredListings = listings.filter((listing) => {
    if (selectedCategory !== "all" && listing.categories.slug !== selectedCategory) {
      return false;
    }
    if (selectedSubCategory !== "all") {
      const sub = listing.attributes?.subCategory?.toLowerCase();
      if (sub !== selectedSubCategory.toLowerCase()) {
        return false;
      }
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Listings Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all property listings
            </p>
          </div>
          <Button onClick={() => navigate("/admin/listings/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Listings</CardTitle>
            <CardDescription>View and manage all property listings (Free and Paid)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6 bg-muted/40 p-4 rounded-lg">
              <div className="w-full sm:w-[200px] space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Main Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory !== "all" && (
                <div className="w-full sm:w-[200px] space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Subcategory</label>
                  <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="All Subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {selectedCategory === "properties" && (
                        <>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="lease">Lease</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {filteredListings.map((listing) => {
                const sub = listing.attributes?.subCategory;
                const formatSub = sub ? (sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase()) : null;

                return (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{listing.title}</h3>
                        <Badge variant={listing.status === "active" ? "default" : listing.status === "rejected" ? "destructive" : "secondary"}>
                          {listing.status}
                        </Badge>
                        <Badge variant="outline">{listing.categories.name}</Badge>
                        {formatSub && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            {formatSub}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {listing.attributes?.priceUnit 
                          ? `₹${listing.price.toLocaleString()} / ${listing.attributes.priceUnit === 'sqft' ? 'Sq Ft' : listing.attributes.priceUnit === 'acre' ? 'Acre' : 'Unit'}`
                          : `₹${listing.price.toLocaleString()}`} • By {listing.profiles.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/listings/edit/${listing.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/listing/${listing.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(listing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {listing.status !== "active" && (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(listing.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {listing.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-amber-600 hover:bg-amber-700"
                          onClick={() => handleReject(listing.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminListings;
