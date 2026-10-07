import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  file_url: string;
  created_at: string;
  profiles: { name: string; email: string } | null;
  listings: { title: string } | null;
}

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  const checkAdminAccess = async () => {
    try {
      const { data: hasAdminRole } = await supabase.rpc("has_role", {
        _user_id: user?.id,
        _role: "admin",
      });

      if (!hasAdminRole) {
        navigate("/");
        return;
      }
      
      fetchInvoices();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const fetchInvoices = async () => {
    try {
      // Fetch invoices without joins to avoid FK naming issues
      const { data, error } = await supabase
        .from("invoices")
        .select("id, invoice_number, amount, file_url, created_at, user_id, listing_id")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const invoiceRows = data || [];

      // Fetch related profiles and listings separately
      const userIds = [...new Set(invoiceRows.map(i => i.user_id).filter(Boolean))];
      const listingIds = [...new Set(invoiceRows.map(i => i.listing_id).filter(Boolean))];

      let profilesMap: Record<string, { name: string; email: string }> = {};
      let listingsMap: Record<string, { title: string }> = {};

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name, email")
          .in("user_id", userIds);
        if (profiles) {
          profiles.forEach(p => { profilesMap[p.user_id] = { name: p.name, email: p.email }; });
        }
      }

      if (listingIds.length > 0) {
        const { data: listings } = await supabase
          .from("listings")
          .select("id, title")
          .in("id", listingIds);
        if (listings) {
          listings.forEach(l => { listingsMap[l.id] = { title: l.title }; });
        }
      }

      const enriched = invoiceRows.map(inv => ({
        ...inv,
        profiles: profilesMap[inv.user_id] || null,
        listings: inv.listing_id ? listingsMap[inv.listing_id] || null : null,
      }));

      setInvoices(enriched as any);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            View and download all generated invoices
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>A complete record of all customer invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <p className="text-muted-foreground">Loading invoices...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No invoices found
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{invoice.invoice_number}</h3>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium dark:bg-green-900/30 dark:text-green-400">
                            ₹{invoice.amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {invoice.profiles?.name || 'Unknown User'} ({invoice.profiles?.email || 'N/A'})
                        </p>
                        {invoice.listings?.title && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Listing: {invoice.listings.title}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Generated on: {new Date(invoice.created_at).toLocaleDateString()} at {new Date(invoice.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(invoice.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
