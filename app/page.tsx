"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 800px at 20% 10%, rgba(255,80,40,0.18), transparent 60%), radial-gradient(900px 600px at 80% 30%, rgba(255,0,80,0.12), transparent 55%), linear-gradient(180deg, #070607 0%, #0b0a0c 35%, #060506 100%)",
        color: "#f4f4f5",
        padding: "48px 18px",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(255,60,20,0.9), rgba(255,0,90,0.65))",
                boxShadow: "0 10px 30px rgba(255,60,20,0.18)",
              }}
              aria-hidden
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.2 }}>BurnBank</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>BBNK on Monad</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a
              href="#how"
              style={{ opacity: 0.85, textDecoration: "none", color: "inherit", fontSize: 13 }}
            >
              How it works
            </a>
            <a
              href="#token"
              style={{ opacity: 0.85, textDecoration: "none", color: "inherit", fontSize: 13 }}
            >
              Token
            </a>
            <Link
              href="/app"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(255,60,20,0.95), rgba(255,0,90,0.75))",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 13,
                boxShadow: "0 12px 34px rgba(255,60,20,0.18)",
                border: "1px solid rgba(255,120,80,0.35)",
              }}
            >
              Launch App →
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section
          style={{
            padding: "34px 22px",
            borderRadius: 22,
            border: "1px solid rgba(255,120,80,0.18)",
            background: "linear-gradient(180deg, rgba(255,80,40,0.08), rgba(20,18,22,0.6))",
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.05, letterSpacing: -0.4 }}>
            Burn. Stake. Earn.
            <span style={{ display: "block", opacity: 0.8, fontSize: 20, marginTop: 10 }}>
              BurnBank is a simple staking vault for BBNK on Monad.
            </span>
          </h1>

          <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/app"
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(255,60,20,0.95), rgba(255,0,90,0.75))",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 900,
                border: "1px solid rgba(255,120,80,0.35)",
              }}
            >
              Open Staking App
            </Link>

            <a
              href="#how"
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Learn More
            </a>
          </div>

          <p style={{ marginTop: 16, opacity: 0.75, maxWidth: 740, lineHeight: 1.6 }}>
            This is early-stage software. Always verify contract addresses and transact at your own risk.
          </p>
        </section>

        {/* How it works */}
        <section id="how" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {[
            { t: "1) Connect", d: "Connect your wallet on Monad." },
            { t: "2) Approve", d: "Approve the staking contract to spend your BBNK." },
            { t: "3) Stake & Earn", d: "Stake BBNK and claim rewards anytime." },
            { t: "4) Unstake", d: "Unstake whenever available by contract rules." },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                padding: 18,
                borderRadius: 18,
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,120,80,0.14)",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{x.t}</div>
              <div style={{ opacity: 0.8, lineHeight: 1.5 }}>{x.d}</div>
            </div>
          ))}
        </section>

        {/* Token */}
        <section
          id="token"
          style={{
            padding: 20,
            borderRadius: 18,
            background: "rgba(0,0,0,0.22)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h2 style={{ margin: 0, marginBottom: 10 }}>Token info</h2>
          <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.85, lineHeight: 1.8 }}>
            <li><b>Name:</b> BurnBank</li>
            <li><b>Symbol:</b> BBNK</li>
            <li><b>Chain:</b> Monad</li>
            <li><b>Decimals:</b> 18</li>
            <li><b>Verify contracts:</b> Always confirm addresses from official links.</li>
          </ul>
        </section>

        {/* ================= Explorer Links ================= */}
<div
  style={{
    marginTop: 24,
    padding: "16px 20px",
    borderRadius: 14,
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <h3 style={{ marginBottom: 8 }}>Explorer</h3>

  <p style={{ opacity: 0.85, marginBottom: 12 }}>
    Verify BurnBank contracts directly on the Monad block explorer.
  </p>

  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <a
      href="https://monadvision.com/token/0x81D61e48BCe95aB2Cd16Ced67B8d4aaf682B8350?tab=Contract"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#ff4d4f",
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      🔍 View BBNK Token on MonadVision →
    </a>

    <a
      href="https://monadvision.com/address/0x98275b6127BA4443A90b08840E9B7eF2E4CB2fbf"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#ff4d4f",
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      🔍 View Staking Contract on MonadVision →
    </a>
  </div>
</div>
{/* ================================================ */}
        

        {/* Footer */}
        <footer style={{ opacity: 0.65, fontSize: 12, lineHeight: 1.6, paddingBottom: 10 }}>
          © {new Date().getFullYear()} BurnBank • Not financial advice • Use at your own risk
        </footer>
      </div>
    </main>
  );
}

