import { notFound } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { setTestTime, getCurrentTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PasteViewPage({ params }: PageProps) {
  const { id } = await params;

  // Handle test mode
  if (process.env.TEST_MODE === "1") {
    const headersList = await headers();
    const testNowMs = headersList.get("x-test-now-ms");
    if (testNowMs) {
      const ms = parseInt(testNowMs, 10);
      if (!isNaN(ms) && ms > 0) {
        setTestTime(ms);
      }
    }
  }

  try {
    // Get the paste
    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      notFound();
    }

    const now = getCurrentTime();

    // Check if paste has expired
    if (paste.expiresAt && paste.expiresAt <= now) {
      notFound();
    }

    // Check if view limit exceeded
    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      notFound();
    }

    // Increment view count for HTML view as well
    await prisma.paste.update({
      where: { id },
      data: {
        viewCount: paste.viewCount + 1,
      },
    });

    // Escape HTML to prevent XSS
    const escapedContent = paste.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");

    return (
      <div
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1>Paste</h1>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
            border: "1px solid #ddd",
          }}
        >
          {escapedContent}
        </pre>
        {paste.maxViews && (
          <p>
            <small>
              Views remaining: {Math.max(0, paste.maxViews - (paste.viewCount + 1))}
            </small>
          </p>
        )}
        {paste.expiresAt && (
          <p>
            <small>
              Expires: {new Date(paste.expiresAt).toLocaleString()}
            </small>
          </p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering paste:", error);
    notFound();
  }
}
