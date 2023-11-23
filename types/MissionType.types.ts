export type Mission = {
  id: number;
  title: string;
  numberOfDays: number;
  isCompleted: boolean;
  prevDate: Date;
};

export type FormPropsTypes = {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  username: string;
};
