"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EarningsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Earnings & Fees</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Claimable Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 SOL</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earned (All Time)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 SOL</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Earned (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 SOL</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No earnings yet. Once fans buy your token, trading fees will appear
            here and you can claim them on-chain.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
