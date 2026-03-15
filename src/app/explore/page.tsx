import { prisma } from "@/lib/db/client";
import { Navbar } from "@/components/layout/navbar";
import { ExploreClient } from "./client";

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

  const serialized = creators.map((c) => ({
    id: c.id,
    displayName: c.displayName,
    bio: c.bio,
    avatarUrl: c.avatarUrl,
    creatorSlug: c.creatorSlug,
    tokenSymbol: c.tokens[0]?.symbol || null,
    contentCount: c._count.content,
  }));

  return (
    <div className="min-h-screen">
      <Navbar />
      <ExploreClient creators={serialized} />
    </div>
  );
}
