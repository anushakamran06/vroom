'use client';

import { useMemo, useState } from 'react';

interface Props {
  vehiclePrice: number;
  isMaybach?: boolean;
}

function fmt(n: number) {
  return 'S$' + Math.round(n).toLocaleString('en-SG');
}

export default function LoanCalculator({ vehiclePrice, isMaybach }: Props) {
  const maxLtv = 0.6; // 60% LTV (40% down)
  const maxLoan = Math.round(vehiclePrice * maxLtv);

  const [loanAmount, setLoanAmount] = useState(maxLoan);
  const [tenureYears, setTenureYears] = useState(7);
  const [annualRate, setAnnualRate] = useState(2.78);

  const { monthly, totalInterest, totalRepayment, downPayment } = useMemo(() => {
    const downPayment = vehiclePrice - loanAmount;
    const r = annualRate / 100 / 12;
    const n = tenureYears * 12;
    const monthly =
      r === 0
        ? loanAmount / n
        : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalRepayment = monthly * n;
    const totalInterest = totalRepayment - loanAmount;
    return { monthly, totalInterest, totalRepayment, downPayment };
  }, [loanAmount, tenureYears, annualRate, vehiclePrice]);

  return (
    <div className="space-y-5">
      {/* Loan amount slider */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-xs text-[#8A8A8A] uppercase tracking-widest">Loan Amount</label>
          <span className="text-sm font-medium text-white">{fmt(loanAmount)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxLoan}
          step={1000}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full accent-[#C8A96E]"
        />
        <div className="flex justify-between text-xs text-[#555] mt-1">
          <span>S$0</span>
          <span>{fmt(maxLoan)} max (60% LTV)</span>
        </div>
      </div>

      {/* Down payment display */}
      <div className="flex justify-between items-center bg-[#111111] border border-[#1A1A1A] rounded-lg px-4 py-2.5">
        <span className="text-sm text-[#8A8A8A]">Down Payment</span>
        <span className="text-sm font-semibold text-white">
          {fmt(downPayment)}{' '}
          <span className="text-[#8A8A8A] font-normal">
            ({((downPayment / vehiclePrice) * 100).toFixed(0)}%)
          </span>
        </span>
      </div>

      {/* Tenure */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-xs text-[#8A8A8A] uppercase tracking-widest">Loan Tenure</label>
          <span className="text-sm font-medium text-white">{tenureYears} years</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((y) => (
            <button
              key={y}
              onClick={() => setTenureYears(y)}
              className={`flex-1 py-1.5 text-xs rounded border transition-all ${
                tenureYears === y
                  ? 'border-[#C8A96E] text-[#C8A96E] bg-[#C8A96E]/5'
                  : 'border-[#1A1A1A] text-[#8A8A8A] hover:border-[#333]'
              }`}
            >
              {y}yr
            </button>
          ))}
        </div>
      </div>

      {/* Interest rate */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-xs text-[#8A8A8A] uppercase tracking-widest">
            Interest Rate (p.a.)
          </label>
          <span className="text-sm font-medium text-white">{annualRate.toFixed(2)}%</span>
        </div>
        <input
          type="range"
          min={1.5}
          max={5.0}
          step={0.01}
          value={annualRate}
          onChange={(e) => setAnnualRate(Number(e.target.value))}
          className="w-full accent-[#C8A96E]"
        />
        <div className="flex justify-between text-xs text-[#555] mt-1">
          <span>1.50%</span>
          <span>5.00%</span>
        </div>
      </div>

      {/* Results */}
      <div className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]">
          <span className="text-sm text-[#8A8A8A]">Monthly Instalment</span>
          <span className="text-2xl font-bold text-[#C8A96E]">{fmt(monthly)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8A8A8A]">Total Interest</span>
          <span className="text-white">{fmt(totalInterest)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8A8A8A]">Total Repayment</span>
          <span className="text-white">{fmt(totalRepayment)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8A8A8A]">Total Cost (incl. down payment)</span>
          <span className="text-white">{fmt(totalRepayment + downPayment)}</span>
        </div>
      </div>

      {isMaybach && (
        <p className="text-xs text-[#8A8A8A] leading-relaxed border border-[#1A1A1A] rounded-lg p-3 bg-[#111111]">
          Maybach S-Class exceeds S$1M — standard MAS LTV rules apply. Minimum 30% cash
          downpayment required.
        </p>
      )}

      <p className="text-xs text-[#555] leading-relaxed">
        Indicative figures only. Actual loan terms subject to lender approval and prevailing MAS
        guidelines. Interest calculated using flat rate method.
      </p>
    </div>
  );
}
