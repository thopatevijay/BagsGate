import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">Explore Creators</h1>
        <p className="text-muted-foreground mb-8">
          Discover creators and unlock exclusive content by holding their tokens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Empty state */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-center">No creators yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Be the first to launch a token and start gating content.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
