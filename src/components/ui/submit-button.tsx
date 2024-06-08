import { useFormStatus } from "react-dom";
import { Button } from "./button";

type SubmitButtonProps = {
  type: "button" | "submit" | "reset" | undefined;
  className: string;
  title: string;
};

export default function SubmitButton({
  type,
  className,
  title,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type={type} className={className}>
      {pending ? (
        <div className="w-7 h-7 animate-spin rounded-full border-b-2 border-black"></div>
      ) : (
        title
      )}
    </Button>
  );
}
