import { NextResponse } from "next/server";

const BBNK_ADDRESS = "0x81D61e48BCe95aB2Cd16Ced67B8d4aaf682B8350";

export async function GET() {
  const apiKey = process.env.BLOCKVISION_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing BLOCKVISION_API_KEY" },
      { status: 500 }
    );
  }

  const url = new URL("https://api.blockvision.org/v2/monad/token/price/list");
  url.searchParams.set("tokenIds", BBNK_ADDRESS);
  url.searchParams.set("show24hChange", "true");

  const res = await fetch(url.toString(), {
    headers: {
      "x-api-key": apiKey,
      "accept": "application/json",
    },
    // prevents CU burn while keeping data fresh
    next: { revalidate: 15 },
  });

  const json = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: "BlockVision API error", details: json },
      { status: 502 }
    );
  }

  const priceStr =
    json?.result?.prices?.[BBNK_ADDRESS.toLowerCase()] ??
    json?.result?.prices?.[BBNK_ADDRESS] ??
    "0";

  const changeStr =
    json?.result?.token24HChange?.[BBNK_ADDRESS.toLowerCase()] ??
    json?.result?.token24HChange?.[BBNK_ADDRESS] ??
    "0";

  const priceUsd = Number(priceStr);
  const change24h = Number(changeStr);

  return NextResponse.json({
    priceUsd,
    change24h,
    hasPrice: Number.isFinite(priceUsd) && priceUsd > 0,
    source: "blockvision",
    timestamp: Date.now(),
  });
}

