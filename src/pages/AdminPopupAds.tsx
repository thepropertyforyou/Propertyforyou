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
  listings: {
    id: string;
    title: string;
    price: number;
    user_id: string;
    seller_phone: string;
    profiles: { name: string; email: string };
  };
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
  
  const [newAd, setNewAd] = useState({
    listingId: "",
    date: "",
    slot: "1",
    amount: "499",
    proof: "",
  });
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; scheduleId: string | null }>({
    open: false,
    scheduleId: null,
  });
  const [paymentAmount, setPaymentAmount] = useState("");

  const [editAd, setEditAd] = useState({
    id: "",
    listingId: "",
    date: "",
    slot: "1",
    amount: "499"
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
          listings (
            id,
            title,
            price,
            user_id,
            seller_phone,
            profiles (name, email)
          )
        `)
        .order("schedule_date", { ascending: false })
        .order("slot_number", { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
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
    if (!newAd.listingId || !newAd.date) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
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
      const { error } = await supabase
        .from('popup_ad_schedules')
        .insert({
          listing_id: newAd.listingId,
          schedule_date: newAd.date,
          slot_number: parseInt(newAd.slot),
          payment_amount: parseFloat(newAd.amount),
          payment_proof: newAd.proof,
          payment_status: 'paid',
          admin_approved: true
        });

      if (error) throw error;
      toast({ title: "Success", description: "Popup ad created successfully" });
      setNewAd({ listingId: "", date: "", slot: "1", amount: "499", proof: "" });
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
    if (!editAd.listingId || !editAd.date) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
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

      const { error } = await supabase
        .from('popup_ad_schedules')
        .update({
          listing_id: editAd.listingId,
          schedule_date: editAd.date,
          slot_number: parseInt(editAd.slot)
        })
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Popup Ad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Manual Popup Ad</DialogTitle>
                <DialogDescription>Add a popup ad schedule for an existing listing</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Slot {schedule.slot_number}</Badge>
                          <h3 className="font-semibold">{schedule.listings.title}</h3>
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
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ₹{schedule.listings.price.toLocaleString()} • 
                          By {schedule.listings.profiles.name} ({schedule.listings.profiles.email})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Popup Ad Fee: ₹{schedule.payment_amount.toLocaleString()}
                        </p>
                        {schedule.payment_proof ? (
                          <a
                            href={schedule.payment_proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            View Payment Proof
                          </a>
                        ) : (
                          <div className="mt-2 w-32">
                            <ImageUpload 
                              bucket="popup-ads"
                              onUploadComplete={(url) => handleProofUpload(schedule.id, url)}
                              label="Upload Proof"
                            />
                          </div>
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
                              listingId: schedule.listings.id,
                              date: schedule.schedule_date,
                              slot: schedule.slot_number.toString(),
                              amount: schedule.payment_amount.toString()
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
                  ))}
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
