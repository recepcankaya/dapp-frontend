import { users } from "@/mock/user";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(
  req: Request,
  { params }: { params: { user: string } }
) {
  const user = users.find((u) => u.username === params.user);
  return NextResponse.json({ user });
}

export async function POST(req: Request) {
  const jwtCookie = cookies().get("jwt");
  const body = await req.json();
  const { username, email } = body;

  if (jwtCookie) {
    const res = await fetch(
      "https://akikoko.pythonanywhere.com/api/user/profile_update/",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtCookie.value}`,
        },
        body: JSON.stringify({
          username,
          email,
        }),
      }
    );
    const data = await res.json();
    console.log("profile data: ", data);
    const { username: u } = data;
    redirect(`/${u}`);
  }
}
