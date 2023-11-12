"use client";

import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertdialog";
import { Mission } from "@/types/MissionType.types";
import styles from "@/styles/MissionList.module.css";

type MissionListProps = {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
};

export default function MissionList({
  missions,
  setMissions,
}: MissionListProps) {
  /**
   * The action that marks the mission as completed
   * @param index the index of the mission
   */
  const handleCompleted = (index: number) => {
    setMissions((prev) => {
      const updatedMissions = [...prev]; // Create a copy of the missions array
      updatedMissions[index] = {
        ...updatedMissions[index],
        isCompleted: true,
      };
      return updatedMissions; // Update the state with the modified array
    });
  };

  /**
   * The action that deletes the mission
   * @param mission the mission that is going to be deleted
   */
  const handleDeleted = (mission: Mission) => {
    setMissions(missions.filter((m) => m.id !== mission.id));
  };

  return (
    <section className="pt-12 w-full">
      {missions.map((mission, idx) => (
        <ul
          className="mx-auto mb-16 w-[90%] h-auto sm:flex sm:items-center sm:justify-around sm:gap-1.5"
          key={mission.id}>
          {/* @todo - work with border here. add it to divs */}
          <div className="mx-auto w-1/2 sm:w-auto h-16 md:h-20 mb-4 sm:mb-0 font-bold text-sm md:text-base sm:order-last">
            <p className="-mb-2">Completed days</p>
            <div className="bg-[url('/designs/sand-watch.svg')] bg-no-repeat w-full h-full bg-contain bg-center flex flex-col items-center justify-center gap-2">
              <span>5</span>
              <span>21</span>
            </div>
          </div>
          <li
            className={`${
              mission.isCompleted ? styles.cardChanged : styles.card
            } w-full sm:w-3/4 xl:7/12 h-16 md:h-20 rounded-3xl flex items-center justify-between mx-auto`}>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  disabled={mission.isCompleted}
                  onClick={() => {
                    handleCompleted(idx);
                  }}
                  className="bg-[url('/designs/button-shield.svg')] bg-no-repeat bg-transparent h-full hover:bg-[url('/designs/button-shield-finish-hover.svg')] hover:bg-transparent text-sm lg:text-base"
                  style={{
                    backgroundSize: "100% 100%",
                  }}>
                  Finish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">
                    You are rocking!
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You completed today&apos;s mission. Keep up the good work!
                    As your reward, we sent LDT token to your account🥳🎉
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Back to page</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-center text-lg sm:text-xl md:text-2xl">
              {mission.text}
            </p>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  className="bg-[url('/designs/button-shield.svg')] bg-no-repeat bg-transparent h-full hover:bg-[url('/designs/button-shield-delete-hover.svg')] hover:bg-transparent text-sm lg:text-base"
                  style={{
                    backgroundSize: "100% 100%",
                  }}>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you want to delete your mission🥺? If you sure, you will
                    lose your progress for this mission.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-foreground">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleted(mission)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        </ul>
      ))}
    </section>
  );
}
