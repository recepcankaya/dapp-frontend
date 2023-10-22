"use client";
import { useState } from "react";

import styles from "@/styles/MissionList.module.css";
import { Button } from "../ui/Button";

type SelectedItemIndex = {
  index: number;
};

type MissionListProps = {
  missions: string[];
};

export default function MissionList({ missions }: MissionListProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedItemIndex | null>(
    null
  );

  const handleClick = (_index: number) => {
    setSelectedItem({ index: _index });
  };

  return missions.map((mission, idx) => (
    <ul className="mt-16 w-2/3 h-24" key={idx}>
      <li
        className={
          selectedItem?.index === idx ? styles.cardChanged : styles.card
        }>
        <Button onClick={() => handleClick(idx)} className="bg-[#974EC3]">
          Finish
        </Button>
        <p className="text-center text-foreground text-2xl">{mission}</p>
        <Button className="bg-[#77037B]">Delete</Button>
      </li>
    </ul>
  ));
}
