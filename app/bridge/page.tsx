"use client";

import Link from "next/link";
import BridgeWidgetBox from "../components/BridgeWidget";

export default function BridgePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "36px 16px 60px",
        background:
          "radial-gradient(1200px 800px at 15% 10%, rgba(255,90,70,0.22), transparent 60%)," +
          "radial-gradient(900px 700px at 85% 15%, rgba(255,40,40,0.14), transparent 55%)," +
          "radial-gradient(900px 700px at 50% 95%, rgba(120,40,20,0.18), transparent 55%)," +
          "linear-gradient(180deg, rgba(0,0,0,0.92), rgba(0,0,0,0.98))",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header (copied from Buy page) */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.25)",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/burnbank-logo.png"
                  alt="BurnBank"
                  style={{ width: 44, height: 44, display: "block" }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
                  BurnBank
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>BBNK • Monad</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 34, fontWeight: 950, letterSpacing: -0.5 }}>
                Bridge to Monad
              </div>
              <div style={{ marginTop: 8, fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
                Move assets onto Monad, then swap for <b>BBNK</b> and stake. If a bridge quote fails,
                try a smaller amount.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.30)",
                color: "rgba(255,255,255,0.92)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              ← Back
            </Link>

            <Link
  href="/app"
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 800,
    textDecoration: "none",
    border: "1px solid rgba(255,80,80,0.28)",
    background:
      "linear-gradient(180deg, rgba(255,70,70,0.25), rgba(0,0,0,0.25))",
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  }}
>
  Open Staking App →
</Link>

            
            {/* Optional: keep the “flow” visible */}
            <Link
              href="/buy"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.30)",
                color: "rgba(255,255,255,0.92)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              Buy Crypto →
            </Link>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(0,0,0,0.22)",
            padding: 20,
            boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
            width: "fit-content",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>Bridge</div>
          <BridgeWidgetBox />
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.72, lineHeight: 1.5 }}>
            Tip: Bridge WMON → swap → stake. Gas and liquidity conditions may vary.
          </div>
        </div>
      </div>
    </main>
  );
}
