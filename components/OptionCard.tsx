"use client";

import { formatSGD } from "@/lib/utils";
import type { CarAddOn } from "@/data/cars";

interface OptionCardProps {
  addon: CarAddOn;
  selected: boolean;
  onToggle: () => void;
}

export function OptionCard({ addon, selected, onToggle }: OptionCardProps) {
  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all cursor-pointer select-none ${
        selected
          ? "border-gray-900 bg-gray-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-900">
              {addon.name}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            {addon.plainDescription}
          </p>
          {addon.replacesWhat && (
            <p className="mt-1 text-[11px] text-gray-400">
              Replaces: {addon.replacesWhat}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-sm font-semibold text-gray-900">
            +{formatSGD(addon.priceDelta)}
          </span>
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              selected
                ? "bg-gray-900 border-gray-900"
                : "bg-white border-gray-300"
            }`}
          >
            {selected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
