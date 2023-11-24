import { cookies } from "next/headers";

export async function GET(req: Request) {
  const jwtCookie = cookies().get("jwt");

  if (jwtCookie) {
    const res = await fetch(
      "https://akikoko.pythonanywhere.com/api/user/user_detail/",
      {
        headers: {
          Authorization: `Bearer ${jwtCookie.value}`,
        },
      }
    );
    const data = await res.json();
    console.log("profile data: ", data);
    const { username, email, timeZone } = data;
    return new Response(JSON.stringify({ username, email, timeZone }));
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}

export async function POST(req: Request): Promise<Response> {
  const jwtCookie = cookies().get("jwt");
  const body = await req.json();
  const { username } = body;

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
        }),
      }
    );
    const data = await res.json();
    console.log("profile data: ", data);
    const { username: u } = data;
    return new Response(JSON.stringify({ u }));
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}
