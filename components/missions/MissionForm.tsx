"use client";
import { useState } from "react";
import { Button } from "../ui/Button";

export default function MissionForm() {
  const [text, setText] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length < 3) {
      return handleLessText();
    }
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleLessText = () => {
    if (text.length < 3) {
      alert("You cannot enter a mission");
    }
  };

  return (
    <>
      <form
        className="w-1/2 h-72 p-12 flex flex-col justify-between bg-ultraViolet border border-solid border-ultraViolet rounded-md"
        onSubmit={handleFormSubmit}>
        <h2 className="text-2xl text-bgColor text-center">Add Missions</h2>
        <input
          className="h-[1.80rem] pl-2 py-4 rounded-xl border border-solid border-ultraViolet focus:outline-none"
          value={text}
          onChange={handleText}
        />
        <Button className="mx-auto py-2 w-1/2 bg-bgColor rounded-3xl hover:bg-[#6A666C] hover:text-bgColor">
          Add
        </Button>
      </form>
    </>
  );
}
