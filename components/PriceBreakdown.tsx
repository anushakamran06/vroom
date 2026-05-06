"use client";

import { useMemo, useState, useEffect } from "react";
import type { Car } from "@/types/car";
import TooltipInfo from "./TooltipInfo";

interface PriceBreakdownProps {
  car: Car;
  selectedColor: string;
  selectedWheels: number;
  selectedAddOns: string[];
  onRemoveAddOn: (id: string) => void;
}

interface LivePrice {
  basePrice: number;
  coeEstimate: number;
  arf: number;
  source: string;
  retrievedAt: string;
}

type LiveStatus = "idle" | "loading" | "done" | "error";

function fmt(n: number): string {
  return "S$" + n.toLocaleString("en-SG");
}

const ROW: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  fontSize: "13px",
  color: "#C0C0C0",
};

const LABEL: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const DIVIDER: React.CSSProperties = {
  borderTop: "1px solid #2A2A2A",
  margin: "10px 0",
};

const COE_TIP =
  "Certificate of Entitlement — Singapore government quota licence to own a car. Estimate based on current Cat B bidding.";
const ARF_TIP =
  "Additional Registration Fee — a tax based on your car's open market value. Paid once on registration.";
const REG_TIP =
  "One-time admin fee paid to LTA when registering the car.";
const ROAD_TAX_TIP =
  "Annual fee to use Singapore roads. Based on engine size.";

export default function PriceBreakdown({
  car,
  selectedColor,
  selectedWheels,
  selectedAddOns,
  onRemoveAddOn,
}: PriceBreakdownProps) {
  const [liveData, setLiveData] = useState<LivePrice | null>(null);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>("idle");
  const [updatedTime, setUpdatedTime] = useState<string>("");

  useEffect(() => {
    if (!car.livePrice) return;
    setLiveStatus("loading");

    fetch("/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand: car.brand, model: car.model }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: LivePrice) => {
        setLiveData(data);
        setLiveStatus("done");
        const d = new Date(data.retrievedAt);
        setUpdatedTime(
          d.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })
        );
      })
      .catch((err) => {
        console.error("Live price fetch failed, using static fallback:", err);
        setLiveStatus("error");
      });
  }, [car.brand, car.model, car.livePrice]);

  const effectiveBasePrice = liveData?.basePrice ?? car.basePrice;
  const effectiveCoe = liveData?.coeEstimate ?? car.sgFees.coeEstimate;
  const effectiveArf = liveData?.arf ?? car.sgFees.arf;

  const color = useMemo(
    () => car.colors.find((c) => c.slug === selectedColor),
    [car.colors, selectedColor]
  );
  const wheel = useMemo(
    () => car.wheels.find((w) => w.index === selectedWheels),
    [car.wheels, selectedWheels]
  );
  const activeAddOns = useMemo(
    () => car.addOns.filter((a) => selectedAddOns.includes(a.id)),
    [car.addOns, selectedAddOns]
  );

  const colorDelta = color?.priceDelta ?? 0;
  const wheelDelta = wheel?.priceDelta ?? 0;
  const addOnTotal = activeAddOns.reduce((s, a) => s + a.priceDelta, 0);
  const subtotal = effectiveBasePrice + colorDelta + wheelDelta + addOnTotal;
  const promotionSavings = car.activePromotions.reduce((s, p) => s + p.saving, 0);
  const { registrationFee, annualRoadTax } = car.sgFees;
  const total = subtotal - promotionSavings + effectiveCoe + effectiveArf + registrationFee;

  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #2A2A2A",
        borderRadius: "8px",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      {/* Base price row with live badge */}
      <div style={ROW}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>Base price</span>
          {car.livePrice && liveStatus === "loading" && (
            <span style={{ fontSize: "10px", color: "#E05555", letterSpacing: "0.05em" }}>
              🔴 LIVE
            </span>
          )}
          {car.livePrice && liveStatus === "done" && (
            <span style={{ fontSize: "10px", color: "#6DBF8C" }}>
              ✅ Updated {updatedTime}
            </span>
          )}
        </span>
        <span>{fmt(effectiveBasePrice)}</span>
      </div>

      {/* Color delta */}
      {colorDelta > 0 && (
        <div style={{ ...ROW, marginTop: "8px" }}>
          <span style={LABEL}>Colour — {color?.name}</span>
          <span>+{fmt(colorDelta)}</span>
        </div>
      )}

      {/* Wheel delta */}
      {wheelDelta > 0 && (
        <div style={{ ...ROW, marginTop: "8px" }}>
          <span style={LABEL}>Wheels — {wheel?.name.split(",")[0]}</span>
          <span>+{fmt(wheelDelta)}</span>
        </div>
      )}

      {/* Add-ons */}
      {activeAddOns.map((addon) => (
        <div key={addon.id} style={{ ...ROW, marginTop: "8px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{addon.name}</span>
            <button
              onClick={() => onRemoveAddOn(addon.id)}
              style={{
                fontSize: "11px",
                color: "#888",
                background: "transparent",
                border: "1px solid #3A3A3A",
                borderRadius: "3px",
                padding: "1px 6px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </span>
          <span>+{fmt(addon.priceDelta)}</span>
        </div>
      ))}

      <div style={DIVIDER} />

      {/* Subtotal */}
      <div style={{ ...ROW, color: "#E0E0E0", fontWeight: 600 }}>
        <span>Subtotal</span>
        <span>{fmt(subtotal)}</span>
      </div>

      {/* Promotions */}
      {car.activePromotions.map((promo, i) => (
        <div key={i} style={{ ...ROW, marginTop: "8px", color: "#6DBF8C" }}>
          <span style={LABEL}>
            <span>{promo.description.split("—")[0].trim()}</span>
            <TooltipInfo content={promo.description} />
          </span>
          <span>−{fmt(promo.saving)}</span>
        </div>
      ))}

      <div style={DIVIDER} />

      {/* SG Fees */}
      <div style={{ ...ROW, color: "#A0A0A0", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Singapore Registration Fees
        </span>
      </div>

      <div style={ROW}>
        <span style={LABEL}>
          <span>COE estimate</span>
          <TooltipInfo content={COE_TIP} />
        </span>
        <span>{fmt(effectiveCoe)}</span>
      </div>

      <div style={{ ...ROW, marginTop: "8px" }}>
        <span style={LABEL}>
          <span>ARF</span>
          <TooltipInfo content={ARF_TIP} />
        </span>
        <span>{fmt(effectiveArf)}</span>
      </div>

      <div style={{ ...ROW, marginTop: "8px" }}>
        <span style={LABEL}>
          <span>Registration fee</span>
          <TooltipInfo content={REG_TIP} />
        </span>
        <span>{fmt(registrationFee)}</span>
      </div>

      <div style={{ ...ROW, marginTop: "8px", color: "#A0A0A0" }}>
        <span style={LABEL}>
          <span>
            Annual road tax{" "}
            <span style={{ fontSize: "11px" }}>(annual, not one-time)</span>
          </span>
          <TooltipInfo content={ROAD_TAX_TIP} />
        </span>
        <span>{fmt(annualRoadTax)}/yr</span>
      </div>

      <div style={DIVIDER} />

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#C8A96E",
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
        >
          Total on-the-road
        </span>
        <span
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#C8A96E",
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            letterSpacing: "-0.02em",
          }}
        >
          {fmt(total)}
        </span>
      </div>

      {/* Live source footnote */}
      {liveStatus === "done" && liveData?.source && (
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#444", textAlign: "right" }}>
          Source: {liveData.source}
        </div>
      )}
    </div>
  );
}
