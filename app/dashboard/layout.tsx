import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ToastProvider } from "@/components/ui/Toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ToastProvider>
  );
}
