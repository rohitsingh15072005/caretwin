"use client";

import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { uploadMedicalRecord, processRecordOCR, getFamilyMembers } from "@/lib/api";

interface AddRecordCardProps {
  onRecordAdded?: () => void;
}

export default function AddRecordCard({ onRecordAdded }: AddRecordCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("Prescription");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      alert("Please provide a title and select a file.");
      return;
    }

    try {
      setLoading(true);
      setStatusMsg("Uploading document to Record Locker...");
      
      // Get primary family member profile ID (Self)
      const familyMembers = await getFamilyMembers();
      const selfId = familyMembers[0]?.id || 1;

      // 1. Upload record
      const record = await uploadMedicalRecord(selfId, title, docType, file);
      
      // 2. Automatically trigger OCR & Medical NLP processing
      setStatusMsg("Running OCR & Medical NLP extraction...");
      await processRecordOCR(record.id);

      setStatusMsg("Document uploaded & processed successfully!");
      setTimeout(() => {
        setIsOpen(false);
        setTitle("");
        setFile(null);
        setStatusMsg(null);
        if (onRecordAdded) onRecordAdded();
      }, 1200);

    } catch (err: any) {
      alert(err.message || "Failed to upload medical record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex min-h-[170px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#bfc8dc] bg-transparent px-5 transition hover:border-[#0878b8] hover:bg-white"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9edff] text-[#0878b8]">
          <Plus size={18} />
        </div>

        <p className="mt-3 text-xs font-semibold text-[#374151]">
          Add New Record
        </p>

        <p className="mt-1 text-center text-[10px] leading-[13px] text-[#8b95a7]">
          Upload PDF/JPG prescriptions & lab reports
        </p>
      </button>

      {/* Interactive Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Upload Medical Record
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Document will be stored in CareTwin Smart Record Locker & parsed via OCR.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Blood Test Report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-cyan-500"
                >
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Radiology">Radiology / Imaging</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select File (PDF, PNG, JPG)
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 border border-slate-300 rounded-xl p-2 cursor-pointer"
                  required
                />
              </div>

              {statusMsg && (
                <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl text-xs font-medium border border-cyan-200">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                {loading ? "Processing..." : "Upload & Analyze"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}