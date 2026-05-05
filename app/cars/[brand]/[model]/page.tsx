import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import carsData from "@/data/cars.json";
import type { Car } from "@/types/car";

// CarViewer uses WebGL — must be client-only, no SSR
const CarViewer = dynamic(() => import("@/components/CarViewer"), { ssr: false });

const cars = carsData.filter(Boolean) as Car[];

export function generateStaticParams() {
  return cars.map((car) => ({
    brand: car.brand,
    model: car.slug,
  }));
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = await params;
  const car = cars.find((c) => c.brand === brand && c.slug === model);
  if (!car) notFound();

  const specRows = [
    { label: "Engine",       value: car.specs.engine },
    { label: "Power",        value: `${car.specs.horsepower} hp` },
    { label: "Torque",       value: car.specs.torque },
    { label: "0–100 km/h",   value: car.specs["0_to_100_kph"] },
    { label: "Top Speed",    value: car.specs.top_speed },
    { label: "Transmission", value: car.specs.transmission },
    { label: "Drivetrain",   value: car.specs.drivetrain },
  ];

  return (
    <div style={{ background: "var(--brand-bg)" }}>
      <div className="car-detail-layout">
        {/* Left 60% — 3D viewer */}
        <div className="car-viewer-pane">
          <CarViewer />
        </div>

        {/* Right 40% — specs panel */}
        <div className="specs-pane">
          {/* Category badge */}
          <div style={{ marginBottom: "0.75rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.65rem",
                fontFamily: "var(--brand-font-mono)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: car.category === "amg" ? "var(--brand-accent)" : "transparent",
                color: car.category === "amg" ? "#000000" : "var(--brand-secondary)",
                border: car.category === "amg" ? "none" : "1px solid var(--brand-secondary)",
              }}
            >
              {car.category === "amg" ? "AMG" : "Standard"}
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              color: "var(--brand-primary)",
              fontFamily: "var(--brand-font-heading)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            {car.model}
          </h1>

          {/* Price */}
          <p
            style={{
              color: "var(--brand-accent)",
              fontFamily: "var(--brand-font-mono)",
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "2rem",
            }}
          >
            S${car.price_sgd.toLocaleString()}
          </p>

          {/* Specs grid */}
          <div style={{ borderTop: "1px solid var(--brand-border)" }}>
            {specRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--brand-border)",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "var(--brand-secondary)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    color: "var(--brand-primary)",
                    fontFamily: "var(--brand-font-mono)",
                    fontSize: "0.95rem",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="cta-btn"
            style={{
              marginTop: "2rem",
              width: "100%",
              padding: "1rem",
              background: "transparent",
              color: "var(--brand-primary)",
              border: "1px solid var(--brand-primary)",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "var(--brand-font-heading)",
              fontWeight: 500,
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Configure Your {car.model}
          </button>
        </div>
      </div>
    </div>
  );
}
