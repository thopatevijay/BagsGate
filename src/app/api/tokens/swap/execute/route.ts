import { NextRequest, NextResponse } from "next/server";
import { executeSwap } from "@/lib/bags/swap";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quoteResponse, userPublicKey } = body;

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { error: "quoteResponse and userPublicKey are required" },
        { status: 400 }
      );
    }

    const swap = await executeSwap({ quoteResponse, userPublicKey });

    return NextResponse.json({ swap });
  } catch (error) {
    console.error("Swap error:", error);
    return NextResponse.json(
      { error: "Failed to execute swap" },
      { status: 500 }
    );
  }
}
