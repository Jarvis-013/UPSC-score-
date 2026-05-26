import { getSessionUser } from "@/lib/getSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import prisma from "@/lib/prisma";
import { FileText, Clock, ChevronRight, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSessionUser();

  // Fetch user's existing attempts
  const attempts = await prisma.examAttempt.findMany({
    where: { userId: session.user.id as string },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Evaluator</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:block">Welcome, {session.user?.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        
        {/* Exam Selection */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Start Examination</h2>
            {session.user.role === "ADMIN" && (
              <Link href="/admin/manage" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                Admin Panel
              </Link>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8">
            <form action="/exam" method="GET" className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Paper Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="cursor-pointer group">
                    <input type="radio" name="paperType" value="GS" className="peer sr-only" defaultChecked />
                    <div className="p-5 border-2 border-slate-200 rounded-xl text-left peer-checked:border-indigo-600 peer-checked:bg-indigo-50/50 hover:bg-slate-50 transition-all duration-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="block font-bold text-slate-900 text-lg">General Studies (GS)</span>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 peer-checked:border-indigo-600 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                      <span className="block text-sm font-medium text-slate-500">100 Questions • +2 / -0.66</span>
                    </div>
                  </label>
                  <label className="cursor-pointer group">
                    <input type="radio" name="paperType" value="CSAT" className="peer sr-only" />
                    <div className="p-5 border-2 border-slate-200 rounded-xl text-left peer-checked:border-indigo-600 peer-checked:bg-indigo-50/50 hover:bg-slate-50 transition-all duration-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="block font-bold text-slate-900 text-lg">CSAT</span>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 peer-checked:border-indigo-600 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                      <span className="block text-sm font-medium text-slate-500">80 Questions • +2.5 / -0.83</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Question Paper Set
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['A', 'B', 'C', 'D'].map((set) => (
                    <label key={set} className="cursor-pointer group">
                      <input type="radio" name="set" value={set} className="peer sr-only" defaultChecked={set === 'A'} />
                      <div className="py-3 px-4 border-2 border-slate-200 rounded-xl text-center peer-checked:border-indigo-600 peer-checked:bg-indigo-50/50 hover:bg-slate-50 transition-all duration-200">
                        <span className="font-bold text-slate-900">Set {set}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-8 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Start / Resume Evaluation
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-sm font-medium text-slate-500 mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Starting an exam you already began will securely load your saved answers.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* History of Saved Attempts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Attempt History</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            {attempts.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-slate-900 font-semibold text-lg">No history found</p>
                <p className="text-slate-500 text-sm mt-1">Your saved exams and results will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paper Details</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                              {attempt.paperType}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">UPSC {attempt.paperType}</div>
                              <div className="text-sm text-slate-500">Set {attempt.set}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{new Date(attempt.updatedAt).toLocaleDateString()}</div>
                          <div className="text-sm text-slate-500">{new Date(attempt.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/exam?paperType=${attempt.paperType}&set=${attempt.set}`} className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                              Edit Answers
                            </Link>
                            <Link href={`/result/${attempt.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg transition-colors">
                              View Results
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
