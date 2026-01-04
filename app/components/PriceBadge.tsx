"use client";

import { useEffect, useState } from "react";

type PriceResponse = {
  priceUsd: number;
  change24h: number;
  hasPrice: boolean;
  source: string;
  timestamp: number;
};

function fmtUsd(x: number) {
  if (!Number.isFinite(x)) return "-";
  if (x > 1) return x.toFixed(4);
  if (x > 0.01) return x.toFixed(6);
  return x.toFixed(10);
}

export default function PriceBadge() {
  const [data, setData] = useState<PriceResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const r = await fetch("/app/api/bbnk/price", { cache: "no-store" });
      const j = (await r.json()) as PriceResponse;

      if (!r.ok) {
        setErr((j as any)?.error ?? "Failed to load price");
        return;
      }
      setData(j);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load price");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, []);

  const hasPrice = data?.hasPrice;
  const change = data?.change24h ?? 0;
  const changeText = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.30)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "grid", gap: 2 }}>
        <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 800 }}>
          BBNK Price
        </div>

        {err ? (
          <div style={{ fontSize: 14, fontWeight: 900 }}>Error loading price</div>
        ) : !data ? (
          <div style={{ fontSize: 14, fontWeight: 900 }}>Loading…</div>
        ) : !hasPrice ? (
          <div style={{ fontSize: 14, fontWeight: 900, opacity: 0.9 }}>
            Price unavailable
          </div>
        ) : (
          <div style={{ fontSize: 16, fontWeight: 950 }}>
            ${fmtUsd(data.priceUsd)}
          </div>
        )}
      </div>

      {data && hasPrice ? (
        <div
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 900,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            whiteSpace: "nowrap",
          }}
          title="24h change"
        >
          {changeText}
        </div>
      ) : null}
    </div>
  );
}

