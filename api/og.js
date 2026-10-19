function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getPriceUnitLabel(priceUnit) {
  if (!priceUnit || priceUnit === "plain" || priceUnit === "none") return "";
  if (priceUnit === "sqft") return " / Sq Ft";
  if (priceUnit === "acre") return " / Acre";
  if (priceUnit === "cent") return " / Cent";
  if (priceUnit === "month") return " / month";
  if (priceUnit === "room") return " / Room";
  if (priceUnit === "unit") return " / Unit";
  return ` / ${priceUnit}`;
}

function formatPrice(price, attributes) {
  const displayPrice = attributes?.displayPrice || attributes?.display_price;
  let pricePart = "";
  const rawTyped = displayPrice && String(displayPrice).trim() !== "" && (String(displayPrice).trim() !== "0" || !price || Number(price) === 0)
    ? String(displayPrice).trim()
    : null;
  if (rawTyped) {
    pricePart = rawTyped.startsWith("₹") ? rawTyped : `₹${rawTyped}`;
  } else if (price !== null && price !== undefined && !isNaN(Number(price))) {
    pricePart = `₹${Number(price).toLocaleString()}`;
  } else {
    pricePart = "₹0";
  }

  const unitLabel = getPriceUnitLabel(attributes?.priceUnit);
  const deposit = attributes?.deposit;
  const depositVal = deposit !== null && deposit !== undefined && !isNaN(Number(deposit)) && Number(deposit) > 0
    ? Number(deposit)
    : null;
  const depositText = depositVal ? `, Deposit ₹${depositVal.toLocaleString()}` : "";
  return `${pricePart}${unitLabel}${depositText}`;
}

export default async function handler(req, res) {
  // Support both req.query (Node serverless) and URL params (Edge)
  const urlObj = new URL(req.url, `https://${req.headers?.host || "thepropertyforyou.com"}`);
  const id = req.query?.id || urlObj.searchParams.get("id") || "";

  if (!id) {
    if (res?.status) {
      return res.status(400).send("Listing ID required");
    }
    return new Response("Listing ID required", { status: 400 });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://nvtzsxuejwlgnayescfw.supabase.co";
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable__8p5SlJyL9kzsfV4BUbV0Q_BuQx2wwR";

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const filter = isUuid ? `id=eq.${id}` : `listing_id=eq.${encodeURIComponent(id)}`;
    const endpoint = `${supabaseUrl}/rest/v1/listings?${filter}&select=id,listing_id,title,price,description,location_city,location_locality,attributes,listing_images(image_url,display_order)&limit=1`;

    const response = await fetch(endpoint, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    const listings = await response.json();
    const listing = Array.isArray(listings) && listings.length > 0 ? listings[0] : null;

    const defaultImage = "https://thepropertyforyou.com/Asset%203.png";

    if (!listing) {
      const fallbackHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Property | The Property For You</title>
  <meta property="og:site_name" content="The Property For You" />
  <meta property="og:title" content="The Property For You - Marketplace" />
  <meta property="og:description" content="Karnataka's trusted marketplace for land, homes, cars & jewellery." />
  <meta property="og:image" content="${defaultImage}" />
  <meta property="og:type" content="website" />
  <meta http-equiv="refresh" content="0;url=/listing/${encodeURIComponent(id)}" />
</head>
<body>
  <p>Redirecting to listing... <a href="/listing/${encodeURIComponent(id)}">Click here</a></p>
</body>
</html>`;
      if (res?.setHeader) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(404).send(fallbackHtml);
      }
      return new Response(fallbackHtml, {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Sort images by display_order
    const images = (listing.listing_images || []).sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
    const rawImageUrl = images[0]?.image_url || defaultImage;
    const imageUrl = rawImageUrl.startsWith("http") ? rawImageUrl : `https://thepropertyforyou.com${rawImageUrl}`;

    const formattedPrice = formatPrice(listing.price, listing.attributes);
    const location = [listing.location_locality, listing.location_city].filter(Boolean).join(", ");
    const cleanDesc = listing.description ? listing.description.replace(/[\r\n]+/g, " ").slice(0, 150) : "";
    const metaDescription = `${formattedPrice} • ${location}${cleanDesc ? ` — ${cleanDesc}` : " • Verified listing on The Property For You"}`;
    const pageTitle = `${listing.title} - ${formattedPrice} | The Property For You`;
    const canonicalUrl = `https://thepropertyforyou.com/listing/${listing.id}`;

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}" />

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:site_name" content="The Property For You" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(metaDescription)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(listing.title)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <!-- Automatic redirect for browsers -->
  <meta http-equiv="refresh" content="0;url=/listing/${encodeURIComponent(listing.id)}" />
  <script>
    window.location.replace('/listing/' + encodeURIComponent('${listing.id}'));
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; background: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
  <div style="max-width: 440px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; text-align: left;">
    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(listing.title)}" style="width: 100%; height: 260px; object-fit: cover; display: block;" />
    <div style="padding: 20px;">
      <h1 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px; line-height: 1.4;">${escapeHtml(listing.title)}</h1>
      <p style="font-size: 20px; font-weight: 800; color: #007bff; margin: 0 0 6px;">${escapeHtml(formattedPrice)}</p>
      <p style="font-size: 14px; color: #64748b; margin: 0 0 16px;">${escapeHtml(location)}</p>
      <a href="/listing/${encodeURIComponent(listing.id)}" style="display: block; width: 100%; text-align: center; background: #007bff; color: #ffffff; padding: 12px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; box-sizing: border-box;">Open in The Property For You</a>
    </div>
  </div>
</body>
</html>`;

    if (res?.setHeader) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
      return res.status(200).send(html);
    }
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("OG handler error:", error);
    if (res?.status) {
      return res.status(500).send("Error generating preview");
    }
    return new Response("Error generating preview", { status: 500 });
  }
}
