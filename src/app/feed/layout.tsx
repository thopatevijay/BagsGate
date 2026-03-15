import { Navbar } from "@/components/layout/navbar";
import { FanSidebar } from "@/components/layout/sidebar";

export default function FanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="hidden md:block">
          <FanSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
