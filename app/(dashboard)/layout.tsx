import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <main className="flex h-screen w-full">
        <Navbar />
        <LeftSidebar />

        <div className="w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
};
export default DashboardLayout;
