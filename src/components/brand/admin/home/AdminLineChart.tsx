"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LineChartProps = {
  weeklyTotalOrders: BrandBranch["weekly_total_orders"];
};

export default function AdminLineChart({ weeklyTotalOrders }: LineChartProps) {
  const orderedDays = ["pzt", "salı", "çrş", "prş", "cuma", "cmt", "pzr"];
  const dayNumber = new Date().getDay();
  const orderedWeeklyTotalOrdersArray: Array<number> = orderedDays
    .map(
      (day) => weeklyTotalOrders?.[day as keyof typeof weeklyTotalOrders] ?? 0
    )
    .slice(0, dayNumber === 0 ? 7 : dayNumber);

  const minValue = Math.min(...orderedWeeklyTotalOrdersArray);
  const maxValue = Math.max(...orderedWeeklyTotalOrdersArray);

  const data = {
    labels: ["Pzt", "Salı", "Çrş", "Prş", "Cuma", "Cmt", "Pzr"],
    datasets: [
      {
        label: "Günlük Sipariş Sayısı",
        data: orderedWeeklyTotalOrdersArray,
        backgroundColor: "transparent",
        borderColor: "#7B5240",
        pointBorderColor: "#7B5240",
        pointBackgroundColor: "#7B5240",
        borderWidth: 2,
        tension: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Siparişler",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        // Find the optimal min and max values for the y-axis.
        min: minValue - 20,
        max: maxValue + 20,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <section className="pt-12">
      <Line
        data={data}
        options={options}
        className="w-[250px] h-[225px] min-[425px]:w-[300px] min-[425px]:h-[300px] md:h-[400px] md:w-[400px] lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px]"
      />
    </section>
  );
}
