import { getSessionUser } from "@/lib/getSession";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ManageClientActions from "./ManageClientActions";
import { Plus, LayoutDashboard, KeyRound } from "lucide-react";

import AdminHeader from "@/components/AdminHeader";

export default async function ManageKeysPage() {
  const session = await getSessionUser();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Get distinct combinations using groupBy
  const distinctKeys = await prisma.answerKey.groupBy({
    by: ['institute', 'paperType', 'set'],
    _count: {
      questionNum: true
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminHeader title="Admin Dashboard" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Uploaded Answer Keys</h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {distinctKeys.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
                <KeyRound className="w-8 h-8" />
              </div>
              <p className="text-slate-900 font-semibold text-lg">No keys found</p>
              <p className="text-slate-500 text-sm mt-1">Upload your first answer key to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Institute</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paper</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Set</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Questions</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {distinctKeys.map((k) => (
                    <tr key={`${k.institute}-${k.paperType}-${k.set}`} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">{k.institute}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-700">{k.paperType}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Set {k.set}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">{k._count.questionNum} Qs</td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/manage/edit?institute=${encodeURIComponent(k.institute)}&paperType=${k.paperType}&set=${k.set}`} 
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Edit
                          </Link>
                          <ManageClientActions institute={k.institute} paperType={k.paperType} set={k.set} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
