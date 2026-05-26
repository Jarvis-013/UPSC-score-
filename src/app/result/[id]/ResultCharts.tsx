"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ResultChartsProps {
  correct: number;
  wrong: number;
  unattempted: number;
}

export default function ResultCharts({ correct, wrong, unattempted }: ResultChartsProps) {
  const data = [
    { name: "Correct", value: correct, color: "#16a34a" }, // text-green-600
    { name: "Wrong", value: wrong, color: "#dc2626" },   // text-red-600
    { name: "Unattempted", value: unattempted, color: "#9ca3af" }, // text-gray-400
  ];

  return (
    <div className="h-80 w-full flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`${value} Questions`, '']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
