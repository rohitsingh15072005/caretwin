import WelcomeBanner from "@/components/Dashboard/Welcomebanner";
import UploadReport from "@/components/Dashboard/UploadReport"; 
import StartAIChat from "@/components/Dashboard/StartAIChat";
import SymptomCheckerCard from "@/components/Dashboard/SymptomCheckerCard";
import HealthSummary from "@/components/Dashboard/HealthSummary";
export default function DashboardPage() {
  return (
    <div>
      <WelcomeBanner />
      <section className="mt-5 grid w-full grid-cols-3 gap-4">
        <UploadReport />
        <StartAIChat />
        <SymptomCheckerCard />
      </section>
      <HealthSummary />
    </div>
  );
}
