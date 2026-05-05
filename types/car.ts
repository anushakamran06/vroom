export type CarCategory = "standard" | "amg";

export type CarType = "sedan" | "suv" | "coupe" | "estate";

export interface CarSpecs {
  engine: string;
  horsepower: number;
  torque: string;
  transmission: string;
  drivetrain: string;
  "0_to_100_kph": string;
  top_speed: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  slug: string;
  category: CarCategory;
  type: CarType;
  year: number;
  specs: CarSpecs;
  price_sgd: number;
  colors: string[];
  description: string;
}

export interface BrandTheme {
  "--brand-bg": string;
  "--brand-surface": string;
  "--brand-surface-hover": string;
  "--brand-primary": string;
  "--brand-secondary": string;
  "--brand-accent": string;
  "--brand-border": string;
  "--brand-font-heading": string;
  "--brand-font-mono": string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  theme: BrandTheme;
}
