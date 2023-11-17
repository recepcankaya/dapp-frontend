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
import styles from "@/styles/MissionList.module.css";
import { useCallback, useEffect } from "react";
import { FormPropsTypes, Mission } from "@/types/MissionType.types";

export default function MissionList({
  missions,
  setMissions,
  user,
}: FormPropsTypes) {
  /**
   * Marks the mission at the specified index as completed and updates the state and server accordingly.
   * @param index - The index of the mission to mark as completed.
   */
  const handleCompleted = async (index: number) => {
    try {
      const mission = missions.find((m) => m.id === index);
      if (mission) {
        mission.isCompleted = true;
      }
      const res = await fetch(`/api/users/${user}`, {
        method: "POST",
        body: JSON.stringify({ ...mission, type: "finish" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Finished mission", data);
      setMissions((prev) => {
        const updatedMissions = [...prev]; // Create a copy of the missions array
        updatedMissions[index] = {
          ...updatedMissions[index],
          isCompleted: true,
        };
        return updatedMissions; // Update the state with the modified array
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Deletes a mission from the list of missions and sends a DELETE request to the server.
   * @param index - The index of the mission to be deleted.
   */
  const handleDeleted = async (index: number) => {
    try {
      const mission = missions.find((m) => m.id === index);
      const res = await fetch(`/api/users/${user}`, {
        method: "DELETE",
        body: JSON.stringify({ id: mission?.id }),
      });
      const data = await res.json();
      console.log("Deleted mission", data);
      setMissions(missions.filter((m) => m.id !== mission?.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="pt-12 w-full">
      {missions.map((mission) => (
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
              mission?.isCompleted ? styles.cardChanged : styles.card
            } w-full sm:w-3/4 xl:7/12 h-16 md:h-20 rounded-3xl flex items-center justify-between mx-auto`}>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  disabled={mission?.isCompleted}
                  onClick={() => {
                    handleCompleted(mission.id);
                  }}
                  // @todo - does not work
                  className={`${
                    mission?.isCompleted ? "cursor-not-allowed" : ""
                  } bg-[url('/designs/button-shield.svg')] bg-no-repeat bg-transparent h-full hover:bg-[url('/designs/button-shield-finish-hover.svg')] hover:bg-transparent text-sm lg:text-base`}
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
                  <AlertDialogAction onClick={() => handleDeleted(mission.id)}>
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
