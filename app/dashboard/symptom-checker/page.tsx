"use client";

import SymptomCheckerHeader from "@/components/Dashboard/SymptomChecker/SymptomCheckerHeader";
import SymptomInput from "@/components/Dashboard/SymptomChecker/SymptomInput";
import AnalysisPanel from "@/components/Dashboard/SymptomChecker/AnalysisPanel";

export default function SymptomCheckerPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px]">

      {/* Header */}
      <SymptomCheckerHeader />

      {/* Main Checker */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_0.8fr]">

        {/* Left */}
        <SymptomInput />

        {/* Right */}
        <AnalysisPanel />

      </div>

    </div>
  );
}