import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { prisma } from "@/lib/db/client";
import { getUserByPrivyId } from "@/lib/db/queries";
import { checkTokenBalanceCached } from "@/services/gate-verifier";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.replace("Bearer ", "");
    const verifiedClaims = await privyClient.verifyAuthToken(token);
    return getUserByPrivyId(verifiedClaims.userId);
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        creator: { select: { displayName: true, creatorSlug: true, avatarUrl: true } },
        gate: { include: { token: true } },
      },
    });

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Public content — return full body
    if (!content.gateId || !content.gate) {
      return NextResponse.json({ content, hasAccess: true });
    }

    // Gated content — check access
    const user = await getAuthUser(req);
    if (!user?.walletAddress) {
      return NextResponse.json({
        content: {
          ...content,
          body: null, // Strip gated body
          mediaUrl: null,
        },
        hasAccess: false,
        requiredAmount: content.gate.requiredAmount.toString(),
        tokenSymbol: content.gate.token.symbol,
      });
    }

    // Creator always has access to their own content
    if (user.id === content.creatorId) {
      return NextResponse.json({ content, hasAccess: true });
    }

    const balance = await checkTokenBalanceCached(
      user.walletAddress,
      content.gate.token.mintAddress
    );

    const hasAccess = balance >= content.gate.requiredAmount;

    if (hasAccess) {
      return NextResponse.json({ content, hasAccess: true });
    }

    return NextResponse.json({
      content: {
        ...content,
        body: null,
        mediaUrl: null,
      },
      hasAccess: false,
      balance: balance.toString(),
      requiredAmount: content.gate.requiredAmount.toString(),
      deficit: (content.gate.requiredAmount - balance).toString(),
      tokenMint: content.gate.token.mintAddress,
      tokenSymbol: content.gate.token.symbol,
    });
  } catch (error) {
    console.error("Get content by id error:", error);
    return NextResponse.json(
      { error: "Failed to get content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.content.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Content not found or not owned by you" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, body: contentBody, contentType, gateId, mediaUrl, previewText, isPublished } = body;

    const content = await prisma.content.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(contentBody !== undefined && { body: contentBody }),
        ...(contentType !== undefined && { contentType }),
        ...(gateId !== undefined && { gateId: gateId || null }),
        ...(mediaUrl !== undefined && { mediaUrl: mediaUrl || null }),
        ...(previewText !== undefined && { previewText: previewText || null }),
        ...(isPublished !== undefined && {
          isPublished,
          publishedAt: isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
        }),
      },
      include: { gate: true },
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Update content error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.content.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Content not found or not owned by you" },
        { status: 403 }
      );
    }

    await prisma.content.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete content error:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
