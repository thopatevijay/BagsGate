import { prisma } from "@/lib/db/client";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    totalUsers,
    totalCreators,
    totalFans,
    totalTokens,
    totalContent,
    totalGates,
    publishedContent,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.user.count({ where: { role: "FAN" } }),
    prisma.token.count(),
    prisma.content.count(),
    prisma.gate.count({ where: { isActive: true } }),
    prisma.content.count({ where: { isPublished: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        displayName: true,
        role: true,
        createdAt: true,
        walletAddress: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCreators}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalFans}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tokens Launched
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalTokens}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{publishedContent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalContent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Gates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalGates}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium">
                      {user.displayName || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.walletAddress
                      ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`
                      : "No wallet"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
