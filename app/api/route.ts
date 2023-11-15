import { NextResponse } from "next/server";
import { users } from "@/mock/user";

export async function GET() {
  return NextResponse.json(users);
}
