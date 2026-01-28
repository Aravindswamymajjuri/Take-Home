import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentTime, setTestTime, extractTestTimeFromRequest } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Set test time if provided
    const testTime = extractTestTimeFromRequest(req);
    if (testTime) {
      setTestTime(testTime);
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid paste ID" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the paste
    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const now = getCurrentTime();

    // Check if paste has expired
    if (paste.expiresAt && paste.expiresAt <= now) {
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if view limit exceeded
    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Increment view count
    await prisma.paste.update({
      where: { id },
      data: {
        viewCount: paste.viewCount + 1,
      },
    });

    // Calculate remaining views
    const remainingViews =
      paste.maxViews !== null ? paste.maxViews - (paste.viewCount + 1) : null;

    // Format response
    const response = {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt ? paste.expiresAt.toISOString() : null,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
