import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  secretKey: String(process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID),
});
