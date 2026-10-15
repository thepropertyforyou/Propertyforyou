import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  name: string;
  contact_number: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
  customer_id?: string;
  listing_id?: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/admin");
      return;
    }

    const { data: hasAdminRole } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!hasAdminRole) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Lookup customer_id by email or phone from profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("email, phone, customer_id")
      .not("customer_id", "is", null);

    const emailToCus: Record<string, string> = {};
    const phoneToCus: Record<string, string> = {};

    if (profiles) {
      profiles.forEach((p) => {
        if (p.customer_id) {
          if (p.email) emailToCus[p.email.toLowerCase().trim()] = p.customer_id;
          if (p.phone) {
            const clean = p.phone.replace(/[^0-9]/g, "");
            if (clean) phoneToCus[clean] = p.customer_id;
          }
        }
      });
    }

    const enriched = (data || []).map((msg: any) => {
      const cleanPhone = (msg.contact_number || "").replace(/[^0-9]/g, "");
      const cleanEmail = (msg.email || "").toLowerCase().trim();
      const cusMatch = msg.message?.match(/CUS-\d+/i);
      const lstMatch = msg.message?.match(/LST-\d+/i);

      return {
        ...msg,
        customer_id: msg.customer_id || (cusMatch ? cusMatch[0].toUpperCase() : undefined) || emailToCus[cleanEmail] || phoneToCus[cleanPhone],
        listing_id: msg.listing_id || (lstMatch ? lstMatch[0].toUpperCase() : undefined),
      };
    });

    setMessages(enriched);
    setLoading(false);
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    
    if (!message.read) {
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", message.id);
      
      fetchMessages();
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      fetchMessages();
    }
  };

  if (!isAdmin || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">View and manage user messages</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      {message.read ? (
                        <Badge variant="secondary">Read</Badge>
                      ) : (
                        <Badge>New</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {message.customer_id ? (
                          <Badge variant="outline" className="font-mono text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 w-fit">
                            {message.customer_id}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">—</span>
                        )}
                        {message.listing_id && (
                          <Badge variant="outline" className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 w-fit">
                            {message.listing_id}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.contact_number}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>
                      {format(new Date(message.created_at), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && format(new Date(selectedMessage.created_at), "MMMM dd, yyyy 'at' HH:mm")}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              {(selectedMessage.customer_id || selectedMessage.listing_id) && (
                <div className="p-3 bg-muted/60 rounded-lg border flex items-center gap-2 flex-wrap">
                  {selectedMessage.customer_id && (
                    <Badge variant="outline" className="font-mono text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200">
                      Customer ID: {selectedMessage.customer_id}
                    </Badge>
                  )}
                  {selectedMessage.listing_id && (
                    <Badge variant="outline" className="font-mono text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200">
                      Listing ID: {selectedMessage.listing_id}
                    </Badge>
                  )}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                <p className="text-base">{selectedMessage.contact_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="text-base whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMessages;