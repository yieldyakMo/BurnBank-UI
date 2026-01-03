"use client";

import Link from "next/link";
import { BuyWidget } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import Image from "next/image";


const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// BBNK + Uniswap (Monad)
const BBNK_TOKEN = "0x81D61e48BCe95aB2Cd16Ced67B8d4aaf682B8350";
const UNISWAP_SWAP = `https://app.uniswap.org/swap?inputCurrency=MON&outputCurrency=${BBNK_TOKEN}`;
const UNISWAP_POOL =
  "https://app.uniswap.org/explore/pools/monad/0x35d4bb30ccfd698acc2dd0778cb1581474263bad";
const MONADVISION_TOKEN = `https://monadvision.com/token/${BBNK_TOKEN}`;

function ButtonLink({
  href,
  children,
  variant = "ghost",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.30)",
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    cursor: "pointer",
  };

  const primary: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,70,70,0.25), rgba(0,0,0,0.25))",
    border: "1px solid rgba(255,80,80,0.28)",
  };

  const style = variant === "primary" ? { ...base, ...primary } : base;

  return (
    <a
      href={href}
      style={style}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.22)",
        padding: 20,
        boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

export default function BuyPage() {
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
        {/* Header */}
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
                {/* If you want your logo here later, swap this for next/image */}
                <img
  src="/burnbank-logo.png"
  alt="BurnBank"
  style={{ width: 44, height: 44, display: "block" }}
/>

              </div>

              <div>
                <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>BurnBank</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>BBNK • Monad</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 34, fontWeight: 950, letterSpacing: -0.5 }}>
                Buy Crypto
              </div>
              <div style={{ marginTop: 8, fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
                Get funds into your wallet, then swap <b>MON → BBNK</b> on Uniswap (Monad).
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
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
                background: "linear-gradient(180deg, rgba(255,70,70,0.25), rgba(0,0,0,0.25))",
                color: "rgba(255,255,255,0.92)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              Open Staking App →
            </Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(12, 1fr)" }}>
          {/* Left */}
          <div style={{ gridColumn: "span 6" as any }}>
            <Card title="How this works">
              <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, fontSize: 14, opacity: 0.82 }}>
                <li>Buy a base asset (typically ETH/USDC) using card or crypto.</li>
                <li>Move funds to your wallet.</li>
                <li>Get MON on Monad (bridge if needed).</li>
                <li>Swap MON → BBNK on Uniswap (Monad), then come back and stake.</li>
              </ol>

              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.22)",
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Next step: Swap on Uniswap (Monad)</div>
                <div style={{ fontSize: 13, opacity: 0.78, lineHeight: 1.5 }}>
                  Uniswap is the primary MON/BBNK liquidity venue. Always verify the BBNK contract address
                  before swapping.
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                  <ButtonLink href={UNISWAP_SWAP} variant="primary" external>
                    Swap on Uniswap →
                  </ButtonLink>
                  <ButtonLink href={UNISWAP_POOL} external>
                    View Pool →
                  </ButtonLink>
                  <ButtonLink href={MONADVISION_TOKEN} external>
                    Verify Contract →
                  </ButtonLink>
                </div>

                <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
                  BBNK contract: <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{BBNK_TOKEN}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right */}
          <div style={{ gridColumn: "span 6" as any }}>
            <Card title="Buy">
              <div style={{ maxWidth: 520 }}>
                <BuyWidget client={client} />
              </div>
              <div style={{ marginTop: 12, fontSize: 12, opacity: 0.72, lineHeight: 1.5 }}>
                Availability depends on region/provider. If token lists look empty in dev, try in production mode
                (<span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>npm run build</span> then{" "}
                <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>npm start</span>).
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
