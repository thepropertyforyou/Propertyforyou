import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropperDialog } from "@/components/common/ImageCropperDialog";
import { addWatermarkToImage } from "@/utils/watermark";
import { statesAndDistricts } from "@/data/india-locations";
import { parsePriceToNumber } from "@/lib/priceUtils";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";

const AdminEditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Listing Fields
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    size: "",
    price: "",
    deposit: "",
    description: "",
    sellerPhone: "",
    sellerName: "",
    sellerEmail: "",
    state: "",
    district: "",
    taluk: "",
    categoryId: "",
    status: "active",
    isFeatured: false,
  });

  const [subCategory, setSubCategory] = useState("sales");
  const [priceUnit, setPriceUnit] = useState("unit");

  // Images state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pendingCropQueue, setPendingCropQueue] = useState<File[]>([]);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Categories
      const { data: catData } = await supabase.from("categories").select("*");
      if (catData) setCategories(catData);

      // 2. Fetch Listing with images
      const { data: listing, error } = await supabase
        .from("listings")
        .select(`
          *,
          listing_images (image_url, display_order)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      if (listing) {
        const depositVal = (listing as any).deposit ?? (listing.attributes as any)?.deposit;
        const rawSub = (listing.attributes as any)?.subCategory || (listing.attributes as any)?.subcategory || (listing.attributes as any)?.type || (listing as any).subcategory || "sales";
        const normSub = String(rawSub).toLowerCase();
        const initialSub = normSub === "rent" || normSub === "lease" ? normSub : "sales";

        let stateVal = (listing.attributes as any)?.state || "";
        let districtVal = (listing.attributes as any)?.district || listing.location_city || "";
        let talukVal = (listing.attributes as any)?.taluk || listing.location_locality || "";

        // If state is not stored, resolve from district
        if (!stateVal && districtVal) {
          const matchedState = statesAndDistricts.find((s) =>
            s.districts.some(
              (d) =>
                d.name.toLowerCase() === districtVal.toLowerCase() ||
                districtVal.toLowerCase().includes(d.name.toLowerCase()) ||
                d.name.toLowerCase().includes(districtVal.toLowerCase())
            )
          );
          if (matchedState) {
            stateVal = matchedState.state;
          }
        }

        setFormData({
          title: listing.title || "",
          propertyType: (listing.attributes as any)?.propertyType || "",
          size: (listing.attributes as any)?.size ? String((listing.attributes as any).size) : "",
          price: (listing.attributes as any)?.displayPrice || (listing.price ? listing.price.toString() : ""),
          deposit: depositVal !== undefined && depositVal !== null ? depositVal.toString() : "",
          description: listing.description || "",
          sellerPhone: listing.seller_phone || (listing.attributes as any)?.contactNumber || "",
          sellerName: listing.seller_name || "",
          sellerEmail: listing.seller_email || "",
          categoryId: listing.category_id || "",
          state: stateVal,
          district: districtVal,
          taluk: talukVal,
          status: listing.status || "active",
          isFeatured: Boolean(listing.is_featured),
        });

        setSubCategory(initialSub);
        setPriceUnit((listing.attributes as any)?.priceUnit || (initialSub === "rent" ? "month" : "unit"));

        const sortedImages = (listing.listing_images || [])
          .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((img: any) => img.image_url);
        setImageUrls(sortedImages);
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Failed to load listing data");
    } finally {
      setLoading(false);
    }
  };

  // Image Upload with Multiple Selection & Sequential Cropping
  const handleMultipleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = 6 - imageUrls.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 6 images allowed (Listing plan limit)");
      return;
    }

    let filesToProcess = files;
    if (files.length > remainingSlots) {
      toast.info(`You can add up to ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""}. Queued first ${remainingSlots}.`);
      filesToProcess = files.slice(0, remainingSlots);
    }

    const [first, ...rest] = filesToProcess;
    setPendingCropQueue(rest);
    startCroppingFile(first);
  };

  const startCroppingFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploadingImage(true);
    try {
      const finalFile = await addWatermarkToImage(croppedFile);
      const fileExt = finalFile.name.split(".").pop() || "jpg";
      const fileName = `listing_${id || 'admin'}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, finalFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(fileName);

      setImageUrls((prev) => [...prev, publicUrl]);
      toast.success("Image added");
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }

    // Process next queued file if any
    if (pendingCropQueue.length > 0) {
      const [nextFile, ...remaining] = pendingCropQueue;
      setPendingCropQueue(remaining);
      startCroppingFile(nextFile);
    } else {
      setCropperOpen(false);
      setRawImageSrc(null);
    }
  };

  const handleCropperClose = (open: boolean) => {
    if (!open) {
      setCropperOpen(false);
      setPendingCropQueue([]);
      setRawImageSrc(null);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Form Submit: Save everything in one click
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const numericPrice = parsePriceToNumber(formData.price);
    if (!formData.price.trim() || numericPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (subCategory === "rent" && !formData.deposit) {
      toast.error("Please enter the deposit amount for rent");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!formData.sellerPhone.trim()) {
      toast.error("Please enter a contact number");
      return;
    }

    if (imageUrls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setSaving(true);
    try {
      // 1. Fetch current attributes to preserve custom fields if any
      const { data: currentListing } = await supabase
        .from("listings")
        .select("attributes")
        .eq("id", id)
        .single();

      const currentAttributes = currentListing?.attributes && typeof currentListing.attributes === "object"
        ? currentListing.attributes
        : {};

      const depositNum = subCategory === "rent" && formData.deposit ? parseFloat(formData.deposit) : undefined;

      const updatedAttributes = {
        ...currentAttributes,
        subCategory,
        priceUnit,
        displayPrice: formData.price.trim(),
        propertyType: formData.propertyType || currentAttributes.propertyType,
        size: formData.size || currentAttributes.size,
        state: formData.state || currentAttributes.state,
        district: formData.district || currentAttributes.district,
        taluk: formData.taluk || currentAttributes.taluk,
        deposit: depositNum,
        contactNumber: formData.sellerPhone.trim(),
      };

      const updatePayload: any = {
        category_id: formData.categoryId,
        title: formData.title.trim(),
        price: numericPrice,
        description: formData.description,
        location_city: formData.district || formData.state || "",
        location_locality: formData.taluk || null,
        seller_name: formData.sellerName || "",
        seller_email: formData.sellerEmail || "",
        seller_phone: formData.sellerPhone.trim(),
        status: formData.status,
        is_featured: formData.isFeatured,
        attributes: updatedAttributes,
      };

      // 2. Update Listing (with fallback if deposit column is not present)
      try {
        const { error: listingError } = await supabase
          .from("listings")
          .update({
            ...updatePayload,
            deposit: depositNum ?? null,
          })
          .eq("id", id);

        if (listingError) {
          if (listingError.code === "42703") {
            const { error: fallbackErr } = await supabase
              .from("listings")
              .update(updatePayload)
              .eq("id", id);
            if (fallbackErr) throw fallbackErr;
          } else {
            throw listingError;
          }
        }
      } catch (err: any) {
        if (err?.code === "42703") {
          const { error: fallbackErr } = await supabase
            .from("listings")
            .update(updatePayload)
            .eq("id", id);
          if (fallbackErr) throw fallbackErr;
        } else {
          throw err;
        }
      }

      // 3. Refresh Images (Delete old and insert new with display_order)
      await supabase.from("listing_images").delete().eq("listing_id", id);

      if (imageUrls.length > 0) {
        const imageInserts = imageUrls.map((url, index) => ({
          listing_id: id,
          image_url: url,
          display_order: index,
        }));
        await supabase.from("listing_images").insert(imageInserts);
      }

      toast.success("Listing updated successfully!");
      navigate("/admin/listings");
    } catch (error: any) {
      console.error("Error updating listing:", error);
      toast.error(error.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Listing</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Update listing details, pricing, location, and images.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/listings")}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          {/* Category */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Category</h2>
            <div className="flex items-center gap-3">
              <Button type="button" variant="default" className="pointer-events-none">
                Properties
              </Button>
            </div>
          </Card>

          {/* Subcategory - Pre-filled and already selected */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Subcategory</h2>
              <Badge variant="secondary" className="capitalize">
                Current: {subCategory}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Pre-filled from saved listing. You can change it if needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={subCategory === "sales" ? "default" : "outline"}
                onClick={() => {
                  setSubCategory("sales");
                  if (priceUnit === "month") setPriceUnit("unit");
                }}
              >
                Sales
              </Button>
              <Button
                type="button"
                variant={subCategory === "rent" ? "default" : "outline"}
                onClick={() => {
                  setSubCategory("rent");
                  setPriceUnit("month");
                }}
              >
                Rent
              </Button>
              <Button
                type="button"
                variant={subCategory === "lease" ? "default" : "outline"}
                onClick={() => {
                  setSubCategory("lease");
                  if (priceUnit === "month") setPriceUnit("unit");
                }}
              >
                Lease
              </Button>
            </div>
          </Card>

          {/* Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="land">Land/Plot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size (sq ft)</Label>
                <Input
                  id="size"
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g. 1200"
                />
              </div>
            </div>
          </Card>

          {/* Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  {subCategory === "rent" ? "Rent per month (₹) *" : "Price (₹) *"}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input
                      id="price"
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder={subCategory === "rent" ? "e.g. 15,000 or 15k" : "e.g. 1.20 cr, 1 lakh, 15000"}
                      required
                    />
                  </div>
                  <div>
                    <Select value={priceUnit} onValueChange={setPriceUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plain">Plain</SelectItem>
                        <SelectItem value="sqft">Per Sq Ft</SelectItem>
                        <SelectItem value="acre">Per Acre</SelectItem>
                        <SelectItem value="cent">Per Cent</SelectItem>
                        <SelectItem value="month">Per Month</SelectItem>
                        <SelectItem value="room">Per Room</SelectItem>
                        <SelectItem value="unit">Per Unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {subCategory === "rent" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Label htmlFor="deposit">Deposit (₹) *</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    placeholder="Enter security deposit amount"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the property..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerPhone">Contact Number *</Label>
                <Input
                  id="sellerPhone"
                  type="tel"
                  value={formData.sellerPhone}
                  onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                  placeholder="Contact phone"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value, district: "", taluk: "" })}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
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
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => setFormData({ ...formData, district: value, taluk: "" })}
                    disabled={!formData.state}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.state &&
                        statesAndDistricts
                          .find((s) => s.state === formData.state)
                          ?.districts.map((district) => (
                            <SelectItem key={district.name} value={district.name}>
                              {district.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taluk">Taluk</Label>
                  <Select
                    value={formData.taluk}
                    onValueChange={(value) => setFormData({ ...formData, taluk: value })}
                    disabled={!formData.district}
                  >
                    <SelectTrigger id="taluk">
                      <SelectValue placeholder="Select Taluk" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.state &&
                        formData.district &&
                        statesAndDistricts
                          .find((s) => s.state === formData.state)
                          ?.districts.find((d) => d.name === formData.district)
                          ?.taluks.map((taluk) => (
                            <SelectItem key={taluk} value={taluk}>
                              {taluk}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Images Management - Multiple uploads & Crop tool */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Listing Images *</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload up to 6 images in one go. Each image can be cropped to 4:3.
                </p>
              </div>
              <Badge variant="outline" className="text-sm font-semibold">
                {imageUrls.length} / 6 images
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Dropzone for Multiple Selection */}
              {imageUrls.length < 6 && (
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center relative transition-colors hover:bg-muted/20 cursor-pointer"
                  onClick={() => document.getElementById("admin-edit-image-upload")?.click()}
                >
                  <input
                    type="file"
                    id="admin-edit-image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageSelect}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <div className="cursor-pointer flex flex-col items-center">
                    {isUploadingImage ? (
                      <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    )}
                    <span className="text-base font-semibold text-foreground">
                      {isUploadingImage ? "Cropping & saving..." : "Click to Add Images"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Select one or multiple photos (up to 6 total). 4:3 crop tool included.
                    </span>
                  </div>
                </div>
              )}

              {/* Existing & Added Images Grid */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-lg overflow-hidden shadow-sm bg-muted aspect-[4/3]"
                    >
                      <img
                        src={url}
                        alt={`Listing image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {index === 0 ? "Cover (1)" : `Image ${index + 1}`}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-90 hover:opacity-100 shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        title="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Status & Featured */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Settings & Visibility</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Status</Label>
                  <p className="text-sm text-muted-foreground">Listing visibility on platform</p>
                </div>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Featured Listing</Label>
                  <p className="text-sm text-muted-foreground">Highlight on homepage & featured list</p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(val) => setFormData({ ...formData, isFeatured: val })}
                />
              </div>
            </div>
          </Card>

          {/* Seller Contact Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Seller Account Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sname">Seller Name</Label>
                <Input
                  id="sname"
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  placeholder="Seller name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semail">Seller Email</Label>
                <Input
                  id="semail"
                  type="email"
                  value={formData.sellerEmail}
                  onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                  placeholder="Seller email"
                />
              </div>
            </div>
          </Card>

          <Button type="submit" className="w-full text-base py-6 font-semibold" disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Image Cropper Dialog */}
      <ImageCropperDialog
        open={cropperOpen}
        onOpenChange={handleCropperClose}
        imageSrc={rawImageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={4 / 3}
        targetWidth={1200}
        targetHeight={900}
      />
    </AdminLayout>
  );
};

export default AdminEditListing;
