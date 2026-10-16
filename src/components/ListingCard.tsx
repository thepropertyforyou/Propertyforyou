import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    location_city: string;
    location_locality: string | null;
    deposit?: number | null;
    is_featured?: boolean;
    listing_images?: { image_url: string; display_order?: number }[];
    categories?: { name: string };
    attributes?: any;
  };
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = (listing.listing_images || []).sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col group"
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]?.image_url || images[0]?.image_url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {hasMultipleImages && (
              <>
                {/* Previous Image Arrow */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Next Image Arrow */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1.5 z-20">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleDotClick(e, idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "w-4 bg-white shadow-md"
                          : "w-2 bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`Show image ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Image counter badge */}
                <div className="absolute top-2 right-12 z-20 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
                  {currentImageIndex + 1}/{images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-2 z-20">
          {listing.is_featured && (
            <Badge className="bg-accent text-accent-foreground shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute top-2 right-2 z-20">
          <FavoriteButton listingId={listing.id} />
        </div>
      </div>
      
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2 min-h-[3rem]">
          {listing.title}
        </h3>
        
        <p className="text-xl font-bold text-primary mb-2">
          {(() => {
            const unit = listing.attributes?.priceUnit;
            let unitLabel = "";
            if (unit === "sqft") unitLabel = " / Sq Ft";
            else if (unit === "acre") unitLabel = " / Acre";
            else if (unit === "cent") unitLabel = " / Cent";
            else if (unit === "month") unitLabel = " / month";
            else if (unit === "unit") unitLabel = " / Unit";
            else if (unit) unitLabel = ` / ${unit}`;

            const depositVal = (listing as any).deposit ?? listing.attributes?.deposit;
            const depositText = depositVal ? `, Deposit ₹${Number(depositVal).toLocaleString()}` : "";

            return `₹${listing.price.toLocaleString()}${unitLabel}${depositText}`;
          })()}
        </p>
        
        <div className="mt-auto flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
          <span className="line-clamp-1">
            {listing.location_locality
              ? `${listing.location_locality}, ${listing.location_city}`
              : listing.location_city}
          </span>
        </div>
      </div>
    </Card>
  );
};
