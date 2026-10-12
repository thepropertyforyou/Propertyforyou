import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Star, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AdPlan {
  id?: string;
  ad_type: "featured" | "popup";
  plan_tier: number;
  name: string;
  duration_days: number;
  price: number;
  display_price?: string | null;
}

const AdminPricingManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Dedicated 3 plans for Featured and Popup ads
  const [featuredPlans, setFeaturedPlans] = useState<AdPlan[]>([
    { ad_type: "featured", plan_tier: 1, name: "Plan 1", duration_days: 30, price: 0, display_price: "" },
    { ad_type: "featured", plan_tier: 2, name: "Plan 2", duration_days: 60, price: 350, display_price: "" },
    { ad_type: "featured", plan_tier: 3, name: "Plan 3", duration_days: 90, price: 500, display_price: "" },
  ]);
  const [popupPlans, setPopupPlans] = useState<AdPlan[]>([
    { ad_type: "popup", plan_tier: 1, name: "Plan 1", duration_days: 30, price: 999, display_price: "" },
    { ad_type: "popup", plan_tier: 2, name: "Plan 2", duration_days: 60, price: 1499, display_price: "" },
    { ad_type: "popup", plan_tier: 3, name: "Plan 3", duration_days: 90, price: 1999, display_price: "" },
  ]);
  const [savingPlanKey, setSavingPlanKey] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdPlans();
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

  const fetchAdPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.warn("pricing_plans table query error:", error);
        return;
      }

      if (data && data.length > 0) {
        const featuredRows = data
          .filter(p => p.plan_type.startsWith("featured_"))
          .sort((a, b) => a.display_order - b.display_order);

        setFeaturedPlans([1, 2, 3].map(tier => {
          const row = featuredRows[tier - 1];
          const hasNumericDisplay = row?.display_price !== null && row?.display_price !== undefined && !isNaN(Number(row.display_price));
          return {
            id: row?.id,
            ad_type: "featured",
            plan_tier: tier,
            name: row?.plan_name || (row?.display_price && isNaN(Number(row.display_price)) && !row.display_price.startsWith("₹") ? row.display_price : `Plan ${tier}`),
            duration_days: row ? Number(row.duration) : (tier === 1 ? 30 : tier === 2 ? 60 : 90),
            price: row ? Number(row.price) : (tier === 1 ? 0 : tier === 2 ? 350 : 500),
            display_price: hasNumericDisplay ? String(row.display_price) : ""
          };
        }));

        const popupRows = data
          .filter(p => p.plan_type.startsWith("popup_"))
          .sort((a, b) => a.display_order - b.display_order);

        setPopupPlans([1, 2, 3].map(tier => {
          const row = popupRows[tier - 1];
          const hasNumericDisplay = row?.display_price !== null && row?.display_price !== undefined && !isNaN(Number(row.display_price));
          return {
            id: row?.id,
            ad_type: "popup",
            plan_tier: tier,
            name: row?.plan_name || (row?.display_price && isNaN(Number(row.display_price)) && !row.display_price.startsWith("₹") ? row.display_price : `Plan ${tier}`),
            duration_days: row ? Number(row.duration) : (tier === 1 ? 30 : tier === 2 ? 60 : 90),
            price: row ? Number(row.price) : (tier === 1 ? 999 : tier === 2 ? 1499 : 1999),
            display_price: hasNumericDisplay ? String(row.display_price) : ""
          };
        }));
      }
    } catch (err) {
      console.error("Error fetching ad plans from pricing_plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdPlan = async (plan: AdPlan) => {
    const key = `${plan.ad_type}-${plan.plan_tier}`;
    setSavingPlanKey(key);
    try {
      const planType = `${plan.ad_type}_${plan.duration_days}`;
      const displayOrder = plan.ad_type === "featured" ? plan.plan_tier : plan.plan_tier + 3;
      const displayPriceValue = plan.display_price !== undefined && plan.display_price !== null && String(plan.display_price).trim() !== ""
        ? String(plan.display_price).trim()
        : null;

      const payload: any = {
        duration: Number(plan.duration_days),
        price: Number(plan.price),
        display_price: displayPriceValue,
        plan_name: plan.name,
        updated_at: new Date().toISOString()
      };

      if (plan.id) {
        let { error } = await supabase
          .from("pricing_plans")
          .update(payload)
          .eq("id", plan.id);

        if (error && error.message?.includes("plan_name")) {
          delete payload.plan_name;
          const retry = await supabase.from("pricing_plans").update(payload).eq("id", plan.id);
          error = retry.error;
        }

        if (error) throw error;
      } else {
        const upsertPayload: any = {
          plan_type: planType,
          ...payload,
          display_order: displayOrder,
        };

        let { error } = await supabase
          .from("pricing_plans")
          .upsert(upsertPayload, { onConflict: "plan_type" });

        if (error && error.message?.includes("plan_name")) {
          delete upsertPayload.plan_name;
          const retry = await supabase.from("pricing_plans").upsert(upsertPayload, { onConflict: "plan_type" });
          error = retry.error;
        }

        if (error) throw error;
      }

      toast.success(`${plan.name} (${plan.ad_type.toUpperCase()}) saved successfully!`);
      fetchAdPlans();
    } catch (error: any) {
      console.error("Error saving ad plan to pricing_plans:", error);
      toast.error(error.message || "Failed to save plan to pricing_plans");
    } finally {
      setSavingPlanKey(null);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pricing Management</h1>
            <p className="text-muted-foreground mt-1">
              Configure pricing plans and promotional display prices for featured listings and popup ads
            </p>
          </div>
        </div>

        {/* Featured Ad Plans (Plan 1, Plan 2, Plan 3) */}
        <Card className="border-yellow-200 dark:border-yellow-900 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  Featured Ad Plans
                </CardTitle>
                <CardDescription>
                  Configure the 3 plans (Plan 1, Plan 2, Plan 3) shown on the /post-ad page for Featured listings.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">3 Plans</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Tier</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead className="w-32">Duration (Days)</TableHead>
                  <TableHead className="w-32">Price (₹)</TableHead>
                  <TableHead className="w-36">Display Price (₹)</TableHead>
                  <TableHead className="text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featuredPlans.map((plan, idx) => (
                  <TableRow key={`featured-${plan.plan_tier}`}>
                    <TableCell className="font-semibold text-muted-foreground">
                      Tier {plan.plan_tier}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={plan.name}
                        onChange={(e) => {
                          const updated = [...featuredPlans];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setFeaturedPlans(updated);
                        }}
                        placeholder={`Plan ${plan.plan_tier}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={plan.duration_days}
                        onChange={(e) => {
                          const updated = [...featuredPlans];
                          updated[idx] = { ...updated[idx], duration_days: parseInt(e.target.value) || 1 };
                          setFeaturedPlans(updated);
                        }}
                        placeholder="Days"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...featuredPlans];
                          updated[idx] = { ...updated[idx], price: parseFloat(e.target.value) || 0 };
                          setFeaturedPlans(updated);
                        }}
                        placeholder="Price"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={plan.display_price ?? ""}
                        onChange={(e) => {
                          const updated = [...featuredPlans];
                          updated[idx] = { ...updated[idx], display_price: e.target.value };
                          setFeaturedPlans(updated);
                        }}
                        placeholder="Optional"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSaveAdPlan(plan)}
                        disabled={savingPlanKey === `featured-${plan.plan_tier}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        {savingPlanKey === `featured-${plan.plan_tier}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" /> Save
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Popup Ad Plans (Plan 1, Plan 2, Plan 3) */}
        <Card className="border-purple-200 dark:border-purple-900 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-purple-500 fill-purple-500" />
                  Popup Ad Plans
                </CardTitle>
                <CardDescription>
                  Configure the 3 plans (Plan 1, Plan 2, Plan 3) shown on the /post-ad page for Popup ads.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-purple-500 text-purple-600">3 Plans</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Tier</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead className="w-32">Duration (Days)</TableHead>
                  <TableHead className="w-32">Price (₹)</TableHead>
                  <TableHead className="w-36">Display Price (₹)</TableHead>
                  <TableHead className="text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popupPlans.map((plan, idx) => (
                  <TableRow key={`popup-${plan.plan_tier}`}>
                    <TableCell className="font-semibold text-muted-foreground">
                      Tier {plan.plan_tier}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={plan.name}
                        onChange={(e) => {
                          const updated = [...popupPlans];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setPopupPlans(updated);
                        }}
                        placeholder={`Plan ${plan.plan_tier}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={plan.duration_days}
                        onChange={(e) => {
                          const updated = [...popupPlans];
                          updated[idx] = { ...updated[idx], duration_days: parseInt(e.target.value) || 1 };
                          setPopupPlans(updated);
                        }}
                        placeholder="Days"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...popupPlans];
                          updated[idx] = { ...updated[idx], price: parseFloat(e.target.value) || 0 };
                          setPopupPlans(updated);
                        }}
                        placeholder="Price"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={plan.display_price ?? ""}
                        onChange={(e) => {
                          const updated = [...popupPlans];
                          updated[idx] = { ...updated[idx], display_price: e.target.value };
                          setPopupPlans(updated);
                        }}
                        placeholder="Optional"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSaveAdPlan(plan)}
                        disabled={savingPlanKey === `popup-${plan.plan_tier}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {savingPlanKey === `popup-${plan.plan_tier}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" /> Save
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPricingManagement;