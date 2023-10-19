"use client";
import { useState } from "react";

import styles from "@/styles/MissionList.module.css";
import { Button } from "../ui/Button";

const missions = ["Study", "Drink", "Run"];

export default function MissionList() {
  return missions.map((mission, index) => (
    <ul className="mt-16 w-2/3 h-24" key={index}>
      <li
      // className={selectedItem[index] ? styles.cardChanging : styles.card}
      // onClick={() => handleClick(index)}
      >
        <label className={styles.cardLabel}>
          <input type="checkbox" className={styles.cardInput} />
          <span className={styles.cardSpan}></span>
        </label>
        <p className="text-center text-bgColor text-2xl">{mission}</p>
      </li>
      <Button>Finish</Button>
    </ul>
  ));
}
