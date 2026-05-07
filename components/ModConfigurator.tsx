'use client';

import { Car, Mod } from '@/types';

interface Props {
  car: Car;
  selectedMods: Set<string>;
  onToggle: (modId: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  exterior: 'Exterior',
  interior: 'Interior',
  performance: 'Performance',
};

export default function ModConfigurator({ car, selectedMods, onToggle }: Props) {
  const categories = [...new Set(car.mods.map((m) => m.category))];
  const selectedCount = selectedMods.size;
  const totalDelta = car.mods
    .filter((m) => selectedMods.has(m.id))
    .reduce((sum, m) => sum + m.priceDelta, 0);

  return (
    <div className="space-y-6">
      {selectedCount > 0 && (
        <div className="flex justify-between items-center text-sm bg-[#111111] border border-[#1A1A1A] rounded-lg px-4 py-2.5">
          <span className="text-[#8A8A8A]">
            {selectedCount} modification{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <span className="text-[#C8A96E] font-medium">
            +S${totalDelta.toLocaleString('en-SG')}
          </span>
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-3">
            {CATEGORY_LABELS[cat] ?? cat}
          </p>
          <div className="space-y-2">
            {car.mods
              .filter((m) => m.category === cat)
              .map((mod) => (
                <ModCard
                  key={mod.id}
                  mod={mod}
                  selected={selectedMods.has(mod.id)}
                  onToggle={() => onToggle(mod.id)}
                />
              ))}
          </div>
        </div>
      ))}

      {car.mods.length === 0 && (
        <p className="text-[#8A8A8A] text-sm text-center py-8">
          No modifications available for this model.
        </p>
      )}
    </div>
  );
}

function ModCard({
  mod,
  selected,
  onToggle,
}: {
  mod: Mod;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-lg border p-4 transition-all duration-200 ${
        selected
          ? 'border-[#C8A96E] bg-[#C8A96E]/5'
          : 'border-[#1A1A1A] bg-[#111111] hover:border-[#333]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${selected ? 'text-[#C8A96E]' : 'text-white'}`}
            >
              {mod.name}
            </span>
            {mod.ltaCompliant && (
              <span className="text-[10px] text-[#8A8A8A] border border-[#1A1A1A] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                LTA OK
              </span>
            )}
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1 leading-relaxed">{mod.description}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-sm font-semibold ${selected ? 'text-[#C8A96E]' : 'text-white'}`}>
            +S${mod.priceDelta.toLocaleString('en-SG')}
          </p>
          <div
            className={`mt-2 w-5 h-5 rounded border flex items-center justify-center ml-auto transition-all ${
              selected ? 'bg-[#C8A96E] border-[#C8A96E]' : 'border-[#333] bg-transparent'
            }`}
          >
            {selected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="#0A0A0A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
