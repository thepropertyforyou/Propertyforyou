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
          className="w-full h-full object-cover object-[70%_center] md:object-center"
        />
        {/* Soft white gradient overlay behind text and search bar only */}
        <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl text-left space-y-5">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="text-[#013B7B]">Buy. Sell. </span>
              <span className="text-[#007BFF]">Connect.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#013B7B] max-w-2xl">
              Find verified listings for land and homes — all in one trusted place.
            </p>
          </div>

          {/* Search Bar - Compact & Rectangular */}
          <form onSubmit={handleSearch} className="w-[82%] sm:w-[80%] md:w-full max-w-xl pt-2">
            <div className="relative">
              <Search className="absolute left-3.5 md:left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
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
                className="pl-9 pr-20 md:pl-12 md:pr-28 h-10 md:h-12 bg-background/95 border-2 border-border rounded-lg text-xs md:text-sm shadow-lg backdrop-blur"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-3 md:px-6 h-7 md:h-9 text-xs md:text-sm font-medium"
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
