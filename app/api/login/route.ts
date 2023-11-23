import { cookies } from "next/headers";

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  console.log("Register body: ", body);
  const { username, password } = body;

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
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  // Set the access token in cookies
  cookies().set({
    name: "jwt",
    value: accessToken,
    httpOnly: true,
    expires: new Date(Date.now() + ninetyDays),
  });

  if (accessToken) {
    return new Response(JSON.stringify(username));
  }
  return new Response(JSON.stringify({ error: "Login failed" }));
}
