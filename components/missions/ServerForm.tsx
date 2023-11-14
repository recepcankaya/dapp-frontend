import { toastError, toastSuccess } from "@/lib/toast/toast";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";

type ServerFormProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

// const addMission = async (formData: FormData) => {
//   const title = formData.get("mission")?.valueOf();
//   const res = await fetch("http://127.0.0.1:8000/api/mission/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify({ title }),
//   });

//   if (res.ok) {
//     console.log("Ok");
//   } else {
//     console.log("HTTP-Error: " + res.status);
//   }
// };

export default function ServerForm({ text, setText }: ServerFormProps) {
  /**
   * handles the text input which is written by the user for the mission
   * @param e the event that is triggered when the user types in the input
   */
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length < 3) {
      toastError("The mission should be at least 3 characters");
      return;
    }
    setText("");
    toastSuccess("The mission is added");
  };

  return (
    <form
      // action={addMission}
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
  );
}
