import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { Navbar } from "@/components/layout/navbar";
import { CreatorProfileClient } from "./client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ creatorSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { creatorSlug } = await params;
  const creator = await prisma.user.findUnique({
    where: { creatorSlug },
    select: { displayName: true, bio: true },
  });

  if (!creator) return { title: "Creator Not Found" };

  return {
    title: `${creator.displayName} — BagsGate`,
    description:
      creator.bio || `Check out ${creator.displayName}'s gated content on BagsGate`,
    openGraph: {
      title: `${creator.displayName} — BagsGate`,
      description:
        creator.bio || `Exclusive content from ${creator.displayName}`,
    },
  };
}

export default async function CreatorProfilePage({ params }: Props) {
  const { creatorSlug } = await params;

  const creator = await prisma.user.findUnique({
    where: { creatorSlug },
    select: {
      id: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      twitterHandle: true,
      creatorSlug: true,
      tokens: {
        select: {
          id: true,
          mintAddress: true,
          name: true,
          symbol: true,
          imageUrl: true,
          status: true,
        },
      },
      content: {
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          previewText: true,
          contentType: true,
          publishedAt: true,
          gateId: true,
          gate: {
            select: {
              id: true,
              name: true,
              requiredAmount: true,
              token: { select: { symbol: true, mintAddress: true } },
            },
          },
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!creator) notFound();

  // Serialize BigInt and Date for client
  const serializedCreator = {
    ...creator,
    content: creator.content.map((c) => ({
      ...c,
      publishedAt: c.publishedAt?.toISOString() ?? null,
      gate: c.gate
        ? { ...c.gate, requiredAmount: c.gate.requiredAmount.toString() }
        : null,
    })),
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <CreatorProfileClient creator={serializedCreator} />
    </div>
  );
}
