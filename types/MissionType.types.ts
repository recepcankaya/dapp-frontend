export type Mission = {
  id: number;
  text: string;
  isCompleted: boolean;
};

export type FormPropsTypes = {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  user: string;
};
