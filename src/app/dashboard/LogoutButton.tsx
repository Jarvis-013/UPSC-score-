"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
