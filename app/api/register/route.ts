import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Register body: ", body);
  const { username, timezone, password } = body;
  const res = await fetch(
    "https://akikoko.pythonanywhere.com/api/user/register/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email: "abc@outlook.com",
        password,
      }),
    }
  );
  const user = await res.json();
  console.log("User registered: ", user);
  const jwtRes = await fetch(
    "https://akikoko.pythonanywhere.com/api/auth/get_token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );
  const jwtData = await jwtRes.json();
  console.log("JwtData: ", jwtData);
  const accessToken = jwtData.access;
  console.log("Access token: ", accessToken);
  // Set the access token in cookies
  cookies().set({
    name: "jwt",
    value: accessToken,
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
  });

  return NextResponse.json(user);
}
