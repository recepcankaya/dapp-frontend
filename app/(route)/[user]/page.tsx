"use client";
import { useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import MissionForm from "@/components/missions/MissionForm";
import MissionList from "@/components/missions/MissionList";
import { Mission } from "@/types/MissionType.types";

const Missions = ({ params }: { params: { user: string } }) => {
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
      <MissionForm
        setMissions={setMissions}
        missions={missions}
        user={params.user}
      />
      <MissionList
        missions={missions}
        setMissions={setMissions}
        user={params.user}
      />
    </main>
  );
};

export default Missions;
