"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Settings and Support have their own layouts.
  if (
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/support")
  ) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}