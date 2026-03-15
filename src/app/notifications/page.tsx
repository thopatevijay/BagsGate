"use client";

import { Navbar } from "@/components/layout/navbar";
import { FanSidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <FanSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No notifications yet. You will be notified when creators you
                follow post new content or when your token holdings change.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
