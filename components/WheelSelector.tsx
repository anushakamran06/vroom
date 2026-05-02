"use client";

import { formatSGD } from "@/lib/utils";
import type { CarWheel } from "@/data/cars";

interface WheelSelectorProps {
  wheels: CarWheel[];
  selected: number;
  onChange: (index: number) => void;
}

export function WheelSelector({
  wheels,
  selected,
  onChange,
}: WheelSelectorProps) {
  return (
    <div className="space-y-2">
      {wheels.map((wheel) => (
        <button
          key={wheel.index}
          type="button"
          onClick={() => onChange(wheel.index)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
            selected === wheel.index
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          aria-pressed={selected === wheel.index}
        >
          {/* Wheel thumbnail placeholder — a simple circle */}
          <div
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0"
            style={{
              borderColor: selected === wheel.index ? "#111" : "#d1d5db",
              background:
                "conic-gradient(#888 0deg, #ccc 45deg, #888 90deg, #ccc 135deg, #888 180deg, #ccc 225deg, #888 270deg, #ccc 315deg, #888 360deg)",
            }}
          >
            <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-gray-500" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-gray-900 leading-snug">
              {wheel.name}
            </span>
          </div>

          <span className="text-sm font-semibold text-gray-700 shrink-0">
            {wheel.priceDelta === 0 ? (
              <span className="text-gray-400 font-normal">Standard</span>
            ) : (
              `+${formatSGD(wheel.priceDelta)}`
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
