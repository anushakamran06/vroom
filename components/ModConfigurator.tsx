"use client";

import { useState, useEffect } from "react";
import type { Car, CarMod } from "@/types/car";
import PriceBreakdown from "./PriceBreakdown";

interface ModConfiguratorProps {
  cars: Car[];
  onModSelect: (imageSlug: string) => void;
}

type Mode = "buy" | "own";
type ModCategory = "wheels" | "suspension" | "tint" | "exhaust" | "bodykit";
type ModalType = "dealer" | "workshop" | null;

const CATEGORIES: { id: ModCategory; label: string }[] = [
  { id: "wheels", label: "Wheels" },
  { id: "suspension", label: "Suspension" },
  { id: "tint", label: "Tint" },
  { id: "exhaust", label: "Exhaust" },
  { id: "bodykit", label: "Body Kit" },
];

const WORKSHOP_QUERY: Record<ModCategory, string> = {
  exhaust: "exhaust+workshop+singapore",
  suspension: "suspension+workshop+singapore",
  bodykit: "body+kit+workshop+singapore",
  wheels: "rim+tyre+workshop+singapore",
  tint: "car+tinting+singapore",
};

const SG_LAT = 1.3521;
const SG_LNG = 103.8198;

function mapsUrl(type: ModalType, lat: number, lng: number, category: ModCategory): string {
  const coord = `@${lat},${lng},13z`;
  if (type === "dealer") {
    return `https://www.google.com/maps/search/authorised+car+dealer+singapore/${coord}`;
  }
  const query = WORKSHOP_QUERY[category] ?? "car+modification+workshop+singapore";
  return `https://www.google.com/maps/search/${query}/${coord}`;
}

function fmtSGD(n: number): string {
  return "S$" + n.toLocaleString("en-SG");
}

