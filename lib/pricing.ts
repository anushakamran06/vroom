import type { Car } from "@/data/cars";

export interface PriceLineItem {
  id: string;
  label: string;
  amount: number;
  type: "base" | "option" | "discount" | "fee" | "subtotal" | "total";
  tooltip: string;
  canRemove?: boolean;
}

export interface PriceBreakdownResult {
  lines: PriceLineItem[];
  subtotal: number;
  totalSavings: number;
  total: number;
}

export function buildPriceBreakdown(
  car: Car,
  selectedColorSlug: string,
  selectedWheelIndex: number,
  selectedAddOnIds: string[]
): PriceBreakdownResult {
  const lines: PriceLineItem[] = [];

  lines.push({
    id: "base",
    label: `${car.brand} ${car.name} — base price`,
    amount: car.basePrice,
    type: "base",
    tooltip:
      "The manufacturer's list price for the car in its standard specification, before any Singapore government fees or optional extras.",
  });

  const selectedColor = car.colors.find((c) => c.slug === selectedColorSlug);
  if (selectedColor && selectedColor.priceDelta > 0) {
    lines.push({
      id: "color",
      label: `${selectedColor.name} paint`,
      amount: selectedColor.priceDelta,
      type: "option",
      tooltip:
        "Metallic, pearlescent, and special-order paint colours cost more to apply than standard solid colours.",
    });
  }

  const selectedWheel = car.wheels.find((w) => w.index === selectedWheelIndex);
  if (selectedWheel && selectedWheel.priceDelta > 0) {
    lines.push({
      id: "wheel",
      label: selectedWheel.name,
      amount: selectedWheel.priceDelta,
      type: "option",
      tooltip:
        "Larger or more complex wheel designs cost more to manufacture and fit.",
    });
  }

  for (const id of selectedAddOnIds) {
    const addon = car.addOns.find((a) => a.id === id);
    if (addon) {
      lines.push({
        id: addon.id,
        label: addon.name,
        amount: addon.priceDelta,
        type: "option",
        tooltip: addon.plainDescription,
        canRemove: true,
      });
    }
  }

  const subtotal =
    car.basePrice +
    (selectedColor?.priceDelta ?? 0) +
    (selectedWheel?.priceDelta ?? 0) +
    selectedAddOnIds.reduce((sum, id) => {
      const addon = car.addOns.find((a) => a.id === id);
      return sum + (addon?.priceDelta ?? 0);
    }, 0);

  lines.push({
    id: "subtotal",
    label: "Subtotal",
    amount: subtotal,
    type: "subtotal",
    tooltip: "Sum of base price plus all selected options before discounts and Singapore government fees.",
  });

  let totalSavings = 0;
  for (const promo of car.activePromotions) {
    totalSavings += promo.saving;
    lines.push({
      id: `promo-${promo.description}`,
      label: promo.description,
      amount: -promo.saving,
      type: "discount",
      tooltip: `${promo.description}${promo.expiryDate ? ` — offer ends ${promo.expiryDate}` : ""}. This saving is applied automatically and deducted from the subtotal.`,
    });
  }

  const afterDiscount = subtotal - totalSavings;

  lines.push({
    id: "coe",
    label: "COE (current est.)",
    amount: car.sgFees.coeEstimate,
    type: "fee",
    tooltip:
      "Certificate of Entitlement — a Singapore government quota licence required to own any car. It is bid at fortnightly government auctions; this figure is an estimate based on recent Cat B bidding prices. The actual COE you pay may be higher or lower.",
  });

  lines.push({
    id: "arf",
    label: "ARF (Additional Registration Fee)",
    amount: car.sgFees.arf,
    type: "fee",
    tooltip: `Additional Registration Fee — a Singapore tax calculated as a percentage of the car's Open Market Value (OMV of S$${car.sgFees.omv.toLocaleString("en-SG")}). The rate is 100% on the first S$20,000, 140% on the next S$30,000, and 180% on anything above S$50,000. It is meant to discourage car ownership.`,
  });

  lines.push({
    id: "reg",
    label: "Registration fee",
    amount: car.sgFees.registrationFee,
    type: "fee",
    tooltip:
      "A fixed S$220 one-time fee charged by LTA (Land Transport Authority) to register the vehicle in your name.",
  });

  lines.push({
    id: "roadtax",
    label: `Road tax (annual, est.)`,
    amount: car.sgFees.annualRoadTax,
    type: "fee",
    tooltip:
      "Annual fee paid to LTA to legally use public roads. The amount depends on engine size — larger engines pay more. This figure is an estimate; the actual amount may vary slightly.",
  });

  const total =
    afterDiscount +
    car.sgFees.coeEstimate +
    car.sgFees.arf +
    car.sgFees.registrationFee +
    car.sgFees.annualRoadTax;

  lines.push({
    id: "total",
    label: "Total on-the-road price",
    amount: total,
    type: "total",
    tooltip:
      "The total amount you would pay to drive this car out of the showroom in Singapore, including all taxes, fees, and selected options. Road tax recurs annually.",
  });

  return { lines, subtotal, totalSavings, total };
}
