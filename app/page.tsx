import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-black tracking-tighter">VROOM</span>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <Link href="/cars" className="hover:text-white transition-colors">
            Browse cars
          </Link>
          <Link href="/compare" className="hover:text-white transition-colors">
            Compare
          </Link>
          <Link
            href="/configure/sclass"
            className="hover:text-white transition-colors"
          >
            Configurator
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 pt-28 pb-24">
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase mb-6">
          The car showcase
        </p>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
          Drive your
          <br />
          <span className="text-white/30">dream car.</span>
        </h1>
        <p className="text-white/50 max-w-md text-base leading-relaxed mb-10">
          Browse, compare, and configure cars with full Singapore on-the-road
          pricing — no surprises.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/cars"
            className="bg-white text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            Browse all cars
          </Link>
          <Link
            href="/compare"
            className="border border-white/20 text-white text-sm px-6 py-3 rounded-full hover:border-white/50 transition-colors"
          >
            Compare models
          </Link>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-white/10 px-8 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: "↗",
              title: "360° viewer",
              desc: "Rotate every car in your browser — no app needed.",
            },
            {
              icon: "S$",
              title: "Transparent pricing",
              desc: "See exactly what you pay: base, COE, ARF, every fee.",
            },
            {
              icon: "⇄",
              title: "Side-by-side compare",
              desc: "Pick two cars and see every spec lined up together.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="space-y-2">
              <span className="text-2xl text-white/30">{icon}</span>
              <p className="font-semibold text-white">{title}</p>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-xs text-white/20">
        VROOM · Demo project · Prices are estimates
      </footer>
    </main>
  );
}
