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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, X, Star, Image as ImageIcon, Phone, Eye, Check, AlertTriangle, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ImageCropperDialog } from "@/components/common/ImageCropperDialog";
import { statesAndDistricts } from "@/data/india-locations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type PostingType = "free" | "featured" | "popup";

export interface AdPlan {
  id?: string;
  ad_type: "featured" | "popup";
  plan_tier: number;
  name: string;
  duration_days: number;
  price: number;
  display_price?: string | null;
  is_active?: boolean;
}

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
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);

  // Confirmation result
  const [submittedResult, setSubmittedResult] = useState<{
    listingId: string;
    customerId: string;
    title: string;
    internalId: string;
    type: string;
  } | null>(null);
  const [existingCustomerId, setExistingCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("customer_id")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.customer_id) {
            setExistingCustomerId(data.customer_id);
          }
        });
    }
  }, [user]);

  // Multi-step flow for Featured and Popup Ads
  const [currentStep, setCurrentStep] = useState<"form" | "plan" | "schedule" | "confirm">("form");
  const [adPlans, setAdPlans] = useState<AdPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<AdPlan | null>(null);
  
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

  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [verificationDocUrl, setVerificationDocUrl] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isRestoringProgress, setIsRestoringProgress] = useState(true);

  // Restore progress on mount and validate plan and slot
  useEffect(() => {
    const restoreProgress = async () => {
      try {
        const saved = localStorage.getItem("post_ad_progress");
        if (saved) {
          const data = JSON.parse(saved);
          if (data.category) setCategory(data.category);
          if (data.subCategory) setSubCategory(data.subCategory);
          if (data.priceUnit) setPriceUnit(data.priceUnit);
          if (data.postingType) setPostingType(data.postingType);
          if (data.formData) setFormData(data.formData);
          if (data.agreedToTerms !== undefined) setAgreedToTerms(data.agreedToTerms);
          if (data.verificationDocName) setVerificationDocName(data.verificationDocName);
          if (data.verificationDocUrl) setVerificationDocUrl(data.verificationDocUrl);

          if (Array.isArray(data.uploadedImageUrls) && data.uploadedImageUrls.length > 0) {
            setUploadedImageUrls(data.uploadedImageUrls);
            setImagePreviews(data.uploadedImageUrls);
          }

          // Fetch latest pricing plans to validate saved plan
          const { data: plansData } = await supabase
            .from("pricing_plans")
            .select("*")
            .order("display_order", { ascending: true });

          let freshPlans: AdPlan[] = [];
          if (plansData) {
            setPricingPlans(plansData);

            const featuredRows = plansData
              .filter(p => p.plan_type.startsWith("featured_"))
              .sort((a, b) => a.display_order - b.display_order);

            const popupRows = plansData
              .filter(p => p.plan_type.startsWith("popup_"))
              .sort((a, b) => a.display_order - b.display_order);

            const mappedFeatured: AdPlan[] = featuredRows.map((row, idx) => {
              const hasNumericDisplay = row.display_price !== null && row.display_price !== undefined && !isNaN(Number(row.display_price));
              const isActive = row.is_active !== undefined && row.is_active !== null ? Boolean(row.is_active) : true;
              return {
                id: row.id,
                ad_type: "featured",
                plan_tier: idx + 1,
                name: row.plan_name || (row.display_price && isNaN(Number(row.display_price)) && row.display_price.trim() !== "0" && !row.display_price.startsWith("₹")
                  ? row.display_price
                  : `Plan ${idx + 1}`),
                duration_days: Number(row.duration),
                price: Number(row.price),
                display_price: hasNumericDisplay ? String(row.display_price) : null,
                is_active: isActive,
              };
            });

            const mappedPopup: AdPlan[] = popupRows.map((row, idx) => {
              const hasNumericDisplay = row.display_price !== null && row.display_price !== undefined && !isNaN(Number(row.display_price));
              const isActive = row.is_active !== undefined && row.is_active !== null ? Boolean(row.is_active) : true;
              return {
                id: row.id,
                ad_type: "popup",
                plan_tier: idx + 1,
                name: row.plan_name || (row.display_price && isNaN(Number(row.display_price)) && row.display_price.trim() !== "0" && !row.display_price.startsWith("₹")
                  ? row.display_price
                  : `Plan ${idx + 1}`),
                duration_days: Number(row.duration),
                price: Number(row.price),
                display_price: hasNumericDisplay ? String(row.display_price) : null,
                is_active: isActive,
              };
            });

            freshPlans = [...mappedFeatured, ...mappedPopup];
            setAdPlans(freshPlans);
          }

          // Validate and restore selected plan (never auto-select a paused plan)
          if (data.selectedPlan && freshPlans.length > 0) {
            const currentType = data.postingType || "featured";
            const matchingPlan = freshPlans.find(
              p => p.ad_type === currentType && (p.id === data.selectedPlan.id || p.plan_tier === data.selectedPlan.plan_tier)
            );
            if (matchingPlan && matchingPlan.is_active !== false) {
              setSelectedPlan(matchingPlan);
            } else {
              const activeFallback = freshPlans.find(p => p.ad_type === currentType && p.is_active !== false);
              setSelectedPlan(activeFallback || null);
            }
          }

          // Validate and restore selected date and slot
          let validDate = data.selectedDate || "";
          let validSlot: number | null = data.selectedSlot !== undefined ? data.selectedSlot : null;

          if (validDate) {
            const todayStr = new Date().toISOString().split("T")[0];
            if (validDate < todayStr) {
              validDate = "";
              validSlot = null;
            } else if (data.postingType === "popup" && validSlot !== null) {
              const { data: bookedData } = await supabase
                .from("popup_ad_schedules")
                .select("slot_number")
                .eq("schedule_date", validDate);

              const booked = (bookedData || []).map(s => s.slot_number);
              setBookedSlots(booked);
              const available = [1, 2, 3].filter(s => !booked.includes(s));
              setAvailableSlots(available);

              if (booked.includes(validSlot)) {
                validSlot = null;
                toast.warning(`Saved slot was booked by someone else. Please choose another slot.`);
              }
            }
            setSelectedDate(validDate);
            setSelectedSlot(validSlot);
          }

          // Restore currentStep (if user was past form step, ensure required fields exist)
          let targetStep = data.currentStep || "form";
          if (targetStep !== "form") {
            const hasBasicFields = data.formData?.title && data.formData?.price && data.formData?.district && (data.uploadedImageUrls?.length > 0 || data.imagesCount > 0);
            if (!hasBasicFields) {
              targetStep = "form";
            }
          }
          setCurrentStep(targetStep);
          toast.info("Resumed previous progress");
        }
      } catch (err) {
        console.error("Error restoring progress:", err);
      } finally {
        setIsRestoringProgress(false);
      }
    };

    restoreProgress();
  }, []);

  // Save progress to localStorage on change (after initial restoration)
  useEffect(() => {
    if (isRestoringProgress) return;
    try {
      const progress = {
        category,
        subCategory,
        priceUnit,
        postingType,
        formData,
        agreedToTerms,
        selectedDate,
        selectedSlot,
        currentStep,
        selectedPlan,
        uploadedImageUrls,
        verificationDocName,
        verificationDocUrl,
        timestamp: Date.now()
      };
      localStorage.setItem("post_ad_progress", JSON.stringify(progress));
    } catch (err) {
      console.error("Error saving progress to localStorage:", err);
    }
  }, [
    category,
    subCategory,
    priceUnit,
    postingType,
    formData,
    agreedToTerms,
    selectedDate,
    selectedSlot,
    currentStep,
    selectedPlan,
    uploadedImageUrls,
    verificationDocName,
    verificationDocUrl,
    isRestoringProgress
  ]);

  const fetchPricingPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      if (data) {
        setPricingPlans(data);

        // Derive Featured Plans (ordered by display_order)
        const featuredRows = data
          .filter(p => p.plan_type.startsWith("featured_"))
          .sort((a, b) => a.display_order - b.display_order);

        // Derive Popup Plans (ordered by display_order)
        const popupRows = data
          .filter(p => p.plan_type.startsWith("popup_"))
          .sort((a, b) => a.display_order - b.display_order);

        const mappedFeatured: AdPlan[] = featuredRows.map((row, idx) => {
          const hasNumericDisplay = row.display_price !== null && row.display_price !== undefined && !isNaN(Number(row.display_price));
          const isActive = row.is_active !== undefined && row.is_active !== null ? Boolean(row.is_active) : true;
          return {
            id: row.id,
            ad_type: "featured",
            plan_tier: idx + 1,
            name: row.plan_name || (row.display_price && isNaN(Number(row.display_price)) && row.display_price.trim() !== "0" && !row.display_price.startsWith("₹")
              ? row.display_price
              : `Plan ${idx + 1}`),
            duration_days: Number(row.duration),
            price: Number(row.price),
            display_price: hasNumericDisplay ? String(row.display_price) : null,
            is_active: isActive,
          };
        });

        const mappedPopup: AdPlan[] = popupRows.map((row, idx) => {
          const hasNumericDisplay = row.display_price !== null && row.display_price !== undefined && !isNaN(Number(row.display_price));
          const isActive = row.is_active !== undefined && row.is_active !== null ? Boolean(row.is_active) : true;
          return {
            id: row.id,
            ad_type: "popup",
            plan_tier: idx + 1,
            name: row.plan_name || (row.display_price && isNaN(Number(row.display_price)) && row.display_price.trim() !== "0" && !row.display_price.startsWith("₹")
              ? row.display_price
              : `Plan ${idx + 1}`),
            duration_days: Number(row.duration),
            price: Number(row.price),
            display_price: hasNumericDisplay ? String(row.display_price) : null,
            is_active: isActive,
          };
        });

        setAdPlans([...mappedFeatured, ...mappedPopup]);
      }
    } catch (err) {
      console.error("Error fetching pricing_plans:", err);
    }
  };

  useEffect(() => {
    if (!isRestoringProgress && adPlans.length === 0) {
      fetchPricingPlans();
    }
  }, [isRestoringProgress]);

  const getPlansForType = (type: "featured" | "popup"): AdPlan[] => {
    return adPlans.filter(p => p.ad_type === type);
  };

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
      const booked = (data || []).map(s => s.slot_number);
      setBookedSlots(booked);
      const available = [1, 2, 3].filter(slot => !booked.includes(slot));
      setAvailableSlots(available);
      if (available.length === 0) {
        toast.error("All 3 slots are booked for this date");
        setSelectedSlot(null);
      } else if (selectedSlot && booked.includes(selectedSlot)) {
        setSelectedSlot(null);
      }
    } catch (error) {
      console.error("Error checking slots:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxAllowed = postingType === "free" ? 2 : 6;
      if (uploadedImageUrls.length >= maxAllowed) {
        toast.error(`Maximum ${maxAllowed} images allowed`);
        e.target.value = '';
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

  const handleUploadAreaClick = (e: React.MouseEvent) => {
    const maxAllowed = postingType === "free" ? 2 : 6;
    if (uploadedImageUrls.length >= maxAllowed) {
      e.preventDefault();
      toast.error(`Maximum ${maxAllowed} images allowed`);
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploadingImage(true);
    try {
      const fileExt = croppedFile.name.split(".").pop() || "jpg";
      const fileName = `temp_${user?.id || 'anon'}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("listing-images").upload(fileName, croppedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(fileName);
      setUploadedImageUrls(prev => [...prev, publicUrl]);
      setImagePreviews(prev => [...prev, publicUrl]);
      toast.success("Image uploaded & saved");
    } catch (err: any) {
      console.error("Direct image upload failed:", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerificationDocSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerificationDocName(file.name);
    setIsUploadingDoc(true);
    try {
      const fileExt = file.name.split(".").pop() || "pdf";
      const fileName = `verification-docs/temp_${user?.id || 'anon'}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("listing-images").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(fileName);
      setVerificationDocUrl(publicUrl);
      toast.success("Verification document uploaded");
    } catch (err: any) {
      console.error("Verification doc upload failed:", err);
      toast.error(err.message || "Failed to upload document");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const validateInitialForm = (): boolean => {
    if (!formData.title.trim() || !formData.price || parseFloat(formData.price) <= 0 || !formData.district || uploadedImageUrls.length === 0 || !agreedToTerms) {
      toast.error("Please fill all required fields and agree to terms");
      return false;
    }
    if (!subCategory) {
      toast.error("Please select a subcategory");
      return false;
    }
    if (postingType !== "free") {
      if (!formData.description.trim()) {
        toast.error("Description required for featured/popup listings");
        return false;
      }
      if (!formData.sellerPhone.trim()) {
        toast.error("Contact number required for featured/popup listings");
        return false;
      }
    }
    if (!user) {
      sessionStorage.setItem("pendingAdFormData", JSON.stringify({ formData, category, postingType }));
      toast.error("Please login to proceed");
      navigate("/auth?redirect=/post-ad");
      return false;
    }
    return true;
  };

  const handleProceedToPlan = async () => {
    if (!validateInitialForm()) return;
    await fetchPricingPlans();
    const availablePlans = getPlansForType(postingType as "featured" | "popup");
    const activePlans = availablePlans.filter(p => p.is_active !== false);
    if (!selectedPlan || selectedPlan.ad_type !== postingType || selectedPlan.is_active === false) {
      if (activePlans.length > 0) {
        setSelectedPlan(activePlans[0]);
      } else {
        setSelectedPlan(null);
      }
    }
    setCurrentStep("plan");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    if (postingType === "free") {
      if (!validateInitialForm()) return;
    } else {
      if (!selectedPlan) {
        toast.error("Please select a plan");
        return;
      }

      // Live re-check from pricing_plans that the selected plan is still active and not paused
      try {
        let planQuery = supabase.from("pricing_plans").select("*");
        if (selectedPlan.id) {
          planQuery = planQuery.eq("id", selectedPlan.id);
        } else {
          planQuery = planQuery.eq("plan_type", `${selectedPlan.ad_type}_${selectedPlan.duration_days}`);
        }
        const { data: latestPlanRow, error: checkPlanErr } = await planQuery.maybeSingle();
        if (!checkPlanErr && latestPlanRow && latestPlanRow.is_active === false) {
          toast.error(`The selected plan "${selectedPlan.name}" is currently paused. Please choose an active plan.`);
          setSelectedPlan(null);
          setCurrentStep("plan");
          await fetchPricingPlans();
          return;
        }
      } catch (checkErr) {
        console.warn("Could not re-verify plan active status:", checkErr);
      }

      if (!selectedDate) {
        toast.error(postingType === "popup" ? "Please select a date for the popup ad" : "Please select a start date for the featured ad");
        return;
      }
      if (postingType === "popup" && selectedSlot === null) {
        toast.error("Please select a slot for the popup ad");
        return;
      }
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

      // If popup ad, re-check slot double booking
      if (postingType === "popup" && selectedDate && selectedSlot !== null) {
        const { data: existingSlots, error: checkErr } = await supabase
          .from("popup_ad_schedules")
          .select("id")
          .eq("schedule_date", selectedDate)
          .eq("slot_number", selectedSlot);

        if (checkErr) throw checkErr;
        if (existingSlots && existingSlots.length > 0) {
          toast.error(`Slot ${selectedSlot} on ${selectedDate} was just booked. Please choose another slot.`);
          setIsSubmitting(false);
          setCurrentStep("schedule");
          checkAvailableSlots(selectedDate);
          return;
        }
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

      // Attach chosen plan, price, date, and slot if featured or popup
      if (postingType !== "free" && selectedPlan) {
        const effectivePrice = selectedPlan.display_price !== null && selectedPlan.display_price !== undefined && String(selectedPlan.display_price).trim() !== "" && !isNaN(Number(selectedPlan.display_price))
          ? Number(selectedPlan.display_price)
          : Number(selectedPlan.price);

        attributes.plan_tier = selectedPlan.plan_tier;
        attributes.plan_name = selectedPlan.name;
        attributes.plan_duration = selectedPlan.duration_days;
        attributes.plan_price = effectivePrice;
        if (selectedPlan.display_price) {
          attributes.original_price = selectedPlan.price;
          attributes.display_price = selectedPlan.display_price;
        }
        attributes.start_date = selectedDate;
        if (postingType === "popup") {
          attributes.slot_number = selectedSlot;
        }
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

      // Associate already uploaded images
      for (let i = 0; i < uploadedImageUrls.length; i++) {
        await supabase.from("listing_images").insert({
          listing_id: listing.id,
          image_url: uploadedImageUrls[i],
          display_order: i,
        });
      }

      // Attach verification doc if uploaded
      if (verificationDocUrl) {
        const updatedAttributes = {
          ...attributes,
          verificationDocUrl,
          verificationStatus: "pending",
        };
        await supabase
          .from("listings")
          .update({ attributes: updatedAttributes })
          .eq("id", listing.id);
      }

      // If popup promotion is selected, insert schedule with chosen plan, date, and slot
      if (postingType === "popup" && selectedDate && selectedSlot !== null) {
        const paymentAmount = selectedPlan
          ? (selectedPlan.display_price !== null && selectedPlan.display_price !== undefined && String(selectedPlan.display_price).trim() !== "" && !isNaN(Number(selectedPlan.display_price))
              ? Number(selectedPlan.display_price)
              : Number(selectedPlan.price))
          : 999;

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

      // Clear saved progress on successful submission
      localStorage.removeItem("post_ad_progress");

      const assignedListingId = listing.listing_id || "LST-0001";
      let assignedCustomerId = listing.customer_id;
      if (!assignedCustomerId && user?.id) {
        const { data: pData } = await supabase.from("profiles").select("customer_id").eq("user_id", user.id).single();
        if (pData?.customer_id) assignedCustomerId = pData.customer_id;
      }

      setSubmittedResult({
        listingId: assignedListingId,
        customerId: assignedCustomerId || existingCustomerId || "CUS-0001",
        title,
        internalId: listing.id,
        type: postingType,
      });

      if (postingType === "popup") {
        toast.success("Popup ad submitted! Sent to admin portal for review.");
      } else if (postingType === "featured") {
        toast.success("Featured ad submitted! Sent to admin portal for review.");
      } else {
        toast.success("Free ad posted!");
      }
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

  if (loading || isRestoringProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const maxImages = postingType === "free" ? 2 : 6;

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
                  <TableCell className="text-center">2</TableCell>
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
                    From ₹{getPlansForType("featured")[0]?.display_price || getPlansForType("featured")[0]?.price || 199}
                  </TableCell>
                  <TableCell className="text-center bg-purple-50 dark:bg-purple-950 font-bold">
                    From ₹{getPlansForType("popup")[0]?.display_price || getPlansForType("popup")[0]?.price || 199}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Posting Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={`p-6 cursor-pointer transition-all hover:shadow-lg ${postingType === "free" ? "border-2 border-primary shadow-md" : "border-2 border-transparent"}`} onClick={() => { setPostingType("free"); setUploadedImageUrls(prev => prev.slice(0, 2)); setImagePreviews(prev => prev.slice(0, 2)); setCurrentStep("form"); }}>
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

          <Card className={`p-6 cursor-pointer transition-all hover:shadow-lg relative ${postingType === "featured" ? "border-2 border-yellow-500 shadow-md" : "border-2 border-transparent"}`} onClick={() => { setPostingType("featured"); setCurrentStep("form"); }}>
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

          <Card className={`p-6 cursor-pointer transition-all hover:shadow-lg relative ${postingType === "popup" ? "border-2 border-purple-500 shadow-md" : "border-2 border-transparent"}`} onClick={() => { setPostingType("popup"); setCurrentStep("form"); }}>
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

        {/* Multi-step progress indicator for Featured / Popup Ads */}
        {postingType !== "free" && (
          <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto px-4 bg-muted/30 py-3 rounded-xl border">
            <div className={`flex items-center gap-2 text-sm font-semibold ${currentStep === "form" ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === "form" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>1</span>
              <span>Ad Form</span>
            </div>
            <div className="h-0.5 flex-1 bg-muted-foreground/20 mx-2" />
            <div className={`flex items-center gap-2 text-sm font-semibold ${currentStep === "plan" ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === "plan" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>2</span>
              <span>Choose Plan</span>
            </div>
            <div className="h-0.5 flex-1 bg-muted-foreground/20 mx-2" />
            <div className={`flex items-center gap-2 text-sm font-semibold ${currentStep === "schedule" ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === "schedule" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>3</span>
              <span>Schedule & Slot</span>
            </div>
            <div className="h-0.5 flex-1 bg-muted-foreground/20 mx-2" />
            <div className={`flex items-center gap-2 text-sm font-semibold ${currentStep === "confirm" ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === "confirm" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>4</span>
              <span>Confirm</span>
            </div>
          </div>
        )}

        {/* STEP 1: Main Form */}
        {currentStep === "form" && (
          <>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upload Images *</h2>
                <Badge variant={uploadedImageUrls.length >= maxImages ? "secondary" : "outline"} className="text-sm font-semibold">
                  {uploadedImageUrls.length}/{maxImages}
                </Badge>
              </div>
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center relative transition-colors ${
                    uploadedImageUrls.length >= maxImages ? "bg-muted/40 cursor-pointer" : "hover:bg-muted/20 cursor-pointer"
                  }`}
                  onClick={handleUploadAreaClick}
                >
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <label
                    htmlFor={uploadedImageUrls.length >= maxImages ? undefined : "image-upload"}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="h-12 w-12 text-primary animate-spin mb-2" />
                    ) : (
                      <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                    )}
                    <span className="text-base font-semibold text-foreground">
                      {isUploadingImage
                        ? "Uploading & saving image..."
                        : `Upload (Max ${maxImages}) (${uploadedImageUrls.length}/${maxImages})`}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {uploadedImageUrls.length >= maxImages
                        ? `Maximum ${maxImages} images reached. Remove an image to replace it.`
                        : "Images are automatically cropped and securely saved"}
                    </span>
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group border rounded-lg overflow-hidden shadow-sm bg-muted">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-28 object-cover" 
                        />
                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                          Image {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-transform active:scale-95"
                          title="Remove image"
                        >
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
                    onChange={handleVerificationDocSelect} 
                    className="hidden" 
                    disabled={isUploadingDoc}
                  />
                  <label
                    htmlFor="doc-upload"
                    className={`cursor-pointer flex flex-col items-center ${isUploadingDoc ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUploadingDoc ? (
                      <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {isUploadingDoc
                        ? "Uploading document..."
                        : verificationDocName
                        ? `Uploaded: ${verificationDocName}`
                        : "Choose PDF or Image"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">Optional, max 10MB</span>
                  </label>
                  {(verificationDocName || verificationDocUrl) && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setVerificationDoc(null);
                        setVerificationDocName("");
                        setVerificationDocUrl(null);
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

            {/* Submit Button for Form Step */}
            <Button
              onClick={postingType === "free" ? handleFinalSubmit : handleProceedToPlan}
              disabled={isSubmitting || !agreedToTerms}
              className={`w-full ${
                postingType === "popup"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  : postingType === "featured"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-primary hover:bg-primary/90"
              }`}
              size="lg"
            >
              {isSubmitting
                ? "Processing..."
                : postingType === "free"
                ? "Submit Free Listing"
                : `Continue to Choose Plan (Step 2/4)`}
            </Button>
          </>
        )}

        {/* STEP 2: Choose Plan (Plan 1, Plan 2, Plan 3) */}
        {currentStep === "plan" && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                {postingType === "featured" ? (
                  <>
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    Choose Your Featured Plan
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 text-purple-500 fill-purple-500" />
                    Choose Your Popup Plan
                  </>
                )}
              </h2>
              <p className="text-muted-foreground">
                Select one of the 3 plans below to proceed with your promotion.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {getPlansForType(postingType as "featured" | "popup").map((plan) => {
                const isPaused = plan.is_active === false;
                const isSelected = !isPaused && selectedPlan?.plan_tier === plan.plan_tier && selectedPlan?.ad_type === plan.ad_type;
                return (
                  <Card
                    key={`${plan.ad_type}-${plan.plan_tier}`}
                    className={`p-6 transition-all relative ${
                      isPaused
                        ? "opacity-60 bg-muted/40 border-muted-foreground/20 cursor-not-allowed select-none"
                        : isSelected
                        ? postingType === "featured"
                          ? "cursor-pointer border-2 border-yellow-500 bg-yellow-50/20 dark:bg-yellow-950/20 shadow-md ring-2 ring-yellow-400 hover:shadow-lg"
                          : "cursor-pointer border-2 border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 shadow-md ring-2 ring-purple-400 hover:shadow-lg"
                        : "cursor-pointer border-2 border-border hover:border-muted-foreground/50 hover:shadow-lg"
                    }`}
                    onClick={() => {
                      if (!isPaused) {
                        setSelectedPlan(plan);
                      }
                    }}
                  >
                    {isPaused ? (
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-950/50 font-semibold px-2 py-0.5 text-xs shadow-sm">
                          Paused
                        </Badge>
                      </div>
                    ) : isSelected ? (
                      <div className={`absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center text-white ${postingType === "featured" ? "bg-yellow-500" : "bg-purple-600"}`}>
                        <Check className="h-4 w-4" />
                      </div>
                    ) : null}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={!isPaused && isSelected ? "default" : "outline"} className="mb-2">
                          Plan {plan.plan_tier}
                        </Badge>
                        {isPaused && (
                          <span className="text-xs font-semibold text-muted-foreground mb-2">(Paused)</span>
                        )}
                      </div>
                      <h3 className={`text-xl font-bold ${isPaused ? "text-muted-foreground" : ""}`}>{plan.name}</h3>
                      <div>
                        {plan.display_price !== null && plan.display_price !== undefined && String(plan.display_price).trim() !== "" && !isNaN(Number(plan.display_price)) ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-foreground">
                              ₹{plan.display_price}
                            </span>
                            <span className="text-lg font-semibold text-red-500 line-through">
                              ₹{plan.price}
                            </span>
                          </div>
                        ) : (
                          <div className="text-3xl font-extrabold text-foreground">
                            ₹{plan.price}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Duration: <span className="font-semibold text-foreground">{plan.duration_days} Days</span>
                        </p>
                      </div>
                      <ul className="text-sm space-y-2 text-muted-foreground pt-4 border-t">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>Valid for {plan.duration_days} days</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{postingType === "featured" ? "Featured badge & homepage top section" : "High-impact popup modal exposure"}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>Direct buyer contact enabled</span>
                        </li>
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-6 border-t mt-8">
              <Button variant="outline" onClick={() => setCurrentStep("form")} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Ad Form
              </Button>
              <Button
                onClick={() => {
                  if (!selectedPlan || selectedPlan.is_active === false) {
                    toast.error("Please select an active plan to continue");
                    return;
                  }
                  setCurrentStep("schedule");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={!selectedPlan || selectedPlan.is_active === false}
                size="lg"
                className={postingType === "featured" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}
              >
                Continue to Pick Schedule & Slot
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Pick Slot and Date */}
        {currentStep === "schedule" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold">
                {postingType === "popup" ? "Pick Date & Slot (1-3)" : "Pick Featured Start Date"}
              </h2>
              <p className="text-muted-foreground">
                {postingType === "popup"
                  ? "Popup ads run in 3 daily slots (maximum 3 ads per day). Select date and an available slot."
                  : `Select when your ${selectedPlan?.name || "Featured"} promotion should begin.`}
              </p>
            </div>

            <Card className="p-6 space-y-6 shadow-sm">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="scheduleDatePicker" className="text-base font-semibold">
                  {postingType === "popup" ? "Scheduled Popup Date *" : "Promotion Start Date *"}
                </Label>
                <Input
                  id="scheduleDatePicker"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (postingType === "popup") {
                      checkAvailableSlots(e.target.value);
                    }
                  }}
                  className="text-base py-5"
                />
              </div>

              {/* Popup Ads: Slot 1-3, max 3 per day, hide or disable booked slots */}
              {postingType === "popup" && (
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-base font-semibold">Choose Available Slot (Max 3 ads/day) *</Label>
                  {!selectedDate ? (
                    <p className="text-sm text-muted-foreground italic">
                      Please select a date above first to view slot availability.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                              isBooked
                                ? "opacity-40 cursor-not-allowed bg-muted border-border"
                                : isSelected
                                ? "border-2 border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-100 shadow-sm ring-2 ring-purple-400"
                                : "border-border hover:border-purple-300 hover:bg-muted/40 cursor-pointer"
                            }`}
                          >
                            <span className="font-bold text-lg">Slot {slot}</span>
                            {isBooked ? (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                Booked
                              </Badge>
                            ) : isSelected ? (
                              <Badge className="bg-purple-600 text-[10px] px-1.5 py-0">
                                Selected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600 border-green-500 text-[10px] px-1.5 py-0">
                                Available
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedDate && bookedSlots.length >= 3 && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive font-medium">
                      All 3 slots are fully booked for {selectedDate}. Please select another date.
                    </div>
                  )}
                </div>
              )}

              {/* Featured Ad info */}
              {postingType === "featured" && selectedDate && selectedPlan && (
                <div className="bg-yellow-50 dark:bg-yellow-950/40 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900 text-sm space-y-1">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                    Plan Selected: {selectedPlan.name} ({selectedPlan.duration_days} Days)
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Listing will be featured starting on <strong>{new Date(selectedDate).toLocaleDateString()}</strong>.
                  </p>
                </div>
              )}
            </Card>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button variant="outline" onClick={() => setCurrentStep("plan")} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
              </Button>
              <Button
                onClick={() => {
                  if (!selectedDate) {
                    toast.error("Please choose a date");
                    return;
                  }
                  if (postingType === "popup" && selectedSlot === null) {
                    toast.error("Please pick an available slot");
                    return;
                  }
                  setCurrentStep("confirm");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={!selectedDate || (postingType === "popup" && selectedSlot === null)}
                size="lg"
                className={postingType === "featured" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}
              >
                Proceed to Confirm
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirm & Submit */}
        {currentStep === "confirm" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Review & Confirm Your Ad</h2>
              <p className="text-muted-foreground">
                Verify all details before submitting. Once confirmed, your ad will be sent to the admin portal.
              </p>
            </div>

            <Card className="p-6 space-y-5 shadow-sm border">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <span className="text-xs uppercase font-semibold text-muted-foreground">Promotional Ad</span>
                  <h3 className="text-xl font-bold flex items-center gap-2 mt-0.5">
                    {postingType === "featured" ? (
                      <>
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        Featured Listing
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 text-purple-500 fill-purple-500" />
                        Popup Ad
                      </>
                    )}
                  </h3>
                </div>
                <Badge className={postingType === "featured" ? "bg-yellow-500" : "bg-purple-600"}>
                  {selectedPlan?.name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Listing Title:</span>
                  <p className="font-semibold text-base mt-0.5">{formData.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Property Price:</span>
                  <p className="font-semibold text-base mt-0.5">₹{parseFloat(formData.price).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Chosen Plan:</span>
                  <p className="font-medium mt-0.5">{selectedPlan?.name} ({selectedPlan?.duration_days} Days)</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Plan Fee:</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <p className="font-bold text-lg text-primary">
                      ₹{selectedPlan?.display_price !== null && selectedPlan?.display_price !== undefined && String(selectedPlan?.display_price).trim() !== "" && !isNaN(Number(selectedPlan?.display_price))
                        ? selectedPlan.display_price
                        : selectedPlan?.price}
                    </p>
                    {selectedPlan?.display_price !== null && selectedPlan?.display_price !== undefined && String(selectedPlan?.display_price).trim() !== "" && !isNaN(Number(selectedPlan?.display_price)) && (
                      <span className="text-xs font-semibold text-red-500 line-through">
                        ₹{selectedPlan.price}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">{postingType === "popup" ? "Popup Date:" : "Start Date:"}</span>
                  <p className="font-medium mt-0.5">{selectedDate ? new Date(selectedDate).toLocaleDateString() : "—"}</p>
                </div>
                {postingType === "popup" && (
                  <div>
                    <span className="text-muted-foreground text-xs uppercase">Selected Slot:</span>
                    <p className="font-bold text-purple-600 mt-0.5">Slot {selectedSlot}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Location:</span>
                  <p className="font-medium mt-0.5">{formData.district}, {formData.state}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Contact:</span>
                  <p className="font-medium mt-0.5">{formData.sellerPhone}</p>
                </div>
                {existingCustomerId && (
                  <div>
                    <span className="text-muted-foreground text-xs uppercase">Customer ID:</span>
                    <p className="font-mono font-bold text-primary text-sm mt-0.5">{existingCustomerId}</p>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Submission Note:</p>
                <p>• Clicking <strong>Confirm & Submit</strong> will save this ad with your chosen plan, price, date, and slot.</p>
                <p>• The ad will be immediately submitted to the admin portal for approval.</p>
              </div>
            </Card>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button variant="outline" onClick={() => setCurrentStep("schedule")} disabled={isSubmitting} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                size="lg"
                className={`font-bold px-8 ${
                  postingType === "featured"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting Ad...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation & Reference IDs Dialog */}
      <Dialog open={!!submittedResult} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto my-2 w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <DialogTitle className="text-2xl font-bold">Listing Confirmed!</DialogTitle>
            <DialogDescription>
              Your listing has been submitted successfully. Please save your reference IDs below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-sm text-muted-foreground font-medium">Listing ID:</span>
                <Badge variant="outline" className="font-mono text-sm font-bold bg-background text-primary border-primary/40 px-2.5 py-0.5">
                  {submittedResult?.listingId}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">Customer ID:</span>
                <Badge variant="outline" className="font-mono text-sm font-bold bg-background text-purple-700 dark:text-purple-300 border-purple-400 px-2.5 py-0.5">
                  {submittedResult?.customerId}
                </Badge>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-xs text-amber-800 dark:text-amber-200">
              💡 <strong>Important:</strong> Quote your <strong>Customer ID</strong> and <strong>Listing ID</strong> whenever you contact support or need to report an error. You can also view them anytime in <strong>My Account</strong>.
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex-1"
              onClick={() => {
                const id = submittedResult?.internalId;
                setSubmittedResult(null);
                navigate(`/listing/${id}`);
              }}
            >
              View Listing
            </Button>
            <Button
              className="w-full sm:w-auto flex-1"
              onClick={() => {
                setSubmittedResult(null);
                navigate("/my-listings");
              }}
            >
              Go to My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default PostAd;
