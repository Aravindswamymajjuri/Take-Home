import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generatePasteId, getBaseUrl, getCurrentTime, setTestTime, extractTestTimeFromRequest } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    // Set test time if provided
    const testTime = extractTestTimeFromRequest(req);
    if (testTime) {
      setTestTime(testTime);
    }

    const body = await req.json();

    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required and must be a non-empty string" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (ttl_seconds !== undefined && ttl_seconds !== null) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          {
            error:
              "ttl_seconds must be an integer >= 1 if provided",
          },
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (max_views !== undefined && max_views !== null) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          { error: "max_views must be an integer >= 1 if provided" },
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Generate paste ID
    const pasteId = generatePasteId();
    const now = getCurrentTime();

    // Calculate expiry time
    let expiresAt: Date | null = null;
    if (ttl_seconds) {
      expiresAt = new Date(now.getTime() + ttl_seconds * 1000);
    }

    // Create paste in database
    const paste = await prisma.paste.create({
      data: {
        id: pasteId,
        content,
        ttlSeconds: ttl_seconds || null,
        maxViews: max_views || null,
        expiresAt,
      },
    });

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/p/${paste.id}`;

    return NextResponse.json(
      {
        id: paste.id,
        url,
      },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(req: NextRequest) {
  // GET request to /api/pastes should not be allowed
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
}
