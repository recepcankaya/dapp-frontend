import { Button } from "../ui/Button";
import { Input } from "../ui/input";

type MissionFormProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setMissions: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function MissionForm({
  text,
  setText,
  setMissions,
}: MissionFormProps) {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length < 3) {
      return handleLessText();
    }
    setMissions((prev) => [...prev, text]);
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
