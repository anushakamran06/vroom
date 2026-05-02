"use client";

import { formatSGD } from "@/lib/utils";
import type { NotIncludedItem } from "@/data/cars";

interface NotIncludedSectionProps {
  items: NotIncludedItem[];
  onAdd?: (item: NotIncludedItem) => void;
}

export function NotIncludedSection({
  items,
  onAdd,
}: NotIncludedSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        What&rsquo;s NOT included
      </h3>
      <p className="text-xs text-gray-400 mb-3">
        Commonly expected items that don&rsquo;t come with this car.
      </p>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-0"
          >
            <div className="flex-1 min-w-0">
              <span className="block text-sm text-gray-700 font-medium">
                {item.name} —{" "}
                <span className="font-normal text-gray-500 italic">
                  not included
                </span>
              </span>
              <span className="block text-xs text-gray-400 mt-0.5">
                {item.description}
              </span>
            </div>

            {item.addPrice != null && (
              <button
                type="button"
                onClick={() => onAdd?.(item)}
                className="shrink-0 text-xs font-medium text-gray-900 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all whitespace-nowrap"
              >
                Add {formatSGD(item.addPrice)}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
