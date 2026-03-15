import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { Navbar } from "@/components/layout/navbar";
import { ContentViewClient } from "./client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ creatorSlug: string; contentId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentId } = await params;
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { title: true, previewText: true },
  });

  if (!content) return { title: "Content Not Found" };

  return {
    title: `${content.title} — BagsGate`,
    description: content.previewText || content.title,
  };
}

export default async function ContentViewPage({ params }: Props) {
  const { creatorSlug, contentId } = await params;

  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      creator: {
        select: {
          displayName: true,
          creatorSlug: true,
          avatarUrl: true,
        },
      },
      gate: {
        include: {
          token: {
            select: { mintAddress: true, symbol: true, name: true },
          },
        },
      },
    },
  });

  if (!content || content.creator.creatorSlug !== creatorSlug) {
    notFound();
  }

  const serializedContent = {
    id: content.id,
    title: content.title,
    body: content.body,
    contentType: content.contentType,
    mediaUrl: content.mediaUrl,
    previewText: content.previewText,
    publishedAt: content.publishedAt?.toISOString() ?? null,
    creator: content.creator,
    gate: content.gate
      ? {
          id: content.gate.id,
          name: content.gate.name,
          requiredAmount: content.gate.requiredAmount.toString(),
          token: content.gate.token,
        }
      : null,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <ContentViewClient content={serializedContent} />
    </div>
  );
}
