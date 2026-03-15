"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Token Gates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Active Gates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No token gates configured. Set minimum token holdings required for
            fans to access your exclusive content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
