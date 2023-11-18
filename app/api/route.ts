import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const jwtToken = cookies();
  if (jwtToken.has("jwt") === true) {
    const jwtValue = jwtToken.get("jwt");
    if (jwtValue) {
      const decodedToken = jwt.decode(jwtValue.value);
      console.log("decodedToken: ", decodedToken);
      return NextResponse.json(decodedToken);
    }
  } else {
    return NextResponse.json({ error: "No JWT token found" });
  }
}
