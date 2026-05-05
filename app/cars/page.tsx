import Link from "next/link";
import carsData from "@/data/cars.json";
import type { Car } from "@/types/car";

const cars = carsData.filter(Boolean) as Car[];

export default function CarsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--brand-bg)", padding: "4rem 2rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            color: "var(--brand-primary)",
            fontFamily: "var(--brand-font-heading)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          ALL MODELS
        </h1>
        <p
          style={{
            color: "var(--brand-secondary)",
            marginTop: "0.75rem",
            fontSize: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          Mercedes-Benz lineup
        </p>
      </div>

      <div
        className="slideshow"
        style={{
          display: "flex",
          gap: "1.5rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingBottom: "1rem",
        }}
      >
        {cars.map((car) => (
          <Link
            key={car.id}
            href={`/cars/${car.brand}/${car.slug}`}
            style={{ flex: "0 0 320px", scrollSnapAlign: "start", textDecoration: "none" }}
          >
            <div
              className="car-card"
              style={{
                background: "var(--brand-surface)",
                border: "1px solid var(--brand-border)",
                borderRadius: "4px",
                padding: "1.5rem",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    color: "var(--brand-secondary)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  {car.type}
                </span>
                <h2
                  style={{
                    color: "var(--brand-primary)",
                    fontFamily: "var(--brand-font-heading)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {car.model}
                </h2>
              </div>
              <div>
                <p
                  style={{
                    color: "var(--brand-secondary)",
                    fontFamily: "var(--brand-font-mono)",
                    fontSize: "0.8rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  {car.specs.horsepower} hp
                </p>
                <p
                  style={{
                    color: "var(--brand-accent)",
                    fontFamily: "var(--brand-font-mono)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  S${car.price_sgd.toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
