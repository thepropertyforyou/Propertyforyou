import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, CheckCircle, XCircle, Eye, DollarSign, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PopupSchedule {
  id: string;
  schedule_date: string;
  slot_number: number;
  payment_status: string;
  payment_amount: number;
  payment_proof: string | null;
  admin_approved: boolean;
  image_url?: string | null;
  link_url?: string | null;
  title?: string | null;
  listings?: {
    id: string;
    title: string;
    price: number;
    user_id: string;
    seller_phone: string;
    listing_id?: string;
    customer_id?: string;
    attributes?: any;
    profiles: { name: string; email: string };
  } | null;
}

const AdminPopupAds = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [schedules, setSchedules] = useState<PopupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [allListings, setAllListings] = useState<{ id: string; title: string }[]>([]);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAdType, setNewAdType] = useState<"listing" | "custom">("listing");
  const [newAd, setNewAd] = useState({
    listingId: "",
    date: "",
    slot: "1",
    amount: "499",
    proof: "",
    imageUrl: "",
    linkUrl: "",
    title: "",
  });
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; scheduleId: string | null }>({
    open: false,
    scheduleId: null,
  });
  const [paymentAmount, setPaymentAmount] = useState("");

  const [editAd, setEditAd] = useState({
    id: "",
    isCustom: false,
    listingId: "",
    date: "",
    slot: "1",
    amount: "499",
    imageUrl: "",
    linkUrl: "",
    title: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchSchedules();
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
      fetchSchedules();
      fetchAllListings();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const fetchAllListings = async () => {
    const { data } = await supabase.from('listings').select('id, title').eq('status', 'active');
    if (data) setAllListings(data);
  };

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("popup_ad_schedules")
        .select(`
          id,
          schedule_date,
          slot_number,
          payment_status,
          payment_amount,
          payment_proof,
          admin_approved,
          image_url,
          link_url,
          title,
          listings (
            id,
            title,
            price,
            user_id,
            seller_phone,
            listing_id,
            customer_id,
            attributes,
            profiles (name, email)
          )
        `)
        .order("schedule_date", { ascending: false })
        .order("slot_number", { ascending: true });

      if (error) throw error;
      setSchedules((data as any) || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch popup ad schedules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async (action: "approve" | "reject") => {
    if (!paymentDialog.scheduleId) return;

    try {
      const updates: any = {
        payment_status: action === "approve" ? "paid" : "rejected",
      };

      if (action === "approve") {
        updates.admin_approved = true;
        if (paymentAmount) {
          updates.payment_amount = parseFloat(paymentAmount);
        }
      }

      const { error } = await supabase
        .from("popup_ad_schedules")
        .update(updates)
        .eq("id", paymentDialog.scheduleId);

      if (error) throw error;

      if (action === "approve") {
        try {
          const schedule = schedules.find((s) => s.id === paymentDialog.scheduleId);
          if (schedule && schedule.listings) {
            const { generateInvoiceBlob } = await import("@/utils/generateInvoice");
            const invoiceNumber = `INV-${Date.now()}`;
            const amount = parseFloat(paymentAmount || schedule.payment_amount.toString());
            
            const blob = await generateInvoiceBlob({
              invoiceNumber,
              userName: schedule.listings.profiles?.name || "Customer",
              userEmail: schedule.listings.profiles?.email || "",
              userPhone: schedule.listings.seller_phone,
              planName: "Popup Ad Promotion",
              amount,
            });

            const fileName = `${schedule.listings.id}_${invoiceNumber}.pdf`;
            const { error: uploadError } = await supabase.storage
              .from("invoices")
              .upload(fileName, blob, { contentType: "application/pdf" });

            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage
                .from("invoices")
                .getPublicUrl(fileName);

              const { error: invoiceError } = await supabase.from("invoices").insert({
                invoice_number: invoiceNumber,
                user_id: schedule.listings.user_id,
                listing_id: schedule.listings.id,
                amount: amount,
                file_url: publicUrl,
              });

              if (!invoiceError) {
                // Invoke Edge Function for email & WhatsApp
                supabase.functions.invoke("send-invoice", {
                  body: {
                    email: schedule.listings.profiles?.email,
                    phone: schedule.listings.seller_phone,
                    invoiceUrl: publicUrl,
                    userName: schedule.listings.profiles?.name,
                    invoiceNumber,
                  },
                }).catch(err => console.error("Edge function error:", err));
              } else {
                 console.error("Failed to insert invoice record:", invoiceError);
              }
            } else {
              console.error("Failed to upload invoice PDF:", uploadError);
            }
          }
        } catch (invoiceErr) {
          console.error("Error generating invoice:", invoiceErr);
        }
      }

      toast({
        title: "Success",
        description: `Payment ${action === "approve" ? "approved" : "rejected"} successfully`,
      });

      setPaymentDialog({ open: false, scheduleId: null });
      setPaymentAmount("");
      fetchSchedules();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const handleProofUpload = async (scheduleId: string, url: string) => {
    if (!url) return;
    try {
      const { error } = await supabase
        .from("popup_ad_schedules")
        .update({ payment_proof: url })
        .eq("id", scheduleId);

      if (error) throw error;
      toast({ title: "Success", description: "Payment proof uploaded" });
      fetchSchedules();
    } catch (error) {
      console.error("Error uploading proof:", error);
      toast({ title: "Error", description: "Failed to upload proof", variant: "destructive" });
    }
  };

  const handleCreateAd = async () => {
    if (newAdType === "listing" && !newAd.listingId) {
      toast({ title: "Error", description: "Please select a listing", variant: "destructive" });
      return;
    }
    if (newAdType === "custom" && !newAd.imageUrl) {
      toast({ title: "Error", description: "Please upload an ad image", variant: "destructive" });
      return;
    }
    if (!newAd.date) {
      toast({ title: "Error", description: "Please select a schedule date", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      // Check for double booking
      const { data: existingSlots, error: checkError } = await supabase
        .from('popup_ad_schedules')
        .select('id')
        .eq('schedule_date', newAd.date)
        .eq('slot_number', parseInt(newAd.slot));
        
      if (checkError) throw checkError;
      
      if (existingSlots && existingSlots.length > 0) {
        toast({ title: "Error", description: "This slot is already booked for the selected date", variant: "destructive" });
        setIsCreating(false);
        return;
      }

      const insertPayload: any = {
        schedule_date: newAd.date,
        slot_number: parseInt(newAd.slot),
        payment_amount: parseFloat(newAd.amount || "0"),
        payment_proof: newAd.proof || null,
        payment_status: 'paid',
        admin_approved: true,
        selected_dates: [newAd.date],
      };

      if (newAdType === "custom") {
        insertPayload.listing_id = null;
        insertPayload.image_url = newAd.imageUrl;
        insertPayload.link_url = newAd.linkUrl ? newAd.linkUrl.trim() : null;
        insertPayload.title = "Custom Popup Ad";
      } else {
        insertPayload.listing_id = newAd.listingId;
      }

      const { error } = await supabase
        .from('popup_ad_schedules')
        .insert(insertPayload);

      if (error) throw error;
      toast({ title: "Success", description: "Popup ad created successfully" });
      setNewAd({ listingId: "", date: "", slot: "1", amount: "499", proof: "", imageUrl: "", linkUrl: "", title: "" });
      setIsCreateDialogOpen(false);
      fetchSchedules();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create ad", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this popup ad?")) return;
    
    setIsDeleting(id);
    try {
      const { error } = await supabase.from('popup_ad_schedules').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Popup ad deleted successfully" });
      fetchSchedules();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete ad", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditAdSubmit = async () => {
    if (!editAd.isCustom && !editAd.listingId) {
      toast({ title: "Error", description: "Please select a listing", variant: "destructive" });
      return;
    }
    if (editAd.isCustom && !editAd.imageUrl) {
      toast({ title: "Error", description: "Please upload an ad image", variant: "destructive" });
      return;
    }
    if (!editAd.date) {
      toast({ title: "Error", description: "Please select a schedule date", variant: "destructive" });
      return;
    }

    try {
      const { data: existingSlots, error: checkError } = await supabase
        .from('popup_ad_schedules')
        .select('id')
        .eq('schedule_date', editAd.date)
        .eq('slot_number', parseInt(editAd.slot))
        .neq('id', editAd.id);
        
      if (checkError) throw checkError;
      
      if (existingSlots && existingSlots.length > 0) {
        toast({ title: "Error", description: "This slot is already booked for the selected date", variant: "destructive" });
        return;
      }

      const updatePayload: any = {
        schedule_date: editAd.date,
        slot_number: parseInt(editAd.slot),
        selected_dates: [editAd.date],
      };

      if (editAd.isCustom) {
        updatePayload.listing_id = null;
        updatePayload.image_url = editAd.imageUrl;
        updatePayload.link_url = editAd.linkUrl ? editAd.linkUrl.trim() : null;
      } else {
        updatePayload.listing_id = editAd.listingId;
      }

      const { error } = await supabase
        .from('popup_ad_schedules')
        .update(updatePayload)
        .eq('id', editAd.id);

      if (error) throw error;
      toast({ title: "Success", description: "Popup ad updated successfully" });
      setIsEditDialogOpen(false);
      fetchSchedules();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update ad", variant: "destructive" });
    }
  };

  const groupByDate = (schedules: PopupSchedule[]) => {
    const grouped: Record<string, PopupSchedule[]> = {};
    schedules.forEach((schedule) => {
      const date = schedule.schedule_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
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

  const groupedSchedules = groupByDate(schedules);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Popup Ads Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage scheduled popup ads (max 3 per day)
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setNewAdType("listing");
                setNewAd({ listingId: "", date: "", slot: "1", amount: "499", proof: "", imageUrl: "", linkUrl: "", title: "" });
                setIsCreateDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Popup Ad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Popup Ad</DialogTitle>
                <DialogDescription>Schedule a popup ad from an existing listing or create a custom ad</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Mode Selector */}
                <div className="flex border rounded-lg p-1 bg-muted/50">
                  <button
                    type="button"
                    onClick={() => setNewAdType("listing")}
                    className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                      newAdType === "listing" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Select Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAdType("custom")}
                    className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                      newAdType === "custom" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Custom Ad
                  </button>
                </div>

                {newAdType === "listing" ? (
                  <div className="space-y-2">
                    <Label>Select Listing *</Label>
                    <Select value={newAd.listingId} onValueChange={(val) => setNewAd({...newAd, listingId: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Search listing..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allListings.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Ad Image *</Label>
                      {newAd.imageUrl && (
                        <div className="relative aspect-video w-full rounded-md overflow-hidden border mb-2 bg-muted">
                          <img src={newAd.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <ImageUpload 
                        bucket="popup-ads"
                        onUploadComplete={(url) => setNewAd(prev => ({ ...prev, imageUrl: url }))}
                        label={newAd.imageUrl ? "Replace Ad Image" : "Upload Ad Image"}
                        targetWidth={1280}
                        targetHeight={720}
                        recommendedSize="Recommended: 1280 × 720 px (16:9)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-link-url">Link URL (Optional)</Label>
                      <Input
                        id="custom-link-url"
                        type="url"
                        placeholder="https://example.com"
                        value={newAd.linkUrl}
                        onChange={(e) => setNewAd(prev => ({ ...prev, linkUrl: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Schedule Date *</Label>
                    <Input type="date" value={newAd.date} onChange={(e) => setNewAd({...newAd, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Slot (1-3) *</Label>
                    <Select value={newAd.slot} onValueChange={(val) => setNewAd({...newAd, slot: val})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Slot 1</SelectItem>
                        <SelectItem value="2">Slot 2</SelectItem>
                        <SelectItem value="3">Slot 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateAd} disabled={isCreating}>
                  {isCreating ? <Loader2 className="animate-spin mr-2" /> : "Create Ad"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
                <CardDescription>
                  {daySchedules.length} / 3 slots booked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {daySchedules.map((schedule) => {
                    const isCustom = !schedule.listings;
                    return (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {schedule.listings?.listing_id && (
                              <Badge variant="outline" className="font-mono text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200">
                                {schedule.listings.listing_id}
                              </Badge>
                            )}
                            {schedule.listings?.customer_id && (
                              <Badge variant="outline" className="font-mono text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200">
                                {schedule.listings.customer_id}
                              </Badge>
                            )}
                            <Badge variant="outline">Slot {schedule.slot_number}</Badge>
                            {isCustom && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 font-medium">
                                Custom Ad
                              </Badge>
                            )}
                            <h3 className="font-semibold">{schedule.listings?.title || schedule.title || "Custom Popup Ad"}</h3>
                            <Badge 
                              variant={
                                schedule.payment_status === "paid" 
                                  ? "default" 
                                  : schedule.payment_status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {schedule.payment_status}
                            </Badge>
                            {schedule.admin_approved && (
                              <Badge variant="featured">Approved</Badge>
                            )}
                            {schedule.listings?.attributes?.plan_name && (
                              <Badge variant="outline" className="border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/50">
                                {schedule.listings.attributes.plan_name} ({schedule.listings.attributes.plan_duration} Days)
                              </Badge>
                            )}
                          </div>

                          {isCustom ? (
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center gap-3">
                                {schedule.image_url ? (
                                  <div className="w-24 h-14 rounded-md overflow-hidden bg-muted border shrink-0">
                                    <img src={schedule.image_url} alt="Custom ad" className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-24 h-14 rounded-md bg-muted border shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                                    No image
                                  </div>
                                )}
                                <div className="text-sm space-y-1">
                                  {schedule.link_url ? (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                      <span className="font-medium text-foreground">Link URL:</span>
                                      <a
                                        href={schedule.link_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline max-w-sm truncate inline-block align-bottom"
                                      >
                                        {schedule.link_url}
                                      </a>
                                    </p>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">No link URL provided</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    Popup Ad Fee: ₹{schedule.payment_amount.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                ₹{schedule.listings?.price?.toLocaleString() || 0} • 
                                By {schedule.listings?.profiles?.name || "Customer"} ({schedule.listings?.profiles?.email || "No email"})
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Popup Ad Fee: ₹{schedule.payment_amount.toLocaleString()}
                              </p>
                            </>
                          )}

                          {schedule.payment_proof ? (
                            <div className="mt-1">
                              <a
                                href={schedule.payment_proof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View Payment Proof
                              </a>
                            </div>
                          ) : (
                            !isCustom && (
                              <div className="mt-2 w-36">
                                <ImageUpload 
                                  bucket="popup-ads"
                                  onUploadComplete={(url) => handleProofUpload(schedule.id, url)}
                                  label="Upload Proof"
                                  targetWidth={800}
                                  targetHeight={1000}
                                  recommendedSize="Recommended: 800 × 1000 px"
                                />
                              </div>
                            )
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/popup-ads/${schedule.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditAd({
                                id: schedule.id,
                                isCustom,
                                listingId: schedule.listings?.id || "",
                                date: schedule.schedule_date,
                                slot: schedule.slot_number.toString(),
                                amount: schedule.payment_amount.toString(),
                                imageUrl: schedule.image_url || "",
                                linkUrl: schedule.link_url || "",
                                title: schedule.title || "",
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAd(schedule.id)}
                            disabled={isDeleting === schedule.id}
                          >
                            {isDeleting === schedule.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                          {schedule.payment_status === "pending" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                setPaymentDialog({ open: true, scheduleId: schedule.id });
                                setPaymentAmount(schedule.payment_amount.toString());
                              }}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Manage Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(groupedSchedules).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No popup ads scheduled yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Management Dialog */}
      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({ open, scheduleId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Payment</DialogTitle>
            <DialogDescription>
              Confirm payment received and approve or reject the popup ad request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPaymentDialog({ open: false, scheduleId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handlePaymentConfirm("reject")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="default"
              onClick={() => handlePaymentConfirm("approve")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Popup Ad Schedule</DialogTitle>
            <DialogDescription>Modify the details for this scheduled ad.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editAd.isCustom ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Ad Image *</Label>
                  {editAd.imageUrl && (
                    <div className="relative aspect-video w-full rounded-md overflow-hidden border mb-2 bg-muted">
                      <img src={editAd.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <ImageUpload 
                    bucket="popup-ads"
                    onUploadComplete={(url) => setEditAd(prev => ({ ...prev, imageUrl: url }))}
                    label={editAd.imageUrl ? "Replace Ad Image" : "Upload Ad Image"}
                    targetWidth={1280}
                    targetHeight={720}
                    recommendedSize="Recommended: 1280 × 720 px (16:9)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-link-url">Link URL (Optional)</Label>
                  <Input
                    id="edit-link-url"
                    type="url"
                    placeholder="https://example.com"
                    value={editAd.linkUrl}
                    onChange={(e) => setEditAd(prev => ({ ...prev, linkUrl: e.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Select Listing *</Label>
                <Select value={editAd.listingId} onValueChange={(val) => setEditAd({...editAd, listingId: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search listing..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allListings.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule Date *</Label>
                <Input type="date" value={editAd.date} onChange={(e) => setEditAd({...editAd, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Slot (1-3) *</Label>
                <Select value={editAd.slot} onValueChange={(val) => setEditAd({...editAd, slot: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Slot 1</SelectItem>
                    <SelectItem value="2">Slot 2</SelectItem>
                    <SelectItem value="3">Slot 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAdSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPopupAds;
