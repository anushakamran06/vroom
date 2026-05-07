'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageViewer from './ImageViewer';
import PriceBreakdown from './PriceBreakdown';
import ModConfigurator from './ModConfigurator';
import LoanCalculator from './LoanCalculator';
import WorkshopModal from './WorkshopModal';
import { Car } from '@/types';

type Tab = 'overview' | 'modifications' | 'finance';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'modifications', label: 'Modifications' },
  { id: 'finance', label: 'Finance' },
];

interface Props {
  car: Car;
  isMaybach?: boolean;
}

export default function CarConfiguratorPage({ car, isMaybach }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState(car.variants[0].id);
  const [selectedMods, setSelectedMods] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [workshopOpen, setWorkshopOpen] = useState(false);

  const variant = car.variants.find((v) => v.id === selectedVariantId) ?? car.variants[0];
  const modsTotal = car.mods
    .filter((m) => selectedMods.has(m.id))
    .reduce((sum, m) => sum + m.priceDelta, 0);
  const vehiclePrice = variant.basePrice + modsTotal + car.sgFees.coe + car.sgFees.arf;

  function toggleMod(modId: string) {
    setSelectedMods((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) { next.delete(modId); } else { next.add(modId); }
      return next;
    });
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Left — Image Viewer */}
      <div className="hidden md:flex flex-col w-3/5 border-r border-[#1A1A1A]">
        <ImageViewer images={car.images} alt={car.fullName} />
      </div>

      {/* Right — Configuration Panel */}
      <div className="flex flex-col w-full md:w-2/5 overflow-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A1A1A] shrink-0">
          <Link
            href="/classes"
            className="text-xs text-[#8A8A8A] hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>←</span> Back to Classes
          </Link>
          <button
            onClick={() => setWorkshopOpen(true)}
            className="text-xs text-[#C8A96E] border border-[#C8A96E]/30 px-3 py-1.5 rounded hover:bg-[#C8A96E]/10 transition-colors uppercase tracking-wider"
          >
            Find Workshops
          </button>
        </div>

        {/* Car Identity */}
        <div className="px-5 pt-4 pb-3 border-b border-[#1A1A1A] shrink-0">
          <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-0.5">
            Mercedes-{isMaybach ? 'Maybach' : 'Benz'}
          </p>
          <h1 className="text-lg font-bold text-white leading-tight">{car.name}</h1>
          <p className="text-sm text-[#C8A96E] font-medium mt-0.5">
            From S${variant.basePrice.toLocaleString('en-SG')}
          </p>
        </div>

        {/* Variant Selector — only if more than one variant */}
        {car.variants.length > 1 && (
          <div className="px-5 py-3 border-b border-[#1A1A1A] shrink-0">
            <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Select Variant</p>
            <div className="flex flex-col gap-1.5">
              {car.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`flex justify-between items-center px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    selectedVariantId === v.id
                      ? 'border-[#C8A96E] bg-[#C8A96E]/5 text-[#C8A96E]'
                      : 'border-[#1A1A1A] text-[#8A8A8A] hover:border-[#333] hover:text-white'
                  }`}
                >
                  <span className="font-medium">{v.name}</span>
                  <span className="text-xs font-normal">
                    S${v.basePrice.toLocaleString('en-SG')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#1A1A1A] shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#C8A96E] border-[#C8A96E]'
                  : 'text-[#8A8A8A] border-transparent hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Specs Grid */}
              <div>
                <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-3">
                  Specifications
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Engine', value: variant.engine },
                    { label: 'Power', value: variant.power },
                    { label: 'Torque', value: variant.torque },
                    { label: '0–100 km/h', value: variant.zeroToHundred },
                    { label: 'Top Speed', value: variant.topSpeed },
                    { label: 'Transmission', value: variant.transmission },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-[#111111] border border-[#1A1A1A] rounded-lg px-3 py-2.5"
                    >
                      <p className="text-[10px] text-[#555] uppercase tracking-wider">{label}</p>
                      <p className="text-sm text-white font-medium mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#1A1A1A]" />

              <PriceBreakdown car={car} variant={variant} selectedMods={selectedMods} />
            </div>
          )}

          {activeTab === 'modifications' && (
            <ModConfigurator car={car} selectedMods={selectedMods} onToggle={toggleMod} />
          )}

          {activeTab === 'finance' && (
            <LoanCalculator vehiclePrice={vehiclePrice} isMaybach={isMaybach} />
          )}
        </div>

        {/* Mobile image strip */}
        <div className="md:hidden border-t border-[#1A1A1A] shrink-0 h-28">
          <ImageViewer images={car.images} alt={car.fullName} />
        </div>
      </div>

      {workshopOpen && <WorkshopModal onClose={() => setWorkshopOpen(false)} />}
    </main>
  );
}
