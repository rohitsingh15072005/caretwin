import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ToastProvider } from "@/components/ui/Toast";
import { CareDataProvider } from "@/lib/CareDataProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CareDataProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </CareDataProvider>
    </ToastProvider>
  );
}
