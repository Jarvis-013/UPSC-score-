"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import StatsCharts from "./StatsCharts";
import { Loader2, TrendingUp, Award, Activity, Sparkles } from "lucide-react";

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminHeader title="Admin Dashboard" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time aggregate scoring curves and score frequencies across all candidate attempts.</p>
        </div>

        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
            <p className="text-slate-500 text-sm font-semibold">Generating candidate curves...</p>
          </div>
        ) : !stats ? (
          <div className="p-16 text-center text-slate-500 font-medium">Error loading statistics.</div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* GS Stats Panel */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">General Studies (GS) Aggregate</h3>
                  <p className="text-xs font-semibold text-slate-400">Calculated over {stats.gs.count} total attempts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Average Score</p>
                  <p className="text-4xl font-extrabold text-indigo-600 tracking-tight">{stats.gs.average.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Highest Score</p>
                  <p className="text-4xl font-extrabold text-emerald-600 tracking-tight">{stats.gs.high.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lowest Score</p>
                  <p className="text-4xl font-extrabold text-rose-500 tracking-tight">{stats.gs.low.toFixed(2)}</p>
                </div>
              </div>
            </section>

            {/* CSAT Stats Panel */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">CSAT Aggregate</h3>
                  <p className="text-xs font-semibold text-slate-400">Calculated over {stats.csat.count} total attempts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Average Score</p>
                  <p className="text-4xl font-extrabold text-cyan-600 tracking-tight">{stats.csat.average.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Highest Score</p>
                  <p className="text-4xl font-extrabold text-emerald-600 tracking-tight">{stats.csat.high.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lowest Score</p>
                  <p className="text-4xl font-extrabold text-rose-500 tracking-tight">{stats.csat.low.toFixed(2)}</p>
                </div>
              </div>
            </section>

            {/* Graphs and Frequencies */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Score Frequency Distribution Charts</h3>
                  <p className="text-xs font-semibold text-slate-400">Displays score distributions grouped into brackets</p>
                </div>
              </div>

              <StatsCharts gsData={stats.gsDistribution} csatData={stats.csatDistribution} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
