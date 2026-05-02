"use client";

import { useState } from "react";

interface TooltipInfoProps {
  text: string;
}

export function TooltipInfo({ text }: TooltipInfoProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] font-bold leading-none hover:border-gray-700 hover:text-gray-700 transition-colors cursor-help"
        aria-label="More information"
      >
        ?
      </button>

      {visible && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-md bg-gray-900 text-white text-xs leading-relaxed px-3 py-2 shadow-xl pointer-events-none"
        >
          {text}
          {/* Caret */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}
