"use client";

import MedicalRecordsHeader from "@/components/Dashboard/MedicalRecords/MedicalRecordsHeader";
import RecordStats from "@/components/Dashboard/MedicalRecords/RecordStats";
import MedicalRecordCard from "@/components/Dashboard/MedicalRecords/MedicalRecordCard";
import AddRecordCard from "@/components/Dashboard/MedicalRecords/AddRecordCard";

export default function MedicalRecordsPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px]">

      {/* Page Header */}
      <MedicalRecordsHeader />

      {/* Statistics */}
      <RecordStats />

      {/* Medical Records */}
      <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <MedicalRecordCard
          type="Laboratory"
          title="Full Blood Count Analysis"
          description="Comprehensive metabolic panel and lipid profile for routine checkup."
          date="Oct 24, 2023"
          doctor="Dr. Sarah Jenkins"
        />

        <MedicalRecordCard
          type="Cardiology"
          title="ECG Report & Summary"
          description="Standard 12-lead electrocardiogram performed during cardiac stress test."
          date="Sep 12, 2023"
          doctor="City General Hospital"
          analyzed
          analysis="Normal sinus rhythm detected. 15% improvement in resting heart rate compared to 2022."
        />

        <MedicalRecordCard
          type="Radiology"
          title="Chest X-Ray Digital Copy"
          description="Diagnostic imaging for annual physical. Clear findings reported."
          date="Aug 30, 2023"
          doctor="Dr. Marcus Thorne"
        />

        <MedicalRecordCard
          type="Prescription"
          title="Medication Reconciliation"
          description="Updated list of active prescriptions and dosage instructions."
          date="July 15, 2023"
          doctor="Dr. Sarah Jenkins"
        />

        <AddRecordCard />

      </section>

    </div>
  );
}