"use client";

import { useEffect, useState } from "react";
import MedicalRecordsHeader from "@/components/Dashboard/MedicalRecords/MedicalRecordsHeader";
import RecordStats from "@/components/Dashboard/MedicalRecords/RecordStats";
import MedicalRecordCard from "@/components/Dashboard/MedicalRecords/MedicalRecordCard";
import AddRecordCard from "@/components/Dashboard/MedicalRecords/AddRecordCard";
import {
  getMedicalRecords,
  MedicalRecord,
  getCurrentUser,
  deleteMedicalRecord,
  downloadMedicalRecord,
  viewMedicalRecord,
  getTrendAlerts,
  getFamilyMembers,
  uploadMedicalRecord,
  processRecordOCR,
} from "@/lib/api";
import { X, Upload } from "lucide-react";

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Patient");
  const [followUpsCount, setFollowUpsCount] = useState(0);

  // Filters & Modals
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDocType, setUploadDocType] = useState("Prescription");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);

  async function loadRecords() {
    try {
      setLoading(true);
      const [u, fetchedRecords] = await Promise.all([
        getCurrentUser().catch(() => null),
        getMedicalRecords().catch(() => []),
      ]);
      if (u) {
        setPatientName(u.full_name);
        try {
          const members = await getFamilyMembers();
          const selfId = members[0]?.id || 1;
          const alerts = await getTrendAlerts(selfId);
          setFollowUpsCount(alerts.length);
        } catch {
          setFollowUpsCount(0);
        }
      }
      setRecords(fetchedRecords);
    } catch (err) {
      console.error("Failed to load records:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  // Compute Last Update String
  const computeLastUpdate = () => {
    if (records.length === 0) return "No records yet";
    const sorted = [...records].sort(
      (a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
    );
    const diffHours = Math.floor(
      (new Date().getTime() - new Date(sorted[0].upload_date).getTime()) / (1000 * 60 * 60)
    );
    if (diffHours < 1) return "Just Now";
    if (diffHours < 24) return `${diffHours} Hours Ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} Days Ago`;
  };

  // Filter records by category
  const filteredRecords = records.filter((r) => {
    if (selectedCategory === "All") return true;
    return r.document_type.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Action Handlers
  const handleView = async (recordId: number) => {
    try {
      await viewMedicalRecord(recordId);
    } catch (err: any) {
      alert(err.message || "Unable to open document");
    }
  };

  const handleDownload = async (recordId: number, title: string) => {
    try {
      await downloadMedicalRecord(recordId, `${title}.pdf`);
    } catch (err: any) {
      alert(err.message || "Failed to download document");
    }
  };

  const handleDelete = async (recordId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteMedicalRecord(recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    } catch (err: any) {
      alert(err.message || "Failed to delete document");
    }
  };

  // Header Upload Modal Submit
  const handleModalUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      alert("Please provide a title and select a file.");
      return;
    }

    try {
      setUploadLoading(true);
      setUploadStatusMsg("Uploading document to Record Locker...");
      const familyMembers = await getFamilyMembers();
      const selfId = familyMembers[0]?.id || 1;

      const record = await uploadMedicalRecord(selfId, uploadTitle, uploadDocType, uploadFile);
      setUploadStatusMsg("Running OCR & Medical NLP extraction...");
      await processRecordOCR(record.id);

      setUploadStatusMsg("Document uploaded & processed successfully!");
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadTitle("");
        setUploadFile(null);
        setUploadStatusMsg(null);
        loadRecords();
      }, 1000);
    } catch (err: any) {
      alert(err.message || "Failed to upload medical record.");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">

      {/* Page Header with working Actions */}
      <MedicalRecordsHeader
        onUploadClick={() => setIsUploadModalOpen(true)}
        onFilterToggle={() => setShowFilters(!showFilters)}
        isFilterActive={showFilters || selectedCategory !== "All"}
      />

      {/* Category Filter Pills (When Filters button is toggled) */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-[#e5e7eb] rounded-xl">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter By:</span>
          {["All", "Prescription", "Lab Report", "Discharge Summary", "Radiology"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                selectedCategory === cat
                  ? "bg-[#0878b8] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Dynamic Statistics Bar */}
      <RecordStats
        totalDocs={records.length}
        aiAnalyzed={records.filter((r) => r.ocr_status === "COMPLETED").length}
        lastUpdate={computeLastUpdate()}
        followUps={followUpsCount}
      />

      {/* Medical Records Grid */}
      <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <AddRecordCard onRecordAdded={loadRecords} />

        {filteredRecords.map((rec) => (
          <MedicalRecordCard
            key={rec.id}
            id={rec.id}
            type={rec.document_type}
            title={rec.title}
            description={`Digitized by CareTwin Smart Record Locker. OCR Status: ${rec.ocr_status}`}
            date={new Date(rec.upload_date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
            doctor={`Patient: ${patientName}`}
            analyzed={rec.ocr_status === "COMPLETED"}
            analysis="Clinical fields and time-series metrics extracted and synchronized with Health Timeline."
            onView={() => handleView(rec.id)}
            onDownload={() => handleDownload(rec.id, rec.title)}
            onDelete={() => handleDelete(rec.id, rec.title)}
          />
        ))}

        {filteredRecords.length === 0 && !loading && (
          <div className="flex min-h-[170px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-400">
            <p className="text-xs font-medium">No documents match "{selectedCategory}"</p>
            <p className="text-[10px] mt-1">Try selecting another filter or upload a new record.</p>
          </div>
        )}

      </section>

      {/* Global Upload Modal triggered from Top Right "Upload New Report" button */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Upload Medical Report
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Securely store in CareTwin Record Locker and parse clinical metrics via OCR.
            </p>

            <form onSubmit={handleModalUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Max Healthcare Lab Report"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Category
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
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
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 border border-slate-300 rounded-xl p-2 cursor-pointer"
                  required
                />
              </div>

              {uploadStatusMsg && (
                <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl text-xs font-medium border border-cyan-200">
                  {uploadStatusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={uploadLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                {uploadLoading ? "Uploading & Analyzing..." : "Upload & Analyze"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}