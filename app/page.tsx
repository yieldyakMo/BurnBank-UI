"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

const TOKEN_ADDRESS = "0x81D61e48BCe95aB2Cd16Ced67B8d4aaf682B8350";
const STAKING_ADDRESS = "0x98275b6127BA4443A90b08840E9B7eF2E4CB2fbf";

// Links
const MONADVISION_TOKEN =
  "https://monadvision.com/token/0x81D61e48BCe95aB2Cd16Ced67B8d4aaf682B8350";


const GMGN_LINK =
  "https://gmgn.ai/monad/token/0x81d61e48bce95ab2cd16ced67b8d4aaf682b8350";

const MACE_LINK = "https://www.mace.ag";

const REDDIT_URL = "https://www.reddit.com/r/burnbank";

const DISCORD_INVITE = "https://discord.gg/6WKZnYCgDu";

const X_URL = "https://x.com/Monad_Burn_Bank";

const GECKOTERMINAL_LINK =
  "https://www.geckoterminal.com/monad/pools/0x35d4bb30ccfd698acc2dd0778cb1581474263bad";
 
const MINT_URL =
  "https://thirdweb.com/monad/0xfE6B58241706d9e4689EeE369685F05a40d9837D/nfts/0";




function shortAddr(addr: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{label}</div>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {shortAddr(value)}
        </div>
      </div>

      <button
        onClick={onCopy}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(255, 80, 80, 0.35)",
          background:
            "linear-gradient(180deg, rgba(255,80,80,0.18), rgba(255,80,80,0.08))",
          color: "rgba(255,255,255,0.92)",
          cursor: "pointer",
          fontWeight: 700,
          minWidth: 96,
        }}
        title="Copy to clipboard"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.25)",
        fontSize: 12,
        opacity: 0.9,
      }}
    >
      {children}
    </span>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const styles =
    variant === "primary"
      ? {
          border: "1px solid rgba(255, 80, 80, 0.40)",
          background:
            "linear-gradient(180deg, rgba(255,80,80,0.22), rgba(255,80,80,0.10))",
          color: "rgba(255,255,255,0.95)",
        }
      : {
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(0,0,0,0.22)",
          color: "rgba(255,255,255,0.90)",
        };

  // Use Link for internal routes, <a> for external
  const isInternal = !external && (href.startsWith("/") || href.startsWith("#"));

  const commonStyle: React.CSSProperties = {
    ...styles,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    cursor: "pointer",
  };

  if (isInternal) {
    return (
      <Link href={href} style={commonStyle}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={commonStyle}
    >
      {children}
    </a>
  );
}

function DexCard({
  name,
  href,
  description,
  badge,
}: {
  name: string;
  href: string;
  description: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.22)",
        padding: 16,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>{name}</div>
        {badge ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid rgba(255,80,80,0.35)",
              background: "rgba(255,80,80,0.10)",
              opacity: 0.95,
            }}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6, lineHeight: 1.5 }}>
        {description}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 13,
          fontWeight: 800,
          color: "rgba(255,120,120,0.95)",
        }}
      >
        Open {name} →
      </div>
    </a>
  );
}

export default function Page() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "rgba(255,255,255,0.92)",
        background:
          "radial-gradient(1200px 700px at 20% 10%, rgba(255,70,70,0.20), transparent 55%)," +
          "radial-gradient(900px 600px at 80% 20%, rgba(255,160,60,0.12), transparent 55%)," +
          "radial-gradient(900px 650px at 50% 90%, rgba(180,60,255,0.10), transparent 60%)," +
          "linear-gradient(180deg, #07070a, #050509 65%, #040407)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 18px 80px" }}>
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            padding: "10px 4px 22px",
          }}
        >
          {/* Left: logo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image
              src="/burnbank-logo.png"
              alt="BurnBank logo"
              width={44}
              height={44}
              priority
              style={{
                borderRadius: 10,
                boxShadow: "0 0 20px rgba(255,80,80,0.35)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>BurnBank</div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>BBNK • Monad</div>
            </div>
          </div>

          {/* Right: buttons */}
         <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
  <ButtonLink href="/app" variant="primary">
    Open Staking App →
  </ButtonLink>

  <ButtonLink href="/buy" variant="ghost">
    Buy Crypto →
  </ButtonLink>

  <ButtonLink href="/bridge" variant="ghost">
  Bridge Assets →
</ButtonLink>
 

 <ButtonLink href={MONADVISION_TOKEN} variant="ghost" external>
    View on MonadVision
  </ButtonLink>
