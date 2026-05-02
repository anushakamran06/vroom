"use client";

import { ColorSelector } from "./ColorSelector";
import { WheelSelector } from "./WheelSelector";
import { OptionCard } from "./OptionCard";
import { PriceBreakdown } from "./PriceBreakdown";
import { NotIncludedSection } from "./NotIncludedSection";
import { formatSGD } from "@/lib/utils";
import { buildPriceBreakdown } from "@/lib/pricing";
import type { Car, NotIncludedItem } from "@/data/cars";

interface ConfigPanelProps {
  car: Car;
  selectedColor: string;
  selectedWheel: number;
  selectedAddOns: Set<string>;
  onColorChange: (slug: string) => void;
  onWheelChange: (index: number) => void;
  onAddOnToggle: (id: string) => void;
  onOpenChat: () => void;
}

export function ConfigPanel({
  car,
  selectedColor,
  selectedWheel,
  selectedAddOns,
  onColorChange,
  onWheelChange,
  onAddOnToggle,
  onOpenChat,
}: ConfigPanelProps) {
  const breakdown = buildPriceBreakdown(
    car,
    selectedColor,
    selectedWheel,
    Array.from(selectedAddOns)
  );

  const handleRemoveOption = (id: string) => {
    if (selectedAddOns.has(id)) onAddOnToggle(id);
  };

  const handleNotIncludedAdd = (item: NotIncludedItem) => {
    // Show a simple alert — actual purchase flow would be hooked up to checkout
    alert(`"${item.name}" has been noted. In a full implementation this would add it to your order.`);
  };

  return (
    <div className="h-full flex flex-col bg-[#fafafa]">
      {/* Sticky header */}
      <div className="px-6 pt-8 pb-4 bg-[#fafafa] border-b border-gray-100">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">
          {car.brand}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
          {car.name}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          From {formatSGD(car.basePrice)} · est. total{" "}
          <span className="font-semibold text-gray-700">
            {formatSGD(breakdown.total)}
          </span>
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto config-scroll">
        <div className="px-6 py-6 space-y-8">

          {/* Specs */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Specs
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "Engine", value: car.specs.engine },
                { label: "Power", value: car.specs.power },
                { label: "Torque", value: car.specs.torque },
                { label: "0–100 km/h", value: car.specs.zeroToHundred },
                { label: "Top speed", value: car.specs.topSpeed },
                { label: "Fuel", value: car.specs.fuelType },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-[11px] text-gray-400 uppercase tracking-wide">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-gray-800 mt-0.5">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="border-t border-gray-100" />

          {/* Colour */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Paint colour
            </h2>
            <ColorSelector
              colors={car.colors}
              selected={selectedColor}
              onChange={onColorChange}
            />
          </section>

          <div className="border-t border-gray-100" />

          {/* Wheels */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Wheels
            </h2>
            <WheelSelector
              wheels={car.wheels}
              selected={selectedWheel}
              onChange={onWheelChange}
            />
          </section>

          <div className="border-t border-gray-100" />

          {/* Add-ons */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Options &amp; add-ons
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              All unchecked by default. Every item below must be explicitly selected.
            </p>
            <div className="space-y-3">
              {car.addOns.map((addon) => (
                <OptionCard
                  key={addon.id}
                  addon={addon}
                  selected={selectedAddOns.has(addon.id)}
                  onToggle={() => onAddOnToggle(addon.id)}
                />
              ))}
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Price breakdown */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
              Price breakdown
            </h2>

            {/* Promotions banner */}
            {car.activePromotions.length > 0 && (
              <div className="mb-4 space-y-2">
                {car.activePromotions.map((promo) => (
                  <div
                    key={promo.description}
                    className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3"
                  >
                    <svg
                      className="w-4 h-4 text-green-600 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-green-800">
                        {promo.description}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        Saves {formatSGD(promo.saving)}
                        {promo.expiryDate ? ` · Expires ${promo.expiryDate}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <PriceBreakdown
              lines={breakdown.lines}
              onRemoveOption={handleRemoveOption}
            />
          </section>

          <div className="border-t border-gray-100" />

          {/* Not included */}
          <section>
            <NotIncludedSection
              items={car.notIncluded}
              onAdd={handleNotIncludedAdd}
            />
          </section>

          {/* Calculate loan button */}
          <div className="pb-2">
            <button
              type="button"
              onClick={onOpenChat}
              className="w-full bg-gray-900 text-white rounded-2xl py-4 font-semibold text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Calculate loan · {formatSGD(breakdown.total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
