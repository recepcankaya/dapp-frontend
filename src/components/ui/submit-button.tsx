import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { FormEvent } from "react";

type SubmitButtonProps = {
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className: string;
  title: string;
  onClick?: (e: FormEvent<Element>) => Promise<void>;
};

export default function SubmitButton({
  type,
  className,
  title,
  onClick,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type={type}
      className={className}
      onClick={onClick}>
      {pending ? (
        <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-white"></div>
      ) : (
        title
      )}
    </Button>
  );
}
