import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const creators = await prisma.user.findMany({
    where: { role: "CREATOR" },
    include: {
      tokens: { select: { symbol: true, name: true } },
      _count: { select: { content: { where: { isPublished: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">Explore Creators</h1>
        <p className="text-muted-foreground mb-8">
          Discover creators and unlock exclusive content by holding their tokens.
        </p>

        {creators.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">No creators yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Be the first to launch a token and start gating content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Link key={creator.id} href={`/${creator.creatorSlug}`}>
                <Card className="hover:bg-secondary/50 transition cursor-pointer h-full">
                  <CardContent className="py-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatarUrl || undefined} />
                        <AvatarFallback>
                          {(creator.displayName || "?")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {creator.displayName}
                        </h3>
                        {creator.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {creator.bio}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {creator.tokens[0] && (
                            <Badge variant="outline" className="text-xs">
                              ${creator.tokens[0].symbol}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {creator._count.content} posts
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
