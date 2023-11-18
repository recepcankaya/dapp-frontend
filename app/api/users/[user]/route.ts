import { NextResponse } from "next/server";
import { users } from "@/mock/user";

export async function GET(
  req: Request,
  { params }: { params: { user: string } }
) {
  const res = await fetch(
    "https://akikoko.pythonanywhere.com/api/user/user_detail/"
  );
  const user = await res.json();
  console.log("user: ", user);
  return NextResponse.json(user);
}

export async function POST(
  req: Request,
  { params }: { params: { user: string } }
) {
  const body = await req.json();
  const { id, text, isCompleted, type } = body;
  const user = users.find((u) => u.username === params.user);

  if (type === "add") {
    const data = { id, text, isCompleted };
    user?.missions.push(data);
    console.log("mission is added: ", data);
    return NextResponse.json(data);
  } else if (type === "finish") {
    const mission = user?.missions.find((m) => m.id === id);
    if (mission) {
      mission.isCompleted = !mission.isCompleted;
    }
    console.log("completed mission: ", mission?.text, mission?.isCompleted);
    return NextResponse.json(mission);
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
