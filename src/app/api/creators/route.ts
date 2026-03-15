import { NextRequest, NextResponse } from "next/server";
import { getCreators } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");

    const creators = await getCreators({ limit, offset, search });

    return NextResponse.json({ creators });
  } catch (error) {
    console.error("Get creators error:", error);
    return NextResponse.json(
      { error: "Failed to get creators" },
      { status: 500 }
    );
  }
}
