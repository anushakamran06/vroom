import Link from "next/link";
import carsData from "@/data/cars.json";
import type { Car } from "@/types/car";

interface PageProps {
  searchParams: Promise<{ brand?: string }>;
}

export default async function CarsPage({ searchParams }: PageProps) {
  const { brand } = await searchParams;
  const cars = (carsData as Car[]).filter((c) =>
    brand ? c.brandSlug === brand : true
  );

  const brands = Array.from(new Set((carsData as Car[]).map((c) => c.brandSlug)));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#E0E0E0",
        padding: "40px 48px",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <Link href="/" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          ← Home
        </Link>
      </div>

      <h1
        style={{
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          marginBottom: "32px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {brand
          ? `${(carsData as Car[]).find((c) => c.brandSlug === brand)?.brand ?? brand} Models`
          : "All Models"}
      </h1>

      {/* Brand filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
        <Link
          href="/cars"
          style={{
            padding: "6px 16px",
            borderRadius: "999px",
            border: "1px solid",
            borderColor: !brand ? "#C8A96E" : "#333",
            color: !brand ? "#C8A96E" : "#666",
            textDecoration: "none",
            fontSize: "13px",
          }}
        >
          All
        </Link>
        {brands.map((b) => (
          <Link
            key={b}
            href={`/cars?brand=${b}`}
            style={{
              padding: "6px 16px",
              borderRadius: "999px",
              border: "1px solid",
              borderColor: brand === b ? "#C8A96E" : "#333",
              color: brand === b ? "#C8A96E" : "#666",
              textDecoration: "none",
              fontSize: "13px",
            }}
          >
            {(carsData as Car[]).find((c) => c.brandSlug === b)?.brand ?? b}
          </Link>
        ))}
      </div>

      {/* Car grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {cars.map((car) => (
          <Link
            key={car.id}
            href={`/cars/${car.brandSlug}/${car.modelSlug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#111",
                border: "1px solid #1E1E1E",
                borderRadius: "12px",
                padding: "28px 24px",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#C8A96E")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#1E1E1E")
              }
            >
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  background: "#1A1A1A",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2A2A2A",
                  fontSize: "12px",
                }}
              >
                {car.brand} {car.model}
              </div>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
                {car.brand} · {car.year}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#E0E0E0",
                  letterSpacing: "-0.02em",
                }}
              >
                {car.model}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#C8A96E",
                  marginTop: "8px",
                }}
              >
                From S${car.basePrice.toLocaleString("en-SG")}
              </div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
                {car.specs.engine} · {car.specs.power}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {cars.length === 0 && (
        <div style={{ color: "#555", fontSize: "14px", marginTop: "40px" }}>
          No models found for this brand.
        </div>
      )}
    </div>
  );
}
