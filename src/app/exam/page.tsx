"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

function ExamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const paperType = searchParams.get("paperType") || "GS";
  const set = searchParams.get("set") || "A";
  
  const totalQuestions = paperType === "CSAT" ? 80 : 100;
  
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExistingAttempt() {
      try {
        const res = await fetch(`/api/exam/attempt?paperType=${paperType}&set=${set}`);
        if (res.ok) {
          const data = await res.json();
          const initialResponses: Record<number, string> = {};
          
          if (data.attempt && data.attempt.responses) {
            // Load from existing attempt
            const existing = JSON.parse(data.attempt.responses);
            existing.forEach((r: any) => {
              initialResponses[r.questionNum] = r.selectedAnswer;
            });
            // Fill remaining with 'N'
            for (let i = 1; i <= totalQuestions; i++) {
              if (!initialResponses[i]) initialResponses[i] = "N";
            }
          } else {
            // Initialize all to 'N' (Not Attempted)
            for (let i = 1; i <= totalQuestions; i++) {
              initialResponses[i] = "N";
            }
          }
          setResponses(initialResponses);
        }
      } catch (err) {
        console.error("Failed to load existing attempt", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadExistingAttempt();
  }, [paperType, set, totalQuestions]);

  const handleOptionChange = (qNum: number, option: string) => {
    setResponses((prev) => ({
      ...prev,
      [qNum]: option,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const responseArray = Object.entries(responses).map(([qNum, answer]) => ({
      questionNum: parseInt(qNum),
      selectedAnswer: answer,
    }));

    try {
      const res = await fetch("/api/exam/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperType,
          set,
          responses: responseArray,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/result/${data.attemptId}`);
      } else {
        alert("Failed to evaluate exam. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgress = () => {
    const attempted = Object.values(responses).filter(ans => ans !== 'N').length;
    return Math.round((attempted / totalQuestions) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Preparing your exam sheet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Premium Glassmorphic Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/60 shadow-sm shadow-slate-200/20">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">Set {set}</span>
              <h1 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">UPSC {paperType}</h1>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {Object.values(responses).filter(ans => ans !== 'N').length} of {totalQuestions} attempted
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end gap-1 w-32">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${getProgress()}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{getProgress()}% Completed</span>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Saving..." : "Submit Exam"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-8">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const qNum = i + 1;
            const isAttempted = responses[qNum] !== 'N';
            
            return (
              <div key={qNum} id={`q-${qNum}`} className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border transition-all duration-300 ${isAttempted ? 'border-indigo-100 shadow-indigo-100/20' : 'border-slate-200/60'}`}>
                <div className="flex items-start justify-between mb-5">
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm mr-3 border border-slate-200">
                      {qNum}
                    </span>
                    Select your answer
                  </h3>
                  {isAttempted && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-in zoom-in duration-200" />
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['A', 'B', 'C', 'D', 'N'].map((option) => {
                    const isSelected = responses[qNum] === option;
                    return (
                      <label 
                        key={option} 
                        className={`group flex items-center justify-center sm:justify-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm shadow-indigo-100' 
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                      }`}>
                        <div className="relative flex items-center justify-center w-5 h-5 mr-3 shrink-0">
                          <input
                            type="radio"
                            name={`q-${qNum}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleOptionChange(qNum, option)}
                            className="peer sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 transition-colors ${isSelected ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}></div>
                          <div className={`absolute w-2.5 h-2.5 rounded-full bg-indigo-600 transition-all scale-0 ${isSelected ? 'scale-100' : ''}`}></div>
                        </div>
                        <span className={`font-semibold text-sm whitespace-nowrap transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                          {option === 'N' ? 'Not Attempted' : `Option ${option}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 sm:hidden z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</span>
          <span className="text-xs font-bold text-indigo-600">{getProgress()}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${getProgress()}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
      </div>
    }>
      <ExamContent />
    </Suspense>
  );
}
