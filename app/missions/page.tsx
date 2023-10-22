"use client";
import { NextPage } from "next";

import MissionForm from "@/components/missions/MissionForm";
import MissionList from "@/components/missions/MissionList";
import { useState } from "react";

const Missions: NextPage = () => {
  const [text, setText] = useState("");
  const [missions, setMissions] = useState<string[]>([]);

  return (
    <div>
      <MissionForm text={text} setText={setText} setMissions={setMissions} />
      <MissionList missions={missions} />
    </div>
  );
};

export default Missions;
