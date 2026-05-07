import { Metadata } from 'next';
import carsData from '@/data/cars.json';
import CarConfiguratorPage from '@/components/CarConfiguratorPage';
import { Car } from '@/types';

export const metadata: Metadata = {
  title: 'Mercedes-Maybach S-Class — VROOM',
  description:
    'Configure your Mercedes-Maybach S-Class Saloon. Full COE, ARF, and running cost breakdown for Singapore.',
};

export default function UltraLuxuryPage() {
  const car = (carsData as Car[]).find((c) => c.class === 'ultra-luxury')!;
  return <CarConfiguratorPage car={car} isMaybach />;
}
