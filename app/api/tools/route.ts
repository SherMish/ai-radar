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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, name, category } = body;

    await connectDB();

    // Create slug from name
    const slug = slugify(name);

    // Check if tool with same slug exists
    const existingTool = await Tool.findOne({ slug });
    if (existingTool) {
      return NextResponse.json(
        { error: "A tool with this name already exists" },
        { status: 400 }
      );
    }

    // Create tool
    const tool = await Tool.create({
      url,
      name,
      slug,
      category,
      createdBy: session.user.id,
    });

    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    );
  }
} 