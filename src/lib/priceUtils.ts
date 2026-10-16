/**
 * Parses user input like "1.20 cr", "1 lakh", "85 L", "50k", "15000", "15,000" into a numeric value
 * for database storage, numerical sorting, and range filtering.
 */
export const parsePriceToNumber = (input: string | number | null | undefined): number => {
  if (input === null || input === undefined) return 0;
  if (typeof input === "number") return isNaN(input) ? 0 : input;

  const raw = String(input).trim();
  if (!raw) return 0;

  // Clean string: remove currency symbols, commas, and "rs."
  const clean = raw
    .replace(/[₹$€£,]/g, "")
    .replace(/\brs\.?\s*/gi, "")
    .trim()
    .toLowerCase();

  // Match pattern: <number> <optional multiplier word or suffix>
  const match = clean.match(/^([0-9]+(?:\.[0-9]+)?)\s*([a-z]+)?$/);
  if (!match) {
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }

  const numPart = parseFloat(match[1]);
  if (isNaN(numPart)) return 0;

  const unitPart = match[2] || "";

  if (/^(cr|crore|crores)$/.test(unitPart)) {
    return Math.round(numPart * 10000000);
  }
  if (/^(l|lac|lacs|lakh|lakhs)$/.test(unitPart)) {
    return Math.round(numPart * 100000);
  }
  if (/^(k|thousand|thousands)$/.test(unitPart)) {
    return Math.round(numPart * 1000);
  }
  if (/^(m|mn|million|millions)$/.test(unitPart)) {
    return Math.round(numPart * 1000000);
  }
  if (/^(b|bn|billion|billions)$/.test(unitPart)) {
    return Math.round(numPart * 1000000000);
  }

  return numPart;
};

/**
 * Returns formatted unit label for display, e.g. " / month", " / Room", or "" for plain.
 */
export const getPriceUnitLabel = (priceUnit?: string | null): string => {
  if (!priceUnit || priceUnit === "plain" || priceUnit === "none") return "";
  if (priceUnit === "sqft") return " / Sq Ft";
  if (priceUnit === "acre") return " / Acre";
  if (priceUnit === "cent") return " / Cent";
  if (priceUnit === "month") return " / month";
  if (priceUnit === "room") return " / Room";
  if (priceUnit === "unit") return " / Unit";
  return ` / ${priceUnit}`;
};

/**
 * Formats full listing price including typed text (if available), unit, and deposit.
 * Example outputs:
 *  - "₹1.20 cr"
 *  - "₹1 lakh / month, Deposit ₹50,000"
 *  - "₹5,000 / Room"
 *  - "₹15,000 / month, Deposit ₹50,000"
 */
export const formatListingPrice = (
  price: number | string | null | undefined,
  priceUnit?: string | null,
  deposit?: number | string | null,
  displayPrice?: string | null
): string => {
  let pricePart = "";
  const rawTyped = displayPrice && String(displayPrice).trim() !== "" ? String(displayPrice).trim() : null;

  if (rawTyped) {
    pricePart = rawTyped.startsWith("₹") ? rawTyped : `₹${rawTyped}`;
  } else if (price !== null && price !== undefined && !isNaN(Number(price))) {
    pricePart = `₹${Number(price).toLocaleString()}`;
  } else {
    pricePart = "₹0";
  }

  const unitLabel = getPriceUnitLabel(priceUnit);

  const depositVal = deposit !== null && deposit !== undefined && !isNaN(Number(deposit)) && Number(deposit) > 0
    ? Number(deposit)
    : null;
  const depositText = depositVal ? `, Deposit ₹${depositVal.toLocaleString()}` : "";

  return `${pricePart}${unitLabel}${depositText}`;
};
