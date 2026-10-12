import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Plus, Trash2, Star, Sparkles, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface AdPlan {
  id?: string;
  ad_type: "featured" | "popup";
  plan_tier: number;
  name: string;
  duration_days: number;
  price: number;
  display_price?: string | null;
}

interface PricingPlan {
  id: string;
  plan_type: string;
  duration: number;
  price: number;
  display_order: number;
  display_price: string | null;
}

const AdminPricingManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    plan_type: "",
    duration: 30,
    price: 0,
    display_order: 0,
    display_price: "",
  });

  // Dedicated 3 plans for Featured and Popup ads
  const [featuredPlans, setFeaturedPlans] = useState<AdPlan[]>([
    { ad_type: "featured", plan_tier: 1, name: "Plan 1", duration_days: 7, price: 199 },
    { ad_type: "featured", plan_tier: 2, name: "Plan 2", duration_days: 15, price: 349 },
    { ad_type: "featured", plan_tier: 3, name: "Plan 3", duration_days: 30, price: 499 },
  ]);
  const [popupPlans, setPopupPlans] = useState<AdPlan[]>([
    { ad_type: "popup", plan_tier: 1, name: "Plan 1", duration_days: 1, price: 199 },
    { ad_type: "popup", plan_tier: 2, name: "Plan 2", duration_days: 3, price: 499 },
    { ad_type: "popup", plan_tier: 3, name: "Plan 3", duration_days: 7, price: 999 },
  ]);
  const [savingPlanKey, setSavingPlanKey] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchPlans();
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
          return {
            id: row?.id,
            ad_type: "featured",
            plan_tier: tier,
            name: `Plan ${tier}`,
            duration_days: row ? Number(row.duration) : (tier === 1 ? 30 : tier === 2 ? 60 : 90),
            price: row ? Number(row.price) : (tier === 1 ? 199 : tier === 2 ? 349 : 500),
            display_price: row?.display_price || ""
          };
        }));

        const popupRows = data
          .filter(p => p.plan_type.startsWith("popup_"))
          .sort((a, b) => a.display_order - b.display_order);

        setPopupPlans([1, 2, 3].map(tier => {
          const row = popupRows[tier - 1];
          return {
            id: row?.id,
            ad_type: "popup",
            plan_tier: tier,
            name: `Plan ${tier}`,
            duration_days: row ? Number(row.duration) : (tier === 1 ? 30 : tier === 2 ? 60 : 90),
            price: row ? Number(row.price) : (tier === 1 ? 999 : tier === 2 ? 1499 : 1999),
            display_price: row?.display_price || ""
          };
        }));
      }
    } catch (err) {
      console.error("Error fetching ad plans from pricing_plans:", err);
    }
  };

  const handleSaveAdPlan = async (plan: AdPlan) => {
    const key = `${plan.ad_type}-${plan.plan_tier}`;
    setSavingPlanKey(key);
    try {
      const planType = `${plan.ad_type}_${plan.duration_days}`;
      const displayOrder = plan.ad_type === "featured" ? plan.plan_tier : plan.plan_tier + 3;
      const displayPriceValue = plan.display_price && String(plan.display_price).trim() !== "" ? String(plan.display_price).trim() : null;

      if (plan.id) {
        const { error } = await supabase
          .from("pricing_plans")
          .update({
            duration: Number(plan.duration_days),
            price: Number(plan.price),
            display_price: displayPriceValue,
            updated_at: new Date().toISOString()
          })
          .eq("id", plan.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("pricing_plans")
          .upsert({
            plan_type: planType,
            duration: Number(plan.duration_days),
            price: Number(plan.price),
            display_price: displayPriceValue,
            display_order: displayOrder,
            updated_at: new Date().toISOString()
          }, { onConflict: "plan_type" });

        if (error) throw error;
      }

      toast.success(`${plan.name} (${plan.ad_type.toUpperCase()}) saved successfully!`);
      fetchAdPlans();
      fetchPlans();
    } catch (error: any) {
      console.error("Error saving ad plan to pricing_plans:", error);
      toast.error(error.message || "Failed to save plan to pricing_plans");
    } finally {
      setSavingPlanKey(null);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to fetch pricing plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (plan: PricingPlan) => {
    try {
      const { error } = await supabase
        .from("pricing_plans")
        .update({
          duration: plan.duration,
          price: plan.price,
          display_price: plan.display_price,
        })
        .eq("id", plan.id);

      if (error) throw error;

      toast.success("Pricing plan updated successfully");
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update pricing plan");
    }
  };

  const handleAdd = async () => {
    if (!newPlan.plan_type || newPlan.duration <= 0 || newPlan.price < 0) {
      toast.error("Please fill all fields with valid values");
      return;
    }

    try {
      const { error } = await supabase
        .from("pricing_plans")
        .insert({
          plan_type: newPlan.plan_type,
          duration: newPlan.duration,
          price: newPlan.price,
          display_order: newPlan.display_order,
          display_price: newPlan.display_price || null,
        });

      if (error) throw error;

      toast.success("New pricing plan added successfully");
      setShowAddDialog(false);
      setNewPlan({ plan_type: "", duration: 30, price: 0, display_order: 0, display_price: "" });
      fetchPlans();
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error("Failed to add pricing plan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing plan?")) return;

    try {
      const { error } = await supabase
        .from("pricing_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Pricing plan deleted successfully");
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete pricing plan");
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
              Manage pricing plans for featured listings and popup ads
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Plan
          </Button>
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
                  <TableHead className="w-24">Tier</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead className="w-36">Duration (Days)</TableHead>
                  <TableHead className="w-32">Price (₹)</TableHead>
                  <TableHead className="w-36">Display Price (₹)</TableHead>
                  <TableHead className="text-right w-28">Action</TableHead>
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
                        value={plan.display_price || ""}
                        onChange={(e) => {
                          const updated = [...featuredPlans];
                          updated[idx] = { ...updated[idx], display_price: e.target.value };
                          setFeaturedPlans(updated);
                        }}
                        placeholder="e.g. 50"
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
                  <TableHead className="w-24">Tier</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead className="w-36">Duration (Days)</TableHead>
                  <TableHead className="w-32">Price (₹)</TableHead>
                  <TableHead className="w-36">Display Price (₹)</TableHead>
                  <TableHead className="text-right w-28">Action</TableHead>
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
                        value={plan.display_price || ""}
                        onChange={(e) => {
                          const updated = [...popupPlans];
                          updated[idx] = { ...updated[idx], display_price: e.target.value };
                          setPopupPlans(updated);
                        }}
                        placeholder="e.g. 50"
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

        <Card>
          <CardHeader>
            <CardTitle>Pricing Plans</CardTitle>
            <CardDescription>
              Update prices and durations for all plans. Changes apply immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Type</TableHead>
                  <TableHead>Duration (days)</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Display Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      {plan.plan_type.replace(/_/g, " ").toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {editingPlan?.id === plan.id ? (
                        <Input
                          type="number"
                          value={editingPlan.duration}
                          onChange={(e) =>
                            setEditingPlan({ ...editingPlan, duration: parseInt(e.target.value) })
                          }
                          className="w-24"
                        />
                      ) : (
                        plan.duration
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPlan?.id === plan.id ? (
                        <Input
                          type="number"
                          value={editingPlan.price}
                          onChange={(e) =>
                            setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })
                          }
                          className="w-24"
                        />
                      ) : (
                        `₹${plan.price}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPlan?.id === plan.id ? (
                        <Input
                          type="text"
                          value={editingPlan.display_price || ""}
                          onChange={(e) =>
                            setEditingPlan({ ...editingPlan, display_price: e.target.value })
                          }
                          placeholder="e.g. ₹499 → ₹0"
                          className="w-40"
                        />
                      ) : (
                        plan.display_price || `₹${plan.price}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingPlan?.id === plan.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleSave(editingPlan)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPlan(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPlan(plan)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(plan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add New Plan Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Pricing Plan</DialogTitle>
            <DialogDescription>
              Create a new pricing plan for featured listings or popup ads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plan_type">Plan Type</Label>
              <Input
                id="plan_type"
                value={newPlan.plan_type}
                onChange={(e) => setNewPlan({ ...newPlan, plan_type: e.target.value })}
                placeholder="e.g., featured_120 or popup_120"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={newPlan.duration}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration: parseInt(e.target.value) })
                }
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={newPlan.price}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })
                }
                placeholder="199"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_price">Display Price (text)</Label>
              <Input
                id="display_price"
                type="text"
                value={newPlan.display_price}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, display_price: e.target.value })
                }
                placeholder="e.g., Free or ₹499 → ₹0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={newPlan.display_order}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, display_order: parseInt(e.target.value) })
                }
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPricingManagement;