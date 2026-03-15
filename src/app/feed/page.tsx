"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">No content yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Follow creators and buy their tokens to unlock exclusive content in
            your feed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
