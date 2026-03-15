"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Content</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You have no gated content yet. Create your first post, video, or
            file and set a token threshold to unlock it for fans.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
