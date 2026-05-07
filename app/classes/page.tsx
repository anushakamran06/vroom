import Link from 'next/link';
import Image from 'next/image';

const CLASSES = [
  {
    slug: 'saloon',
    label: 'SALOON',
    model: 'Mercedes-Benz E-Class Saloon',
    from: 'From S$392,888',
    image: '/images/saloon-class-hero.jpg',
  },
  {
    slug: 'coupe',
    label: 'COUPÉ',
    model: 'Mercedes-Benz CLE 200 Coupé',
    from: 'From S$363,888',
    image: '/images/coupe-class-hero.jpg',
  },
  {
    slug: 'ultra-luxury',
    label: 'ULTRA-LUXURY',
    model: 'Mercedes-Maybach S-Class Saloon',
    from: 'From S$1,236,888',
    image: '/images/ultra-luxury-class-hero.jpg',
  },
];

export default function ClassesPage() {
  return (
    <main className="flex flex-col md:flex-row h-screen bg-[#0A0A0A]">
      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 text-xs text-[#8A8A8A] hover:text-white transition-colors uppercase tracking-widest"
      >
        ← VROOM
      </Link>

      {CLASSES.map((cls) => (
        <Link
          key={cls.slug}
          href={`/classes/${cls.slug}`}
          className="group relative flex-1 h-[60vh] md:h-screen overflow-hidden"
        >
          {/* Background image */}
          <Image
            src={cls.image}
            alt={cls.model}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />

          {/* Base overlay */}
          <div className="absolute inset-0 bg-black/45 transition-colors duration-300 group-hover:bg-black/62" />

          {/* Gold border on hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A96E] transition-all duration-300 pointer-events-none" />

          {/* Vertical divider between cards */}
          <div className="absolute inset-y-0 right-0 w-px bg-[#1A1A1A] hidden md:block" />

          {/* Arrow icon — appears on hover */}
          <div className="absolute bottom-6 right-6 w-8 h-8 flex items-center justify-center border border-[#C8A96E] text-[#C8A96E] text-base opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            →
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-0 left-0 right-0 px-7 py-8 bg-gradient-to-t from-black/80 to-transparent">
            <p
              className="text-white font-black text-[1.2rem] tracking-[0.2em] uppercase"
            >
              {cls.label}
            </p>
            <p className="text-[#C8A96E] text-sm mt-1 font-medium">{cls.model}</p>
            <p className="text-[#8A8A8A] text-xs mt-1">{cls.from}</p>
          </div>
        </Link>
      ))}
    </main>
  );
}
