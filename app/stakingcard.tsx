"use client";

import { useMemo, useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { allowance, balanceOf } from "thirdweb/extensions/erc20";
import { toUnits } from "thirdweb/utils";
import type { Chain } from "thirdweb/chains";
import { client } from "./client";

const DECIMALS = 18;

const ERC20_APPROVE_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const STAKING_ABI = [
  {
    type: "function",
    name: "stake",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getReward",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },

  {
    type: "function",
    name: "earned",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "periodFinish",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "rewardsDuration",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

type Props = {
  tokenAddress: string;
  stakingAddress: string;
  chain: Chain;
};

function formatUnitsSafe(value?: bigint, decimals = 18) {
  if (value === undefined) return "0";
  const neg = value < 0n;
  const raw = (neg ? -value : value).toString();

  if (decimals === 0) return (neg ? "-" : "") + raw;

  const pad = raw.padStart(decimals + 1, "0");
  const intPart = pad.slice(0, -decimals);
  let fracPart = pad.slice(-decimals).replace(/0+$/, "");
  const out = fracPart ? `${intPart}.${fracPart}` : intPart;
  return (neg ? "-" : "") + out;
}

function formatCompact(numStr: string, maxFrac = 4) {
  if (!numStr.includes(".")) return numStr;
  const [a, b] = numStr.split(".");
  return `${a}.${b.slice(0, maxFrac)}`.replace(/\.$/, "");
}

function toDateFromSeconds(seconds?: bigint) {
  if (!seconds) return "—";
  const ms = Number(seconds) * 1000;
  if (!Number.isFinite(ms) || ms <= 0) return "—";
  return new Date(ms).toLocaleString();
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function StakingCard({ tokenAddress, stakingAddress, chain }: Props) {
  const account = useActiveAccount();
  const address = account?.address;

  const [amount, setAmount] = useState("1");
  const [busy, setBusy] = useState<null | "approve" | "stake" | "withdraw" | "claim">(null);
  const [banner, setBanner] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  const { mutate: sendTx } = useSendTransaction();

  const tokenRead = useMemo(
    () => getContract({ client, chain, address: tokenAddress }),
    [chain, tokenAddress]
  );

  const tokenWrite = useMemo(
    () => getContract({ client, chain, address: tokenAddress, abi: ERC20_APPROVE_ABI }),
    [chain, tokenAddress]
  );

  const staking = useMemo(
    () => getContract({ client, chain, address: stakingAddress, abi: STAKING_ABI }),
    [chain, stakingAddress]
  );

  const zero = "0x0000000000000000000000000000000000000000";

  // Reads
  const tokenBalance = useReadContract(balanceOf, {
    contract: tokenRead,
    address: address ?? zero,
  });

  const tokenAllowance = useReadContract(allowance, {
    contract: tokenRead,
    owner: address ?? zero,
    spender: stakingAddress,
  });

  const stakedBalance = useReadContract({
    contract: staking,
    method: "balanceOf",
    params: [address ?? zero],
  });

  const earnedRewards = useReadContract({
    contract: staking,
    method: "earned",
    params: [address ?? zero],
  });

  const periodFinish = useReadContract({
    contract: staking,
    method: "periodFinish",
    params: [],
  });

  const rewardsDuration = useReadContract({
    contract: staking,
    method: "rewardsDuration",
    params: [],
  });

  const refreshReads = () => {
    // @ts-ignore
    tokenBalance?.refetch?.();
    // @ts-ignore
    tokenAllowance?.refetch?.();
    // @ts-ignore
    stakedBalance?.refetch?.();
    // @ts-ignore
    earnedRewards?.refetch?.();
    // @ts-ignore
    periodFinish?.refetch?.();
    // @ts-ignore
    rewardsDuration?.refetch?.();
  };

  const walletBalWei = tokenBalance.data ?? 0n;
  const stakedBalWei = (stakedBalance.data as bigint | undefined) ?? 0n;
  const earnedBalWei = (earnedRewards.data as bigint | undefined) ?? 0n;
  const allowanceWei = tokenAllowance.data ?? 0n;

  // ✅ Use WEI for approve/stake/withdraw (staking contract expects token base units)
  const amountWei = useMemo(() => {
    try {
      return toUnits(amount || "0", DECIMALS);
    } catch {
      return 0n;
    }
  }, [amount]);

  const amountInputInvalid = useMemo(() => {
    const v = amount.trim();
    if (!v) return false;
    // Basic guard: toUnits will throw on invalid; we treat amountWei==0 with non-zero text as invalid below
    // This keeps behavior simple without being overly strict.
    return false;
  }, [amount]);

  const allowanceOk = allowanceWei >= amountWei && amountWei > 0n;

  const canApprove = !!address && busy === null && amountWei > 0n;
  const canStake =
    !!address &&
    busy === null &&
    amountWei > 0n &&
    amountWei <= walletBalWei &&
    allowanceWei >= amountWei;

  const canWithdraw =
    !!address &&
    busy === null &&
    amountWei > 0n &&
    amountWei <= stakedBalWei;

  const canClaim = !!address && busy === null;

  const runPrepared = (label: typeof busy, preparedTx: any) => {
    setBusy(label);
    setBanner({ type: "info", msg: "Confirm in wallet…" });

    sendTx(preparedTx, {
      onSuccess: () => setBanner({ type: "success", msg: "Transaction submitted ✅" }),
      onError: (err: any) =>
        setBanner({ type: "error", msg: `Tx failed: ${String(err?.message ?? err)}` }),
      onSettled: () => {
        setBusy(null);
        refreshReads();
      },
    });
  };

  // Actions
  const doApprove = () => {
    if (!address) return;
    if (amountWei <= 0n) return;

    const tx = prepareContractCall({
      contract: tokenWrite,
      method: "approve",
      params: [stakingAddress, amountWei],
    });

    runPrepared("approve", tx);
  };

  const doStake = () => {
    if (!address) return;
    if (amountWei <= 0n) return;

    const tx = prepareContractCall({
      contract: staking,
      method: "stake",
      params: [amountWei], // ✅ wei
    });

    runPrepared("stake", tx);
  };

  const doWithdraw = () => {
    if (!address) return;
    if (amountWei <= 0n) return;

    const tx = prepareContractCall({
      contract: staking,
      method: "withdraw",
      params: [amountWei], // ✅ wei
    });

    runPrepared("withdraw", tx);
  };

  const doClaim = () => {
    if (!address) return;

    const tx = prepareContractCall({
      contract: staking,
      method: "getReward",
      params: [],
    });

    runPrepared("claim", tx);
  };

  // Display
  const balStr = formatCompact(formatUnitsSafe(walletBalWei, DECIMALS));
  const allowanceStr = formatCompact(formatUnitsSafe(allowanceWei, DECIMALS));
  const stakedStr = formatCompact(formatUnitsSafe(stakedBalWei, DECIMALS));
  const earnedStr = formatCompact(formatUnitsSafe(earnedBalWei, DECIMALS));

  const finishHuman = toDateFromSeconds(periodFinish.data as bigint | undefined);
  const durationDays =
    rewardsDuration.data ? (Number(rewardsDuration.data) / 86400).toFixed(2) : "—";

  const amountHint =
    !address
      ? "Connect wallet to stake"
      : amountWei <= 0n
        ? "Enter an amount"
        : !allowanceOk
          ? "Approve first, then Stake"
          : "Ready to stake";

  const styles = {
    card: {
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: 18,
      background: "rgba(15,15,18,0.85)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      maxWidth: 820,
      color: "#f4f4f5",
    } as const,
    titleRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 10,
      flexWrap: "wrap" as const,
    },
    title: { fontSize: 22, fontWeight: 800, margin: 0, color: "#f9fafb" } as const,
    sub: { margin: 0, opacity: 0.8, fontSize: 13, color: "#e5e7eb" } as const,
    pill: {
      fontSize: 12,
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 999,
      padding: "6px 10px",
      background: "rgba(255,255,255,0.06)",
      color: "#fff",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    } as const,
    banner: (type: "success" | "error" | "info") => ({
      borderRadius: 14,
      padding: "12px 14px",
      border: "1px solid rgba(255,255,255,0.10)",
      background:
        type === "success" ? "rgba(34,197,94,0.14)"
        : type === "error" ? "rgba(239,68,68,0.14)"
        : "rgba(59,130,246,0.12)",
      marginBottom: 12,
      color: "#f9fafb",
    }),
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
    label: { fontSize: 12, opacity: 0.75, marginBottom: 4, color: "#d1d5db" } as const,
    value: { fontSize: 16, fontWeight: 800, color: "#f9fafb" } as const,
    divider: {
      margin: "16px 0",
      border: "none",
      borderTop: "1px solid rgba(255,255,255,0.10)",
    } as const,
    formRow: {
      display: "flex",
      gap: 10,
      alignItems: "flex-end",
      flexWrap: "wrap" as const,
    } as const,
    inputWrap: { display: "flex", flexDirection: "column" as const, gap: 6 } as const,
    input: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "#0f1115",
      color: "#f4f4f5",
      minWidth: 260,
      outline: "none",
      fontSize: 14,
    } as const,
    helper: { fontSize: 12, opacity: 0.75, color: "#e5e7eb" } as const,
    btn: (variant: "primary" | "secondary") => ({
      padding: "10px 14px",
      borderRadius: 12,
      border:
        variant === "primary"
          ? "1px solid #ef4444"
          : "1px solid rgba(255,255,255,0.2)",
      background:
        variant === "primary"
          ? "linear-gradient(180deg, #ef4444, #991b1b)"
          : "#111318",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: 13,
    } as const),
    btnDisabled: { opacity: 0.55, cursor: "not-allowed" } as const,
    footer: {
      marginTop: 12,
      fontSize: 12,
      opacity: 0.78,
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      flexWrap: "wrap" as const,
      color: "#e5e7eb",
    } as const,
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } as const,
  };

  return (
    <div style={styles.card}>
      <div style={styles.titleRow}>
        <div>
          <h2 style={styles.title}>Staking</h2>
          <p style={styles.sub}>Stake BBNK into the staking contract to earn rewards.</p>
        </div>

        <div style={styles.pill} title={stakingAddress}>
          Staking: {shortAddr(stakingAddress)}
        </div>
      </div>

      {banner && (
        <div style={styles.banner(banner.type)}>
          <div style={{ fontWeight: 900, marginBottom: 4 }}>
            {banner.type === "success" ? "Success" : banner.type === "error" ? "Error" : "Info"}
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{banner.msg}</div>
        </div>
      )}

      <div style={styles.grid}>
        <div style={styles.stat}>
          <div style={styles.label}>Wallet BBNK</div>
          <div style={styles.value}>
            {balStr} <span style={{ fontWeight: 700, opacity: 0.8 }}>BBNK</span>
          </div>
        </div>

        <div style={styles.stat}>
          <div style={styles.label}>Staked</div>
          <div style={styles.value}>
            {stakedStr} <span style={{ fontWeight: 700, opacity: 0.8 }}>BBNK</span>
          </div>
        </div>

        <div style={styles.stat}>
          <div style={styles.label}>Earned</div>
          <div style={styles.value}>
            {earnedStr} <span style={{ fontWeight: 700, opacity: 0.8 }}>BBNK</span>
          </div>
        </div>

        <div style={styles.stat}>
          <div style={styles.label}>Allowance to Staking</div>
          <div style={styles.value}>
            {allowanceStr} <span style={{ fontWeight: 700, opacity: 0.8 }}>BBNK</span>
          </div>
        </div>

        <div style={styles.stat}>
          <div style={styles.label}>Rewards Duration</div>
          <div style={styles.value}>
            {durationDays} <span style={{ fontWeight: 700, opacity: 0.8 }}>days</span>
          </div>
        </div>

        <div style={styles.stat}>
          <div style={styles.label}>Period Finish</div>
          <div style={{ ...styles.value, fontSize: 14, fontWeight: 800 }}>{finishHuman}</div>
        </div>
      </div>

      <hr style={styles.divider} />

      <div style={styles.formRow}>
        <div style={styles.inputWrap}>
          <div style={{ fontWeight: 900, fontSize: 13, color: "#f9fafb" }}>
            Amount (BBNK)
          </div>
          <input
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setBanner(null);
            }}
            placeholder="1"
            style={styles.input}
          />
          <div style={styles.helper}>{amountHint}</div>
        </div>

        <button
          onClick={doApprove}
          disabled={!canApprove}
          style={{
            ...styles.btn("secondary"),
            ...(canApprove ? {} : styles.btnDisabled),
          }}
          title="Approve the staking contract to move your BBNK"
        >
          {busy === "approve" ? "Approving…" : "Approve"}
        </button>

        <button
          onClick={doStake}
          disabled={!canStake}
          style={{
            ...styles.btn("primary"),
            ...(canStake ? {} : styles.btnDisabled),
          }}
          title={!allowanceOk ? "Approve first" : "Stake"}
        >
          {busy === "stake" ? "Staking…" : "Stake"}
        </button>

        <button
          onClick={doWithdraw}
          disabled={!canWithdraw}
          style={{
            ...styles.btn("secondary"),
            ...(canWithdraw ? {} : styles.btnDisabled),
          }}
          title="Withdraw staked tokens (unstake)"
        >
          {busy === "withdraw" ? "Unstaking…" : "Unstake"}
        </button>

        <button
          onClick={doClaim}
          disabled={!canClaim}
          style={{
            ...styles.btn("secondary"),
            ...(canClaim ? {} : styles.btnDisabled),
          }}
          title="Claim earned rewards"
        >
          {busy === "claim" ? "Claiming…" : "Claim"}
        </button>
      </div>

      <div style={styles.footer}>
        <div style={styles.mono} title={tokenAddress}>
          Token: {shortAddr(tokenAddress)}
        </div>
        <div style={{ opacity: 0.78 }}>
          Tip: approve a bit more than you plan to stake to avoid approving every time.
        </div>
      </div>
    </div>
  );
}
