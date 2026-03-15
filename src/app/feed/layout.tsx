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
        <FanSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
