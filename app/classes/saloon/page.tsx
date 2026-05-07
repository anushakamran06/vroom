import { Metadata } from 'next';
import carsData from '@/data/cars.json';
import CarConfiguratorPage from '@/components/CarConfiguratorPage';
import { Car } from '@/types';

export const metadata: Metadata = {
  title: 'E-Class Saloon — VROOM',
  description:
    'Configure your Mercedes-Benz E-Class Saloon. Full COE, ARF, and running cost breakdown for Singapore.',
};

export default function SaloonPage() {
  const car = (carsData as Car[]).find((c) => c.class === 'saloon')!;
  return <CarConfiguratorPage car={car} />;
}
