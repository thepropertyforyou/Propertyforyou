import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropperDialog } from "@/components/common/ImageCropperDialog";
import { statesAndDistricts } from "@/data/india-locations";
import { parsePriceToNumber } from "@/lib/priceUtils";
import { Loader2, Upload, X } from "lucide-react";

const AdminAddListing = () => {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [subCategory, setSubCategory] = useState("sales");
  const [priceUnit, setPriceUnit] = useState("unit");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    size: "",
    price: "",
    deposit: "",
    description: "",
    sellerPhone: "",
    state: "",
    district: "",
    taluk: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", "properties")
        .single();
      if (data) {
        setCategoryId(data.id);
      } else if (error) {
        console.error("Error fetching properties category:", error);
      }
    };
    fetchCategory();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImageSrc(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploadingImage(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = croppedFile.name.split(".").pop() || "jpg";
      const fileName = `admin_${user?.id || "admin"}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, croppedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(fileName);

      setImageUrls((prev) => [...prev, publicUrl]);
      toast.success("Image cropped & uploaded");
    } catch (err: any) {
      console.error("Direct image upload failed:", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a listing title");
      return;
    }
    if (!subCategory) {
      toast.error("Please select a subcategory");
      return;
    }
    if (!formData.propertyType) {
      toast.error("Please select a property type");
      return;
    }
    const numericPrice = parsePriceToNumber(formData.price);
    if (!formData.price.trim() || numericPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (subCategory === "rent" && (!formData.deposit || parseFloat(formData.deposit) < 0 || isNaN(parseFloat(formData.deposit)))) {
      toast.error("Please enter a valid security deposit amount for rent");
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
    if (!formData.state) {
      toast.error("Please select a state");
      return;
    }
    if (!formData.district) {
      toast.error("Please select a district");
      return;
    }
    if (imageUrls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No admin user found. Please login.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("user_id", user.id)
        .maybeSingle();

      const depositVal = subCategory === "rent" && formData.deposit ? parseFloat(formData.deposit) : undefined;

      const numericPrice = parsePriceToNumber(formData.price);

      const attributesPayload: any = {
        subCategory,
        priceUnit,
        displayPrice: formData.price.trim(),
        propertyType: formData.propertyType,
        size: formData.size || undefined,
        state: formData.state,
        district: formData.district,
        taluk: formData.taluk || undefined,
      };

      if (depositVal !== undefined) {
        attributesPayload.deposit = depositVal;
      }

      const listingPayload: any = {
        user_id: user.id,
        category_id: categoryId,
        title: formData.title.trim(),
        price: numericPrice,
        description: formData.description.trim(),
        location_city: formData.district,
        location_locality: formData.taluk || null,
        seller_name: profile?.name || "Admin",
        seller_email: profile?.email || user.email || "",
        seller_phone: formData.sellerPhone.trim(),
        status: "active",
        attributes: attributesPayload,
      };

      if (depositVal !== undefined) {
        listingPayload.deposit = depositVal;
      }

      // 1. Create Listing (with fallback if deposit column doesn't exist yet)
      let listingRes;
      try {
        listingRes = await supabase
          .from("listings")
          .insert(listingPayload)
          .select()
          .single();
      } catch (err: any) {
        if (err?.code === "42703") {
          delete listingPayload.deposit;
          listingRes = await supabase
            .from("listings")
            .insert(listingPayload)
            .select()
            .single();
        } else {
          throw err;
        }
      }

      if (listingRes.error) {
        if (listingRes.error.code === "42703") {
          delete listingPayload.deposit;
          listingRes = await supabase
            .from("listings")
            .insert(listingPayload)
            .select()
            .single();
        }
        if (listingRes.error) throw listingRes.error;
      }

      const listing = listingRes.data;

      // 2. Add Images
      if (imageUrls.length > 0) {
        const imageInserts = imageUrls.map((url, index) => ({
          listing_id: listing.id,
          image_url: url,
          display_order: index,
        }));
        await supabase.from("listing_images").insert(imageInserts);
      }

      toast.success("Listing created successfully!");
      navigate("/admin/listings");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.error(error.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Listing</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add a property listing to the marketplace with automatic Listing ID generation.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/listings")}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Category</h2>
            <div className="flex gap-4">
              <Button type="button" variant="default">
                Properties
              </Button>
            </div>
          </Card>

          {/* Subcategory */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subcategory *</h2>
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
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select" />
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
                  placeholder="1200" 
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
                  placeholder="Describe your property..." 
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
                  placeholder="Your phone" 
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
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
                  <Label htmlFor="district">District *</Label>
                  <Select 
                    value={formData.district} 
                    onValueChange={(value) => setFormData({ ...formData, district: value, taluk: "" })} 
                    disabled={!formData.state}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
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
                  <Select 
                    value={formData.taluk} 
                    onValueChange={(value) => setFormData({ ...formData, taluk: value })} 
                    disabled={!formData.district}
                  >
                    <SelectTrigger id="taluk">
                      <SelectValue placeholder="Select Taluk" />
                    </SelectTrigger>
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
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upload Images *</h2>
              {imageUrls.length > 0 && (
                <Badge variant="outline" className="text-sm font-semibold">
                  {imageUrls.length} {imageUrls.length === 1 ? "image" : "images"}
                </Badge>
              )}
            </div>
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center relative transition-colors hover:bg-muted/20 cursor-pointer"
                onClick={() => document.getElementById("admin-image-upload")?.click()}
              >
                <input
                  type="file"
                  id="admin-image-upload"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isUploadingImage}
                />
                <div className="cursor-pointer flex flex-col items-center">
                  {isUploadingImage ? (
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-2" />
                  ) : (
                    <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  )}
                  <span className="text-base font-semibold text-foreground">
                    {isUploadingImage ? "Uploading & saving image..." : "Upload Image"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Images are automatically cropped and securely saved (4:3)
                  </span>
                </div>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden shadow-sm bg-muted aspect-[4/3]">
                      <img 
                        src={url} 
                        alt={`Listing image ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Image {index + 1}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-90 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <ImageCropperDialog
            open={cropperOpen}
            onOpenChange={setCropperOpen}
            imageSrc={rawImageSrc}
            onCropComplete={handleCropComplete}
            aspectRatio={4 / 3}
          />

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading || isUploadingImage}>
            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Publish Listing"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddListing;
