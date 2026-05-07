'use client';

import { useEffect } from 'react';

interface Workshop {
  name: string;
  address: string;
  type: 'official' | 'specialist';
  specialisation: string;
  phone: string;
  hours: string;
}

const WORKSHOPS: Workshop[] = [
  {
    name: 'Cycle & Carriage Bintang',
    address: '605 Macpherson Road, Singapore 368243',
    type: 'official',
    specialisation: 'Authorised Mercedes-Benz dealer & service',
    phone: '+65 6897 7777',
    hours: 'Mon–Sat: 8am–6pm',
  },
  {
    name: 'Performance Motors Limited',
    address: '229 Leng Kee Road, Singapore 159051',
    type: 'official',
    specialisation: 'Authorised Mercedes-Benz & AMG service',
    phone: '+65 6475 8800',
    hours: 'Mon–Sat: 8am–6pm',
  },
  {
    name: 'Stars & Stripes Motor Works',
    address: '10 Ubi Crescent #01-58, Singapore 408564',
    type: 'specialist',
    specialisation: 'Independent Mercedes-Benz specialist',
    phone: '+65 6744 1234',
    hours: 'Mon–Sat: 9am–6pm',
  },
  {
    name: 'German Auto Group',
    address: '3 Toh Guan Road East #01-02, Singapore 608831',
    type: 'specialist',
    specialisation: 'Multi-brand German car specialist',
    phone: '+65 6261 8800',
    hours: 'Mon–Fri: 8:30am–6pm, Sat: 9am–1pm',
  },
];

interface Props {
  onClose: () => void;
}

export default function WorkshopModal({ onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Recommended Workshops"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <div>
            <h2 className="text-base font-semibold text-white">Recommended Workshops</h2>
            <p className="text-xs text-[#8A8A8A] mt-0.5">
              Authorised dealers &amp; trusted specialists
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded border border-[#1A1A1A] text-[#8A8A8A] hover:text-white hover:border-[#333] transition-colors text-lg"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Workshop list */}
        <div className="divide-y divide-[#1A1A1A] max-h-[70vh] overflow-y-auto">
          {WORKSHOPS.map((w) => (
            <div key={w.name} className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">{w.name}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        w.type === 'official'
                          ? 'text-[#C8A96E] border-[#C8A96E]/40 bg-[#C8A96E]/5'
                          : 'text-[#8A8A8A] border-[#1A1A1A]'
                      }`}
                    >
                      {w.type === 'official' ? 'Authorised' : 'Specialist'}
                    </span>
                  </div>
                  <p className="text-xs text-[#C8A96E] mt-1">{w.specialisation}</p>
                  <p className="text-xs text-[#8A8A8A] mt-1">{w.address}</p>
                  <div className="flex gap-4 mt-2">
                    <p className="text-xs text-[#8A8A8A]">{w.phone}</p>
                    <p className="text-xs text-[#555]">{w.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-[#1A1A1A] bg-[#0A0A0A]">
          <p className="text-xs text-[#555]">
            Always verify current availability and pricing directly with the workshop.
          </p>
        </div>
      </div>
    </div>
  );
}
