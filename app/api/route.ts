import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const jwtToken = cookies();
  if (jwtToken.has("jwt") === true) {
    const jwtValue = jwtToken.get("jwt");
    if (jwtValue) {
      const decodedToken = jwt.decode(jwtValue.value);
      console.log("decodedToken: ", decodedToken);
      return new Response(JSON.stringify(decodedToken));
    }
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}
