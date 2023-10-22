"use client";
import { useState } from "react";
import { useReward } from "react-rewards";

import styles from "@/styles/MissionList.module.css";
import { Button } from "../ui/Button";
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

type SelectedItemIndex = {
  index: number;
};

type MissionListProps = {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
};

export default function MissionList({
  missions,
  setMissions,
}: MissionListProps) {
  const { reward, isAnimating } = useReward("rewardId", "confetti");

  /**
   * The action that marks the mission as completed
   * @param _index the index of the mission
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
   * @param _index the index of the mission
   */
  const handleDeleted = (_mission: Mission) => {
    setMissions(missions.filter((m) => m.id !== _mission.id));
  };

  return missions.map((mission, idx) => (
    <ul className="mt-16 w-2/3 h-24" key={mission.id}>
      <li className={mission.isCompleted ? styles.cardChanged : styles.card}>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              disabled={isAnimating}
              onClick={() => {
                handleCompleted(idx);
                reward();
              }}
              className="bg-[#974EC3]">
              <span id="rewardId">Finish</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>You are rocking!</AlertDialogTitle>
              <AlertDialogDescription>
                You completed today&apos;s mission. Keep up the good work! As
                your reward, we sent LDT token to your account 🥳🎉
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Back to page</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="text-center text-foreground text-2xl">{mission.text}</p>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button className="bg-[#77037B]">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to delete your mission 🥺? If you sure, you will
                lose your progress for this mission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleted(mission)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </li>
    </ul>
  ));
}
