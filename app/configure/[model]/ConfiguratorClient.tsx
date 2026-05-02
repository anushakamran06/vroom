"use client";

import { useState } from "react";
import Link from "next/link";
import { Viewer360 } from "@/components/Viewer360";
import { ConfigPanel } from "@/components/ConfigPanel";
import { LoanChatbot } from "@/components/LoanChatbot";
import { buildPriceBreakdown } from "@/lib/pricing";
import type { Car } from "@/data/cars";

interface ConfiguratorClientProps {
  car: Car;
}

export function ConfiguratorClient({ car }: ConfiguratorClientProps) {
  const [selectedColor, setSelectedColor] = useState(car.colors[0].slug);
  const [selectedWheel, setSelectedWheel] = useState(car.wheels[0].index);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [chatOpen, setChatOpen] = useState(false);

  const currentColorObj =
    car.colors.find((c) => c.slug === selectedColor) ?? car.colors[0];

  const priceBreakdown = buildPriceBreakdown(
    car,
    selectedColor,
    selectedWheel,
    Array.from(selectedAddOns)
  );

  const handleAddOnToggle = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative h-screen flex flex-col md:flex-row overflow-hidden bg-[#0a0a0a]">
      {/* Back link */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All models
      </Link>

      {/* LEFT — 360° viewer (65% on desktop, full width + fixed height on mobile) */}
      <div className="w-full h-[55vw] md:h-full md:w-[65%] shrink-0">
        <Viewer360
          model={car.slug}
          colorSlug={selectedColor}
          colorHex={currentColorObj.hex}
          wheelIndex={selectedWheel}
        />
      </div>

      {/* RIGHT — config panel (35% on desktop, full remaining on mobile) */}
      <div className="flex-1 min-h-0 md:w-[35%] overflow-hidden border-l border-white/5">
        <ConfigPanel
          car={car}
          selectedColor={selectedColor}
          selectedWheel={selectedWheel}
          selectedAddOns={selectedAddOns}
          onColorChange={setSelectedColor}
          onWheelChange={setSelectedWheel}
          onAddOnToggle={handleAddOnToggle}
          onOpenChat={() => setChatOpen(true)}
        />
      </div>

      {/* Loan chatbot overlay */}
      {chatOpen && (
        <LoanChatbot
          car={car}
          priceBreakdown={priceBreakdown}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
