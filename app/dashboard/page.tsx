import WelcomeBanner from "@/components/Dashboard/Welcomebanner";
import UploadReport from "@/components/Dashboard/UploadReport";
import StartAIChat from "@/components/Dashboard/StartAIChat";
import SymptomCheckerCard from "@/components/Dashboard/SymptomChecker/SymptomCheckerCard";
import HealthSummary from "@/components/Dashboard/HealthSummary";

export default function DashboardPage() {
  return (
    <div className="w-full min-w-0">
      <WelcomeBanner />

      <section className="mt-5 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UploadReport />
        <StartAIChat />
        <SymptomCheckerCard />
      </section>

      <HealthSummary />
    </div>
  );
}