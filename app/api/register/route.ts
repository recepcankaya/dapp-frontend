import { NextResponse } from "next/server";
import { users } from "@/mock/user";

type User = {
  username: string;
  timezone: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const { username, timezone, password } = body;
  users.push({
    username,
    timezone,
    email: "",
    wallet: "",
    missions: [],
  });
  console.log(users);
  return NextResponse.json({ username, timezone, password });
}
