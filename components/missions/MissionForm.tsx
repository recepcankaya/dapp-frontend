import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import { Mission } from "@/types/MissionType.types";

type MissionFormProps = {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
};

let _id = 0;

export default function MissionForm({
  setMissions,
  missions,
}: MissionFormProps) {
  // Input value for the mission
  const [text, setText] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length < 3) {
      return handleLessText();
    }

    setMissions((prev) => [
      ...prev,
      { id: _id, text: text, isCompleted: false },
    ]);
    _id++;
    setText("");
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

  /**
   * handles the case when the user enters less than 3 characters and return an error
   */
  const handleLessText = () => {
    toast.error("You have to enter a mission", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      <form
        className="w-1/2 h-72 p-12 flex flex-col justify-between bg-btnNotifyColor rounded-md text-foreground"
        onSubmit={handleFormSubmit}>
        <h2 className="text-2xl text-center">Add Missions</h2>
        <Input
          placeholder="Run 3 miles"
          className="placeholder:italic"
          value={text}
          onChange={handleText}
        />
        <Button type="submit">Add</Button>
        <ToastContainer />
      </form>
    </>
  );
}
