import Link from "next/link";
import brandsData from "@/data/brands.json";
import type { Brand } from "@/types/car";

export default function HomePage() {
  const brands = brandsData as Brand[];

  return (
    <main
      style={{
        background: "#0A0A0A",
        minHeight: "100vh",
        color: "#E0E0E0",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 48px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          CONFIGURE
          <br />
          YOUR DRIVE
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "#8A8A8A",
            marginTop: "24px",
            marginBottom: "40px",
            maxWidth: "420px",
            lineHeight: 1.6,
          }}
        >
          Singapore&apos;s most transparent car configurator. Real COE estimates,
          honest add-on prices, zero fluff.
        </p>

        <div>
          <Link
            href="/cars"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              border: "1px solid #FFFFFF",
              color: "#FFFFFF",
              background: "transparent",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "6px",
            }}
          >
            Explore Models →
          </Link>
        </div>
      </section>

      {/* Brand grid */}
      <section
        style={{
          padding: "80px 48px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#555",
            marginBottom: "32px",
          }}
        >
          Brands
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/cars?brand=${brand.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="hover-gold"
                style={{
                  background: "#111",
                  border: "1px solid #1E1E1E",
                  borderRadius: "10px",
                  padding: "28px 20px",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#E0E0E0",
                    marginBottom: "4px",
                  }}
                >
                  {brand.name}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {brand.country}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
