import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ToolAnalytics from "@/lib/models/ToolAnalytics";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get("websiteId");
  const eventType = searchParams.get("eventType");
  if (!websiteId) {
    return NextResponse.json({ error: "Missing websiteId" }, { status: 400 });
  }

  try {
    const analytics = await ToolAnalytics.find({ websiteId, eventType }).sort({ month: -1 });

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}