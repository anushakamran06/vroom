import { notFound } from "next/navigation";
import { carsBySlug } from "@/data/cars";
import { ConfiguratorClient } from "./ConfiguratorClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ model: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  const car = carsBySlug.get(model);
  if (!car) return { title: "Not found" };
  return {
    title: `Configure ${car.brand} ${car.name} — VROOM`,
  };
}

export default async function ConfiguratorPage({ params }: Props) {
  const { model } = await params;
  const car = carsBySlug.get(model);

  if (!car) notFound();

  return <ConfiguratorClient car={car} />;
}
