import { notFound } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { setTestTime, getCurrentTime } from "@/lib/utils";
import CopyButton from "./CopyButton";

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
      <div style={{ minHeight: "100vh", padding: "20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "30px" }}>
            <a href="/" style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              color: "white", 
              fontSize: "1rem",
              fontWeight: "600",
              textDecoration: "none",
              padding: "10px 20px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
            }}>
              ← Back to Home
            </a>
          </div>

          {/* Main Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* Title and Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "15px" }}>
              <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1f2937", margin: 0 }}>
                📄 Your Paste
              </h1>
              <CopyButton content={paste.content} />
            </div>

            {/* Info Bar */}
            {(paste.maxViews || paste.expiresAt) && (
              <div style={{
                display: "flex",
                gap: "15px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}>
                {paste.maxViews && (
                  <div style={{
                    padding: "8px 16px",
                    backgroundColor: "#dbeafe",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    color: "#1e40af",
                    fontWeight: "600",
                  }}>
                    👁️ {Math.max(0, paste.maxViews - (paste.viewCount + 1))} views remaining
                  </div>
                )}
                {paste.expiresAt && (
                  <div style={{
                    padding: "8px 16px",
                    backgroundColor: "#fef3c7",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    color: "#92400e",
                    fontWeight: "600",
                  }}>
                    ⏱️ Expires: {new Date(paste.expiresAt).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <pre style={{
              backgroundColor: "#1f2937",
              color: "#f9fafb",
              padding: "24px",
              borderRadius: "12px",
              overflow: "auto",
              fontSize: "14px",
              lineHeight: "1.6",
              border: "none",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
              fontFamily: "'Fira Code', 'Courier New', monospace",
              margin: 0,
            }}>
              {escapedContent}
            </pre>

            {/* Footer Info */}
            <div style={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "10px",
              fontSize: "0.85rem",
              color: "#6b7280",
            }}>
              <p style={{ margin: 0 }}>
                💡 <strong>Tip:</strong> This paste will be automatically deleted once it expires or reaches its view limit.
              </p>
            </div>
          </div>

          {/* Create New Button */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <a href="/" style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "white",
              color: "#667eea",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 4px 15px rgba(255,255,255,0.3)",
            }}>
              ➕ Create New Paste
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering paste:", error);
    notFound();
  }
}
