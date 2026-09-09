import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const getChartThemeOptions = () => {
  const isLight = document.documentElement.classList.contains("light");
  const textColor = isLight ? "#334155" : "#94a3b8";
  const gridColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.04)";

  return {
    defaultOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: textColor,
            font: {
              family: "monospace",
              size: 11,
            },
            padding: 14,
          },
        },
        tooltip: {
          backgroundColor: isLight ? "#ffffff" : "#0f172a",
          titleColor: isLight ? "#0f172a" : "#f8fafc",
          bodyColor: isLight ? "#334155" : "#cbd5e1",
          borderColor: isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          padding: 10,
          displayColors: true,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: { family: "monospace", size: 10 },
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          ticks: {
            color: textColor,
            font: { family: "monospace", size: 10 },
            precision: 0,
          },
          grid: {
            color: gridColor,
          },
        },
      },
    },

    doughnutOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: textColor,
            font: {
              family: "monospace",
              size: 11,
            },
            padding: 12,
          },
        },
        tooltip: {
          backgroundColor: isLight ? "#ffffff" : "#0f172a",
          titleColor: isLight ? "#0f172a" : "#f8fafc",
          bodyColor: isLight ? "#334155" : "#cbd5e1",
          borderColor: isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          padding: 10,
          displayColors: true,
        },
      },
    },
  };
};

export const RealLineChart = ({ data, height = 220 }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs font-mono text-text-muted">
        No metric timeline recorded
      </div>
    );
  }

  const { defaultOptions } = getChartThemeOptions();

  return (
    <div style={{ height }}>
      <Line data={data} options={defaultOptions} />
    </div>
  );
};

export const RealBarChart = ({ data, height = 220 }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs font-mono text-text-muted">
        No metric breakdown recorded
      </div>
    );
  }

  const { defaultOptions } = getChartThemeOptions();

  return (
    <div style={{ height }}>
      <Bar data={data} options={defaultOptions} />
    </div>
  );
};

export const RealDoughnutChart = ({ data, height = 200 }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs font-mono text-text-muted">
        No category metrics recorded
      </div>
    );
  }

  const { doughnutOptions } = getChartThemeOptions();

  return (
    <div style={{ height }}>
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
};
