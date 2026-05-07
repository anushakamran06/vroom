'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333333' font-size='18' font-family='Inter,sans-serif'%3EImage Coming Soon%3C/text%3E%3C/svg%3E";

const VIEWS = ['Front', 'Rear', 'Side', 'Interior'];

interface Props {
  images: string[];
  alt: string;
}

export default function ImageViewer({ images, alt }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [errored, setErrored] = useState<Set<string>>(new Set());

  function getSrc(src: string) {
    return errored.has(src) ? FALLBACK : src;
  }

  function handleError(src: string) {
    setErrored((prev) => new Set([...prev, src]));
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Main image */}
      <div className="relative flex-1 overflow-hidden">
        <Image
          key={activeIdx}
          src={getSrc(images[activeIdx])}
          alt={`${alt} — ${VIEWS[activeIdx] ?? 'View'}`}
          fill
          className="object-cover"
          unoptimized
          onError={() => handleError(images[activeIdx])}
          priority
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />

        {/* View label */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-xs text-[#8A8A8A] uppercase tracking-widest">
          {VIEWS[activeIdx] ?? 'View'}
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur-sm border border-[#1A1A1A] rounded flex items-center justify-center text-white hover:border-[#C8A96E] transition-colors"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur-sm border border-[#1A1A1A] rounded flex items-center justify-center text-white hover:border-[#C8A96E] transition-colors"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 p-3 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActiveIdx(i)}
            className={`relative flex-1 h-16 overflow-hidden rounded transition-all ${
              i === activeIdx
                ? 'ring-1 ring-[#C8A96E] opacity-100'
                : 'opacity-40 hover:opacity-70'
            }`}
            aria-label={`View ${VIEWS[i] ?? i + 1}`}
          >
            <Image
              src={getSrc(img)}
              alt={VIEWS[i] ?? `View ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
              onError={() => handleError(img)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
