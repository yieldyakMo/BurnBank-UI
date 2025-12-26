"use client";

import { BridgeWidget } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export default function BridgeWidgetBox() {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-white/10 bg-black/40 p-4">
      <h2 className="text-xl font-semibold mb-3">Bridge</h2>
      <BridgeWidget client={client} />
    </div>
  );
}

