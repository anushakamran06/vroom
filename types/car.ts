export interface CarColor {
  name: string;
  slug: string;
  hex: string;
  priceDelta: number;
}

export interface CarWheel {
  index: number;
  name: string;
  priceDelta: number;
}

export interface CarAddOn {
  id: string;
  name: string;
  plainDescription: string;
  priceDelta: number;
  replacesWhat: string;
}

export interface CarNotIncluded {
  name: string;
  description: string;
  addPrice?: number;
}

export interface CarPromotion {
  description: string;
  saving: number;
  expiryDate?: string;
}

export interface SgFees {
  coeEstimate: number;
  arf: number;
  registrationFee: number;
  annualRoadTax: number;
}

export interface CarSpecs {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  acceleration: string;
  topSpeed: string;
  fuelConsumption: string;
}

export interface CarMod {
  id: string;
  name: string;
  brand: string;
  category: "wheels" | "suspension" | "tint" | "exhaust" | "bodykit";
  priceMin: number;
  priceMax: number;
  ltaCompliant: boolean;
  ltaNote?: string;
  workshopId: string;
  imageSlug: string;
}

export interface Car {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  modelSlug: string;
  year: number;
  basePrice: number;
  colors: CarColor[];
  wheels: CarWheel[];
  specs: CarSpecs;
  sgFees: SgFees;
  addOns: CarAddOn[];
  notIncluded: CarNotIncluded[];
  activePromotions: CarPromotion[];
  livePrice?: boolean;
  mods?: CarMod[];
  lastUpdated?: string;
  priceSource?: string;
  customRoute?: string;
}

export interface Brand {
  name: string;
  slug: string;
  country: string;
}

export interface Workshop {
  id: string;
  name: string;
  address: string;
  district: string;
  specialities: string[];
  phone: string;
  lat: number;
  lng: number;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  appointmentUrl: string;
  lat: number;
  lng: number;
}
