import { users } from "@/mock/user";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { user: string } }
) {
  const user = users.find((u) => u.username === params.user);
  return new Response(JSON.stringify({ user }));
}

export async function POST(req: Request): Promise<Response> {
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
    return new Response(JSON.stringify({ u }));
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}
