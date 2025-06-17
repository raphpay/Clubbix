import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  CoreScaleOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Scale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { TreasuryEntry } from "../../services/firestore/treasuryService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TreasuryChartProps {
  entries: TreasuryEntry[];
}

const TreasuryChart: React.FC<TreasuryChartProps> = ({ entries }) => {
  const { t } = useTranslation("treasury");
  const monthlyData = useMemo(() => {
    const months = new Map<string, { income: number; expenses: number }>();

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!months.has(monthKey)) {
        months.set(monthKey, { income: 0, expenses: 0 });
      }

      const monthData = months.get(monthKey)!;
      if (entry.type === "income") {
        monthData.income += entry.amount;
      } else {
        monthData.expenses += entry.amount;
      }
    });

    return Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        ...data,
      }));
  }, [entries]);

  const categoryData = useMemo(() => {
    const categories = new Map<string, { income: number; expenses: number }>();

    entries.forEach((entry) => {
      if (!categories.has(entry.category)) {
        categories.set(entry.category, { income: 0, expenses: 0 });
      }

      const categoryData = categories.get(entry.category)!;
      if (entry.type === "income") {
        categoryData.income += entry.amount;
      } else {
        categoryData.expenses += entry.amount;
      }
    });

    return Array.from(categories.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [entries]);

  const monthlyChartData: ChartData<"line"> = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: t("form.types.income"),
        data: monthlyData.map((d) => d.income),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.1,
      },
      {
        label: t("form.types.expense"),
        data: monthlyData.map((d) => d.expenses),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const categoryChartData: ChartData<"bar"> = {
    labels: categoryData.map((d) => d.category),
    datasets: [
      {
        label: t("form.types.income"),
        data: categoryData.map((d) => d.income),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
      {
        label: t("form.types.expense"),
        data: categoryData.map((d) => d.expenses),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("chart.title"),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: number | string
          ) {
            return `$${Number(tickValue).toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{t("chart.title")}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">
            {t("chart.monthlyTrends")}
          </h3>
          <Line data={monthlyChartData} options={chartOptions} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">
            {t("chart.categoryBreakdown")}
          </h3>
          <Bar data={categoryChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default TreasuryChart;
