"use client";

import { useMemo, useState } from "react";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";

import { balanceOf, transfer, totalSupply } from "thirdweb/extensions/erc20";
import { toUnits } from "thirdweb/utils";
import { client } from "./client";

import StakingCard from "./stakingcard";

const TOKEN_ADDRESS = "0x81D61e48BCe95aB2Cd16Ced67B8d4aaf682B8350";
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const DEFAULT_MONAD_RPC = "https://rpc.monad.xyz";
const DECIMALS = 18;

// NOTE: this is just for display; values you display are small enough (1e9) to be safe as Number
const formatUnits = (value: bigint, decimals = 18) => {
  return Number(value) / 10 ** decimals;
};

const formatNumber = (value: string | number, maxFractionDigits = 6) => {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(Number.isFinite(num) ? num : 0);
};

function formatPercent(burned: string, total: string) {
  const b = Number(burned);
  const t = Number(total);
  if (!t) return "0.00%";
  return `${((b / t) * 100).toFixed(2)}%`;
}

const safeToUnits = (value: string, decimals = 18) => {
  try {
    const v = value.trim();
    if (!v) return 0n;
    return toUnits(v, decimals);
  } catch {
    return 0n;
  }
};

const shortAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

export default function Home() {
  const account = useActiveAccount();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const chain = useMemo(
    () =>
      defineChain({
        id: 143,
        name: "Monad Mainnet",
        nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
        rpc: process.env.NEXT_PUBLIC_MONAD_RPC || DEFAULT_MONAD_RPC,
        blockExplorers: [{ name: "MonadVision", url: "https://monadvision.com" }],
      }),
    []
  );

  const contract = useMemo(
    () =>
      getContract({
        client,
        chain,
        address: TOKEN_ADDRESS,
      }),
    [chain]
  );

  // Reads FIRST
  const {
    data: balanceRaw,
    isLoading: balanceLoading,
    error: balanceError,
  } = useReadContract(balanceOf, {
    contract,
    address: account?.address ?? ZERO_ADDRESS,
  });

  const {
    data: burnedRaw,
    isLoading: burnedLoading,
    error: burnedError,
  } = useReadContract(balanceOf, {
    contract,
    address: DEAD_ADDRESS,
  });

  const {
    data: totalSupplyRaw,
    isLoading: totalSupplyLoading,
    error: totalSupplyError,
  } = useReadContract(totalSupply, { contract });

  // Derived values AFTER reads
  const circulatingRaw = (totalSupplyRaw ?? 0n) - (burnedRaw ?? 0n);

  const balanceHuman = balanceRaw
    ? String(formatUnits(balanceRaw, DECIMALS))
    : "0";
  const burnedHuman = burnedRaw ? String(formatUnits(burnedRaw, DECIMALS)) : "0";
  const circulatingHuman = String(formatUnits(circulatingRaw, DECIMALS));
  const totalSupplyHuman = String(formatUnits(totalSupplyRaw ?? 0n, DECIMALS));

  // Amount parsing + gating
  const human = amount.trim();
  const amountRaw = safeToUnits(human, DECIMALS);

  const canSend = !!account?.address && amountRaw > 0n && (balanceRaw ?? 0n) >= amountRaw;
  const canSendTo = canSend && !!to.trim();

  const { mutate: sendTx, isPending, error: txError } = useSendTransaction();

  const sendTransfer = (destination: string) => {
    if (!account?.address) return alert("Connect wallet first.");

    const humanLocal = amount.trim();
    if (!humanLocal) return alert("Enter an amount.");

    const amountRawLocal = safeToUnits(humanLocal, DECIMALS);
    if (amountRawLocal <= 0n) return alert("Amount must be > 0.");

    const bal = balanceRaw ?? 0n;
    if (amountRawLocal > bal) return alert("Insufficient BBNK balance for that amount.");

    if (destination !== DEAD_ADDRESS) {
      const dest = destination.trim();
      if (!dest) return alert("Enter a destination address (or use Burn).");
      destination = dest;
    }

    // ✅ IMPORTANT FIX:
    // Pass HUMAN amount string to thirdweb transfer() so it doesn't get scaled twice.
    const tx = transfer({
      contract,
      to: destination,
      amount: humanLocal,
    });

    sendTx(tx);
  };

  // ---------- UI styles ----------
  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 600px at 15% 10%, rgba(255,80,80,0.18), transparent 60%)," +
        "radial-gradient(900px 500px at 85% 20%, rgba(255,140,0,0.14), transparent 55%)," +
        "linear-gradient(180deg, #0b0d12, #090909)",
      color: "#f4f4f5",
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    } as const,
    container: {
      maxWidth: 920,
      margin: "0 auto",
      padding: "34px 18px 60px",
    } as const,
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 16,
      flexWrap: "wrap" as const,
      marginBottom: 18,
    } as const,
    h1: { fontSize: 34, margin: 0, fontWeight: 900, letterSpacing: -0.4 } as const,
    sub: { margin: "6px 0 0", opacity: 0.78, fontSize: 13 } as const,
    tag: {
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.06)",
      borderRadius: 999,
      padding: "7px 10px",
      fontSize: 12,
      fontWeight: 800,
      color: "#fff",
    } as const,
    card: {
      background: "rgba(15,15,18,0.85)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: 18,
      boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    } as const,
    cardTitleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 10,
      flexWrap: "wrap" as const,
      marginBottom: 12,
    } as const,
    h2: { margin: 0, fontSize: 18, fontWeight: 900 } as const,
    smallMono: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: 12,
      opacity: 0.78,
      color: "#e5e7eb",
    } as const,
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 12,
    } as const,
    stat: {
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 12,
      background: "rgba(255,255,255,0.03)",
    } as const,
    label: { fontSize: 12, opacity: 0.7, marginBottom: 4, color: "#d1d5db" } as const,
    value: { fontSize: 16, fontWeight: 900, color: "#f9fafb" } as const,
    divider: {
      margin: "16px 0",
      border: "none",
      borderTop: "1px solid rgba(255,255,255,0.10)",
    } as const,
    form: { display: "grid", gridTemplateColumns: "1fr", gap: 10 } as const,
    inputLabel: { fontSize: 12, fontWeight: 900, opacity: 0.8, color: "#e5e7eb" } as const,
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "#0f1115",
      color: "#f4f4f5",
      outline: "none",
      fontSize: 14,
    } as const,
    row: { display: "flex", gap: 10, flexWrap: "wrap" as const } as const,
    btn: (variant: "primary" | "secondary" | "danger") =>
      ({
        padding: "10px 14px",
        borderRadius: 12,
        border:
          variant === "primary"
            ? "1px solid #ef4444"
            : variant === "danger"
              ? "1px solid rgba(239,68,68,0.6)"
              : "1px solid rgba(255,255,255,0.2)",
        background:
          variant === "primary"
            ? "linear-gradient(180deg, #ef4444, #991b1b)"
            : variant === "danger"
              ? "rgba(239,68,68,0.12)"
              : "#111318",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 900,
        fontSize: 13,
        minWidth: 104,
      } as const),
    btnDisabled: { opacity: 0.55, cursor: "not-allowed" } as const,
    helper: { marginTop: 10, fontSize: 12, opacity: 0.78, lineHeight: 1.35, color: "#e5e7eb" } as const,
    error: {
      marginTop: 10,
      borderRadius: 14,
      padding: "10px 12px",
      border: "1px solid rgba(239,68,68,0.35)",
      background: "rgba(239,68,68,0.12)",
      color: "#fecaca",
      fontSize: 12,
      whiteSpace: "pre-wrap" as const,
    } as const,
    connectWrap: { marginTop: 10 } as const,
    sectionStack: { display: "grid", gap: 14 } as const,
  };

  const statsLoading = balanceLoading || burnedLoading || totalSupplyLoading;

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.h1}>BurnBank (BBNK)</h1>
            <p style={styles.sub}>Monad • Transfer + Burn • Stake to earn</p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={styles.tag}>Token</span>
            <span style={styles.smallMono} title={TOKEN_ADDRESS}>
              {shortAddr(TOKEN_ADDRESS)}
            </span>
          </div>
        </header>

        <div style={styles.sectionStack}>
          {/* CONNECT + STATS CARD */}
          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <h2 style={styles.h2}>Overview</h2>
              <div style={styles.smallMono} title={account?.address ?? ""}>
                {account?.address ? `Wallet: ${shortAddr(account.address)}` : "Wallet: Not connected"}
              </div>
            </div>

            <div style={styles.connectWrap}>
              <ConnectButton client={client} chain={chain} />
            </div>

            <hr style={styles.divider} />

            <div style={styles.grid}>
              <div style={styles.stat}>
                <div style={styles.label}>BBNK Balance</div>
                <div style={styles.value}>
                  {balanceLoading ? "Loading…" : `${formatNumber(balanceHuman)} BBNK`}
                </div>
              </div>

              <div style={styles.stat}>
                <div style={styles.label}>Total Supply</div>
                <div style={styles.value}>
                  {totalSupplyLoading ? "Loading…" : `${formatNumber(totalSupplyHuman)} BBNK`}
                </div>
              </div>

              <div style={styles.stat}>
                <div style={styles.label}>Total Burned</div>
                <div style={styles.value}>
                  {burnedLoading ? "Loading…" : `${formatNumber(burnedHuman)} BBNK`}
                </div>
              </div>

              <div style={styles.stat}>
                <div style={styles.label}>Burned %</div>
                <div style={styles.value}>
                  {statsLoading ? "Loading…" : formatPercent(burnedHuman, totalSupplyHuman)}
                </div>
              </div>

              <div style={styles.stat}>
                <div style={styles.label}>Circulating Supply</div>
                <div style={styles.value}>
                  {statsLoading ? "Loading…" : `${formatNumber(circulatingHuman)} BBNK`}
                </div>
              </div>

              <div style={styles.stat}>
                <div style={styles.label}>Dead Address</div>
                <div style={{ ...styles.value, fontSize: 13, fontWeight: 900 }}>
                  <span style={styles.smallMono} title={DEAD_ADDRESS}>
                    {shortAddr(DEAD_ADDRESS)}
                  </span>
                </div>
              </div>
            </div>

            {totalSupplyError && (
              <div style={styles.error}>Supply read error: {String(totalSupplyError)}</div>
            )}
            {balanceError && (
              <div style={styles.error}>Balance read error: {String(balanceError)}</div>
            )}
            {burnedError && (
              <div style={styles.error}>Burn read error: {String(burnedError)}</div>
            )}
          </section>

          {/* TRANSFER CARD */}
          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <h2 style={styles.h2}>Transfer</h2>
              <div style={styles.smallMono}>Monad Mainnet</div>
            </div>

            <div style={styles.form}>
              <div>
                <div style={styles.inputLabel}>To Address</div>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="0x..."
                  style={styles.input}
                />
              </div>

              <div>
                <div style={styles.inputLabel}>Amount (BBNK)</div>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  style={styles.input}
                />
              </div>

              <div style={styles.row}>
                <button
                  onClick={() => sendTransfer(to)}
                  disabled={isPending || !canSendTo}
                  style={{
                    ...styles.btn("secondary"),
                    ...(isPending || !canSendTo ? styles.btnDisabled : {}),
                  }}
                >
                  {isPending ? "Sending…" : "Send"}
                </button>

                <button
                  onClick={() => sendTransfer(DEAD_ADDRESS)}
                  disabled={isPending || !canSend}
                  style={{
                    ...styles.btn("danger"),
                    ...(isPending || !canSend ? styles.btnDisabled : {}),
                  }}
                  title={`Irreversible transfer to ${DEAD_ADDRESS}`}
                >
                  {isPending ? "Burning…" : "Burn"}
                </button>
              </div>

              <div style={styles.helper}>
                Burn sends tokens to an irrecoverable address. Total supply does not change; tokens are simply locked forever.
              </div>

              {txError ? <div style={styles.error}>Tx error: {String(txError)}</div> : null}
            </div>

            {/* STAKING SECTION */}
            <div style={{ marginTop: 18 }}>
              <StakingCard
                tokenAddress={TOKEN_ADDRESS}
                stakingAddress="0x98275b6127BA4443A90b08840E9B7eF2E4CB2fbf"
                chain={chain}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
