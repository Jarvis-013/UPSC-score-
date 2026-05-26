"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StatsChartsProps {
  gsData: { range: string; count: number }[];
  csatData: { range: string; count: number }[];
}

export default function StatsCharts({ gsData, csatData }: StatsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* GS Distribution */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-4">GS Score Distribution (Official/First Key)</h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "12px", border: "none" }}
                labelStyle={{ fontWeight: "bold", color: "#f8fafc" }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Attempts count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CSAT Distribution */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-4">CSAT Score Distribution (Official/First Key)</h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={csatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "12px", border: "none" }}
                labelStyle={{ fontWeight: "bold", color: "#f8fafc" }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Attempts count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
