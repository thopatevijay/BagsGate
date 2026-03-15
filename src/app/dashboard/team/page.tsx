"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No team members added yet. Invite collaborators to help manage your
            content, gates, and community.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
