import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { prisma } from "@/lib/db/client";
import { getUserByPrivyId } from "@/lib/db/queries";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const verifiedClaims = await privyClient.verifyAuthToken(token);
  return getUserByPrivyId(verifiedClaims.userId);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "CREATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, body: contentBody, contentType, gateId, mediaUrl, previewText, isPublished } = body;

    if (!title || !contentBody || !contentType) {
      return NextResponse.json(
        { error: "title, body, and contentType are required" },
        { status: 400 }
      );
    }

    // Verify gate belongs to this creator if provided
    if (gateId) {
      const gate = await prisma.gate.findUnique({ where: { id: gateId } });
      if (!gate || gate.creatorId !== user.id) {
        return NextResponse.json(
          { error: "Gate not found or not owned by you" },
          { status: 403 }
        );
      }
    }

    const content = await prisma.content.create({
      data: {
        creatorId: user.id,
        title,
        body: contentBody,
        contentType,
        gateId: gateId || null,
        mediaUrl: mediaUrl || null,
        previewText: previewText || null,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
      include: { gate: true },
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Create content error:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contents = await prisma.content.findMany({
      where: { creatorId: user.id },
      include: {
        gate: { include: { token: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contents });
  } catch (error) {
    console.error("Get content error:", error);
    return NextResponse.json(
      { error: "Failed to get content" },
      { status: 500 }
    );
  }
}
