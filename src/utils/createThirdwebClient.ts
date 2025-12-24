// src/utils/createThirdwebClient.ts (this is a server-side utility)

import { createThirdwebClient } from "thirdweb";

// This utility will only be executed server-side
export const getThirdwebClient = () => {
  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT as string, // Secure server-side access
    secretKey: process.env.THIRDWEB_SECRET_KEY as string,
  });
  return client;
};