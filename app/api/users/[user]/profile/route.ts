import { users } from "@/mock/user";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { user: string } }
) {
  const user = users.find((u) => u.username === params.user);
  return NextResponse.json({ user });
}

export async function POST(
  req: Request,
  { params }: { params: { user: string } }
) {
  const body = await req.json();
  const { username, timezone, email } = body;
  const user = users.find((u) => u.username === params.user);
  if (user) {
    user.username = username ? username.toString() : "";
    user.timezone = timezone ? timezone.toString() : "";
    user.email = email ? email.toString() : "";
  }
  console.log("Fields changed:", {
    username,
    timezone,
    email,
  });
  return NextResponse.json({
    username,
    timezone,
    email,
  });
}
