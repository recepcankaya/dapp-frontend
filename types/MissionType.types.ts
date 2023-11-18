export type Mission = {
  id: number;
  text: string;
  numberOfDays: number;
  isCompleted: boolean;
  prevDate: string;
};

export type FormPropsTypes = {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  username: string;
};
