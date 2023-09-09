type CustomButtonProps = {
  text: string;
  classNames: string;
};

export default function CustomButton({ text, classNames }: CustomButtonProps) {
  return <button className={classNames}>{text}</button>;
}
