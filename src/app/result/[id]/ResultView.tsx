"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ResultCharts from "./ResultCharts";
import { ChevronLeft, Target, BarChart3, CheckCircle2, XCircle, ListTodo } from "lucide-react";

interface ResultViewProps {
  attempt: any;
  responses: any[];
  answerKeys: any[];
}

export default function ResultView({ attempt, responses, answerKeys }: ResultViewProps) {
  // Group keys by institute
  const keysByInstitute = useMemo(() => {
    const map: Record<string, Record<number, string>> = {};
    answerKeys.forEach((k) => {
      if (!map[k.institute]) map[k.institute] = {};
      map[k.institute][k.questionNum] = k.answer;
    });
    return map;
  }, [answerKeys]);

  const institutes = Object.keys(keysByInstitute);
  const [selectedInstitute, setSelectedInstitute] = useState<string>(institutes[0] || "");

  // Calculate scores for all institutes
  const scoresByInstitute = useMemo(() => {
    const scores: Record<string, any> = {};
    const marksPerCorrect = attempt.paperType === "CSAT" ? 2.5 : 2.0;
    const penaltyPerWrong = attempt.paperType === "CSAT" ? 0.83 : 0.66;

    institutes.forEach((inst) => {
      const keyMap = keysByInstitute[inst];
      let correct = 0;
      let wrong = 0;
      let unattempted = 0;

      responses.forEach((res) => {
        const qNum = res.questionNum;
        const selected = res.selectedAnswer;

        if (selected === "N") {
          unattempted++;
        } else {
          const correctAns = keyMap[qNum];
          if (correctAns && selected === correctAns) {
            correct++;
          } else {
            wrong++;
          }
        }
      });

      const attemptedCount = correct + wrong;
      const accuracy = attemptedCount > 0 ? (correct / attemptedCount) * 100 : 0;
      const rawScore = (correct * marksPerCorrect) - (wrong * penaltyPerWrong);
      const finalScore = Math.round(rawScore * 100) / 100;

      scores[inst] = { correct, wrong, unattempted, accuracy, score: finalScore };
    });

    return scores;
  }, [institutes, keysByInstitute, responses, attempt.paperType]);

  if (institutes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 text-slate-500">
          <ListTodo className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">No Answer Keys Found</h2>
        <p className="text-slate-500 mt-2 font-medium">Please ask an admin to upload answer keys for {attempt.paperType} Set {attempt.set}.</p>
        <Link href="/dashboard" className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-full font-semibold mt-6 transition-colors shadow-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentScoreData = scoresByInstitute[selectedInstitute];
  const currentKeyMap = keysByInstitute[selectedInstitute];
  const maxQuestions = attempt.paperType === 'CSAT' ? 80 : 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-200 shadow-sm shadow-slate-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                UPSC {attempt.paperType}
              </h1>
              <p className="text-xs font-semibold text-slate-500">Set {attempt.set} • Analytics</p>
            </div>
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Comparative Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Scores Across Institutes</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Select an institute to view detailed analytics based on their key.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {institutes.map((inst) => {
              const isSelected = selectedInstitute === inst;
              const score = scoresByInstitute[inst].score;
              return (
                <button
                  key={inst}
                  onClick={() => setSelectedInstitute(inst)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm shadow-indigo-100" 
                      : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-left">
                    <div className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{inst} Key</div>
                    <div className={`text-xl font-extrabold tracking-tight ${score >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {score.toFixed(2)}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white ml-2 shadow-sm shadow-indigo-200">
                      <Target className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Stats for Selected Institute */}
        {currentScoreData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Target className="w-16 h-16" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Score</p>
                <p className={`text-5xl font-extrabold tracking-tight ${currentScoreData.score >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {currentScoreData.score.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Accuracy</p>
                <p className="text-5xl font-extrabold tracking-tight text-indigo-500">
                  {currentScoreData.accuracy.toFixed(1)}<span className="text-3xl">%</span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attempted</p>
                <p className="text-5xl font-extrabold tracking-tight text-slate-800">
                  {currentScoreData.correct + currentScoreData.wrong}
                  <span className="text-2xl font-bold text-slate-300 ml-1">/ {maxQuestions}</span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correct / Wrong</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-emerald-500">{currentScoreData.correct}</span>
                  <span className="text-3xl font-bold text-slate-200">/</span>
                  <span className="text-5xl font-extrabold tracking-tight text-rose-500">{currentScoreData.wrong}</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> 
                Performance Breakdown
              </h3>
              <ResultCharts 
                correct={currentScoreData.correct} 
                wrong={currentScoreData.wrong} 
                unattempted={currentScoreData.unattempted} 
              />
            </div>

            {/* Detailed Review Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-indigo-500" />
                Detailed Answer Map
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {responses.map((r: any) => {
                  const qNum = r.questionNum;
                  const selected = r.selectedAnswer;
                  const correct = currentKeyMap[qNum];
                  
                  let statusClass = "bg-slate-50 border-slate-200";
                  let Icon = undefined;
                  let iconColor = "text-slate-400";
                  
                  if (selected !== 'N') {
                    if (selected === correct) {
                      statusClass = "bg-emerald-50/50 border-emerald-200";
                      Icon = CheckCircle2;
                      iconColor = "text-emerald-500";
                    } else {
                      statusClass = "bg-rose-50/50 border-rose-200";
                      Icon = XCircle;
                      iconColor = "text-rose-500";
                    }
                  }

                  return (
                    <div key={qNum} className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${statusClass} transition-all hover:scale-105 cursor-default`}>
                      <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Q{qNum}</span>
                      
                      {Icon ? (
                        <Icon className={`w-6 h-6 mb-2 ${iconColor}`} />
                      ) : (
                        <div className="w-6 h-6 mb-2 flex items-center justify-center text-slate-300 font-bold">-</div>
                      )}

                      {selected !== 'N' ? (
                        <div className="flex flex-col items-center text-xs font-semibold gap-0.5">
                          <span className="text-slate-900">Your: {selected}</span>
                          <span className="text-slate-500 text-[10px]">Key: {correct || '-'}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-xs font-semibold gap-0.5">
                          <span className="text-slate-400">Not Att.</span>
                          <span className="text-slate-500 text-[10px]">Key: {correct || '-'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
