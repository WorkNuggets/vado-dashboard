"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getTourRequestsTrend, type TourRequestTrend } from "@/services/analytics.service";

interface TourRequestsChartProps {
  agentId: string;
  days?: number;
}

export default function TourRequestsChart({
  agentId,
  days = 30,
}: TourRequestsChartProps) {
  const [data, setData] = useState<TourRequestTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const trendData = await getTourRequestsTrend(agentId, days);
        setData(trendData);
      } catch (err) {
        console.error("Error fetching tour requests trend:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchData();
    }
  }, [agentId, days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No data available for the selected period
        </p>
      </div>
    );
  }

  // Calculate total and average for display
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const average = Math.round(total / data.length);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].payload.displayDate}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tour Requests: <span className="font-semibold text-brand-600 dark:text-brand-400">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Stats Summary */}
      <div className="flex gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{total}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daily Average</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{average}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="displayDate"
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fill: "currentColor" }}
            tickLine={{ stroke: "currentColor" }}
          />
          <YAxis
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fill: "currentColor" }}
            tickLine={{ stroke: "currentColor" }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Tour Requests"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
