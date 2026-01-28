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
      <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "white",
              marginBottom: "8px",
            }}>Pastebin Lite</h1>
            <a href="/" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", textDecoration: "underline" }}>
              Create your own paste
            </a>
          </div>

          {/* Content Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                📄 Paste Content
              </h2>
              <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#6b7280" }}>
                {paste.maxViews && (
                  <span style={{
                    padding: "6px 12px",
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    borderRadius: "8px",
                    fontWeight: "500",
                  }}>
                    👁️ {Math.max(0, paste.maxViews - (paste.viewCount + 1))} views left
                  </span>
                )}
                {paste.expiresAt && (
                  <span style={{
                    padding: "6px 12px",
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    borderRadius: "8px",
                    fontWeight: "500",
                  }}>
                    ⏱️ Expires: {new Date(paste.expiresAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <pre
              style={{
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
                padding: "24px",
                borderRadius: "12px",
                overflow: "auto",
                border: "none",
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontSize: "14px",
                lineHeight: "1.6",
                maxHeight: "600px",
              }}
            >
              {escapedContent}
            </pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering paste:", error);
    notFound();
  }
}
