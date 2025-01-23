import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Tool from "@/lib/models/Tool";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("No session or user found");
      return NextResponse.json(
        { error: "You must be logged in to create a tool" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Received body:", body);
    
    const { url, name, category } = body;

    // Validate required fields
    if (!url || !name || !category) {
      console.log("Missing fields:", { url, name, category });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create slug from name
    const slug = slugify(name);

    // Check if tool with same URL exists
    const existingTool = await Tool.findOne({ url: url.toLowerCase().trim() });
    if (existingTool) {
      console.log("Tool with URL already exists:", url);
      return NextResponse.json(
        { error: "A tool with this URL already exists" },
        { status: 400 }
      );
    }

    // Create tool
    const tool = await Tool.create({
      url: url.toLowerCase().trim(),
      name,
      slug,
      category,
      createdBy: session.user.id,
    });

    console.log("Created tool:", tool);

    return NextResponse.json({
      message: "Tool created successfully",
      slug: tool.slug,
      id: tool._id
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create tool" },
      { status: 500 }
    );
  }
} 