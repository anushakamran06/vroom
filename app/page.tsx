import Link from "next/link";
import { cars } from "@/data/cars";
import { formatSGD } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="px-8 pt-10 pb-6 flex items-end justify-between border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">VROOM</h1>
          <p className="text-white/40 text-sm mt-1 tracking-wide">
            Car configurator · Singapore pricing
          </p>
        </div>
        <p className="text-xs text-white/30 hidden md:block">
          All prices estimated · COE subject to bidding
        </p>
      </header>

      {/* Hero line */}
      <div className="px-8 py-12">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white/90">
          Configure your
          <br />
          <span className="text-white/30">perfect car.</span>
        </h2>
        <p className="mt-6 text-white/50 max-w-lg text-sm leading-relaxed">
          See exactly what you&rsquo;re paying and why — every fee, every
          discount, no surprises. Transparent Singapore on-the-road pricing on
          every model.
        </p>
      </div>

      {/* Car grid */}
      <div className="px-8 pb-16">
        <p className="text-xs tracking-widest text-white/30 uppercase mb-6">
          Select a model
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cars.map((car) => {
            const totalEst =
              car.basePrice +
              car.sgFees.coeEstimate +
              car.sgFees.arf +
              car.sgFees.registrationFee +
              car.sgFees.annualRoadTax;

            // Use the car's first color for the card accent
            const accentHex = car.colors[0].hex;

            return (
              <Link
                key={car.slug}
                href={`/configure/${car.slug}`}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all overflow-hidden p-6 flex flex-col"
              >
                {/* Colour accent glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 50% 120%, ${accentHex}33 0%, transparent 65%)`,
                  }}
                />

                {/* Car silhouette placeholder */}
                <div
                  className="relative w-full aspect-[16/9] rounded-xl mb-5 overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: `${accentHex}18` }}
                >
                  {/* Simple SVG car icon */}
                  <svg
                    viewBox="0 0 80 40"
                    className="w-2/3 opacity-60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="5" y="18" width="70" height="14"
                      rx="6"
                      fill={accentHex}
                      opacity="0.8"
                    />
                    <rect
                      x="18" y="10" width="36" height="14"
                      rx="5"
                      fill={accentHex}
                      opacity="0.6"
                    />
                    <circle cx="17" cy="32" r="6" fill="#111" stroke={accentHex} strokeWidth="1.5" />
                    <circle cx="63" cy="32" r="6" fill="#111" stroke={accentHex} strokeWidth="1.5" />
                    <circle cx="17" cy="32" r="2.5" fill={accentHex} opacity="0.5" />
                    <circle cx="63" cy="32" r="2.5" fill={accentHex} opacity="0.5" />
                  </svg>
                </div>

                <div className="relative">
                  <p className="text-xs text-white/40 mb-0.5 tracking-widest uppercase">
                    {car.brand}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-white leading-tight">
                    {car.name}
                  </h3>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-white/40">From</span>
                      <span className="text-sm font-semibold text-white/80">
                        {formatSGD(car.basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-white/30">Est. on-the-road</span>
                      <span className="text-xs text-white/50">
                        {formatSGD(totalEst)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {car.colors.slice(0, 4).map((c) => (
                      <span
                        key={c.slug}
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 relative flex items-center gap-1.5 text-xs text-white/40 group-hover:text-white/70 transition-colors">
                  <span>Configure</span>
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-6 text-white/20 text-xs">
        <p>
          All prices are estimates based on publicly available data and are
          labelled accordingly. COE figures are indicative and subject to LTA
          bidding results. This is a demo configurator — no transactions are
          processed.
        </p>
      </footer>
    </div>
  );
}
