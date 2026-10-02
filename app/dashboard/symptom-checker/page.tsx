"use client";

import { useState } from "react";
import SymptomCheckerHeader from "@/components/Dashboard/SymptomChecker/SymptomCheckerHeader";
import SymptomInput from "@/components/Dashboard/SymptomChecker/SymptomInput";
import AnalysisPanel from "@/components/Dashboard/SymptomChecker/AnalysisPanel";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { analyzeSymptoms, type Analysis } from "@/lib/analyze";

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    setLoading(true);
    setResult(null);
    // Simulated latency; replace with your AI API call.
    setTimeout(() => {
      setResult(analyzeSymptoms(symptoms));
      setLoading(false);
    }, 900);
  };

  return (
    <Stagger className="mx-auto w-full max-w-[1200px]">
      <StaggerItem>
        <SymptomCheckerHeader />
      </StaggerItem>
      <StaggerItem>
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
          <SymptomInput symptoms={symptoms} setSymptoms={setSymptoms} onAnalyze={analyze} loading={loading} />
          <AnalysisPanel result={result} loading={loading} />
        </div>
      </StaggerItem>
    </Stagger>
  );
}
