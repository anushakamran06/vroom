"use client";

import { useState, useEffect } from "react";
import type { Car, CarMod, Workshop, Dealer } from "@/types/car";
import PriceBreakdown from "./PriceBreakdown";
import workshopsRaw from "@/data/workshops.json";
import dealersRaw from "@/data/dealers.json";

const workshops = workshopsRaw as Workshop[];
const dealers = dealersRaw as Dealer[];

interface ModConfiguratorProps {
  cars: Car[];
  onModSelect: (imageSlug: string) => void;
}

type Mode = "buy" | "own";
type ModCategory = "wheels" | "suspension" | "tint" | "exhaust" | "bodykit";

const CATEGORIES: { id: ModCategory; label: string }[] = [
  { id: "wheels", label: "Wheels" },
  { id: "suspension", label: "Suspension" },
  { id: "tint", label: "Tint" },
  { id: "exhaust", label: "Exhaust" },
  { id: "bodykit", label: "Body Kit" },
];

function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
  workshopCard: {
    padding: "14px 16px",
    border: "1px solid #2A2A2A",
    background: "#141414",
  },
  dealerCard: {
    padding: "16px",
    border: "1px solid #2A2A2A",
    background: "#141414",
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
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const car = cars[variantIdx];

  useEffect(() => {
    setSelectedColor(car?.colors[0]?.slug ?? "");
    setSelectedWheel(0);
    setSelectedAddOns([]);
  }, [variantIdx, car]);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

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

  const selectedMods = (car.mods ?? []).filter((m) => selectedModIds.includes(m.id));
  const modMinTotal = selectedMods.reduce((s, m) => s + m.priceMin, 0);
  const modMaxTotal = selectedMods.reduce((s, m) => s + m.priceMax, 0);

  const selectedCategories = new Set(selectedMods.map((m) => m.category));
  const filteredWorkshops = workshops
    .filter((w) => selectedMods.length === 0 || w.specialities.some((s) => selectedCategories.has(s as ModCategory)))
    .sort((a, b) => {
      if (userCoords) {
        return (
          haversineKm(userCoords.lat, userCoords.lng, a.lat, a.lng) -
          haversineKm(userCoords.lat, userCoords.lng, b.lat, b.lng)
        );
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, 3);

  const categoryMods = (car.mods ?? []).filter((m) => m.category === activeCategory);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Buy / Own toggle */}
      <div style={{ display: "flex", gap: "0" }}>
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
              <div
                style={{
                  fontSize: "11px",
                  color: "#555",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                }}
              >
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

          {/* Dealers */}
          <div>
            <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Authorised Dealers
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "10px",
              }}
            >
              {dealers.map((d) => (
                <div key={d.id} style={S.dealerCard}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#E0E0E0", marginBottom: "4px", fontFamily: "Inter, system-ui, sans-serif" }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#8A8A8A", marginBottom: "2px" }}>{d.address}</div>
                  <div style={{ fontSize: "11px", color: "#555", marginBottom: "10px" }}>{d.district}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a
                      href={`tel:${d.phone}`}
                      style={{ fontSize: "12px", color: "#8A8A8A", textDecoration: "none" }}
                    >
                      {d.phone}
                    </a>
                    <a
                      href={d.appointmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "11px",
                        color: "#C8A96E",
                        textDecoration: "none",
                        border: "1px solid #C8A96E",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Book →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "#444", marginTop: "12px", lineHeight: 1.5 }}>
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
            <div
              style={{
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
            >
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
            }}
          >
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
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#8A8A8A",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "4px",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {mod.brand}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#E0E0E0",
                      marginBottom: "6px",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {mod.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#C8A96E",
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      marginBottom: "8px",
                    }}
                  >
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
            <div
              style={{
                padding: "14px 16px",
                border: "1px solid #2A2A2A",
                background: "#141414",
              }}
            >
              <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                Estimated Mod Cost
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#C8A96E",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                }}
              >
                {fmtSGD(modMinTotal)}–{fmtSGD(modMaxTotal)}
              </div>
              <div style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>
                {selectedMods.length} mod{selectedMods.length > 1 ? "s" : ""} selected
              </div>
            </div>
          )}

          {/* Workshops */}
          <div>
            <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
              Nearby Workshops
            </div>
            {selectedMods.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#444" }}>
                Select a mod above to find nearby workshops.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filteredWorkshops.map((w) => {
                  const dist = userCoords
                    ? haversineKm(userCoords.lat, userCoords.lng, w.lat, w.lng)
                    : null;
                  return (
                    <div key={w.id} style={S.workshopCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#E0E0E0", fontFamily: "Inter, system-ui, sans-serif" }}>
                            {w.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#8A8A8A", marginTop: "2px" }}>
                            {w.district}
                            {dist !== null && (
                              <span style={{ color: "#555", marginLeft: "8px" }}>
                                {dist.toFixed(1)} km away
                              </span>
                            )}
                          </div>
                        </div>
                        <a
                          href={`tel:${w.phone}`}
                          style={{ fontSize: "12px", color: "#8A8A8A", textDecoration: "none", whiteSpace: "nowrap" }}
                        >
                          {w.phone}
                        </a>
                      </div>
                      <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                        {w.specialities.map((sp) => (
                          <span
                            key={sp}
                            style={{
                              fontSize: "10px",
                              padding: "2px 8px",
                              border: "1px solid #2A2A2A",
                              color: "#555",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
