import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";

interface PopupSchedule {
  id: string;
  schedule_date: string;
  slot_number: number;
  payment_status: string;
  payment_amount: number;
  payment_proof: string | null;
  admin_approved: boolean;
  selected_dates: string[] | null;
  listings: {
    id: string;
    title: string;
    price: number;
    description: string;
    location_city: string;
    listing_id?: string;
    customer_id?: string;
    profiles: { name: string; email: string; phone: string };
    listing_images: { image_url: string; display_order: number }[];
  };
}

const AdminPopupAdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [schedule, setSchedule] = useState<PopupSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin && id) {
      fetchScheduleDetail();
    }
  }, [isAdmin, id]);

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
        toast.error("Access Denied");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const fetchScheduleDetail = async () => {
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
          selected_dates,
          image_url,
          link_url,
          title,
          listings (
            id,
            title,
            price,
            description,
            location_city,
            listing_id,
            customer_id,
            profiles (name, email, phone),
            listing_images (image_url, display_order)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setSchedule(data);
      
      // Convert string dates to Date objects
      if (data.selected_dates) {
        setSelectedDates(data.selected_dates.map((d: string) => new Date(d)));
      }
    } catch (error) {
      console.error("Error fetching schedule detail:", error);
      toast.error("Failed to fetch popup ad details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDates = async () => {
    if (!schedule) return;

    try {
      const { error } = await supabase
        .from("popup_ad_schedules")
        .update({
          selected_dates: selectedDates.map(d => d.toISOString().split('T')[0])
        })
        .eq("id", schedule.id);

      if (error) throw error;

      toast.success("Selected dates updated successfully");
      fetchScheduleDetail();
    } catch (error) {
      console.error("Error updating dates:", error);
      toast.error("Failed to update dates");
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

  if (!schedule) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Popup ad not found</p>
        </div>
      </AdminLayout>
    );
  }

  const isCustom = !schedule.listings;
  const mainImage = schedule.listings?.listing_images
    ?.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url || schedule.image_url;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/popup-ads")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Popup Ads
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Listing / Custom Ad Details */}
          <Card>
            <CardHeader>
              <CardTitle>{isCustom ? "Custom Ad Details" : "Listing Details"}</CardTitle>
              <CardDescription>{isCustom ? "Custom popup advertisement details" : "Popup ad listing information"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mainImage && (
                <img
                  src={mainImage}
                  alt={isCustom ? "Custom Ad" : schedule.listings?.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              {isCustom ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 font-medium">
                      Custom Ad
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold">{schedule.title || "Custom Popup Ad"}</h3>
                  {schedule.link_url ? (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Target Link URL</h4>
                      <a
                        href={schedule.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm hover:underline break-all"
                      >
                        {schedule.link_url}
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No link URL specified</p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                    </div>
                    <h3 className="text-xl font-semibold">{schedule.listings?.title}</h3>
                    <p className="text-2xl font-bold text-primary mt-2">
                      ₹{schedule.listings?.price?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {schedule.listings?.location_city}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {schedule.listings?.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Seller Information</h4>
                    <p className="text-sm">
                      <strong>Name:</strong> {schedule.listings?.profiles?.name}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {schedule.listings?.profiles?.email}
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> {schedule.listings?.profiles?.phone}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Popup Schedule Details */}
          <Card>
            <CardHeader>
              <CardTitle>Popup Schedule Details</CardTitle>
              <CardDescription>Payment and scheduling information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Schedule Date</p>
                  <p className="font-semibold">
                    {new Date(schedule.schedule_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Slot Number</p>
                  <p className="font-semibold">Slot {schedule.slot_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Amount</p>
                  <p className="font-semibold">₹{schedule.payment_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
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
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admin Approved</p>
                  <Badge variant={schedule.admin_approved ? "default" : "secondary"}>
                    {schedule.admin_approved ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {schedule.payment_proof && (
                <div>
                  <h4 className="font-semibold mb-2">Payment Proof</h4>
                  <a
                    href={schedule.payment_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Payment Screenshot
                  </a>
                </div>
              )}

              {/* Selected Dates Calendar */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Selected Dates ({selectedDates.length})
                </h4>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  className="rounded-md border"
                />
                <Button
                  onClick={handleUpdateDates}
                  className="w-full mt-4"
                  disabled={selectedDates.length === 0}
                >
                  Update Selected Dates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPopupAdDetail;