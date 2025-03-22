import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log("DEBUG 1")
    // Parse request body
    const body = await req.json();
    const { to, name, websiteId, message } = body;

    if (!to || !name || !websiteId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log("DEBUG 2")
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    console.log("DEBUG 3")
    // Connect to database and verify website ownership
    await connectDB();
    const website = await Website.findById(websiteId).lean();
    console.log("DEBUG 4")
    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }
    console.log("DEBUG 5")
    // Verify ownership
    if (session.user.id !== website.owner?.toString()) {
      return NextResponse.json(
        {
          error:
            "You don't have permission to send invitations for this website",
        },
        { status: 403 }
      );
    }
    console.log("DEBUG 6")
    // Send email
    const subject = `Share your experience with ${website.name}`;
    console.log("DEBUG 7")
    await sendEmail({
      to,
      subject,
      html: message.replace(/\n/g, "<br />"),
      text: message,
    });
    console.log("DEBUG 8")
    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Error sending review invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
