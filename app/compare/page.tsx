import Link from "next/link";

export const metadata = {
  title: "Compare Cars — VROOM",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-black tracking-tighter">
          VROOM
        </Link>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <Link href="/cars" className="hover:text-white transition-colors">
            Browse cars
          </Link>
          <span className="text-white">Compare</span>
        </div>
      </nav>

      <div className="px-8 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          Compare cars
        </h1>
        <p className="text-white/40 text-sm mb-12">
          Pick two cars to see their specs side by side.
        </p>

        {/* Two-column compare grid */}
        <div className="grid grid-cols-2 gap-6">
          {["Car A", "Car B"].map((slot) => (
            <div
              key={slot}
              className="rounded-2xl border-2 border-dashed border-white/10 p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] hover:border-white/20 transition-colors"
            >
              <span className="text-white/20 text-4xl">+</span>
              <p className="text-white/30 text-sm font-medium">{slot}</p>
              <Link
                href="/cars"
                className="text-xs text-white/40 border border-white/10 rounded-full px-4 py-2 hover:border-white/30 hover:text-white/70 transition-all"
              >
                Select a car
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison table placeholder */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/40 font-medium w-1/3">Spec</th>
                <th className="text-center p-4 text-white/40 font-medium">Car A</th>
                <th className="text-center p-4 text-white/40 font-medium">Car B</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Engine",
                "Horsepower",
                "Torque",
                "0–100 km/h",
                "Top speed",
                "Price (est.)",
              ].map((spec, i) => (
                <tr
                  key={spec}
                  className={`border-b border-white/5 last:border-0 ${
                    i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                  }`}
                >
                  <td className="p-4 text-white/50">{spec}</td>
                  <td className="p-4 text-center text-white/20">—</td>
                  <td className="p-4 text-center text-white/20">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-white/20 text-center">
          Selection logic and real data connect in a later step.
        </p>
      </div>
    </main>
  );
}
