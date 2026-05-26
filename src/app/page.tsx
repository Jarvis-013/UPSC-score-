import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-100/40 blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-3xl opacity-50 pointer-events-none" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
          UPSC Prelims 2024 Evaluator is Live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl">
          Evaluate Your Performance with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Precision.</span>
        </h1>
        
        <p className="mt-6 text-xl text-slate-600 max-w-2xl leading-relaxed">
          The most advanced, multi-institute answer key evaluator for UPSC Civil Services Examination. Instantly calculate your exact score for GS and CSAT papers.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard"
            className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/25 hover:-translate-y-0.5"
          >
            Start Evaluation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/admin/manage"
            className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-sm"
          >
            Admin Panel
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-left">
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">UPSC Marking Scheme</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Exact adherence to official +2/-0.66 (GS) and +2.5/-0.83 (CSAT) scoring algorithms.</p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multiple Institutes</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Compare your performance seamlessly across Official, VisionIAS, and Vajiram keys instantly.</p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Historical Tracking</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Your answers are saved securely. Pause, resume, and review your historical attempt analytics.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
