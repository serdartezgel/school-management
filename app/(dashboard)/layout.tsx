import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const role = session.user.role;

  return (
    <SidebarProvider>
      <main className="flex h-screen w-full">
        <Navbar />
        <LeftSidebar role={role} />

        <div className="w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
};
export default DashboardLayout;
