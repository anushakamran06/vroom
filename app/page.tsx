import Link from 'next/link';
import Image from 'next/image';

export default function HeroPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] flex flex-col">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Mercedes-Benz hero"
          fill
          className="object-cover opacity-40"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/20 to-[#0A0A0A]/80" />
      </div>

      {/* Top nav */}
      <nav className="relative z-10 flex justify-end px-8 py-6">
        <Link
          href="/classes"
          className="text-xs text-[#8A8A8A] hover:text-white transition-colors uppercase tracking-widest"
        >
          Compare
        </Link>
      </nav>

      {/* Centred hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-xs text-[#8A8A8A] uppercase tracking-[0.5em] mb-6 font-medium">
          Mercedes-Benz · Singapore
        </p>

        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white"
          style={{ letterSpacing: '0.3em' }}
        >
          VROOM
        </h1>

        <p
          className="mt-4 text-[0.8rem] text-[#8A8A8A] font-medium"
          style={{ fontVariant: 'small-caps', letterSpacing: '0.12em' }}
        >
          The Real Cost of Owning a Mercedes in Singapore
        </p>

        <Link
          href="/classes"
          className="mt-10 inline-block border border-white text-white text-sm uppercase tracking-[0.25em] px-8 py-3.5 transition-all duration-200 hover:bg-white hover:text-black"
        >
          Explore Models →
        </Link>
      </div>

      {/* Bottom dots */}
      <div className="relative z-10 pb-8 flex justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-[#8A8A8A]"
              style={{ opacity: i === 0 ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
