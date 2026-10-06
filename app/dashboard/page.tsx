import WelcomeBanner from "@/components/Dashboard/Welcomebanner";
import UploadReport from "@/components/Dashboard/UploadReport";
import StartAIChat from "@/components/Dashboard/StartAIChat";
import SymptomCheckerCard from "@/components/Dashboard/SymptomChecker/SymptomCheckerCard";
import HealthSummary from "@/components/Dashboard/HealthSummary";
import RecentActivity from "@/components/Dashboard/RecentActivity";
import FamilySnapshot from "@/components/Dashboard/FamilySnapshot";
import { Stagger, StaggerItem } from "@/components/ui/Motion";

export const metadata = { title: "Overview" };

export default function DashboardPage() {
  return (
    <Stagger className="mx-auto w-full min-w-0 max-w-[1200px]">
      <StaggerItem>
        <WelcomeBanner />
      </StaggerItem>

      <StaggerItem>
        <section className="mt-5 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UploadReport />
          <StartAIChat />
          <SymptomCheckerCard />
        </section>
      </StaggerItem>

      <StaggerItem>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
          <HealthSummary />
          <div className="space-y-5">
            <RecentActivity />
            <FamilySnapshot />
          </div>
        </div>
      </StaggerItem>
    </Stagger>
  );
}
