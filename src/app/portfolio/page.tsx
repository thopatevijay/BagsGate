"use client";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Portfolio</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">No tokens held</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Buy creator tokens to unlock gated content. Your holdings will
              appear here.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
