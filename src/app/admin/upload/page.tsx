"use client";

import { useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminUploadPage() {
  const [institute, setInstitute] = useState("Official");
  const [paperType, setPaperType] = useState("GS");
  const [set, setSet] = useState("A");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    if (!institute.trim()) {
      setMessage("Please enter an Institute Name.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const keys = results.data.map((row: any) => {
          const qNum = row.Question || row.QuestionNumber || row.QuestionNum;
          const ans = row.Answer || row.CorrectAnswer;
          return { questionNum: parseInt(qNum), answer: ans };
        }).filter(k => !isNaN(k.questionNum) && k.answer);

        if (keys.length === 0) {
          setMessage("Failed to parse CSV. Ensure it has 'Question' and 'Answer' headers.");
          setIsUploading(false);
          return;
        }

        try {
          const res = await fetch("/api/admin/upload-key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ institute, paperType, set, keys }),
          });

          if (res.ok) {
            setMessage("Answer keys uploaded successfully!");
            setFile(null);
          } else {
            const data = await res.json();
            setMessage(data.message || "Failed to upload keys.");
          }
        } catch (error) {
          setMessage("An error occurred during upload.");
        } finally {
          setIsUploading(false);
        }
      },
      error: () => {
        setMessage("Error reading CSV file.");
        setIsUploading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel - Upload Answer Key</h1>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleUpload} className="space-y-6">
            {message && (
              <div className={`p-3 rounded-md text-sm text-center ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institute Name</label>
              <input 
                type="text"
                value={institute}
                onChange={e => setInstitute(e.target.value)}
                placeholder="e.g. Official, VisionIAS"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paper Type</label>
              <select 
                value={paperType} 
                onChange={e => setPaperType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="GS">General Studies (GS)</option>
                <option value="CSAT">CSAT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Paper Set</label>
              <select 
                value={set} 
                onChange={e => setSet(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="A">Set A</option>
                <option value="B">Set B</option>
                <option value="C">Set C</option>
                <option value="D">Set D</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV</label>
              <input 
                type="file" 
                accept=".csv"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                CSV should have headers: <strong>Question</strong> and <strong>Answer</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Answer Key"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
