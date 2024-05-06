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
  totalOrders: BrandBranch["total_orders"];
};

export default function LineChart(totalOrders: LineChartProps) {
  const data = {
    labels: ["Pzt", "Salı", "Çrş", "Prş", "Cuma", "Cmt", "Pzr"],
    datasets: [
      {
        label: "Toplam Sipariş Sayısı",
        data: [12, 19, 3, 5, 2, 3, 9],
        backgroundColor: "transparent",
        borderColor: "red",
        pointBorderColor: "black",
        pointBackgroundColor: "black",
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
        min: 2,
        max: 20,
        ticks: {
          stepSize: 5,
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
