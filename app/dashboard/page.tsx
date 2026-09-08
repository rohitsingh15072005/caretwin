import WelcomeBanner from "@/components/Dashboard/Welcomebanner";
import UploadReport from "@/components/Dashboard/UploadReport";
import StartAIChat from "@/components/Dashboard/StartAIChat";
import SymptomCheckerCard from "@/components/Dashboard/SymptomChecker/SymptomCheckerCard";
import HealthSummary from "@/components/Dashboard/HealthSummary";
import HealthChart from "@/components/Dashboard/HealthChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <section className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
        <UploadReport />
        <StartAIChat />
        <SymptomCheckerCard />
      </section>
      <HealthSummary />
      <HealthChart />
    </div>
  );
}
