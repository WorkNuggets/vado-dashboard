"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  getStatusDistribution,
  type StatusDistribution,
} from "@/services/analytics.service";

interface StatusDistributionChartProps {
  agentId: string;
}

export default function StatusDistributionChart({
  agentId,
}: StatusDistributionChartProps) {
  const [data, setData] = useState<StatusDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const statusData = await getStatusDistribution(agentId);
        setData(statusData);
      } catch (err) {
        console.error("Error fetching status distribution:", err);
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
          No tour requests found
        </p>
      </div>
    );
  }

  // Prepare data for pie chart
  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage,
    color: item.color,
  }));

  // Total count for display
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count:{" "}
            <span className="font-semibold" style={{ color: payload[0].payload.color }}>
              {payload[0].value}
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {payload[0].payload.percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie slices
  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(0)}%`;
  };

  return (
    <div>
      {/* Stats Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Tour Requests</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{total}</p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Status Breakdown */}
      <div className="mt-6 space-y-2">
        {data.map((item) => (
          <div
            key={item.status}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.count} requests
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
