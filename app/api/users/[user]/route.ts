import { NextResponse } from "next/server";
import { users } from "@/mock/user";
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
    const user = await res.json();
    console.log("user: ", user);
    return NextResponse.json(user);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { text, type } = body;
  const jwtCookie = cookies().get("jwt");

  if (jwtCookie) {
    if (type === "add") {
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
      console.log("mission is added: ", data);
      const { id, user, title } = data;
      return NextResponse.json({ id, user, title });
    } else if (type === "finish") {
      // const mission = user?.missions.find((m) => m.id === id);
      // if (mission) {
      //   mission.isCompleted = !mission.isCompleted;
      // }
      // console.log("completed mission: ", mission?.text, mission?.isCompleted);
      // return NextResponse.json(mission);
    }
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { user: string } }
) {
  const body = await req.json();
  const { id } = body;
  const user = users.find((u) => u.username === params.user);
  let deletedMission;
  if (user) {
    deletedMission = user.missions.find((mission) => mission.id === id);
    user.missions = user.missions.filter((mission) => mission.id !== id);
  }
  console.log("deleted: ", deletedMission);

  return NextResponse.json(deletedMission);
}

// ---------- PRODUCTION ----------
/* export async function GET() {
//   const res = await fetch("https://jsonplaceholder.typicode.com/posts");
//   const data = await res.json();
//   return NextResponse.json(data);
 } 

export async function POST(request: Request) {
  const data = await request.json();
  console.log("The title is: ", data);

  const { title, userId } = data;

  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      // title,
      // body: "bar",
      // userId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  return NextResponse.json(await res.json());
} */
