"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getPropertyPerformance,
  type PropertyPerformance,
} from "@/services/analytics.service";

interface PropertyPerformanceChartProps {
  agentId: string;
}

export default function PropertyPerformanceChart({
  agentId,
}: PropertyPerformanceChartProps) {
  const [data, setData] = useState<PropertyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const performanceData = await getPropertyPerformance(agentId);
        setData(performanceData);
      } catch (err) {
        console.error("Error fetching property performance:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchData();
    }
  }, [agentId]);

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
          No properties found
        </p>
      </div>
    );
  }

  // Prepare data for chart - truncate long addresses
  const chartData = data.map((item) => {
    const addressParts = item.propertyAddress.split(",");
    const shortAddress =
      addressParts.length > 0
        ? addressParts[0].length > 30
          ? addressParts[0].substring(0, 30) + "..."
          : addressParts[0]
        : item.propertyAddress;

    return {
      ...item,
      shortAddress,
    };
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].payload.propertyAddress}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tour Requests:{" "}
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Chart Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Top {data.length} properties by tour requests
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 80 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="shortAddress"
            angle={-45}
            textAnchor="end"
            height={100}
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fill: "currentColor", fontSize: 11 }}
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
              paddingTop: "10px",
            }}
          />
          <Bar
            dataKey="tourRequests"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            name="Tour Requests"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
