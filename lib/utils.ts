export function formatSGD(amount: number): string {
  return `S$${Math.round(amount).toLocaleString("en-SG")}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 120, g: 120, b: 120 };
}

export function getAmbientBoxShadow(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // Multi-layer ambient glow — inspired by ambient CSS techniques
  return [
    `0 0 40px 8px rgba(${r},${g},${b},0.45)`,
    `0 0 90px 25px rgba(${r},${g},${b},0.28)`,
    `0 0 160px 55px rgba(${r},${g},${b},0.14)`,
    `0 0 280px 90px rgba(${r},${g},${b},0.07)`,
  ].join(", ");
}

export function getImageSrc(
  model: string,
  colorSlug: string,
  wheelIndex: number,
  degreeIndex: number
): string {
  const degree = degreeIndex * 9;
  // Switch to `/renders/${model}-${colorSlug}-wheel${wheelIndex}-${degree}deg.jpg`
  // when real render sequences are available.
  return `/api/placeholder?model=${encodeURIComponent(model)}&color=${encodeURIComponent(colorSlug)}&wheel=${wheelIndex}&degree=${degree}`;
}

export function configKey(
  model: string,
  colorSlug: string,
  wheelIndex: number
): string {
  return `${model}-${colorSlug}-${wheelIndex}`;
}
