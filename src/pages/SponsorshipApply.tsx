import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, CheckCircle2, ArrowRight, Home, RefreshCw, ExternalLink } from "lucide-react";
import { ImageCropperDialog } from "@/components/common/ImageCropperDialog";
import { SPONSORSHIP_CONFIG } from "@/config/site";

export interface SponsorshipPlan {
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

interface SubmittedApplication {
  applicationId: string;
  planName: string;
  duration: number;
  price: number;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  destinationUrl: string;
  bannerUrl: string;
  whatsappUrl: string;
}

const SponsorshipApply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState<SponsorshipPlan[]>(DEFAULT_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const [submittedApplication, setSubmittedApplication] = useState<SubmittedApplication | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    destinationUrl: "",
    duration: "7",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const { data, error } = await supabase
        .from("sponsorship_plans")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.warn("Could not query sponsorship_plans, using defaults:", error.message);
        setPlans(DEFAULT_PLANS);
        return;
      }

      if (data && data.length > 0) {
        setPlans(data);
        // Pre-select first active plan if none selected
        const firstActive = data.find((p: any) => p.is_active);
        if (firstActive && !selectedPlanId) {
          setSelectedPlanId(firstActive.id);
          setFormData((prev) => ({ ...prev, duration: String(firstActive.duration) }));
        }
      } else {
        setPlans(DEFAULT_PLANS);
      }
    } catch (err) {
      console.warn("Fetch plans exception:", err);
      setPlans(DEFAULT_PLANS);
    } finally {
      setPlansLoading(false);
    }
  };

  // Find currently selected plan
  const selectedPlan =
    plans.find((p) => p.id === selectedPlanId) ||
    plans.find((p) => String(p.duration) === formData.duration && p.is_active) ||
    plans.find((p) => p.is_active) ||
    plans[0];

  const handleSelectPlan = (plan: SponsorshipPlan) => {
    if (!plan.is_active) {
      toast.info(`The ${plan.name} plan is currently paused and cannot be selected.`);
      return;
    }
    setSelectedPlanId(plan.id);
    setFormData((prev) => ({ ...prev, duration: String(plan.duration) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImageSrc(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    setBannerFile(croppedFile);
    setBannerPreview(URL.createObjectURL(croppedFile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerFile) {
      toast.error("Please upload and crop your banner image");
      return;
    }

    if (!selectedPlan) {
      toast.error("Please select a sponsorship plan");
      return;
    }

    setLoading(true);

    try {
      // 1. Verify plan is still active before submitting (check again before submit)
      if (selectedPlan.id && !selectedPlan.id.startsWith("default-")) {
        const { data: latestPlan, error: planCheckError } = await supabase
          .from("sponsorship_plans")
          .select("id, name, is_active, price, duration")
          .eq("id", selectedPlan.id)
          .maybeSingle();

        if (!planCheckError && latestPlan) {
          if (!latestPlan.is_active) {
            toast.error(
              `The "${latestPlan.name}" plan was just paused by the admin. Please select an active plan.`
            );
            await fetchPlans();
            setLoading(false);
            return;
          }
        }
      }

      // 2. Upload banner image to 'sponsorship-banners'
      const fileExt = bannerFile.name.split(".").pop() || "jpg";
      const uploaderPrefix = user?.id || "public";
      const fileName = `${uploaderPrefix}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("sponsorship-banners")
        .upload(fileName, bannerFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("sponsorship-banners").getPublicUrl(fileName);

      // Generate a temporary fallback application ID in case DB sequence isn't configured yet
      const fallbackAppId = `SPN-${Date.now().toString().slice(-4)}`;

      // 3. Insert sponsorship application with status 'Pending payment'
      const insertPayload: any = {
        business_name: formData.businessName.trim(),
        contact_person: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        banner_url: publicUrl,
        destination_url: formData.destinationUrl.trim(),
        duration: Number(selectedPlan.duration),
        price: Number(selectedPlan.price),
        plan_name: selectedPlan.name,
        status: "Pending payment",
        payment_status: "pending",
        user_id: user?.id || null,
        application_id: fallbackAppId,
      };

      const { data: insertedData, error: insertError } = await supabase
        .from("sponsorships")
        .insert(insertPayload)
        .select()
        .single();

      if (insertError) {
        // If 'Pending payment' check constraint failed, retry with 'pending'
        if (insertError.message?.includes("sponsorships_status_check")) {
          insertPayload.status = "pending";
          const retry = await supabase
            .from("sponsorships")
            .insert(insertPayload)
            .select()
            .single();
          if (retry.error) throw retry.error;
        } else {
          throw insertError;
        }
      }

      const finalAppId = insertedData?.application_id || fallbackAppId;
      const planName = selectedPlan.name;
      const duration = selectedPlan.duration;
      const price = selectedPlan.price;

      // 4. Construct WhatsApp prefilled message
      const adminWhatsApp = SPONSORSHIP_CONFIG.adminWhatsApp;
      const message =
`*Sponsorship Application Details*
--------------------------------
*Application ID:* ${finalAppId}
*Plan:* ${planName} (${duration} Days)
*Price:* ₹${price}
*Business Name:* ${formData.businessName.trim()}
*Contact Person:* ${formData.contactPerson.trim()}
*Phone:* ${formData.phone.trim()}
*Email:* ${formData.email.trim()}
*Destination Link:* ${formData.destinationUrl.trim()}

--------------------------------
Please send this message and complete the payment with the admin. Your sponsorship goes live once the admin approves it.`;

      const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;

      // Save details for success screen
      setSubmittedApplication({
        applicationId: finalAppId,
        planName,
        duration,
        price,
        businessName: formData.businessName.trim(),
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        destinationUrl: formData.destinationUrl.trim(),
        bannerUrl: publicUrl,
        whatsappUrl,
      });

      // Automatically open WhatsApp chat in a new window/tab
      try {
        window.open(whatsappUrl, "_blank");
      } catch (err) {
        console.warn("Auto-opening WhatsApp window prevented by browser:", err);
      }

      toast.success("Application submitted! Please send details on WhatsApp to complete payment.");
    } catch (error: any) {
      console.error("Error submitting sponsorship:", error);
      toast.error(error.message || "Failed to submit sponsorship request");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedApplication) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Application Submitted Successfully!
                </h1>
                <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold text-amber-300 border border-amber-300/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Status: Pending payment
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Notice callout */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-900 dark:text-amber-200">
                  <p className="text-sm font-medium leading-relaxed">
                    <strong>Important Note:</strong> Please send the prefilled details message and complete the payment with the admin. Your sponsorship goes live once the admin approves it.
                  </p>
                </div>

                {/* Primary WhatsApp Action Button */}
                <div className="space-y-2">
                  <a
                    href={submittedApplication.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      type="button"
                      size="lg"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-base py-6 shadow-lg rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01]"
                    >
                      <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Send on WhatsApp
                    </Button>
                  </a>
                  <p className="text-xs text-center text-muted-foreground">
                    Connects directly to admin ({SPONSORSHIP_CONFIG.adminPhoneDisplay})
                  </p>
                </div>

                {/* Application Details Summary */}
                <div className="border rounded-xl p-4 sm:p-5 bg-muted/40 space-y-3">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                    Application Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Application ID:</div>
                    <div className="font-mono font-bold text-foreground">
                      {submittedApplication.applicationId}
                    </div>

                    <div className="text-muted-foreground">Plan:</div>
                    <div className="font-semibold text-foreground">
                      {submittedApplication.planName} ({submittedApplication.duration} Days)
                    </div>

                    <div className="text-muted-foreground">Amount:</div>
                    <div className="font-bold text-primary text-base">
                      ₹{submittedApplication.price}
                    </div>

                    <div className="text-muted-foreground">Business Name:</div>
                    <div className="font-medium text-foreground">
                      {submittedApplication.businessName}
                    </div>

                    <div className="text-muted-foreground">Contact Person:</div>
                    <div className="text-foreground">{submittedApplication.contactPerson}</div>

                    <div className="text-muted-foreground">Phone:</div>
                    <div className="text-foreground">{submittedApplication.phone}</div>

                    <div className="text-muted-foreground">Email:</div>
                    <div className="text-foreground truncate">{submittedApplication.email}</div>

                    <div className="text-muted-foreground">Destination Link:</div>
                    <div className="text-foreground truncate">
                      <a
                        href={submittedApplication.destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {submittedApplication.destinationUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {submittedApplication.bannerUrl && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Uploaded Banner (16:9)
                      </p>
                      <img
                        src={submittedApplication.bannerUrl}
                        alt="Uploaded banner"
                        className="w-full aspect-[16/9] object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Secondary navigation */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSubmittedApplication(null);
                      setBannerFile(null);
                      setBannerPreview("");
                      setFormData({
                        businessName: "",
                        contactPerson: "",
                        email: "",
                        phone: "",
                        destinationUrl: "",
                        duration: plans[0]?.duration ? String(plans[0].duration) : "7",
                      });
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Submit Another
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => navigate("/")}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // FORM & PLAN SELECTION SCREEN
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Sponsorship Plans
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Boost your brand visibility with our premium sponsorship packages across Karnataka
            </p>
          </div>

          {/* Pricing Cards (Loaded live from database) */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plansLoading ? (
              <div className="col-span-3 text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                <p className="text-xs text-muted-foreground mt-2">Loading plans...</p>
              </div>
            ) : (
              plans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                const isPaused = !plan.is_active;

                return (
                  <Card
                    key={plan.id}
                    className={`relative transition-all duration-200 overflow-hidden ${
                      isPaused
                        ? "opacity-60 bg-muted/30 border-dashed border-muted-foreground/30 cursor-not-allowed select-none"
                        : `cursor-pointer hover:shadow-lg ${
                            isSelected
                              ? "border-primary ring-2 ring-primary shadow-md bg-primary/5"
                              : "hover:border-primary/50"
                          }`
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {isPaused && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold px-2 py-0.5"
                        >
                          Paused
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-sm font-medium">
                        {plan.duration} Days
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-2">
                      <div className="text-4xl font-extrabold text-primary mb-5">
                        ₹{plan.price}
                      </div>

                      {isPaused ? (
                        <Button
                          disabled
                          variant="outline"
                          className="w-full text-muted-foreground opacity-60"
                        >
                          Paused
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className="w-full font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlan(plan);
                          }}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            "Select Plan"
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Application Form */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sponsorship Application Form</CardTitle>
              <CardDescription>
                Fill in the details below to submit your sponsorship request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="e.g. Royal Promoters & Builders"
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({ ...formData, businessName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person Name *</Label>
                    <Input
                      id="contactPerson"
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPerson: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. contact@business.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destinationUrl">Destination Link *</Label>
                    <Input
                      id="destinationUrl"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.destinationUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, destinationUrl: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Selected Package *</Label>
                    <Select
                      value={selectedPlan?.id || ""}
                      onValueChange={(planId) => {
                        const target = plans.find((p) => p.id === planId);
                        if (target) handleSelectPlan(target);
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            disabled={!p.is_active}
                          >
                            {p.name} — {p.duration} Days (₹{p.price})
                            {!p.is_active ? " [PAUSED]" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Banner Upload with 16:9 Cropper */}
                <div className="space-y-2">
                  <Label htmlFor="banner">Upload Banner * (1280 × 720 px, 16:9, Max 5MB)</Label>
                  <div className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center hover:border-primary transition-colors bg-muted/20">
                    {bannerPreview ? (
                      <div className="space-y-4">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="max-h-52 mx-auto rounded-lg shadow-sm border aspect-[16/9] object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setBannerFile(null);
                            setBannerPreview("");
                          }}
                        >
                          Change Banner
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                        <div>
                          <Button type="button" variant="outline" asChild>
                            <label htmlFor="banner" className="cursor-pointer">
                              Choose Image
                            </label>
                          </Button>
                          <Input
                            id="banner"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Recommended size: 1280 × 720 px (16:9 aspect ratio). PNG, JPG, or WebP.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Price Preview */}
                {selectedPlan && (
                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Selected Plan
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {selectedPlan.name} ({selectedPlan.duration} Days)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Total Amount
                      </p>
                      <p className="text-2xl font-extrabold text-primary">
                        ₹{selectedPlan.price}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full font-bold text-base py-6 rounded-xl shadow-md"
                  size="lg"
                  disabled={loading || (selectedPlan && !selectedPlan.is_active)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <ImageCropperDialog
          open={cropperOpen}
          onOpenChange={setCropperOpen}
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={16 / 9}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SponsorshipApply;
