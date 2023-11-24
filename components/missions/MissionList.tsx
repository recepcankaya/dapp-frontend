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
import { toastInfo } from "@/lib/toast/toast";
import styles from "@/styles/MissionList.module.css";
import { FormPropsTypes } from "@/types/MissionType.types";
import { useEffect } from "react";

export default function MissionList({
  missions,
  setMissions,
  username,
}: FormPropsTypes) {
  /**
   * Marks the mission at the specified index as completed and updates the state and server accordingly.
   * @param index - The index of the mission to mark as completed.
   */
  const handleCompleted = async (index: number) => {
    try {
      await fetch(`/api/users/${username}`, {
        method: "PATCH",
        body: JSON.stringify({ index }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const missionIndex = missions.findIndex(
        (mission) => mission.id === index
      );
      setMissions((prevMissions) => {
        const updatedMissions = [...prevMissions];
        const missionToUpdate = updatedMissions[missionIndex];

        updatedMissions[missionIndex] = {
          ...missionToUpdate,
          isCompleted: true,
          numberOfDays: missionToUpdate.numberOfDays + 1,
          prevDate: new Date(),
        };

        return updatedMissions;
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Deletes a mission from the list of missions and sends a DELETE request to the server.
   * @param index - The index of the mission to be deleted.
   */
  const handleDeleted = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${username}`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      // You can check the response status to ensure the deletion was successful
      if (!res.ok) {
        throw new Error("Failed to delete the mission");
      }
      const data = await res.json();
      console.log("Deleted mission", data);
      setMissions(missions.filter((m) => m.id !== id));
      toastInfo(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Before the user clicks the finish button, request to access to user's camera or gallery depend on what device they are using.
   * Then, the user can take a picture or choose a picture from their gallery.
   * After that, the picture will be sent to the server and the server will return the result of the picture.
   */

  /**
   * If the time which has passed since the last completed mission is greater than 1 minute, the mission is marked as incomplete.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedMissions = [...missions];
      missions.forEach((mission, index) => {
        const prevDate = new Date(mission.prevDate); // Convert to Date object
        if (
          mission.isCompleted &&
          (now.getDate() !== prevDate.getDate() ||
            now.getMonth() !== prevDate.getMonth() ||
            now.getFullYear() !== prevDate.getFullYear())
        ) {
          updatedMissions[index] = {
            ...mission,
            isCompleted: false,
          };
        }
      });
      setMissions(updatedMissions);
    }, 1000);
    return () => clearInterval(interval);
  }, [missions, setMissions]);

  return (
    <section className="pt-12 w-screen">
      {missions.map((mission) => (
        <ul
          className="mx-auto mb-16 w-[90%] h-auto sm:flex sm:items-center sm:justify-around sm:gap-1.5"
          key={mission.id}>
          {/* @todo - work with border here. add it to divs */}
          <div className="mx-auto w-1/2 sm:w-auto h-[5.5rem] md:h-[6.5rem] mb-4 sm:mb-0 font-bold text-sm md:text-base sm:order-last flex flex-col items-center">
            <p className="mx-auto">Completed days</p>
            <div className="bg-[url('/designs/sand-watch.svg')] bg-no-repeat w-full h-full bg-contain bg-center flex flex-col items-center justify-center gap-2.5">
              <span>{mission.numberOfDays | 0}</span>
              <span>21</span>
            </div>
          </div>
          <li
            className={`${
              mission?.isCompleted ? styles.cardChanged : styles.card
            } w-full sm:w-3/4 xl:w-7/12 h-16 md:h-20 rounded-3xl flex items-center justify-between mx-auto`}>
            <AlertDialog>
              <AlertDialogTrigger>
                <div
                  className={`${
                    mission?.isCompleted ? "cursor-not-allowed" : ""
                  }`}>
                  <Button
                    disabled={mission?.isCompleted}
                    onClick={() => {
                      handleCompleted(mission.id);
                    }}
                    className="bg-[url('/designs/button-shield.svg')] bg-no-repeat bg-transparent w-full h-14 sm:h-full hover:bg-[url('/designs/button-shield-finish-hover.svg')] hover:bg-transparent text-sm lg:text-base"
                    style={{
                      backgroundSize: "100% 100%",
                    }}>
                    Finish
                  </Button>
                </div>
              </AlertDialogTrigger>
              {mission?.isCompleted ? (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">
                      You finished today&apos;s mission!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You completed today&apos;s mission. This is good news, but
                      you can&apos;t finish it again today. Come back for
                      tomorrow. We will be waiting for you! 🏆🕒
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Back to page</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              ) : (
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
              )}
            </AlertDialog>
            <p className="text-center text-lg sm:text-xl md:text-2xl">
              {mission.title}
            </p>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  className="bg-[url('/designs/button-shield.svg')] bg-no-repeat bg-transparent w-full h-14 sm:h-full hover:bg-[url('/designs/button-shield-delete-hover.svg')] hover:bg-transparent text-sm lg:text-base"
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
