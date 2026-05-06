// ANTHROPIC_API_KEY must be set in Vercel dashboard → Project → Settings → Environment Variables.
import { NextRequest, NextResponse } from "next/server";

interface LivePrice {
  basePrice: number;
  coeEstimate: number;
  arf: number;
  source: string;
  retrievedAt: string;
}

interface CacheEntry {
  data: LivePrice;
  fetchedAt: number;
}

const priceCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  let brand: string, model: string;
  try {
    ({ brand, model } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!brand || !model) {
    return NextResponse.json({ error: "brand and model are required" }, { status: 400 });
  }

  const cacheKey = `${brand}::${model}`.toLowerCase();
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  let anthropicRes: Response;
  try {
    anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [
          {
            role: "user",
            content: `Search for the current 2025 Singapore OTR price of ${brand} ${model} including COE. Check sgcarmart.com and the official ${brand} Singapore website. Return ONLY a JSON object with no markdown, no explanation: { "basePrice": number, "coeEstimate": number, "arf": number, "source": string, "retrievedAt": string }`,
          },
        ],
      }),
    });
  } catch (err) {
    console.error("Prices fetch network error:", err);
    return NextResponse.json({ error: "Network error reaching Anthropic" }, { status: 502 });
  }

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text();
    console.error("Anthropic prices API error:", errText);
    return NextResponse.json({ error: "Upstream API error" }, { status: anthropicRes.status });
  }

  let responseData: { content?: { type: string; text?: string }[] };
  try {
    responseData = await anthropicRes.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON from Anthropic" }, { status: 502 });
  }

  const textBlock = responseData.content?.find((b) => b.type === "text" && b.text);
  if (!textBlock?.text) {
    return NextResponse.json({ error: "No text in Anthropic response" }, { status: 502 });
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Could not parse price JSON from response" }, { status: 502 });
  }

  let priceData: LivePrice;
  try {
    priceData = JSON.parse(jsonMatch[0]) as LivePrice;
  } catch {
    return NextResponse.json({ error: "Malformed JSON in price response" }, { status: 502 });
  }

  priceData.retrievedAt = new Date().toISOString();
  priceCache.set(cacheKey, { data: priceData, fetchedAt: Date.now() });

  return NextResponse.json(priceData);
}
