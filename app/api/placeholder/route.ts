import { NextRequest, NextResponse } from "next/server";

// Color slug → background hex for placeholder renders
const COLOR_MAP: Record<string, string> = {
  black: "#1C1C1C",
  white: "#E8E8E4",
  grey: "#8A8D8F",
  silver: "#C0C2C5",
  red: "#B22020",
  blue: "#1C3F6E",
  teal: "#2A7A6A",
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const model = searchParams.get("model") ?? "car";
  const colorSlug = searchParams.get("color") ?? "grey";
  const wheel = searchParams.get("wheel") ?? "0";
  const degree = parseInt(searchParams.get("degree") ?? "0", 10);

  const bgHex = COLOR_MAP[colorSlug] ?? "#888888";
  const textColor = luminance(bgHex) > 128 ? "#333333" : "#cccccc";

  // Subtle rotation arc to make the degree visually distinguishable
  const arcAngle = (degree / 360) * 2 * Math.PI;
  const cx = 400;
  const cy = 230;
  const rx = 280;
  const ry = 60;
  const carX = cx + rx * Math.cos(arcAngle - Math.PI / 2);
  const carY = cy + ry * Math.sin(arcAngle - Math.PI / 2);

  // Simple SVG car silhouette (top view, rotated by degree)
  const rotDeg = degree;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="460" viewBox="0 0 800 460">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${bgHex}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${bgHex}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="70%" r="50%">
      <stop offset="0%" stop-color="${bgHex}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${bgHex}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${bgHex}" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Dark background -->
  <rect width="800" height="460" fill="#0a0a0a"/>

  <!-- Ambient glow -->
  <ellipse cx="400" cy="280" rx="320" ry="100" fill="url(#glow)" opacity="0.6"/>

  <!-- Ground reflection line -->
  <ellipse cx="400" cy="295" rx="180" ry="14" fill="${bgHex}" opacity="0.12"/>

  <!-- Car body (top-view silhouette, rotated) -->
  <g transform="translate(${carX}, ${carY}) rotate(${rotDeg})">
    <g filter="url(#shadow)">
      <!-- Body -->
      <ellipse cx="0" cy="0" rx="80" ry="34" fill="${bgHex}" opacity="0.95"/>
      <!-- Roof -->
      <ellipse cx="-8" cy="0" rx="42" ry="22" fill="${bgHex}" opacity="0.7"/>
      <!-- Front hood -->
      <ellipse cx="58" cy="0" rx="30" ry="18" fill="${bgHex}" opacity="0.8"/>
      <!-- Rear -->
      <ellipse cx="-62" cy="0" rx="24" ry="16" fill="${bgHex}" opacity="0.75"/>
      <!-- Wheels -->
      <ellipse cx="50" cy="-30" rx="12" ry="7" fill="#111" stroke="${textColor}" stroke-width="1" opacity="0.8"/>
      <ellipse cx="50" cy="30" rx="12" ry="7" fill="#111" stroke="${textColor}" stroke-width="1" opacity="0.8"/>
      <ellipse cx="-50" cy="-30" rx="12" ry="7" fill="#111" stroke="${textColor}" stroke-width="1" opacity="0.8"/>
      <ellipse cx="-50" cy="30" rx="12" ry="7" fill="#111" stroke="${textColor}" stroke-width="1" opacity="0.8"/>
    </g>
  </g>

  <!-- Model label -->
  <text x="400" y="390" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
        font-size="13" font-weight="600" fill="${textColor}" opacity="0.5" letter-spacing="3">
    ${model.toUpperCase()} · ${colorSlug.toUpperCase()} · W${wheel} · ${degree}°
  </text>

  <!-- Degree indicator arc -->
  <circle cx="400" cy="230" r="4" fill="${textColor}" opacity="0.3"/>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
