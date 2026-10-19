import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Settings2,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Mail,
  User,
  Building,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Sponsorship {
  id: string;
  application_id?: string | null;
  plan_name?: string | null;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  banner_url: string;
  destination_url: string;
  duration: number;
  price: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  clicks: number;
  created_at: string;
  payment_status?: string | null;
  payment_proof?: string | null;
}

interface SponsorshipPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  is_active: boolean;
  display_order?: number;
}

const DEFAULT_PLANS: SponsorshipPlan[] = [
  { id: "default-silver", name: "Silver", duration: 7, price: 199, is_active: true, display_order: 1 },
  { id: "default-gold", name: "Gold", duration: 20, price: 499, is_active: true, display_order: 2 },
  { id: "default-platinum", name: "Platinum", duration: 45, price: 999, is_active: true, display_order: 3 },
];

const AdminSponsorships = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [plans, setPlans] = useState<SponsorshipPlan[]>(DEFAULT_PLANS);
  const [plansLoading, setPlansLoading] = useState(false);

  // Custom date approval dialog state
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customDatesOpen, setCustomDatesOpen] = useState(false);

  // Manual sponsorship dialog state
  const [isCreatingManual, setIsCreatingManual] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [newSponsorship, setNewSponsorship] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    destinationUrl: "",
    duration: "7",
    price: "199",
    bannerUrl: "",
    proofUrl: "",
  });

  // Plan editing dialog state
  const [editingPlan, setEditingPlan] = useState<SponsorshipPlan | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [planForm, setPlanForm] = useState({
    id: "",
    name: "",
    duration: 7,
    price: 199,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (error) throw error;

      if (!data) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchSponsorships();
      fetchPlans();
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/");
    }
  };

  const fetchSponsorships = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsorships")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSponsorships(data || []);
    } catch (error: any) {
      console.error("Error fetching sponsorships:", error);
      toast.error("Failed to load sponsorships");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const { data, error } = await supabase
        .from("sponsorship_plans")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.warn("sponsorship_plans query notice:", error.message);
        setPlans(DEFAULT_PLANS);
        return;
      }

      if (data && data.length > 0) {
        setPlans(data);
      } else {
        setPlans(DEFAULT_PLANS);
      }
    } catch (error) {
      console.warn("fetchPlans error:", error);
      setPlans(DEFAULT_PLANS);
    } finally {
      setPlansLoading(false);
    }
  };

  // Quick Approve: sets start_date = now and end_date = now + duration days, status = approved
  const handleApprove = async (sponsorship: Sponsorship, customDates?: { start: string; end: string }) => {
    try {
      const startDate = customDates?.start
        ? new Date(customDates.start).toISOString()
        : new Date().toISOString();

      const durationDays = sponsorship.duration || 7;
      const endDate = customDates?.end
        ? new Date(customDates.end).toISOString()
        : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("sponsorships")
        .update({
          status: "approved",
          payment_status: "completed",
          start_date: startDate,
          end_date: endDate,
        })
        .eq("id", sponsorship.id);

      if (error) throw error;

      toast.success(
        `Approved! "${sponsorship.business_name}" is now live on the site for ${durationDays} days.`
      );
      fetchSponsorships();
    } catch (error: any) {
      console.error("Error approving sponsorship:", error);
      toast.error(error.message || "Failed to approve sponsorship");
    }
  };

  const handleReject = async (id: string, businessName: string) => {
    try {
      const { error } = await supabase
        .from("sponsorships")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Application for "${businessName}" rejected`);
      fetchSponsorships();
    } catch (error: any) {
      console.error("Error rejecting sponsorship:", error);
      toast.error(error.message || "Failed to reject sponsorship");
    }
  };

  const handleMarkExpired = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sponsorships")
        .update({ status: "expired" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Sponsorship marked as expired");
      fetchSponsorships();
    } catch (error: any) {
      toast.error(error.message || "Failed to update sponsorship");
    }
  };

  const handleFileUpload = async (id: string, url: string, column: "banner_url" | "payment_proof") => {
    if (!url) return;
    try {
      const { error } = await supabase
        .from("sponsorships")
        .update({ [column]: url })
        .eq("id", id);

      if (error) throw error;
      toast.success(`${column === "banner_url" ? "Banner" : "Payment proof"} updated`);
      fetchSponsorships();
    } catch (error: any) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };

  // Toggle plan active / paused
  const handleTogglePlanActive = async (plan: SponsorshipPlan) => {
    const nextState = !plan.is_active;
    // Optimistic update
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, is_active: nextState } : p)));

    try {
      if (plan.id.startsWith("default-")) {
        // If plan is from default memory (table wasn't seeded yet), insert into DB
        const { error } = await supabase.from("sponsorship_plans").upsert({
          name: plan.name,
          duration: plan.duration,
          price: plan.price,
          is_active: nextState,
          display_order: plan.display_order || 0,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sponsorship_plans")
          .update({ is_active: nextState })
          .eq("id", plan.id);
        if (error) throw error;
      }

      toast.success(`Plan "${plan.name}" is now ${nextState ? "Active" : "Paused"}`);
      fetchPlans();
    } catch (error: any) {
      console.error("Error toggling plan:", error);
      toast.error(error.message || "Failed to update plan status");
      fetchPlans();
    }
  };

  // Open edit / add dialog for plan
  const handleOpenPlanDialog = (plan?: SponsorshipPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        id: plan.id,
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
        is_active: plan.is_active,
        display_order: plan.display_order || 0,
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        id: "",
        name: "",
        duration: 30,
        price: 599,
        is_active: true,
        display_order: plans.length + 1,
      });
    }
    setIsPlanDialogOpen(true);
  };

  // Save Plan
  const handleSavePlan = async () => {
    if (!planForm.name.trim()) {
      toast.error("Plan name is required");
      return;
    }
    if (!planForm.duration || planForm.duration <= 0) {
      toast.error("Duration must be at least 1 day");
      return;
    }
    if (planForm.price < 0) {
      toast.error("Price must be a valid number");
      return;
    }

    setIsSavingPlan(true);
    try {
      if (editingPlan && !editingPlan.id.startsWith("default-")) {
        // Update existing DB plan
        const { error } = await supabase
          .from("sponsorship_plans")
          .update({
            name: planForm.name.trim(),
            duration: Number(planForm.duration),
            price: Number(planForm.price),
            is_active: planForm.is_active,
            display_order: Number(planForm.display_order),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPlan.id);

        if (error) throw error;
        toast.success(`Plan "${planForm.name}" updated successfully`);
      } else {
        // Create new plan
        const { error } = await supabase.from("sponsorship_plans").insert({
          name: planForm.name.trim(),
          duration: Number(planForm.duration),
          price: Number(planForm.price),
          is_active: planForm.is_active,
          display_order: Number(planForm.display_order),
        });

        if (error) throw error;
        toast.success(`Plan "${planForm.name}" created successfully`);
      }

      setIsPlanDialogOpen(false);
      fetchPlans();
    } catch (error: any) {
      console.error("Error saving plan:", error);
      toast.error(error.message || "Failed to save plan");
    } finally {
      setIsSavingPlan(false);
    }
  };

  // Manual Sponsorship Creation
  const handleCreateManualSponsorship = async () => {
    if (!newSponsorship.businessName || !newSponsorship.bannerUrl) {
      toast.error("Please fill required fields and upload banner");
      return;
    }

    setIsCreatingManual(true);
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Not authenticated");

      const durationDays = parseInt(newSponsorship.duration) || 7;
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const fallbackAppId = `SPN-${Date.now().toString().slice(-4)}`;

      const { error } = await supabase.from("sponsorships").insert({
        user_id: currentUser.id,
        business_name: newSponsorship.businessName.trim(),
        contact_person: newSponsorship.contactPerson.trim(),
        email: newSponsorship.email.trim(),
        phone: newSponsorship.phone.trim(),
        banner_url: newSponsorship.bannerUrl,
        payment_proof: newSponsorship.proofUrl || null,
        destination_url: newSponsorship.destinationUrl.trim(),
        duration: durationDays,
        price: parseFloat(newSponsorship.price) || 0,
        status: "approved",
        payment_status: "completed",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        application_id: fallbackAppId,
      });

      if (error) throw error;

      toast.success("Manual sponsorship created and activated!");
      setManualDialogOpen(false);
      setNewSponsorship({
        businessName: "",
        contactPerson: "",
        email: "",
        phone: "",
        destinationUrl: "",
        duration: "7",
        price: "199",
        bannerUrl: "",
        proofUrl: "",
      });
      fetchSponsorships();
    } catch (error: any) {
      toast.error(error.message || "Failed to create sponsorship");
    } finally {
      setIsCreatingManual(false);
    }
  };

  const isPendingStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    return s.includes("pending");
  };

  const isApprovedStatus = (status: string) => {
    return (status || "").toLowerCase() === "approved";
  };

  const isRejectedStatus = (status: string) => {
    return (status || "").toLowerCase() === "rejected";
  };

  const isExpiredStatus = (status: string) => {
    return (status || "").toLowerCase() === "expired";
  };

  const pendingList = sponsorships.filter((s) => isPendingStatus(s.status));
  const approvedList = sponsorships.filter((s) => isApprovedStatus(s.status));
  const rejectedList = sponsorships.filter((s) => isRejectedStatus(s.status));
  const expiredList = sponsorships.filter((s) => isExpiredStatus(s.status));

  const getStatusBadge = (status: string) => {
    if (isPendingStatus(status)) {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 gap-1 font-semibold">
          <Clock className="w-3.5 h-3.5" />
          Pending payment
        </Badge>
      );
    }
    if (isApprovedStatus(status)) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 gap-1 font-semibold">
          <CheckCircle className="w-3.5 h-3.5" />
          Approved
        </Badge>
      );
    }
    if (isRejectedStatus(status)) {
      return (
        <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 gap-1 font-semibold">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        Expired
      </Badge>
    );
  };

  if (authLoading || loading || !isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sponsorship Management</h1>
            <p className="text-muted-foreground mt-1">
              Review applications, approve sponsorships to make them live, and manage pricing plans
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Manual Sponsorship
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Manual Sponsorship</DialogTitle>
                  <DialogDescription>
                    Directly activate a business sponsorship banner on the site
                  </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Business Name *</Label>
                    <Input
                      value={newSponsorship.businessName}
                      onChange={(e) =>
                        setNewSponsorship({ ...newSponsorship, businessName: e.target.value })
                      }
                      placeholder="e.g. Prestige Estates"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      value={newSponsorship.contactPerson}
                      onChange={(e) =>
                        setNewSponsorship({ ...newSponsorship, contactPerson: e.target.value })
                      }
                      placeholder="e.g. Anand Sharma"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newSponsorship.email}
                      onChange={(e) =>
                        setNewSponsorship({ ...newSponsorship, email: e.target.value })
                      }
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newSponsorship.phone}
                      onChange={(e) =>
                        setNewSponsorship({ ...newSponsorship, phone: e.target.value })
                      }
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (Days)</Label>
                    <Input
                      type="number"
                      value={newSponsorship.duration}
                      onChange={(e) =>
                        setNewSponsorship({ ...newSponsorship, duration: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={newSponsorship.price}
                      onChange={(e) =>
                        setNewSponsorship({ ...newSponsorship, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Destination URL *</Label>
                    <Input
                      value={newSponsorship.destinationUrl}
                      onChange={(e) =>
                        setNewSponsorship({ ...newSponsorship, destinationUrl: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <ImageUpload
                      bucket="sponsorship-banners"
                      onUploadComplete={(url) =>
                        setNewSponsorship({ ...newSponsorship, bannerUrl: url })
                      }
                      label="Ad Banner * (16:9, 1280 × 720 px)"
                      aspectRatio={16 / 9}
                      targetWidth={1280}
                      targetHeight={720}
                      recommendedSize="Recommended: 1280 × 720 px (16:9)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateManualSponsorship}
                    disabled={isCreatingManual}
                    className="w-full sm:w-auto"
                  >
                    {isCreatingManual ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      "Create & Activate"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto p-1 bg-muted/60">
            <TabsTrigger value="pending" className="flex items-center gap-2 py-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending Payment</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2 py-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Approved (Live)</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {approvedList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2 py-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Rejected</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {rejectedList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2 py-2">
              <span>Expired</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {expiredList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2 py-2 font-semibold">
              <Settings2 className="w-4 h-4 text-primary" />
              <span>Sponsorship Plans</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {plans.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PENDING PAYMENT */}
          <TabsContent value="pending" className="space-y-4">
            {pendingList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-base font-medium">No pending applications</p>
                  <p className="text-sm mt-1">All sponsorship applications have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {pendingList.map((sponsorship) => (
                  <Card key={sponsorship.id} className="border-2 border-amber-500/30 overflow-hidden shadow-sm">
                    <div className="bg-amber-500/10 px-6 py-2.5 flex items-center justify-between border-b border-amber-500/20 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-900 dark:text-amber-200">
                          Application ID: {sponsorship.application_id || sponsorship.id.slice(0, 8)}
                        </span>
                        {sponsorship.plan_name && (
                          <span className="bg-background px-2 py-0.5 rounded font-medium border">
                            Plan: {sponsorship.plan_name}
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        Submitted: {new Date(sponsorship.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl font-bold">
                            {sponsorship.business_name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Contact: {sponsorship.contact_person}
                          </p>
                        </div>
                        {getStatusBadge(sponsorship.status)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Details */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-sm bg-muted/40 p-3.5 rounded-xl border">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-semibold text-foreground">
                              {sponsorship.duration} Days
                            </span>

                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-bold text-primary">
                              ₹{sponsorship.price}
                            </span>

                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium text-foreground">
                              {sponsorship.phone || "—"}
                            </span>

                            <span className="text-muted-foreground">Email:</span>
                            <span className="text-foreground truncate">
                              {sponsorship.email || "—"}
                            </span>

                            <span className="text-muted-foreground">Destination:</span>
                            <a
                              href={sponsorship.destination_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1 truncate text-xs"
                            >
                              {sponsorship.destination_url}
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 flex flex-col sm:flex-row gap-3">
                            <Button
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
                              onClick={() => handleApprove(sponsorship)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve & Make Live
                            </Button>

                            <Button
                              variant="outline"
                              className="text-xs h-11"
                              onClick={() => {
                                setSelectedSponsorship(sponsorship);
                                const now = new Date();
                                const durationDays = sponsorship.duration || 7;
                                const future = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
                                setCustomStartDate(now.toISOString().split("T")[0]);
                                setCustomEndDate(future.toISOString().split("T")[0]);
                                setCustomDatesOpen(true);
                              }}
                            >
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              Custom Dates
                            </Button>

                            <Button
                              variant="destructive"
                              className="h-11 font-semibold"
                              onClick={() => handleReject(sponsorship.id, sponsorship.business_name)}
                            >
                              <XCircle className="w-4 h-4 mr-1.5" />
                              Reject
                            </Button>
                          </div>
                        </div>

                        {/* Right Banner Preview */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Banner (16:9)
                          </p>
                          <img
                            src={sponsorship.banner_url}
                            alt="Banner preview"
                            className="w-full aspect-[16/9] object-cover rounded-xl border mb-3"
                          />
                          <div className="w-full">
                            <ImageUpload
                              bucket="sponsorship-banners"
                              onUploadComplete={(url) =>
                                handleFileUpload(sponsorship.id, url, "banner_url")
                              }
                              label="Replace Banner"
                              aspectRatio={16 / 9}
                              targetWidth={1280}
                              targetHeight={720}
                              recommendedSize="Recommended: 1280 × 720 px"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: APPROVED (LIVE) */}
          <TabsContent value="approved" className="space-y-4">
            {approvedList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No active/approved sponsorships
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {approvedList.map((sponsorship) => (
                  <Card key={sponsorship.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl font-bold">
                            {sponsorship.business_name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            ID: {sponsorship.application_id || sponsorship.id.slice(0, 8)} • Contact:{" "}
                            {sponsorship.contact_person}
                          </p>
                        </div>
                        {getStatusBadge(sponsorship.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm bg-muted/40 p-3 rounded-lg border">
                            <span className="text-muted-foreground">Live Period:</span>
                            <span className="font-semibold text-foreground">
                              {sponsorship.start_date
                                ? new Date(sponsorship.start_date).toLocaleDateString()
                                : "Now"}{" "}
                              to{" "}
                              {sponsorship.end_date
                                ? new Date(sponsorship.end_date).toLocaleDateString()
                                : "—"}
                            </span>

                            <span className="text-muted-foreground">Total Clicks:</span>
                            <span className="font-bold text-foreground">
                              {sponsorship.clicks || 0}
                            </span>

                            <span className="text-muted-foreground">Duration & Price:</span>
                            <span className="text-foreground">
                              {sponsorship.duration} Days (₹{sponsorship.price})
                            </span>
                          </div>

                          <div className="pt-2 flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => handleMarkExpired(sponsorship.id)}
                            >
                              Mark as Expired
                            </Button>
                            <a
                              href={sponsorship.destination_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex"
                            >
                              <Button variant="ghost">
                                Open Destination <ExternalLink className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </a>
                          </div>
                        </div>

                        <div>
                          <img
                            src={sponsorship.banner_url}
                            alt="Banner preview"
                            className="w-full aspect-[16/9] object-cover rounded-xl border mb-2"
                          />
                          <ImageUpload
                            bucket="sponsorship-banners"
                            onUploadComplete={(url) =>
                              handleFileUpload(sponsorship.id, url, "banner_url")
                            }
                            label="Replace Banner"
                            aspectRatio={16 / 9}
                            targetWidth={1280}
                            targetHeight={720}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: REJECTED */}
          <TabsContent value="rejected" className="space-y-4">
            {rejectedList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No rejected applications
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {rejectedList.map((sponsorship) => (
                  <Card key={sponsorship.id} className="opacity-80">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{sponsorship.business_name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            ID: {sponsorship.application_id || sponsorship.id.slice(0, 8)} • Contact:{" "}
                            {sponsorship.contact_person}
                          </p>
                        </div>
                        {getStatusBadge(sponsorship.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {sponsorship.duration} Days (₹{sponsorship.price}) • {sponsorship.phone}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(sponsorship)}
                      >
                        Re-Approve & Make Live
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 4: EXPIRED */}
          <TabsContent value="expired" className="space-y-4">
            {expiredList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No expired sponsorships
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {expiredList.map((sponsorship) => (
                  <Card key={sponsorship.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{sponsorship.business_name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            ID: {sponsorship.application_id || sponsorship.id.slice(0, 8)}
                          </p>
                        </div>
                        {getStatusBadge(sponsorship.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Ran from {sponsorship.start_date ? new Date(sponsorship.start_date).toLocaleDateString() : "—"} to{" "}
                        {sponsorship.end_date ? new Date(sponsorship.end_date).toLocaleDateString() : "—"} • Total Clicks: {sponsorship.clicks}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(sponsorship)}
                      >
                        Re-Activate (Renew)
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 5: SPONSORSHIP PLANS (Admin can pause, enable, edit name, duration, price) */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-xl border">
              <div>
                <h3 className="text-lg font-bold">Live Sponsorship Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Configure package names, durations, prices, or pause plans. Paused plans are greyed out on the application form and cannot be selected.
                </p>
              </div>
              <Button onClick={() => handleOpenPlanDialog()} className="gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /> Add Plan Tier
              </Button>
            </div>

            {plansLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`transition-all ${
                      !plan.is_active
                        ? "border-dashed border-muted-foreground/30 bg-muted/20"
                        : "border-primary/30 shadow-sm"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold flex items-center gap-2">
                            {plan.name}
                            {!plan.is_active && (
                              <Badge
                                variant="secondary"
                                className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold px-2 py-0.5"
                              >
                                Paused
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm font-medium mt-0.5">
                            {plan.duration} Days
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={plan.is_active}
                            onCheckedChange={() => handleTogglePlanActive(plan)}
                            title={plan.is_active ? "Click to Pause Plan" : "Click to Enable Plan"}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="text-3xl font-extrabold text-primary">
                          ₹{plan.price}
                        </span>
                      </div>

                      <div className="pt-3 border-t flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          Status:{" "}
                          <strong className={plan.is_active ? "text-emerald-600" : "text-amber-600"}>
                            {plan.is_active ? "Active on site" : "Paused on site"}
                          </strong>
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleOpenPlanDialog(plan)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Custom Dates Approval Dialog */}
        <Dialog open={customDatesOpen} onOpenChange={setCustomDatesOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve with Custom Dates</DialogTitle>
              <DialogDescription>
                Set exact start and end dates for {selectedSponsorship?.business_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="customStartDate">Start Date</Label>
                <Input
                  id="customStartDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customEndDate">End Date</Label>
                <Input
                  id="customEndDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  if (!selectedSponsorship) return;
                  if (!customStartDate || !customEndDate) {
                    toast.error("Please enter both dates");
                    return;
                  }
                  handleApprove(selectedSponsorship, {
                    start: customStartDate,
                    end: customEndDate,
                  });
                  setCustomDatesOpen(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Confirm Approval & Make Live
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit / Add Plan Dialog */}
        <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? `Edit Plan: ${editingPlan.name}` : "Add New Sponsorship Plan"}
              </DialogTitle>
              <DialogDescription>
                Configure the plan name, duration, price, and active status
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="planName">Plan Name *</Label>
                <Input
                  id="planName"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="e.g. Silver, Gold, Platinum, Diamond"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="planDuration">Duration (Days) *</Label>
                  <Input
                    id="planDuration"
                    type="number"
                    min={1}
                    value={planForm.duration}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, duration: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planPrice">Price (₹) *</Label>
                  <Input
                    id="planPrice"
                    type="number"
                    min={0}
                    value={planForm.price}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <Label htmlFor="planActive" className="font-semibold block">
                    Plan Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {planForm.is_active
                      ? "Plan is active and selectable on /sponsorship-apply"
                      : "Plan is paused and greyed out on /sponsorship-apply"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="planActive"
                    checked={planForm.is_active}
                    onCheckedChange={(checked) =>
                      setPlanForm({ ...planForm, is_active: checked })
                    }
                  />
                  <span className="text-xs font-semibold">
                    {planForm.is_active ? "Active" : "Paused"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPlanDialogOpen(false)}
                disabled={isSavingPlan}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePlan} disabled={isSavingPlan}>
                {isSavingPlan ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSponsorships;
