import { useState, useEffect, useCallback } from "react";
import { useAnimate } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormPropsTypes, Mission } from "@/types/MissionType.types";
import { toastError, toastSuccess } from "@/lib/toast/toast";

import { Input } from "../ui/input";
import { Button } from "../ui/Button";

export default function MissionForm({
  setMissions,
  missions,
  user,
}: FormPropsTypes) {
  // Input value for the mission
  const [text, setText] = useState("");
  const [scope, animate] = useAnimate();

  /**
   * handles the text input which is written by the user for the mission
   * @param e the event that is triggered when the user types in the input
   */
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  /**
   * Handles the form submission for adding a new mission.
   * @param e - The form event.
   */
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length < 3) {
      toastError("The mission should be at least 3 characters");
      return;
    }
    const latestId = await getUserLatestMissionId();
    console.log(latestId);
    const res = await addMission({ id: latestId, text, isCompleted: false });
    console.log(res);
    setText("");
    toastSuccess("The mission is added");
    await displayMissions();
  };

  /**
   * Retrieves the latest mission ID for a given user.
   * @returns {Promise<number>} The latest mission ID.
   */
  const getUserLatestMissionId = async (): Promise<number> => {
    try {
      const res = await fetch(`/api/users/${user}`);
      const data = await res.json();
      console.log("Data is", data);
      if (!data.user.missions || data.user.missions.length === 0) {
        console.log("User has no missions");
        return 0;
      } else {
        return data.user.missions[data.user.missions.length - 1].id + 1;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  /**
   * Adds a new mission to the database.
   * @param {Mission} mission - The mission object to be added.
   * @returns {Promise<void>} - A promise that resolves when the mission is successfully added.
   */
  const addMission = async (mission: Mission): Promise<void> => {
    try {
      const { id, text, isCompleted } = mission;
      const res = await fetch(`/api/users/${user}`, {
        method: "POST",
        body: JSON.stringify({ id, text, isCompleted, type: "add" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetches the missions for the given user and updates the state with the new missions.
   * @returns {Promise<void>}
   */
  const displayMissions = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${user}`);
      const data = await res.json();
      if (data.user && data.user.missions) {
        const newMissions = data.user.missions.map((missionData: any) => {
          const { id, text, isCompleted } = missionData;
          return { id, text, isCompleted };
        });
        setMissions(newMissions);
      } else if (data.user && !data.user.missions) {
        const newMission = {
          id: data.user.missions.id,
          text: data.user.missions.text,
          isCompleted: data.user.missions.isCompleted,
        };
        setMissions([newMission]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, setMissions]);

  const handleAnimation = useCallback(async () => {
    await animate(
      "path",
      { opacity: [0, 1], pathLength: [0, 1] },
      { duration: 3, ease: "easeInOut" }
    );
    await animate(
      "h2",
      { opacity: 1, y: [-100, 0] },
      { duration: 1, ease: "easeInOut" }
    );
    await animate(
      "input",
      { opacity: 1, y: [100, 0] },
      { duration: 1, ease: "easeInOut" }
    );
    await animate(
      "button",
      { opacity: 1, y: [100, 0] },
      { duration: 1, ease: "easeInOut" }
    );
  }, [animate]);

  useEffect(() => {
    displayMissions();
    handleAnimation();
  }, [displayMissions, handleAnimation]);

  return (
    <section ref={scope} className="h-auto w-full pt-12">
      <div className="w-72 sm:w-96 md:w-[30rem] lg:w-[36rem] h-72 sm:h-96 md:h-[30rem] lg:h-[36rem] relative mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1543 1355"
          width="1543"
          height="1355"
          fill="none"
          className="absolute top-0 left-0 w-full h-full">
          <path
            d="M423.63 46.4301L8 140.302V1001.51L771.5 1346L1535 1001.51V140.302L1119.37 46.4301C890.932 -4.81004 652.068 -4.81004 423.63 46.4301Z"
            fill="#D3C189"
            stroke="#EB596E"
            strokeWidth="15"
          />
        </svg>
        <form
          onSubmit={handleFormSubmit}
          className="absolute top-12 sm:top-16 md:top-20 lg:top-24 left-8 sm:left-12 md:left-16 lg:left-20 flex flex-col items-center gap-0 sm:gap-4 md:gap-8 w-3/4 h-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center opacity-0">
            Add Mission
          </h2>
          {/* make this label responsive */}
          {/* <Label htmlFor="mission" className="lg:text-lg -mb-10 float-left">
        Mission
      </Label> */}
          <Input
            placeholder="Run 3 miles"
            className="mt-5 py-3 md:py-4 lg:py-6 lg:text-lg bg-white border-2 border-[#EB596E] placeholder:italic opacity-0"
            value={text}
            onChange={handleText}
            id="mission"
            name="mission"
          />
          <Button
            type="submit"
            className="mt-5 w-full bg-[#EB596E] border-2 border-white opacity-0">
            Add
          </Button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
