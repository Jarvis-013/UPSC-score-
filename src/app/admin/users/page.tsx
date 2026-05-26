"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import { Key, Trash2, Shield, User, Loader2, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handlePasswordChange = (userId: string, val: string) => {
    setPasswords((prev) => ({ ...prev, [userId]: val }));
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = passwords[userId];
    if (!newPassword || newPassword.trim() === "") {
      alert("Please enter a new password.");
      return;
    }

    setIsUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });

      if (res.ok) {
        alert("Password updated successfully!");
        setPasswords((prev) => ({ ...prev, [userId]: "" }));
      } else {
        alert("Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    setIsUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert("Failed to toggle role.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating role.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This will erase all of their historical exam attempts and cannot be undone.")) {
      return;
    }

    setIsUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred.");
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminHeader title="Admin Dashboard" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">User Directory</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage system accounts, assign passwords directly, and assign roles.</p>
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
              <p className="text-slate-500 text-sm font-semibold">Fetching user accounts...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 text-center text-slate-500 font-medium">No users match your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Account ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Password Management</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isCurrentUserUpdating = isUpdating === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-slate-400">
                          {u.id}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                              {u.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{u.name}</div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <button
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            disabled={isCurrentUserUpdating}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                              u.role === "ADMIN"
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {u.role === "ADMIN" ? (
                              <>
                                <Shield className="w-3.5 h-3.5" />
                                Admin
                              </>
                            ) : (
                              <>
                                <User className="w-3.5 h-3.5" />
                                User
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 max-w-xs">
                            <input
                              type="password"
                              placeholder="New password..."
                              value={passwords[u.id] || ""}
                              onChange={(e) => handlePasswordChange(u.id, e.target.value)}
                              disabled={isCurrentUserUpdating}
                              className="px-3 py-1.5 w-full border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                            />
                            <button
                              onClick={() => handleResetPassword(u.id)}
                              disabled={isCurrentUserUpdating}
                              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                            >
                              <Key className="w-3.5 h-3.5" />
                              Reset
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={isCurrentUserUpdating}
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Account
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
