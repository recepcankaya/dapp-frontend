"use client";
import { NextPage } from "next";
import { useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import MissionForm from "@/components/missions/MissionForm";
import MissionList from "@/components/missions/MissionList";
import { Mission } from "@/types/MissionType.types";
import { Button } from "@/components/ui/Button";

const Missions: NextPage = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const { width, height } = useWindowSize();

  return (
    <main className="bg-[#9376E0] min-h-screen w-full relative pb-10">
      {/* @note - A bug in confetti: Confetti displays behind alertdialog  */}
      {missions.map((mission) =>
        mission.isCompleted === true ? (
          <Confetti
            key={mission.id}
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            confettiSource={{
              w: 10,
              h: 10,
              x: width / 2,
              y: height / 2,
            }}
          />
        ) : null
      )}
      <MissionForm setMissions={setMissions} missions={missions} />
      <MissionList missions={missions} setMissions={setMissions} />
    </main>
  );
};

export default Missions;
