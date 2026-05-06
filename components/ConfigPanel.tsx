"use client";

import { useState } from "react";
import type { Car } from "@/types/car";
import PriceBreakdown from "./PriceBreakdown";
import LoanChatbot from "./LoanChatbot";

interface ConfigPanelProps {
  car: Car;
}

export default function ConfigPanel({ car }: ConfigPanelProps) {
  const [selectedColor, setSelectedColor] = useState(car.colors[0]?.slug ?? "");
  const [selectedWheel, setSelectedWheel] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  const isAMG = car.model.toUpperCase().includes("AMG");

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function removeAddOn(id: string) {
    setSelectedAddOns((prev) => prev.filter((x) => x !== id));
  }

  function addNotIncluded(name: string, price?: number) {
    if (!price) return;
    const id = "ni-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    toggleAddOn(id);
  }

  const color = car.colors.find((c) => c.slug === selectedColor);
  const wheel = car.wheels.find((w) => w.index === selectedWheel);
  const colorDelta = color?.priceDelta ?? 0;
  const wheelDelta = wheel?.priceDelta ?? 0;
  const addOnTotal = car.addOns
    .filter((a) => selectedAddOns.includes(a.id))
    .reduce((s, a) => s + a.priceDelta, 0);
  const subtotal = car.basePrice + colorDelta + wheelDelta + addOnTotal;
  const promoSavings = car.activePromotions.reduce((s, p) => s + p.saving, 0);
  const totalOTR =
    subtotal -
    promoSavings +
    car.sgFees.coeEstimate +
    car.sgFees.arf +
    car.sgFees.registrationFee;

  return (
    <>
      <div
        style={{
          background: "#F5F5F0",
          color: "#1A1A1A",
          height: "100%",
          overflowY: "auto",
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* Header */}
        <div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>
            {car.brand} · {car.year}
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {car.model}
          </div>
          <div style={{ marginTop: "10px" }}>
            {isAMG ? (
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 12px",
                  background: "#C8A96E",
                  color: "#fff",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                AMG
              </span>
            ) : (
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 12px",
                  background: "#D0D0D0",
                  color: "#444",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                Standard
              </span>
            )}
          </div>
        </div>

        {/* Color selector */}
        <section>
          <SectionLabel>Colour</SectionLabel>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
            {car.colors.map((c) => (
              <div key={c.slug} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <button
                  title={c.name + (c.priceDelta > 0 ? ` (+S$${c.priceDelta.toLocaleString("en-SG")})` : "")}
                  onClick={() => setSelectedColor(c.slug)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: c.hex,
                    border: selectedColor === c.slug ? "3px solid #1A1A1A" : "2px solid transparent",
                    outline: selectedColor === c.slug ? "2px solid #C8A96E" : "2px solid #D0D0D0",
                    cursor: "pointer",
                    transition: "outline 0.15s",
                  }}
                  aria-label={c.name}
                />
                {c.priceDelta > 0 && (
                  <span style={{ fontSize: "10px", color: "#666" }}>
                    +S${c.priceDelta.toLocaleString("en-SG")}
                  </span>
                )}
              </div>
            ))}
          </div>
          {color && (
            <div style={{ marginTop: "8px", fontSize: "13px", color: "#555" }}>
              {color.name}
            </div>
          )}
        </section>

        {/* Wheel selector */}
        <section>
          <SectionLabel>Wheels</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
            {car.wheels.map((w) => (
              <button
                key={w.index}
                onClick={() => setSelectedWheel(w.index)}
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: selectedWheel === w.index ? "2px solid #1A1A1A" : "2px solid #D5D5D0",
                  background: selectedWheel === w.index ? "#EBEBE6" : "transparent",
                  cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>{w.name}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                  {w.priceDelta > 0 ? `+S$${w.priceDelta.toLocaleString("en-SG")}` : "Included"}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Add-ons */}
        <section>
          <SectionLabel>Add-ons</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            {car.addOns.map((addon) => {
              const checked = selectedAddOns.includes(addon.id);
              return (
                <label
                  key={addon.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: checked ? "2px solid #1A1A1A" : "2px solid #D5D5D0",
                    background: checked ? "#EBEBE6" : "transparent",
                    cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAddOn(addon.id)}
                    style={{ marginTop: "2px", flexShrink: 0, accentColor: "#1A1A1A" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>{addon.name}</span>
                      <span style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px" }}>
                        +S${addon.priceDelta.toLocaleString("en-SG")}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#555", margin: "4px 0 0 0", lineHeight: 1.5 }}>
                      {addon.plainDescription}
                    </p>
                    <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                      Replaces: {addon.replacesWhat}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Not included */}
        <section>
          <SectionLabel>Not Included</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
            {car.notIncluded.map((item) => (
              <div
                key={item.name}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "2px solid #D5D5D0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>{item.name}</div>
                  <p style={{ fontSize: "12px", color: "#555", margin: "4px 0 0 0", lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>
                {item.addPrice != null && (() => {
                  const niId = "ni-" + item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  const added = selectedAddOns.includes(niId);
                  return (
                    <button
                      onClick={() => addNotIncluded(item.name, item.addPrice)}
                      style={{
                        whiteSpace: "nowrap",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #1A1A1A",
                        background: added ? "#1A1A1A" : "transparent",
                        fontSize: "12px",
                        cursor: "pointer",
                        color: added ? "#fff" : "#1A1A1A",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {added ? "Remove" : `Add S$${item.addPrice.toLocaleString("en-SG")}`}
                    </button>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>

        {/* Price breakdown */}
        <section>
          <SectionLabel>Price Breakdown</SectionLabel>
          <div style={{ marginTop: "12px" }}>
            <PriceBreakdown
              car={car}
              selectedColor={selectedColor}
              selectedWheels={selectedWheel}
              selectedAddOns={selectedAddOns}
              onRemoveAddOn={removeAddOn}
            />
          </div>
        </section>

        {/* Loan CTA */}
        <button
          onClick={() => setChatOpen(true)}
          style={{
            width: "100%",
            padding: "16px",
            background: "#C8A96E",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          Calculate loan
        </button>
      </div>

      <LoanChatbot
        car={car}
        totalPrice={totalOTR}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#888",
        borderBottom: "1px solid #D5D5D0",
        paddingBottom: "6px",
      }}
    >
      {children}
    </div>
  );
}
