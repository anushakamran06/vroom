import Link from "next/link";

export const metadata = {
  title: "Browse Cars — VROOM",
};

export default function CarsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-black tracking-tighter">
          VROOM
        </Link>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <span className="text-white">Browse cars</span>
          <Link href="/compare" className="hover:text-white transition-colors">
            Compare
          </Link>
        </div>
      </nav>

      <div className="px-8 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter mb-2">All cars</h1>
        <p className="text-white/40 text-sm mb-10">
          Car data loads here in Step 7. Routing is wired up and ready.
        </p>

        {/* Placeholder grid — will be replaced with real data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { brand: "mercedes-benz", model: "s-class", label: "Mercedes-Benz S-Class" },
            { brand: "mercedes-benz", model: "g-class", label: "Mercedes-Benz G-Class" },
            { brand: "mercedes-benz", model: "amg-gt", label: "Mercedes-Benz AMG GT" },
          ].map((car) => (
            <Link
              key={car.model}
              href={`/cars/${car.brand}/${car.model}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all p-6"
            >
              {/* Placeholder image area */}
              <div className="aspect-[16/9] rounded-xl bg-white/5 flex items-center justify-center mb-5">
                <span className="text-white/20 text-sm">3D viewer goes here</span>
              </div>
              <p className="text-xs text-white/40 tracking-widest uppercase mb-1">
                {car.brand}
              </p>
              <p className="font-bold text-white group-hover:text-white/80 transition-colors">
                {car.label}
              </p>
              <p className="mt-3 text-xs text-white/40 group-hover:text-white/60 transition-colors flex items-center gap-1">
                View car <span>→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
