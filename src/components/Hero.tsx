import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().replace(/\s+/g, ' ');
    
    if (!query) return;

    navigate(`/properties?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative bg-background py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl text-left space-y-5">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-sm">
              <span className="text-[#ffffff]">Buy. Sell. </span>
              <span className="text-[#007BFF]">Connect.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#ffffff] max-w-2xl drop-shadow-sm">
              Find verified listings for land and homes — all in one trusted place.
            </p>
          </div>

          {/* Search Bar - Compact & Rectangular */}
          <form onSubmit={handleSearch} className="max-w-xl pt-2">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
                className="pl-12 pr-28 h-12 bg-background/95 border-2 border-border rounded-lg text-sm shadow-lg backdrop-blur"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-9"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
