import { useState, useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { toastError, toastSuccess } from "@/lib/toast/toast";
import { Mission } from "@/types/MissionType.types";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";

type MissionFormProps = {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
};

const pathVariants = {
  initial: { opacity: 0, pathLength: 0 },
  animate: {
    opacity: 1,
    pathLength: 1,
    transition: { duration: 3, ease: "easeInOut" },
  },
};

let _id = 0;

export default function MissionForm({
  setMissions,
  missions,
}: MissionFormProps) {
  // Input value for the mission
  const [text, setText] = useState("");
  const [scope, animate] = useAnimate();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length < 3) {
      toastError("The mission should be at least 3 characters");
      return;
    }

    setMissions((prev) => [
      ...prev,
      { id: _id, text: text, isCompleted: false },
    ]);
    _id++;
    setText("");
    toastSuccess("The mission is added");
  };

  /**
   * handles the text input which is written by the user for the mission
   * @param e the event that is triggered when the user types in the input
   */
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // =================== IT WILL BE ACTIVATED LATER ===================
  /**
   * function that iterate over the missions array and if there is a mission with the same text
   * @param _text the text of the mission
   */
  // const checkMission = (_text: string) => {
  //   const mission = missions.find((m) => m.text === _text);
  //   if (mission !== undefined) {
  //     toast.error("You have that mission already", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: false,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };
  // ==================================================================

  const handleAnimation = async () => {
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
  };

  useEffect(() => {
    handleAnimation();
  }, []);

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
          <Input
            placeholder="Run 3 miles"
            className="mt-5 py-3 md:py-4 lg:py-6 lg:text-lg bg-white border-2 border-[#EB596E] placeholder:italic opacity-0"
            value={text}
            onChange={handleText}
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
