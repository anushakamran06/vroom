"use client";

import { formatSGD } from "@/lib/utils";
import { TooltipInfo } from "./TooltipInfo";
import type { PriceLineItem } from "@/lib/pricing";

interface PriceBreakdownProps {
  lines: PriceLineItem[];
  onRemoveOption?: (id: string) => void;
}

export function PriceBreakdown({ lines, onRemoveOption }: PriceBreakdownProps) {
  return (
    <div className="font-mono text-sm">
      <div className="space-y-1">
        {lines.map((line) => {
          const isSubtotal = line.type === "subtotal";
          const isTotal = line.type === "total";
          const isDiscount = line.type === "discount";
          const isFee = line.type === "fee";

          if (isSubtotal) {
            return (
              <div key={line.id}>
                <div className="border-t border-gray-200 my-2" />
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900 font-sans">
                      {line.label}
                    </span>
                    <TooltipInfo text={line.tooltip} />
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatSGD(line.amount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 mt-1 mb-2" />
              </div>
            );
          }

          if (isTotal) {
            return (
              <div key={line.id}>
                <div className="border-t-2 border-gray-900 mt-3 mb-2" />
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-gray-900 font-sans">
                      {line.label}
                    </span>
                    <TooltipInfo text={line.tooltip} />
                  </div>
                  <span className="font-bold text-base text-gray-900">
                    {formatSGD(line.amount)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans mt-1">
                  All figures estimated. Road tax is an annual recurring cost.
                  COE is subject to bidding results.
                </p>
              </div>
            );
          }

          return (
            <div
              key={line.id}
              className={`flex items-start justify-between gap-2 py-1 ${
                isDiscount ? "text-green-700" : isFee ? "text-gray-600" : "text-gray-700"
              }`}
            >
              <div className="flex items-start gap-1.5 flex-1 min-w-0">
                <span className="font-sans text-xs leading-5 shrink-0">
                  {isDiscount ? "−" : line.type === "base" ? "" : "+"}
                </span>
                <span className="font-sans text-xs leading-5 flex-1 min-w-0">
                  {line.label}
                </span>
                <TooltipInfo text={line.tooltip} />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-medium ${
                    isDiscount ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  {isDiscount
                    ? `−${formatSGD(Math.abs(line.amount))}`
                    : formatSGD(line.amount)}
                </span>

                {line.canRemove && onRemoveOption && (
                  <button
                    type="button"
                    onClick={() => onRemoveOption(line.id)}
                    className="text-[10px] text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded px-1 transition-colors"
                    aria-label={`Remove ${line.label}`}
                  >
                    remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
