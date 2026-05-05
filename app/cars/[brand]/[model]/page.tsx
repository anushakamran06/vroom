import Link from "next/link";

interface Props {
  params: Promise<{ brand: string; model: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { brand, model } = await params;
  return {
    title: `${brand} ${model} — VROOM`,
  };
}

export default async function CarPage({ params }: Props) {
  const { brand, model } = await params;

  // Pretty-print the URL slugs for display (e.g. "mercedes-benz" → "Mercedes-Benz")
  const displayBrand = brand
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
  const displayModel = model
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-black tracking-tighter">
          VROOM
        </Link>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <Link href="/cars" className="hover:text-white transition-colors">
            ← Back to all cars
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <p className="text-xs text-white/30 mb-6">
          <Link href="/cars" className="hover:text-white/60">Cars</Link>
          <span className="mx-2">/</span>
          <Link href={`/cars/${brand}`} className="hover:text-white/60">{displayBrand}</Link>
          <span className="mx-2">/</span>
          <span className="text-white/60">{displayModel}</span>
        </p>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT — 3D viewer placeholder (CarViewer component goes here in Step 6) */}
          <div className="flex-1">
            <div className="aspect-[4/3] rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-3">
              <span className="text-white/20 text-4xl">◻</span>
              <span className="text-white/20 text-sm">
                3D viewer — Step 6
              </span>
            </div>
          </div>

          {/* RIGHT — specs panel (real data loads in Step 7) */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div>
              <p className="text-xs tracking-widest text-white/40 uppercase mb-1">
                {displayBrand}
              </p>
              <h1 className="text-3xl font-black tracking-tight">
                {displayModel}
              </h1>
            </div>

            {/* Placeholder specs — replaced with real data in Step 7 */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
                Specs
              </p>
              {[
                ["Engine", "—"],
                ["Horsepower", "—"],
                ["Torque", "—"],
                ["0–100 km/h", "—"],
                ["Top speed", "—"],
                ["Price (est.)", "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className="text-sm font-medium text-white/70">{value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-white/20 leading-relaxed">
              Real specs load in Step 7 once cars.json is wired up.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
