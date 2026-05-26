"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function EditKeysContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const institute = searchParams.get("institute");
  const paperType = searchParams.get("paperType");
  const set = searchParams.get("set");

  const [keys, setKeys] = useState<{questionNum: number, answer: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newInstituteName, setNewInstituteName] = useState("");

  useEffect(() => {
    if (institute) setNewInstituteName(institute);
  }, [institute]);

  useEffect(() => {
    if (!institute || !paperType || !set) return;

    async function loadKeys() {
      try {
        const res = await fetch(`/api/admin/manage-keys?institute=${institute}&paperType=${paperType}&set=${set}`);
        if (res.ok) {
          const data = await res.json();
          setKeys(data.keys.map((k: any) => ({ questionNum: k.questionNum, answer: k.answer })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadKeys();
  }, [institute, paperType, set]);

  const handleAnswerChange = (qNum: number, newAns: string) => {
    setKeys(prev => prev.map(k => k.questionNum === qNum ? { ...k, answer: newAns } : k));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/manage-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institute, paperType, set, keys, newInstitute: newInstituteName }),
      });

      if (res.ok) {
        alert("Keys updated successfully!");
        router.push("/admin/manage");
      } else {
        alert("Failed to update keys.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!institute || !paperType || !set) {
    return <div className="p-8 text-center">Invalid parameters.</div>;
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading keys...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Edit Key: {institute} | {paperType} | Set {set}
          </h1>
          <div className="flex gap-4">
            <Link href="/admin/manage" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-md">
              Cancel
            </Link>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Institute Name</label>
            <input 
              type="text"
              value={newInstituteName}
              onChange={(e) => setNewInstituteName(e.target.value)}
              className="block w-full max-w-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <p className="text-xs text-gray-500 mt-1">You can rename the institute here. It will update across all records.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {keys.map((k) => (
              <div key={k.questionNum} className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">Question {k.questionNum}</label>
                <select 
                  value={k.answer}
                  onChange={(e) => handleAnswerChange(k.questionNum, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EditKeysPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <EditKeysContent />
    </Suspense>
  );
}
