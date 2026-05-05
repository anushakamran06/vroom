"use client";

import dynamic from "next/dynamic";

const CarViewer = dynamic(() => import("./CarViewer"), { ssr: false });

export default function CarViewerWrapper() {
  return <CarViewer />;
}
