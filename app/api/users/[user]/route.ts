import { cookies } from "next/headers";

export async function GET(req: Request): Promise<Response> {
  const jwtCookie = cookies().get("jwt");
  if (jwtCookie) {
    const res = await fetch(
      "https://akikoko.pythonanywhere.com/api/user/mission_list/",
      {
        headers: {
          Authorization: `Bearer ${jwtCookie.value}`,
        },
      }
    );
    const missions = await res.json();
    console.log("missions: ", missions);
    return new Response(JSON.stringify(missions));
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { text } = body;
  const jwtCookie = cookies().get("jwt");

  if (jwtCookie) {
    const res = await fetch(
      "https://akikoko.pythonanywhere.com/api/mission/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtCookie.value}`,
        },
        body: JSON.stringify({
          title: text,
        }),
      }
    );
    const data = await res.json();
    if (data.message) {
      return new Response(JSON.stringify({ message: data.message }));
    } else {
      console.log("mission is added: ", data);
      const { id, title } = data;
      return new Response(JSON.stringify({ id, title }));
    }
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}

export async function PATCH(req: Request): Promise<Response> {
  const jwtCookie = cookies().get("jwt");
  const body = await req.json();
  const { index } = body;
  if (jwtCookie) {
    const res = await fetch(
      `https://akikoko.pythonanywhere.com/api/mission/complete/${index}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtCookie.value}`,
        },
      }
    );
    await res.json();
    console.log("Mission is completed");
    return new Response(JSON.stringify({ message: "Mission is completed" }));
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}

export async function DELETE(req: Request): Promise<Response> {
  const jwtCookie = cookies().get("jwt");
  const body = await req.json();
  const { id } = body;
  if (jwtCookie) {
    const res = await fetch(
      `https://akikoko.pythonanywhere.com/api/mission/delete/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtCookie.value}`,
        },
      }
    );
    await res.json();
    console.log("Mission is deleted");
    return new Response(
      JSON.stringify({ message: "Mission deleted successfully" })
    );
  }
  return new Response(JSON.stringify({ error: "No JWT token found" }));
}