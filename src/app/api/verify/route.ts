import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ success: true, message: "Verified" });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
