import { useState, useEffect, useRef } from "react";
import { Search, Bell, User, Eye, Edit, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  price: number;
  status: string;
  listing_id?: string;
  customer_id?: string;
  profiles?: { name: string; email: string };
}

const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search by Listing ID, Customer ID, or Title
  useEffect(() => {
    const term = searchQuery.trim();
    if (!term || term.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select(`
            id,
            title,
            price,
            status,
            listing_id,
            customer_id,
            profiles (name, email)
          `)
          .or(`listing_id.ilike.%${term}%,customer_id.ilike.%${term}%,title.ilike.%${term}%`)
          .limit(8);

        if (!error && data) {
          setSearchResults(data as any);
        }
      } catch (err) {
        console.error("Error searching listings:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Search by Customer ID or Listing ID */}
      <div className="flex-1 max-w-lg relative" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Listing ID (e.g. LST-0001) or Customer ID (CUS-0001)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="pl-9 pr-9 bg-muted/60 border border-border/80 focus-visible:bg-background text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setShowResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {showResults && searchQuery.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-1">
            <div className="p-2 border-b bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Matching Listings & Customers</span>
              {isSearching && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
              {isSearching && searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No listing found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {item.listing_id ? (
                          <Badge variant="outline" className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200">
                            {item.listing_id}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                            No LST-ID
                          </Badge>
                        )}

                        {item.customer_id && (
                          <Badge variant="outline" className="font-mono text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200">
                            {item.customer_id}
                          </Badge>
                        )}

                        <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-[10px] py-0">
                          {item.status}
                        </Badge>
                      </div>

                      <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        ₹{item.price.toLocaleString()} • Poster: {item.profiles?.name || "Unknown"} ({item.profiles?.email || "No email"})
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 text-xs gap-1"
                        onClick={() => {
                          setShowResults(false);
                          navigate(`/admin/listing/${item.id}`);
                        }}
                        title="Open listing preview"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 px-2.5 text-xs gap-1"
                        onClick={() => {
                          setShowResults(false);
                          navigate(`/admin/listings/edit/${item.id}`);
                        }}
                        title="Edit listing details"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm">Admin Account</span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/")}>
              View Site
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
