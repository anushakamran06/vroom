export interface Variant {
  id: string;
  name: string;
  basePrice: number;
  engine: string;
  power: string;
  torque: string;
  zeroToHundred: string;
  topSpeed: string;
  transmission: string;
}

export interface Mod {
  id: string;
  category: 'exterior' | 'interior' | 'performance';
  name: string;
  description: string;
  priceDelta: number;
  ltaCompliant: boolean;
}

export interface SgFees {
  coe: number;
  arf: number;
  roadTax: number | Record<string, number>;
}

export interface MonthlyRunning {
  petrol: number | Record<string, number>;
  maintenance: number | Record<string, number>;
  insurance: number | Record<string, number>;
}

export interface Car {
  id: string;
  name: string;
  fullName: string;
  class: 'saloon' | 'coupe' | 'ultra-luxury';
  route: string;
  basePrice: number;
  images: string[];
  variants: Variant[];
  sgFees: SgFees;
  monthlyRunning: MonthlyRunning;
  mods: Mod[];
}
