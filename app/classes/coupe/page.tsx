import { Metadata } from 'next';
import carsData from '@/data/cars.json';
import CarConfiguratorPage from '@/components/CarConfiguratorPage';
import { Car } from '@/types';

export const metadata: Metadata = {
  title: 'CLE Coupé — VROOM',
  description:
    'Configure your Mercedes-Benz CLE Coupé. Full COE, ARF, and running cost breakdown for Singapore.',
};

export default function CoupePage() {
  const car = (carsData as Car[]).find((c) => c.class === 'coupe')!;
  return <CarConfiguratorPage car={car} />;
}
