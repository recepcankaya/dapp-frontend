import { NextPage } from "next";

import MissionForm from "@/components/missions/MissionForm";
import MissionList from "@/components/missions/MissionList";

const Missions: NextPage = () => {
  return (
    <>
      <MissionForm />
      <MissionList />
    </>
  );
};

export default Missions;
