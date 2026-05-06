"use client";

import { useState } from "react";
import Link from "next/link";
import carsData from "@/data/cars.json";
import type { Car } from "@/types/car";
import ModConfigurator from "@/components/ModConfigurator";

const eClassCars = (carsData as Car[]).filter((c) => c.customRoute === "/e-class");

export default function EClassPage() {
  const [currentImageSlug, setCurrentImageSlug] = useState("");

  return (
    <>
      <style>{`
        .ec-layout { display: flex; flex-direction: row; height: 100vh; background: #0A0A0A; overflow: hidden; }
        .ec-left { width: 55%; flex-shrink: 0; position: sticky; top: 0; height: 100vh; background: #141414; display: flex; align-items: center; justify-content: center; border-right: 1px solid #2A2A2A; overflow: hidden; }
        .ec-right { flex: 1; overflow-y: auto; padding: 32px 28px 48px; display: flex; flex-direction: column; gap: 4px; }
        @media (max-width: 768px) {
          .ec-layout { flex-direction: column; height: auto; overflow: visible; }
          .ec-left { width: 100%; height: 40vh; position: relative; }
          .ec-right { overflow-y: visible; }
        }
      `}</style>

      <div className="ec-layout">
        {/* Left panel */}
        <div className="ec-left">
          <div style={{ textAlign: "center", userSelect: "none" }}>
            <div
              style={{
                fontSize: "clamp(1rem, 2vw, 1.4rem)",
                color: "#8A8A8A",
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 300,
                letterSpacing: "0.06em",
              }}
            >
              {currentImageSlug
                ? currentImageSlug.replace(/-/g, " ").toUpperCase()
                : "E-CLASS"}
            </div>
            {currentImageSlug && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  color: "#2A2A2A",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  letterSpacing: "0.1em",
                }}
              >
                /images/e-class-{currentImageSlug}.jpg
              </div>
            )}
          </div>

          {/* VROOM watermark */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "24px",
              fontSize: "11px",
              color: "#8A8A8A",
              opacity: 0.5,
              letterSpacing: "0.2em",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 800,
            }}
          >
            VROOM
          </div>
        </div>

        {/* Right panel */}
        <div className="ec-right">
          <div style={{ marginBottom: "8px" }}>
            <Link
              href="/cars"
              style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}
            >
              ← All Models
            </Link>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "Inter, system-ui, sans-serif",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              E-Class
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "#C8A96E",
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 500,
                marginTop: "6px",
              }}
            >
              Configure
            </div>
          </div>

          <ModConfigurator
            cars={eClassCars}
            onModSelect={setCurrentImageSlug}
          />
        </div>
      </div>
    </>
  );
}
