import { Car, Mod, Variant } from '@/types';

function fmt(n: number) {
  return 'S$' + n.toLocaleString('en-SG');
}

function getVal(v: number | Record<string, number>, variantId: string): number {
  if (typeof v === 'number') return v;
  return v[variantId] ?? 0;
}

interface Props {
  car: Car;
  variant: Variant;
  selectedMods: Set<string>;
}

export default function PriceBreakdown({ car, variant, selectedMods }: Props) {
  const activeMods: Mod[] = car.mods.filter((m) => selectedMods.has(m.id));
  const modsTotal = activeMods.reduce((sum, m) => sum + m.priceDelta, 0);

  const coe = car.sgFees.coe;
  const arf = car.sgFees.arf;
  const roadTax = getVal(car.sgFees.roadTax, variant.id);

  const totalOnRoad = variant.basePrice + modsTotal + coe + arf;

  const petrol = getVal(car.monthlyRunning.petrol, variant.id);
  const maintenance = getVal(car.monthlyRunning.maintenance, variant.id);
  const insurance = getVal(car.monthlyRunning.insurance, variant.id);
  const monthlyTotal = petrol + maintenance + insurance + Math.round(roadTax / 12);

  return (
    <div className="space-y-4">
      {/* Vehicle price */}
      <div>
        <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Vehicle Price</p>
        <div className="space-y-1.5">
          <Row label={variant.name + ' Base Price'} value={fmt(variant.basePrice)} />
          {activeMods.map((m) => (
            <Row key={m.id} label={m.name} value={'+' + fmt(m.priceDelta)} gold />
          ))}
          {modsTotal > 0 && (
            <Row label="Modifications Total" value={fmt(modsTotal)} subtle />
          )}
        </div>
      </div>

      <Divider />

      {/* Singapore fees */}
      <div>
        <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Singapore Fees</p>
        <div className="space-y-1.5">
          <Row label="Certificate of Entitlement (COE)" value={fmt(coe)} />
          <Row label="Additional Registration Fee (ARF)" value={fmt(arf)} />
          <Row label="Road Tax (annual)" value={fmt(roadTax)} subtle />
        </div>
      </div>

      <Divider />

      {/* Total */}
      <div className="bg-[#111111] rounded-lg p-4 border border-[#1A1A1A]">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#8A8A8A] uppercase tracking-wider">Total On-Road</span>
          <span className="text-xl font-bold text-[#C8A96E]">{fmt(totalOnRoad)}</span>
        </div>
        {modsTotal > 0 && (
          <p className="text-xs text-[#8A8A8A] mt-1">Includes {fmt(modsTotal)} in modifications</p>
        )}
      </div>

      {/* Monthly running */}
      <div>
        <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">
          Est. Monthly Running Costs
        </p>
        <div className="space-y-1.5">
          <Row label="Petrol" value={fmt(petrol) + '/mo'} />
          <Row label="Maintenance" value={fmt(maintenance) + '/mo'} />
          <Row label="Insurance" value={fmt(insurance) + '/mo'} />
          <Row label="Road Tax (prorated)" value={fmt(Math.round(roadTax / 12)) + '/mo'} subtle />
        </div>
        <div className="mt-3 flex justify-between items-center border-t border-[#1A1A1A] pt-3">
          <span className="text-sm text-white">Monthly Total</span>
          <span className="text-base font-semibold text-white">{fmt(monthlyTotal)}/mo</span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  gold,
  subtle,
}: {
  label: string;
  value: string;
  gold?: boolean;
  subtle?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${subtle ? 'text-[#555]' : 'text-[#8A8A8A]'}`}>{label}</span>
      <span
        className={`text-sm font-medium ${
          gold ? 'text-[#C8A96E]' : subtle ? 'text-[#555]' : 'text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-[#1A1A1A]" />;
}
