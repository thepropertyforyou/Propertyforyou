import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, Plus, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FeaturedRequest {
  id: string;
  title: string;
  price: number;
  is_featured: boolean;
  status: string;
  payment_proof: string | null;
  created_at: string;
  user_id: string;
  seller_phone: string;
  profiles: { name: string; email: string };
}

const AdminFeatured = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const [requests, setRequests] = useState<FeaturedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allListings, setAllListings] = useState<{ id: string; title: string }[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newFeatured, setNewFeatured] = useState({
    listingId: "",
    proof: ""
  });

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
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

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          id,
          title,
          price,
          is_featured,
          payment_proof,
          status,
          created_at,
          user_id,
          seller_phone,
          profiles(name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch featured requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (listingId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({ is_featured: !currentStatus })
        .eq("id", listingId);

      if (error) throw error;

      if (!currentStatus) {
        // Generating invoice for making it featured
        try {
          const request = requests.find((r) => r.id === listingId);
          if (request) {
            const { generateInvoiceBlob } = await import("@/utils/generateInvoice");
            const invoiceNumber = `INV-${Date.now()}`;
            
            // Fetch dynamic featured pricing from database (checking featured_30 or featured)
            const { data: plansData } = await supabase
              .from("pricing_plans")
              .select("plan_type, price")
              .in("plan_type", ["featured_30", "featured"]);
            
            const featured30 = plansData?.find(p => p.plan_type === "featured_30");
            const featuredBase = plansData?.find(p => p.plan_type === "featured");
            const amount = featured30 ? Number(featured30.price) : (featuredBase ? Number(featuredBase.price) : 499);

            const blob = await generateInvoiceBlob({
              invoiceNumber,
              userName: request.profiles?.name || "Customer",
              userEmail: request.profiles?.email || "",
              userPhone: request.seller_phone,
              planName: "Featured Listing Promotion",
              amount,
            });

            const fileName = `${request.id}_${invoiceNumber}.pdf`;
            const { error: uploadError } = await supabase.storage
              .from("invoices")
              .upload(fileName, blob, { contentType: "application/pdf" });

            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage
                .from("invoices")
                .getPublicUrl(fileName);

              const { error: invoiceError } = await supabase.from("invoices").insert({
                invoice_number: invoiceNumber,
                user_id: request.user_id,
                listing_id: request.id,
                amount: amount,
                file_url: publicUrl,
              });

              if (!invoiceError) {
                // Invoke Edge Function for email & WhatsApp
                supabase.functions.invoke("send-invoice", {
                  body: {
                    email: request.profiles?.email,
                    phone: request.seller_phone,
                    invoiceUrl: publicUrl,
                    userName: request.profiles?.name,
                    invoiceNumber,
                  },
                }).catch(err => console.error("Edge function error:", err));
              }
            }
          }
        } catch (invoiceErr) {
          console.error("Error generating invoice:", invoiceErr);
        }
      }

      toast({
        title: "Success",
        description: `Listing ${!currentStatus ? "featured" : "unfeatured"} successfully`,
      });

      fetchRequests();
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
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

      toast({
        title: "Success",
        description: "Listing approved successfully",
      });

      fetchRequests();
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

      fetchRequests();
    } catch (error) {
      console.error("Error rejecting listing:", error);
      toast({
        title: "Error",
        description: "Failed to reject listing",
        variant: "destructive",
      });
    }
  };

  const handleProofUpload = async (listingId: string, url: string) => {
    if (!url) return;
    try {
      const { error } = await supabase
        .from("listings")
        .update({ payment_proof: url })
        .eq("id", listingId);

      if (error) throw error;
      toast({ title: "Success", description: "Payment proof uploaded" });
      fetchRequests();
    } catch (error) {
      console.error("Error uploading proof:", error);
      toast({ title: "Error", description: "Failed to upload proof", variant: "destructive" });
    }
  };

  const fetchAllListings = async () => {
    const { data } = await supabase.from('listings').select('id, title').eq('is_featured', false).eq('status', 'active');
    if (data) setAllListings(data);
  };

  const handleCreateFeatured = async () => {
    if (!newFeatured.listingId) {
      toast({ title: "Error", description: "Please select a listing", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update({ 
          is_featured: true,
          payment_proof: newFeatured.proof 
        })
        .eq('id', newFeatured.listingId);

      if (error) throw error;
      toast({ title: "Success", description: "Listing featured successfully" });
      setNewFeatured({ listingId: "", proof: "" });
      fetchRequests();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to feature listing", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Featured Management</h1>
            <p className="text-muted-foreground mt-1">Boost active listings to featured status</p>
          </div>
          <Dialog onOpenChange={(open) => { if(open) fetchAllListings(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Featured Listing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manually Feature a Listing</DialogTitle>
                <DialogDescription>Select an active listing to boost as featured</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Listing *</Label>
                  <Select value={newFeatured.listingId} onValueChange={(val) => setNewFeatured({...newFeatured, listingId: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search listing..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allListings.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <ImageUpload 
                      bucket="listing-images"
                      onUploadComplete={(url) => setNewFeatured({...newFeatured, proof: url})}
                      label="Payment Proof (Optional)"
                   />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateFeatured} disabled={isCreating}>
                  {isCreating ? <Loader2 className="animate-spin mr-2" /> : "Boost to Featured"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Paid Featured Listings</CardTitle>
            <CardDescription>Approve or remove paid featured listings with payment proof</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{request.title}</h3>
                      <Badge variant={request.is_featured ? "default" : "secondary"}>
                        {request.is_featured ? "Featured" : "Not Featured"}
                      </Badge>
                      <Badge variant={request.status === "active" ? "default" : request.status === "rejected" ? "destructive" : "secondary"}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ₹{request.price.toLocaleString()} • By {request.profiles.name} ({request.profiles.email})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                    {request.payment_proof ? (
                      <a
                        href={request.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View Payment Proof
                      </a>
                    ) : (
                      <div className="mt-2 w-32">
                        <ImageUpload 
                          bucket="listing-images"
                          onUploadComplete={(url) => handleProofUpload(request.id, url)}
                          label="Upload Proof"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={request.is_featured ? "secondary" : "default"}
                      onClick={() => handleToggleFeatured(request.id, request.is_featured)}
                    >
                      {request.is_featured ? "Remove Featured" : "Make Featured"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/listing/${request.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status !== "active" && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    {request.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => handleReject(request.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {requests.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No featured requests found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFeatured;
