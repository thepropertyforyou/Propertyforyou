import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

const AdminBanners = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [currentBanner, setCurrentBanner] = useState({
    id: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
  });

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchBanners();
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

      if (error || !hasAdminRole) {
        toast({ title: "Access Denied", description: "You are not authorized to access this page.", variant: "destructive" });
        navigate("/");
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      navigate("/");
    }
  };

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch banners", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!currentBanner.imageUrl) {
      toast({ title: "Error", description: "Please upload an image", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      if (currentBanner.id) {
        // Update
        const { error } = await supabase
          .from("banners")
          .update({
            image_url: currentBanner.imageUrl,
            link_url: currentBanner.linkUrl,
            is_active: currentBanner.isActive
          })
          .eq("id", currentBanner.id);
        if (error) throw error;
        toast({ title: "Success", description: "Banner updated successfully" });
        setIsEditDialogOpen(false);
      } else {
        // Create
        const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.display_order)) : 0;
        const { error } = await supabase
          .from("banners")
          .insert({
            image_url: currentBanner.imageUrl,
            link_url: currentBanner.linkUrl,
            is_active: currentBanner.isActive,
            display_order: maxOrder + 1
          });
        if (error) throw error;
        toast({ title: "Success", description: "Banner created successfully" });
        setIsCreateDialogOpen(false);
      }
      fetchBanners();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Operation failed", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    setIsDeleting(id);
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Banner deleted successfully" });
      fetchBanners();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === id);
    if (currentIndex < 0) return;
    
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === banners.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const current = banners[currentIndex];
    const target = banners[swapIndex];

    try {
      const { error: err1 } = await supabase.from('banners').update({ display_order: target.display_order }).eq('id', current.id);
      const { error: err2 } = await supabase.from('banners').update({ display_order: current.display_order }).eq('id', target.id);
      
      if (err1 || err2) throw new Error("Failed to reorder");
      fetchBanners();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openCreateDialog = () => {
    setCurrentBanner({ id: "", imageUrl: "", linkUrl: "", isActive: true });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setCurrentBanner({ 
      id: banner.id, 
      imageUrl: banner.image_url, 
      linkUrl: banner.link_url || "", 
      isActive: banner.is_active 
    });
    setIsEditDialogOpen(true);
  };

  if (authLoading || !isAdmin || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const DialogForm = ({ isEdit }: { isEdit: boolean }) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Banner Image *</Label>
        {currentBanner.imageUrl && (
          <div className="relative h-32 w-full rounded-md overflow-hidden mb-2">
            <img src={currentBanner.imageUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <ImageUpload 
          bucket="banners"
          onUploadComplete={(url) => setCurrentBanner({...currentBanner, imageUrl: url})}
          label={currentBanner.imageUrl ? "Change Image" : "Upload Banner Image"}
        />
      </div>
      <div className="space-y-2">
        <Label>Link URL (Optional)</Label>
        <Input 
          type="url" 
          placeholder="https://example.com"
          value={currentBanner.linkUrl} 
          onChange={(e) => setCurrentBanner({...currentBanner, linkUrl: e.target.value})} 
        />
      </div>
      <div className="flex items-center justify-between border rounded-lg p-3">
        <Label>Active Status</Label>
        <Switch 
          checked={currentBanner.isActive} 
          onCheckedChange={(c) => setCurrentBanner({...currentBanner, isActive: c})} 
        />
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Banners Management</h1>
            <p className="text-muted-foreground mt-1">
              Add and arrange auto-sliding banners for the homepage
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
              </DialogHeader>
              <DialogForm isEdit={false} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateOrUpdate} disabled={isCreating}>
                  {isCreating && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                  Create Banner
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {banners.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No banners found. Add one to display on the homepage.
              </CardContent>
            </Card>
          ) : (
            banners.map((banner, index) => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="w-full sm:w-48 h-32 bg-muted relative shrink-0">
                    <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 w-full">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={banner.is_active ? "default" : "secondary"}>
                            {banner.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Order: {banner.display_order}</span>
                        </div>
                        {banner.link_url && (
                          <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline line-clamp-1">
                            {banner.link_url}
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col mr-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            disabled={index === 0}
                            onClick={() => handleReorder(banner.id, 'up')}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            disabled={index === banners.length - 1}
                            onClick={() => handleReorder(banner.id, 'down')}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(banner.id)}
                          disabled={isDeleting === banner.id}
                        >
                          {isDeleting === banner.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          <DialogForm isEdit={true} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOrUpdate} disabled={isCreating}>
              {isCreating && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBanners;
