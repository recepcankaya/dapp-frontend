import { useState } from "react";

import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import { Mission } from "@/types/MissionType.types";

type MissionFormProps = {
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
};

let _id = 0;

export default function MissionForm({ setMissions }: MissionFormProps) {
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
  };

  /**
   * handles the text input which is written by the user for the mission
   * @param e the event that is triggered when the user types in the input
   */
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  /**
   * handles the case when the user enters less than 3 characters and return an error
   * @todo - add a toast message instead of an alert
   */
  const handleLessText = () => {
    if (text.length < 3) {
      alert("You cannot enter a mission");
    }
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
        <Button variant="outline">Add</Button>
      </form>
    </>
  );
}
