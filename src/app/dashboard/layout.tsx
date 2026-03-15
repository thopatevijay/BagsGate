import { Navbar } from "@/components/layout/navbar";
import { CreatorSidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
