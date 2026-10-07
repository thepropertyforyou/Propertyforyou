import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Upload, X, Star, Image as ImageIcon, Phone, Eye, Check, AlertTriangle, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ImageCropperDialog } from "@/components/common/ImageCropperDialog";
import { statesAndDistricts } from "@/data/india-locations";

type PostingType = "free" | "featured" | "popup";

const PostAd = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [category, setCategory] = useState("properties");
  const [categoryId, setCategoryId] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [priceUnit, setPriceUnit] = useState("unit");

  useEffect(() => {
    setSubCategory("");
    setPriceUnit("unit");
  }, [category]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);
  const [verificationDocName, setVerificationDocName] = useState("");
  const [postingType, setPostingType] = useState<PostingType>("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const getPlanDisplayPrice = (planType: string, defaultPrice: string) => {
    // Try to find the specific planType (e.g. featured_30) first
    let plan = pricingPlans.find(p => p.plan_type === planType);
    
    // If not found, try the base planType (e.g. if planType is featured_30, try featured)
    if (!plan) {
      const baseType = planType.replace(/_30$/, "");
      plan = pricingPlans.find(p => p.plan_type === baseType);
    }
    
    // If still not found, try the reverse (if planType is featured, try featured_30)
    if (!plan) {
      const altType = planType.includes("_") ? planType : `${planType}_30`;
      plan = pricingPlans.find(p => p.plan_type === altType);
    }

    if (!plan) return defaultPrice;

    if (plan.display_price !== null && plan.display_price !== undefined && plan.display_price !== "") {
      return plan.display_price;
    }

    if (plan.price !== null && plan.price !== undefined) {
      return `₹${plan.price}`;
    }

    return defaultPrice;
  };

  const [formData, setFormData] = useState({
    title: "", brand: "", model: "", year: "", fuelType: "", kmDriven: "",
    ownership: "", condition: "", propertyType: "", size: "", bedrooms: "",
    furnishing: "", type: "", material: "", weight: "", purity: "", price: "",
    description: "", state: "", district: "", taluk: "", sellerPhone: "",
  });

  useEffect(() => {
    const savedFormData = sessionStorage.getItem("pendingAdFormData");
    if (savedFormData) {
      const parsed = JSON.parse(savedFormData);
      setFormData(parsed.formData);
      setCategory(parsed.category);
      setPostingType(parsed.postingType || "free");
      sessionStorage.removeItem("pendingAdFormData");
      toast.info("Form data restored");
    }
  }, []);

  useEffect(() => {
    const fetchPricingPlans = async () => {
      const { data } = await supabase.from("pricing_plans").select("*");
      if (data) setPricingPlans(data);
    };
    fetchPricingPlans();
  }, []);

  useEffect(() => {
    const fetchCategoryId = async () => {
      const { data } = await supabase.from("categories").select("id").eq("slug", category).single();
      if (data) setCategoryId(data.id);
    };
    fetchCategoryId();
  }, [category]);

  useEffect(() => {
    if (postingType === "popup" && selectedDate) {
      checkAvailableSlots(selectedDate);
    }
  }, [selectedDate, postingType]);

  const checkAvailableSlots = async (date: string) => {
    try {
      const { data, error } = await supabase.from("popup_ad_schedules").select("slot_number").eq("schedule_date", date);
      if (error) throw error;
      const bookedSlots = data.map(s => s.slot_number);
      const available = [1, 2, 3].filter(slot => !bookedSlots.includes(slot));
      setAvailableSlots(available);
      if (available.length === 0) toast.error("All slots booked for this date");
    } catch (error) {
      console.error("Error checking slots:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxImages = postingType === "free" ? 1 : 6;
      if (images.length >= maxImages) {
        toast.error(`Maximum ${maxImages} image${maxImages === 1 ? '' : 's'} allowed`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImageSrc(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleCropComplete = (croppedFile: File) => {
    setImages(prev => [...prev, croppedFile]);
    const previewUrl = URL.createObjectURL(croppedFile);
    setImagePreviews(prev => [...prev, previewUrl]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (listingId: string) => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${listingId}/${Date.now()}-${i}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("listing-images").upload(fileName, file);
      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(fileName);
      uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
  };

  const uploadVerificationDoc = async (listingId: string) => {
    if (!verificationDoc) return null;
    const fileExt = verificationDoc.name.split(".").pop();
    const fileName = `verification-docs/${listingId}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("listing-images").upload(fileName, verificationDoc);
    if (uploadError) {
      console.error("Verification doc upload error:", uploadError);
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.price || parseFloat(formData.price) <= 0 || !formData.district || images.length === 0 || !agreedToTerms) {
      toast.error("Please fill all required fields and agree to terms");
      return;
    }
    if (!subCategory) {
      toast.error("Please select a subcategory");
      return;
    }
    if (postingType !== "free") {
      if (!formData.description.trim()) {
        toast.error("Description required for featured/popup listings");
        return;
      }
      if (!formData.sellerPhone.trim()) {
        toast.error("Contact number required for featured/popup listings");
        return;
      }
    }
    if (postingType === "popup" && (!selectedDate || selectedSlot === null)) {
      toast.error("Please select date and slot for popup");
      return;
    }
    if (!user) {
      sessionStorage.setItem("pendingAdFormData", JSON.stringify({ formData, category, postingType }));
      toast.error("Please login");
      navigate("/auth?redirect=/post-ad");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      const title = formData.title || `${formData.brand || formData.propertyType || formData.type} ${formData.model || ""}`.trim();
      const attributes: any = {
        subCategory: subCategory
      };
      
      if (category === "properties") {
        attributes.priceUnit = priceUnit;
        attributes.propertyType = formData.propertyType;
        attributes.size = formData.size;
        attributes.bedrooms = formData.bedrooms;
        attributes.furnishing = formData.furnishing;
      }

      // Determine parameters based on posting type
      const isFeatured = postingType === "featured";
      const listingStatus = postingType === "popup" ? "popup" : "pending";
      const sellerPhone = postingType === "free" ? "+91 1234567890" : (formData.sellerPhone || profile.phone);

      const { data: listing, error: listingError } = await supabase.from("listings").insert({
        user_id: user.id,
        category_id: categoryId,
        title,
        price: parseFloat(formData.price),
        description: formData.description || (postingType === "free" ? "Contact through platform" : ""),
        location_city: formData.district,
        location_locality: formData.taluk || null,
        seller_name: profile.name,
        seller_email: profile.email,
        seller_phone: sellerPhone,
        attributes,
        is_featured: isFeatured,
        status: listingStatus,
      }).select().single();

      if (listingError) throw listingError;

      // Upload and associate images
      const imageUrls = await uploadImages(listing.id);
      for (let i = 0; i < imageUrls.length; i++) {
        await supabase.from("listing_images").insert({
          listing_id: listing.id,
          image_url: imageUrls[i],
          display_order: i,
        });
      }

      // Upload verification doc if any and update listing attributes
      if (verificationDoc) {
        const docUrl = await uploadVerificationDoc(listing.id);
        if (docUrl) {
          const updatedAttributes = {
            ...attributes,
            verificationDocUrl: docUrl,
            verificationStatus: "pending",
          };
          await supabase
            .from("listings")
            .update({ attributes: updatedAttributes })
            .eq("id", listing.id);
        }
      }

      // If popup promotion is selected, insert schedule
      if (postingType === "popup") {
        const popupPlan = pricingPlans.find(p => p.plan_type === "popup_30") || pricingPlans.find(p => p.plan_type === "popup");
        const paymentAmount = popupPlan ? Number(popupPlan.price) : 999;

        const { error: popupError } = await supabase
          .from("popup_ad_schedules")
          .insert({
            listing_id: listing.id,
            schedule_date: selectedDate,
            slot_number: selectedSlot,
            payment_amount: paymentAmount,
            payment_status: "pending",
            admin_approved: false,
            selected_dates: [selectedDate],
          });

        if (popupError) throw popupError;
      }

      if (postingType === "popup") {
        toast.success("Popup ad submitted! Pending admin approval.");
      } else if (postingType === "featured") {
        toast.success("Featured ad submitted! Pending admin approval.");
      } else {
        toast.success("Free ad posted!");
      }
      navigate("/");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.message || error?.details || "Failed to post ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryFields = () => {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Property Type *</Label>
          <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="land">Land/Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Size (sq ft)</Label>
          <Input type="number" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="1200" />
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const maxImages = postingType === "free" ? 1 : 6;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Post Your Ad</h1>

        {/* Comparison Table */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Choose Your Plan</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead className="text-center">Free</TableHead>
                  <TableHead className="text-center bg-yellow-50 dark:bg-yellow-950">Featured</TableHead>
                  <TableHead className="text-center bg-purple-50 dark:bg-purple-950">Popup</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Images</TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center bg-yellow-50 dark:bg-yellow-950">6</TableCell>
                  <TableCell className="text-center bg-purple-50 dark:bg-purple-950">6</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Description</TableCell>
                  <TableCell className="text-center"><X className="h-4 w-4 mx-auto text-destructive" /></TableCell>
                  <TableCell className="text-center bg-yellow-50 dark:bg-yellow-950"><Check className="h-4 w-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center bg-purple-50 dark:bg-purple-950"><Check className="h-4 w-4 mx-auto text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Contact</TableCell>
                  <TableCell className="text-center">Platform</TableCell>
                  <TableCell className="text-center bg-yellow-50 dark:bg-yellow-950">Your Number</TableCell>
                  <TableCell className="text-center bg-purple-50 dark:bg-purple-950">Your Number</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Homepage Priority</TableCell>
                  <TableCell className="text-center"><X className="h-4 w-4 mx-auto text-destructive" /></TableCell>
                  <TableCell className="text-center bg-yellow-50 dark:bg-yellow-950"><Check className="h-4 w-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center bg-purple-50 dark:bg-purple-950"><Check className="h-4 w-4 mx-auto text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Popup Visibility</TableCell>
                  <TableCell className="text-center"><X className="h-4 w-4 mx-auto text-destructive" /></TableCell>
                  <TableCell className="text-center bg-yellow-50 dark:bg-yellow-950"><X className="h-4 w-4 mx-auto text-destructive" /></TableCell>
                  <TableCell className="text-center bg-purple-50 dark:bg-purple-950"><Check className="h-4 w-4 mx-auto text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pricing</TableCell>
                  <TableCell className="text-center font-bold text-green-600">FREE</TableCell>
                  <TableCell className="text-center bg-yellow-50 dark:bg-yellow-950 font-bold">
                    {getPlanDisplayPrice("featured_30", "₹499")}
                  </TableCell>
                  <TableCell className="text-center bg-purple-50 dark:bg-purple-950 font-bold">
                    {getPlanDisplayPrice("popup_30", "₹0")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Posting Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={`p-6 cursor-pointer transition-all hover:shadow-lg ${postingType === "free" ? "border-2 border-primary shadow-md" : "border-2 border-transparent"}`} onClick={() => { setPostingType("free"); setImages([]); setImagePreviews([]); }}>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold flex items-center gap-2"><ImageIcon className="h-5 w-5" />Free</h3>
                <p className="text-sm text-muted-foreground">Basic visibility</p>
              </div>
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${postingType === "free" ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                {postingType === "free" && <div className="h-3 w-3 rounded-full bg-white" />}
              </div>
            </div>
          </Card>

          <Card className={`p-6 cursor-pointer transition-all hover:shadow-lg relative ${postingType === "featured" ? "border-2 border-yellow-500 shadow-md" : "border-2 border-transparent"}`} onClick={() => { setPostingType("featured"); setImages([]); setImagePreviews([]); }}>
            <Star className="absolute top-2 right-2 h-6 w-6 text-yellow-500 fill-yellow-500" />
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500" />Featured</h3>
                <p className="text-sm text-muted-foreground">Premium placement</p>
              </div>
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${postingType === "featured" ? "border-yellow-500 bg-yellow-500" : "border-muted-foreground"}`}>
                {postingType === "featured" && <div className="h-3 w-3 rounded-full bg-white" />}
              </div>
            </div>
          </Card>

          <Card className={`p-6 cursor-pointer transition-all hover:shadow-lg relative ${postingType === "popup" ? "border-2 border-purple-500 shadow-md" : "border-2 border-transparent"}`} onClick={() => { setPostingType("popup"); setImages([]); setImagePreviews([]); }}>
            <Sparkles className="absolute top-2 right-2 h-6 w-6 text-purple-500" />
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-500" />Popup</h3>
                <p className="text-sm text-muted-foreground">Maximum exposure</p>
              </div>
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${postingType === "popup" ? "border-purple-500 bg-purple-500" : "border-muted-foreground"}`}>
                {postingType === "popup" && <div className="h-3 w-3 rounded-full bg-white" />}
              </div>
            </div>
          </Card>
        </div>

        {/* Date & Slot for Popup */}
        {postingType === "popup" && (
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">Select Popup Schedule</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="popupDate">Date</Label>
                <Input id="popupDate" type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              {selectedDate && availableSlots.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Slots</Label>
                  <div className="flex gap-2">
                    {availableSlots.map(slot => (
                      <Button key={slot} variant={selectedSlot === slot ? "default" : "outline"} onClick={() => setSelectedSlot(slot)}>Slot {slot}</Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Category */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Category</h2>
          <div className="flex gap-4">
            <Button variant={category === "properties" ? "default" : "outline"} onClick={() => setCategory("properties")}>Properties</Button>
          </div>
        </Card>

        {/* Subcategory */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Subcategory *</h2>
          <div className="flex flex-wrap gap-3">
            {category === "properties" && (
              <>
                <Button type="button" variant={subCategory === "sales" ? "default" : "outline"} onClick={() => setSubCategory("sales")}>Sales</Button>
                <Button type="button" variant={subCategory === "rent" ? "default" : "outline"} onClick={() => setSubCategory("rent")}>Rent</Button>
                <Button type="button" variant={subCategory === "lease" ? "default" : "outline"} onClick={() => setSubCategory("lease")}>Lease</Button>
              </>
            )}
          </div>
        </Card>

        {/* Category Fields */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="space-y-4">{renderCategoryFields()}</div>
        </Card>

        {/* Common Fields */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              {category === "properties" ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Enter price" />
                  </div>
                  <div>
                    <Select value={priceUnit} onValueChange={setPriceUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqft">Per Sq Ft</SelectItem>
                        <SelectItem value="acre">Per Acre</SelectItem>
                        <SelectItem value="unit">Per Unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Enter price" />
              )}
            </div>
            {postingType !== "free" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your item..." rows={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerPhone">Contact Number *</Label>
                  <Input id="sellerPhone" type="tel" value={formData.sellerPhone} onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })} placeholder="Your phone" />
                </div>
              </>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value, district: "", taluk: "" })}>
                  <SelectTrigger id="state"><SelectValue placeholder="Select State" /></SelectTrigger>
                  <SelectContent>
                    {statesAndDistricts.map((item) => (
                      <SelectItem key={item.state} value={item.state}>
                        {item.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value, taluk: "" })} disabled={!formData.state}>
                  <SelectTrigger id="district"><SelectValue placeholder="Select District" /></SelectTrigger>
                  <SelectContent>
                    {formData.state && statesAndDistricts
                      .find((s) => s.state === formData.state)
                      ?.districts.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taluk">Taluk</Label>
                <Select value={formData.taluk} onValueChange={(value) => setFormData({ ...formData, taluk: value })} disabled={!formData.district}>
                  <SelectTrigger id="taluk"><SelectValue placeholder="Select Taluk" /></SelectTrigger>
                  <SelectContent>
                    {formData.state && formData.district && statesAndDistricts
                      .find((s) => s.state === formData.state)
                      ?.districts.find((d) => d.name === formData.district)
                      ?.taluks.map((taluk) => (
                        <SelectItem key={taluk} value={taluk}>
                          {taluk}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
            {postingType === "free" && (
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-blue-900 dark:text-blue-100"><strong>Note:</strong> For free posts, buyers contact you through ThePropertyForYou team. Platform contact displayed.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Images * ({images.length}/{maxImages})</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input type="file" id="image-upload" accept="image/*" onChange={handleImageSelect} className="hidden" disabled={images.length >= maxImages} />
              <label htmlFor="image-upload" className={`cursor-pointer flex flex-col items-center ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">{images.length >= maxImages ? `Max ${maxImages} reached` : `Upload (Max ${maxImages})`}</span>
              </label>
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg shadow-md" />
                    <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Verification Document (Optional) */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Verification Document (Optional)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload verification documents (e.g. registration, property papers, certificate) to get a "Verified" badge. Uploaded documents are only visible to administrators and are never shown publicly.
          </p>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/10 relative">
              <input 
                type="file" 
                id="doc-upload" 
                accept=".pdf,image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setVerificationDoc(file);
                    setVerificationDocName(file.name);
                  }
                }} 
                className="hidden" 
              />
              <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-foreground">
                  {verificationDocName ? `Selected: ${verificationDocName}` : "Choose PDF or Image"}
                </span>
                <span className="text-xs text-muted-foreground mt-1">Optional, max 10MB</span>
              </label>
              {verificationDoc && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setVerificationDoc(null);
                    setVerificationDocName("");
                  }} 
                  className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Terms */}
        <Card className="p-6 mb-6 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
            <div className="space-y-2 flex-1">
              <Label htmlFor="terms" className="text-base font-semibold cursor-pointer">Terms & Conditions</Label>
              <div className="text-sm text-muted-foreground space-y-1 bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Legal Notice:</strong> Only legal products allowed under Property categories.</p>
                </div>
                <p className="ml-6">Posting illegal items, counterfeit goods, or misleading information is prohibited.</p>
                <p className="ml-6">Admin may reject suspicious listings and file complaints for illegal activity.</p>
              </div>
            </div>
          </div>
        </Card>

        <ImageCropperDialog
          open={cropperOpen}
          onOpenChange={setCropperOpen}
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={4/3}
        />

        {/* Submit */}
        <Button onClick={handleSubmit} disabled={isSubmitting || !agreedToTerms} className={`w-full ${postingType === "popup" ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : postingType === "featured" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-primary hover:bg-primary/90"}`} size="lg">
          {isSubmitting ? "Processing..." : postingType === "popup" ? "Submit Popup Ad" : postingType === "featured" ? "Submit Featured Ad" : "Submit Free Listing"}
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default PostAd;
