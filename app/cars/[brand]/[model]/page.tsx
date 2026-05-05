import { notFound } from "next/navigation";
import Link from "next/link";
import carsData from "@/data/cars.json";
import type { Car } from "@/types/car";
import ConfigPanel from "@/components/ConfigPanel";

interface PageProps {
  params: Promise<{ brand: string; model: string }>;
}

export async function generateStaticParams() {
  return (carsData as Car[]).map((car) => ({
    brand: car.brandSlug,
    model: car.modelSlug,
  }));
}

export default async function CarModelPage({ params }: PageProps) {
  const { brand, model } = await params;
  const car = (carsData as Car[]).find(
    (c) => c.brandSlug === brand && c.modelSlug === model
  );

  if (!car) notFound();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 420px",
        height: "100vh",
        background: "#0A0A0A",
        overflow: "hidden",
      }}
    >
      {/* Left — 3D viewer placeholder */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          fontSize: "14px",
          borderRight: "1px solid #1E1E1E",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              border: "1px solid #222",
              borderRadius: "8px",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontSize: "12px",
            }}
          >
            3D View
          </div>
          <div style={{ color: "#2A2A2A" }}>{car.brand} {car.model}</div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            color: "#555",
            fontSize: "13px",
          }}
        >
          <Link href="/cars" style={{ color: "#555", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
      </div>

      {/* Right — config panel */}
      <ConfigPanel car={car} />
    </div>
  );
}
