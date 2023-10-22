"use client";
import { NextPage } from "next";

import MissionForm from "@/components/missions/MissionForm";
import MissionList from "@/components/missions/MissionList";
import { useState } from "react";
import { Mission } from "@/types/MissionType.types";

const Missions: NextPage = () => {
  const [missions, setMissions] = useState<Mission[]>([]);

  return (
    <div>
      <MissionForm setMissions={setMissions} />
      <MissionList missions={missions} setMissions={setMissions} />
    </div>
  );
};

export default Missions;
