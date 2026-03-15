import { NextRequest, NextResponse } from "next/server";
import { getQuote } from "@/lib/bags/swap";

export async function GET(req: NextRequest) {
  try {
    const inputMint = req.nextUrl.searchParams.get("inputMint");
    const outputMint = req.nextUrl.searchParams.get("outputMint");
    const amount = req.nextUrl.searchParams.get("amount");

    if (!inputMint || !outputMint || !amount) {
      return NextResponse.json(
        { error: "inputMint, outputMint, and amount are required" },
        { status: 400 }
      );
    }

    const quote = await getQuote({
      inputMint,
      outputMint,
      amount: parseInt(amount),
    });

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { error: "Failed to get quote" },
      { status: 500 }
    );
  }
}
