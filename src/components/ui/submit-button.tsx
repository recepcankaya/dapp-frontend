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
        <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-white"></div>
      ) : (
        title
      )}
    </Button>
  );
}
