"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, Users, BarChart3, LayoutDashboard, Plus } from "lucide-react";

export default function AdminHeader({ title }: { title: string }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Answer Keys", href: "/admin/manage", icon: KeyRound },
    { name: "User Directory", href: "/admin/users", icon: Users },
    { name: "Performance Stats", href: "/admin/stats", icon: BarChart3 },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              href="/admin/upload" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              Upload Key
            </Link>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex gap-6 mt-1 border-t border-slate-100">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all ${
                  isActive 
                    ? "border-indigo-600 text-indigo-600" 
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