const S: Record<string, React.CSSProperties> = {
  modeBtn: {
    flex: 1,
    padding: "10px 0",
    border: "1px solid #2A2A2A",
    background: "transparent",
    color: "#555",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter, system-ui, sans-serif",
    letterSpacing: "0.04em",
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
  },
  variantCard: {
    flex: "1 1 0",
    padding: "14px 16px",
    border: "1px solid #2A2A2A",
    background: "#141414",
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  tabBtn: {
    padding: "8px 16px",
    border: "1px solid #2A2A2A",
    background: "transparent",
    color: "#555",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    letterSpacing: "0.06em",
    transition: "all 0.15s",
  },
  modCard: {
    padding: "14px",
    border: "1px solid #2A2A2A",
    background: "#141414",
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  findBtn: {
    width: "100%",
    padding: "13px 0",
    border: "1px solid #2A2A2A",
    background: "#141414",
    color: "#E0E0E0",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter, system-ui, sans-serif",
    letterSpacing: "0.04em",
    borderRadius: "4px",
    transition: "border-color 0.15s, color 0.15s",
  },
};

export default function ModConfigurator({ cars, onModSelect }: ModConfiguratorProps) {
  const [mode, setMode] = useState<Mode>("buy");
  const [variantIdx, setVariantIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(cars[0]?.colors[0]?.slug ?? "");
  const [selectedWheel, setSelectedWheel] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<ModCategory>("wheels");
  const [selectedModIds, setSelectedModIds] = useState<string[]>([]);
  const [modalType, setModalType] = useState<ModalType>(null);

  const car = cars[variantIdx];

  useEffect(() => {
    setSelectedColor(car?.colors[0]?.slug ?? "");
    setSelectedWheel(0);
    setSelectedAddOns([]);
  }, [variantIdx, car]);

  function toggleMod(mod: CarMod) {
    setSelectedModIds((prev) => {
      const next = prev.includes(mod.id)
        ? prev.filter((x) => x !== mod.id)
        : [...prev, mod.id];
      const remaining = (car.mods ?? []).filter((m) => next.includes(m.id));
      onModSelect(remaining.length > 0 ? remaining[remaining.length - 1].imageSlug : "");
      return next;
    });
  }

  function removeAddOn(id: string) {
    setSelectedAddOns((prev) => prev.filter((x) => x !== id));
  }

  function handleUseLocation() {
    setModalType(null);
    const open = (lat: number, lng: number) =>
      window.open(mapsUrl(modalType, lat, lng, activeCategory), "_blank", "noopener,noreferrer");

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => open(pos.coords.latitude, pos.coords.longitude),
        () => open(SG_LAT, SG_LNG)
      );
    } else {
      open(SG_LAT, SG_LNG);
    }
  }

  const selectedMods = (car.mods ?? []).filter((m) => selectedModIds.includes(m.id));
  const modMinTotal = selectedMods.reduce((s, m) => s + m.priceMin, 0);
  const modMaxTotal = selectedMods.reduce((s, m) => s + m.priceMax, 0);
  const categoryMods = (car.mods ?? []).filter((m) => m.category === activeCategory);

  return (
    <>
      {/* Location modal */}
      {modalType !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setModalType(null)}
        >
          <div
            style={{
              background: "#141414",
              border: "1px solid #2A2A2A",
              borderRadius: "4px",
              padding: "28px 24px",
              maxWidth: "340px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#E0E0E0",
                fontFamily: "Inter, system-ui, sans-serif",
                marginBottom: "10px",
              }}
            >
              Find Nearby {modalType === "dealer" ? "Dealers" : "Workshops"}
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#8A8A8A",
                lineHeight: 1.6,
                margin: "0 0 22px 0",
              }}
            >
              Vroom will use your location to show you the closest options.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleUseLocation}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "#C8A96E",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                Use My Location
              </button>
              <button
                onClick={() => setModalType(null)}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "transparent",
                  color: "#8A8A8A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Buy / Own toggle */}
        <div style={{ display: "flex" }}>
          {(["buy", "own"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                ...S.modeBtn,
                background: mode === m ? "#C8A96E" : "transparent",
                color: mode === m ? "#fff" : "#555",
                borderColor: mode === m ? "#C8A96E" : "#2A2A2A",
                borderRadius: m === "buy" ? "4px 0 0 4px" : "0 4px 4px 0",
              }}
            >
              {m === "buy" ? "Looking to Buy" : "Already Own"}
            </button>
          ))}
        </div>

        {/* Variant selector */}
        <div>
          <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
            Variant
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {cars.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setVariantIdx(i)}
                style={{
                  ...S.variantCard,
                  borderColor: variantIdx === i ? "#C8A96E" : "#2A2A2A",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "12px", color: "#8A8A8A", marginBottom: "2px", fontFamily: "Inter, system-ui, sans-serif" }}>
                  {c.model.split(" ").slice(0, 1).join(" ")}
                </div>
                <div style={{ fontSize: "11px", color: "#555", fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                  {fmtSGD(c.basePrice + c.sgFees.coeEstimate + c.sgFees.arf + c.sgFees.registrationFee)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* BUY STATE */}
        {mode === "buy" && car && (
          <>
            <PriceBreakdown
              car={car}
              selectedColor={selectedColor}
              selectedWheels={selectedWheel}
              selectedAddOns={selectedAddOns}
              onRemoveAddOn={removeAddOn}
            />

            <div>
              <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                Authorised Dealers
              </div>
              <button
                style={S.findBtn}
                onClick={() => setModalType("dealer")}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#C8A96E";
                  (e.currentTarget as HTMLElement).style.color = "#C8A96E";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#2A2A2A";
                  (e.currentTarget as HTMLElement).style.color = "#E0E0E0";
                }}
              >
                Find Car Dealer →
              </button>
              <p style={{ fontSize: "11px", color: "#444", marginTop: "10px", lineHeight: 1.5 }}>
                * Prices as of 6 May 2026. Verify current OTR at mercedes-benz.com.sg.
              </p>
            </div>
          </>
        )}

        {/* OWN STATE */}
        {mode === "own" && car && (
          <>
            {/* Category tabs */}
            <div>
              <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
                Modification Category
              </div>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      ...S.tabBtn,
                      borderColor: activeCategory === cat.id ? "#C8A96E" : "#2A2A2A",
                      color: activeCategory === cat.id ? "#C8A96E" : "#555",
                      background: activeCategory === cat.id ? "#1A1400" : "transparent",
                    }}
                  >
                    {cat.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Mod cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {categoryMods.map((mod) => {
                const active = selectedModIds.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    onClick={() => toggleMod(mod)}
                    style={{
                      ...S.modCard,
                      borderColor: active ? "#C8A96E" : "#2A2A2A",
                      boxShadow: active ? "0 0 0 1px #C8A96E" : "none",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: "10px", color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontFamily: "Inter, system-ui, sans-serif" }}>
                      {mod.brand}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#E0E0E0", marginBottom: "6px", fontFamily: "Inter, system-ui, sans-serif" }}>
                      {mod.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#C8A96E", fontFamily: "'JetBrains Mono', 'Courier New', monospace", marginBottom: "8px" }}>
                      {fmtSGD(mod.priceMin)}–{fmtSGD(mod.priceMax)}
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: mod.ltaCompliant ? "#0D2B18" : "#2B0D0D",
                        color: mod.ltaCompliant ? "#6DBF8C" : "#E05555",
                        border: `1px solid ${mod.ltaCompliant ? "#1A4A2E" : "#4A1A1A"}`,
                      }}
                    >
                      {mod.ltaCompliant ? "LTA ✓" : `⚠ ${mod.ltaNote ?? "Check LTA"}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Running total */}
            {selectedMods.length > 0 && (
              <div style={{ padding: "14px 16px", border: "1px solid #2A2A2A", background: "#141414" }}>
                <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                  Estimated Mod Cost
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#C8A96E", fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
                  {fmtSGD(modMinTotal)}–{fmtSGD(modMaxTotal)}
                </div>
                <div style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>
                  {selectedMods.length} mod{selectedMods.length > 1 ? "s" : ""} selected
                </div>
              </div>
            )}

            {/* Find Workshop */}
            <div>
              <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
                Nearby Workshops
              </div>
              {selectedMods.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#444", margin: 0 }}>
                  Select a mod above to find nearby workshops.
                </p>
              ) : (
                <button
                  style={S.findBtn}
                  onClick={() => setModalType("workshop")}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#C8A96E";
                    (e.currentTarget as HTMLElement).style.color = "#C8A96E";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#2A2A2A";
                    (e.currentTarget as HTMLElement).style.color = "#E0E0E0";
                  }}
                >
                  Find Workshop →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
