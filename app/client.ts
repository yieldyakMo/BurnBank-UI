import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  // This prevents silent “spinning” when the env var is missing in production builds.
  throw new Error(
    "Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID. Set it in your hosting env vars (or .env.local).",
  );
}

export const client = createThirdwebClient({ clientId });

