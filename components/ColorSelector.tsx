"use client";

import { useState } from "react";
import { formatSGD } from "@/lib/utils";
import type { CarColor } from "@/data/cars";

interface ColorSelectorProps {
  colors: CarColor[];
  selected: string;
  onChange: (slug: string) => void;
}

export function ColorSelector({
  colors,
  selected,
  onChange,
}: ColorSelectorProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const activeColor = colors.find((c) => c.slug === selected);
  const displayColor = hovered ? colors.find((c) => c.slug === hovered) : activeColor;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-900">
          {displayColor?.name ?? "Select colour"}
        </span>
        {displayColor && displayColor.priceDelta > 0 && (
          <span className="text-xs text-gray-500">
            +{formatSGD(displayColor.priceDelta)}
          </span>
        )}
        {displayColor && displayColor.priceDelta === 0 && (
          <span className="text-xs text-gray-400">Included</span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.slug}
            type="button"
            title={color.name}
            onClick={() => onChange(color.slug)}
            onMouseEnter={() => setHovered(color.slug)}
            onMouseLeave={() => setHovered(null)}
            className={`relative w-9 h-9 rounded-full transition-all focus:outline-none ${
              selected === color.slug
                ? "ring-2 ring-offset-2 ring-gray-900"
                : "ring-1 ring-offset-1 ring-transparent hover:ring-gray-300"
            }`}
            style={{ backgroundColor: color.hex }}
            aria-pressed={selected === color.slug}
            aria-label={color.name}
          >
            {/* White/light colour border so it's visible */}
            {color.hex.toLowerCase() === "#f4f4f0" ||
            color.hex.toLowerCase() === "#f2f2ed" ||
            color.hex.toLowerCase() === "#ebebeb" ||
            color.hex.toLowerCase() === "#eef0ec" ||
            color.hex.toLowerCase() === "#f0eee8" ||
            color.hex.toLowerCase() === "#f0ede8" ||
            color.hex.toLowerCase() === "#f0eff0" ? (
              <span className="absolute inset-0 rounded-full border border-gray-200" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
