import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const { url, metadata, ...updateData } = await request.json();
    console.log('Received website update data:', { url, metadata, ...updateData });

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const cleanUrl = url
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .split(":")[0];

    // Prepare update data
    const websiteData = {
      ...updateData,
      ...(metadata || {}), // Spread metadata if it exists
      url: cleanUrl,
      updatedAt: new Date()
    };

    console.log('Final website data:', websiteData);

    const website = await Website.findOneAndUpdate(
      { url: cleanUrl },
      { $set: websiteData },
      { upsert: true, new: true }
    );

    console.log('Updated/Created website:', website);
    return NextResponse.json(website);
  } catch (error) {
    console.error("Error updating website:", error);
    return NextResponse.json({ 
      error: "Failed to update website",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 