import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, timezone, password } = body;
  console.log("User register info:", {
    username,
    timezone,
    password,
  });
  return NextResponse.json({ username, timezone, password });
}
