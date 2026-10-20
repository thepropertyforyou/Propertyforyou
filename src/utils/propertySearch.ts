import Fuse from "fuse.js";
import { statesAndDistricts } from "@/data/india-locations";

export interface SearchableListing {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  location_city: string;
  location_locality: string | null;
  is_featured: boolean;
  listing_id?: string | null;
  attributes: any;
  created_at: string;
  listing_images: { image_url: string; display_order?: number }[];
  categories?: { name: string } | null;
}

/**
 * Strips all spaces, dashes, underscores, and punctuation to lowercase alphanumeric.
 * Example: "3-BHK, Flat!" -> "3bhkflat"
 *          "LST-0001" -> "lst0001"
 */
export function stripToAlphanumeric(str: any): string {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Normalizes text to lowercase with single spaces, removing special symbols.
 */
export function normalizeText(str: any): string {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Common Indian city aliases and equivalents
 */
const ALIAS_MAP: Record<string, string[]> = {
  mangalore: ["mangaluru", "mangalore", "dakshina kannada", "dakshinakannada"],
  mangaluru: ["mangalore", "mangaluru", "dakshina kannada", "dakshinakannada"],
  bangalore: ["bengaluru", "bangalore"],
  bengaluru: ["bangalore", "bengaluru"],
  mysore: ["mysuru", "mysore"],
  mysuru: ["mysore", "mysuru"],
  flat: ["apartment", "flat"],
  apartment: ["flat", "apartment"],
  land: ["plot", "site", "land"],
  plot: ["land", "site", "plot"],
  site: ["land", "plot", "site"],
  villa: ["house", "villa", "home"],
  house: ["villa", "home", "house"],
};

/**
 * Extracts all searchable text and token variations from a listing.
 */
export function getListingSearchMetadata(listing: SearchableListing) {
  const parts: string[] = [];
  const tokens = new Set<string>();

  // Title
  if (listing.title) {
    parts.push(listing.title);
  }

  // Description
  if (listing.description) {
    parts.push(listing.description);
  }

  // Listing ID (e.g. LST-0001)
  if (listing.listing_id) {
    parts.push(listing.listing_id);
    tokens.add(listing.listing_id.toLowerCase());
    tokens.add(stripToAlphanumeric(listing.listing_id));
  }
  if (listing.id) {
    parts.push(listing.id);
  }

  // Locations: city & locality
  if (listing.location_city) parts.push(listing.location_city);
  if (listing.location_locality) parts.push(listing.location_locality);

  // Attributes: city, locality, district, taluk, state, address
  if (listing.attributes?.city) parts.push(listing.attributes.city);
  if (listing.attributes?.locality) parts.push(listing.attributes.locality);
  if (listing.attributes?.district) parts.push(listing.attributes.district);
  if (listing.attributes?.taluk) parts.push(listing.attributes.taluk);
  if (listing.attributes?.state) parts.push(listing.attributes.state);
  if (listing.attributes?.address) parts.push(listing.attributes.address);

  // Derive state from statesAndDistricts
  const cityNorm = normalizeText(listing.location_city);
  const localityNorm = normalizeText(listing.location_locality);
  for (const item of statesAndDistricts) {
    const hasDist = item.districts.some((d) => {
      const dNorm = normalizeText(d.name);
      if (dNorm && cityNorm && (dNorm === cityNorm || cityNorm.includes(dNorm) || dNorm.includes(cityNorm))) {
        return true;
      }
      if (localityNorm && d.taluks.some((t) => normalizeText(t) === localityNorm)) {
        return true;
      }
      return false;
    });
    if (hasDist) {
      parts.push(item.state);
      break;
    }
  }

  // Property type & subcategory
  if (listing.attributes?.propertyType) parts.push(listing.attributes.propertyType);
  if (listing.attributes?.subCategory) parts.push(listing.attributes.subCategory);
  if (listing.attributes?.subcategory) parts.push(listing.attributes.subcategory);
  if (listing.attributes?.type) parts.push(listing.attributes.type);
  if (listing.categories?.name) parts.push(listing.categories.name);

  // Attributes: bedrooms (e.g. "3", "3 BHK", "3bhk")
  if (listing.attributes?.bedrooms) {
    parts.push(String(listing.attributes.bedrooms));
    parts.push(`${listing.attributes.bedrooms} bhk`);
    parts.push(`${listing.attributes.bedrooms}bhk`);
  }
  if (listing.attributes?.size) parts.push(`${listing.attributes.size} sqft`);

  // Build combined text and stripped alphanumeric string
  const combinedRaw = parts.join(" ");
  const normalizedCombined = normalizeText(combinedRaw);
  const strippedCombined = stripToAlphanumeric(combinedRaw);

  // Extract individual word tokens
  const words = normalizedCombined.split(/\s+/).filter(Boolean);
  for (const w of words) {
    tokens.add(w);
    const wStripped = stripToAlphanumeric(w);
    if (wStripped) tokens.add(wStripped);

    // Expand known city/property aliases
    if (ALIAS_MAP[w]) {
      for (const alias of ALIAS_MAP[w]) {
        tokens.add(alias);
      }
    }
  }

  // Extract BHK/bed patterns (e.g. "3 BHK" -> add "3bhk", "3-bhk", "3 bhk")
  const bhkMatches = combinedRaw.match(/\b(\d+)\s*[-_]?\s*(bhk|rk|bed|bedroom|bath|acre|cent|sqft)\b/gi);
  if (bhkMatches) {
    for (const m of bhkMatches) {
      const unified = stripToAlphanumeric(m);
      tokens.add(unified);
      tokens.add(m.toLowerCase());
    }
  }

  return {
    combinedRaw,
    normalizedCombined,
    strippedCombined,
    tokens: Array.from(tokens),
  };
}

export interface SearchResult<T> {
  exactMatches: T[];
  similarMatches: T[];
}

/**
 * Performs enhanced search on listings:
 * 1. Exact matches: Ignores case, spaces, dashes, punctuation (e.g. "3bhk" matches "3 BHK", "3-BHK", "3 bhk flat").
 *    Matches all typed words in any order, and partial words.
 * 2. Similar matches: Uses Fuse.js fuzzy matching for spelling mistakes (e.g. "mangalor", "manglore", "udpi").
 * 3. Returns exact matches first, followed by similar results (deduplicated).
 */
export function searchListings<T extends SearchableListing>(
  listings: T[],
  rawQuery: string
): SearchResult<T> {
  const query = rawQuery.trim();
  if (!query) {
    return { exactMatches: listings, similarMatches: [] };
  }

  const queryNormalized = normalizeText(query);
  const queryStripped = stripToAlphanumeric(query);
  const queryWords = queryNormalized.split(/\s+/).filter(Boolean);

  // Precompute search metadata for each listing
  const docs = listings.map((listing) => {
    const meta = getListingSearchMetadata(listing);
    return {
      listing,
      title: listing.title || "",
      description: listing.description || "",
      location_city: listing.location_city || "",
      location_locality: listing.location_locality || "",
      listing_id: listing.listing_id || "",
      propertyType: listing.attributes?.propertyType || "",
      subCategory: listing.attributes?.subCategory || "",
      district: listing.attributes?.district || "",
      state: listing.attributes?.state || "",
      taluk: listing.attributes?.taluk || "",
      ...meta,
    };
  });

  const exactMatches: T[] = [];
  const exactIds = new Set<string>();

  // 1. Identify EXACT Matches
  for (const doc of docs) {
    let isExact = false;

    // A. Direct stripped match (covers "3bhk" in "3 BHK Flat", "lst0001" in "LST-0001", etc.)
    if (queryStripped && doc.strippedCombined.includes(queryStripped)) {
      isExact = true;
    }

    // B. Direct normalized substring match
    if (!isExact && queryNormalized && doc.normalizedCombined.includes(queryNormalized)) {
      isExact = true;
    }

    // C. Multi-word search: all typed words must match (in any order, matching any part of a word or token)
    if (!isExact && queryWords.length > 0) {
      const allWordsMatch = queryWords.every((word) => {
        const wordStripped = stripToAlphanumeric(word);
        // Direct word or substring in combined text
        if (doc.normalizedCombined.includes(word)) return true;
        // Stripped word match in stripped text (e.g. "3bhk" in "3bhkflat")
        if (wordStripped && doc.strippedCombined.includes(wordStripped)) return true;
        // Token match (including aliases)
        if (doc.tokens.some((t) => t.includes(word) || (wordStripped && t.includes(wordStripped)))) return true;
        return false;
      });

      if (allWordsMatch) {
        isExact = true;
      }
    }

    if (isExact) {
      exactMatches.push(doc.listing);
      exactIds.add(doc.listing.id);
    }
  }

  // 2. Identify SIMILAR / FUZZY Matches (for spelling mistakes like "mangalor", "manglore", "udpi")
  // Only search items that are NOT already in exactMatches
  const remainingDocs = docs.filter((d) => !exactIds.has(d.listing.id));
  const similarMatches: T[] = [];

  if (remainingDocs.length > 0) {
    const fuse = new Fuse(remainingDocs, {
      keys: [
        { name: "tokens", weight: 0.4 },
        { name: "title", weight: 0.3 },
        { name: "location_city", weight: 0.25 },
        { name: "location_locality", weight: 0.25 },
        { name: "district", weight: 0.2 },
        { name: "taluk", weight: 0.2 },
        { name: "state", weight: 0.15 },
        { name: "propertyType", weight: 0.2 },
        { name: "subCategory", weight: 0.2 },
        { name: "listing_id", weight: 0.05 },
        { name: "description", weight: 0.1 },
      ],
      threshold: 0.6,
      ignoreLocation: true,
      minMatchCharLength: 3,
      includeScore: true,
    });

    // Search full query
    const fuseResults = fuse.search(query);
    for (const res of fuseResults) {
      if (res.score !== undefined && res.score <= 0.58) {
        similarMatches.push(res.item.listing);
      }
    }

    // For multi-word queries where fuse on full query didn't find everything,
    // check if each word fuzzy-matches or matches significant terms
    if (queryWords.length > 1) {
      const stopWords = new Set(["for", "and", "the", "with", "near", "all", "in", "at", "to", "of"]);
      const significantWords = queryWords.filter((w) => w.length >= 3 && !stopWords.has(w));

      if (significantWords.length > 0) {
        for (const doc of remainingDocs) {
          if (similarMatches.some((m) => m.id === doc.listing.id)) continue;

          let matchedSignificantWords = 0;

          for (const word of significantWords) {
            const wordStripped = stripToAlphanumeric(word);
            // Check exact word/substring
            const exactHit =
              doc.normalizedCombined.includes(word) ||
              (wordStripped && doc.strippedCombined.includes(wordStripped)) ||
              doc.tokens.some((t) => t === word || (wordStripped && t === wordStripped) || t.includes(word));

            if (exactHit) {
              matchedSignificantWords++;
            } else if (word.length >= 4) {
              // Only fuzzy match words with length >= 4 with tight threshold (0.35)
              const singleWordFuse = new Fuse([doc], {
                keys: ["tokens", "location_city", "location_locality", "district"],
                threshold: 0.35,
                ignoreLocation: true,
                minMatchCharLength: 3,
              });
              if (singleWordFuse.search(word).length > 0) {
                matchedSignificantWords++;
              }
            }
          }

          // If at least 60% of significant words matched or fuzzy matched
          if (matchedSignificantWords >= Math.ceil(significantWords.length * 0.6)) {
            similarMatches.push(doc.listing);
          }
        }
      }
    }
  }

  return {
    exactMatches,
    similarMatches,
  };
}