</div>

        </header>

        {/* Hero + Contracts */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 18,
          }}
        >
          <div
            style={{
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.28)",
              padding: 22,
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <Pill>🔥 Deflation-themed token</Pill>
              <Pill>⛓️ Verified contract</Pill>
              <Pill>💰 Stake to earn</Pill>
            </div>

            <h1 style={{ fontSize: 44, lineHeight: 1.05, margin: "10px 0 8px" }}>
              BurnBank (BBNK)
            </h1>

            <p style={{ fontSize: 16, opacity: 0.78, margin: 0, maxWidth: 720 }}>
              A utility token on Monad. Buy, stake, and track BBNK here.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              <ButtonLink href="/app" variant="primary">
                Open Staking App →
              </ButtonLink>

              <ButtonLink href={REDDIT_URL} variant="ghost" external>
                Reddit
              </ButtonLink>

              <ButtonLink href={DISCORD_INVITE} variant="ghost" external>
                Discord
              </ButtonLink>

              <ButtonLink href={X_URL} variant="ghost" external>
                X / Twitter
              </ButtonLink>
            </div>

            <div style={{ marginTop: 18, opacity: 0.7, fontSize: 12, lineHeight: 1.45 }}>
              Always verify the token address before swapping or staking.
            </div>
          </div>

          <aside
            style={{
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.22)",
              padding: 18,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 10 }}>Contracts</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <CopyRow label="BBNK Token" value={TOKEN_ADDRESS} />
              <CopyRow label="Staking Contract" value={STAKING_ADDRESS} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <ButtonLink href={MONADVISION_TOKEN} variant="ghost" external>
                View Token
              </ButtonLink>
            </div>

            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.10)",
                fontSize: 12,
                opacity: 0.75,
                lineHeight: 1.4,
              }}
            >
              Bookmark this page for reference on correct contracts
            </div>
          </aside>
        </section>

        {/* Quick info grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginTop: 16,
          }}
        >
          {[
            {
              title: "Trust & Status",
              body: (
                <ul style={{ margin: "10px 0 0", paddingLeft: 18, opacity: 0.8 }}>
                  <li>Token contract verified</li>
                  <li>Fixed supply minted at deploy</li>
                  <li>Public addresses posted above</li>
                  <li>Listed and tracked on CoinGecko / GeckoTerminal</li>

                </ul>
              ),
            },
            {
              title: "How to Buy",
              body: (
                <ol style={{ margin: "10px 0 0", paddingLeft: 18, opacity: 0.8 }}>
                  <li>Get MON on Monad</li>
                  <li>Swap MON → BBNK on any DEX listed below</li>
                  <li>
                    If needed, paste the token address to find until token indexes fully
                  </li>
                </ol>
              ),
            },
            {
              title: "Staking",
              body: (
                <ul style={{ margin: "10px 0 0", paddingLeft: 18, opacity: 0.8 }}>
                  <li>Approve once, then stake/unstake anytime</li>
                  <li>Claim rewards whenever you want</li>
                  <li>APR varies with pool totals</li>
                </ul>
              ),
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.22)",
                padding: 18,
              }}
            >
              <div style={{ fontWeight: 900 }}>{c.title}</div>
              <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.55 }}>{c.body}</div>
            </div>
          ))}
        </section>

     {/* DEX + Explorer section */}
<section
  style={{
    marginTop: 16,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.22)",
    padding: 20,
  }}
>
  <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>
    Where to Buy BBNK
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 14,
    }}
  >
    <DexCard
      name="Uniswap (Monad)"
      href="https://app.uniswap.org/swap?inputCurrency=MON&outputCurrency=0x81D61e48BCe95aB2Cd16Ced67B8d4aaf682B8350"
      badge="Swap"
      description="Primary MON/BBNK liquidity venue."
    />

    <DexCard
      name="Uniswap Pool"
      href="https://app.uniswap.org/explore/pools/monad/0x35d4bb30ccfd698acc2dd0778cb1581474263bad"
      badge="Pool"
      description="View pool liquidity, price, and transactions."
    />

      <DexCard
  name="GeckoTerminal"
  href={GECKOTERMINAL_LINK}
  badge="Charts"
  description="Real-time charts, liquidity, and trade data for BBNK."
/>
    

      <DexCard
      name="MonadVision Explorer"
      href={MONADVISION_TOKEN}
      badge="Explorer"
      description="Contract, holders, transfers, and verification details."
    />

    <DexCard
      name="GMGN"
      href={GMGN_LINK}
      badge="Token Page"
      description="Analytics + routing page (optional)."
    />
  </div>

  <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>
    Always verify the BBNK contract address before swapping.
  </div>
  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    opacity: 0.8,
    fontSize: 12,
  }}
>
  <Image
    src="/geckoterminal_icon.png"
    alt="GeckoTerminal"
    width={18}
    height={18}
  />
  <a
    href={GECKOTERMINAL_LINK}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}
  >
    View on GeckoTerminal
  </a>
</div>

</section>

        <footer style={{ marginTop: 22, opacity: 0.65, fontSize: 12, padding: "6px 4px" }}>
          © {year} BurnBank • BBNK • Built on Monad
        </footer>
      </div>
    </main>
  );
}
