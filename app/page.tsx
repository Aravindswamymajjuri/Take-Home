"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCreatePaste = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = { content };

      if (ttlSeconds) {
        payload.ttl_seconds = parseInt(ttlSeconds, 10);
      }

      if (maxViews) {
        payload.max_views = parseInt(maxViews, 10);
      }

      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create paste");
      }

      const data = await response.json();
      router.push(`/p/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "700px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px", color: "white" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "10px", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
            📋 Pastebin Lite
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: "0.95", fontWeight: "300" }}>
            Share text quickly and securely with optional expiration
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <form onSubmit={handleCreatePaste}>
            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="content" style={{ display: "block", marginBottom: "10px", fontWeight: "600", fontSize: "0.95rem", color: "#374151" }}>
                Your Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your text, code, or notes here..."
                required
                style={{
                  width: "100%",
                  minHeight: "220px",
                  padding: "16px",
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontSize: "14px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  resize: "vertical",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <div>
                <label htmlFor="ttl" style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem", color: "#374151" }}>
                  ⏱️ Expires In (seconds)
                </label>
                <input
                  id="ttl"
                  type="number"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  placeholder="Never"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    transition: "border-color 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              <div>
                <label htmlFor="maxViews" style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem", color: "#374151" }}>
                  👁️ Max Views
                </label>
                <input
                  id="maxViews"
                  type="number"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="Unlimited"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    transition: "border-color 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            {error && (
              <div style={{
                color: "#dc2626",
                backgroundColor: "#fee2e2",
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "0.9rem",
                border: "1px solid #fca5a5",
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
                transform: loading ? "none" : "translateY(0)",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)", e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = "translateY(0)", e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)")}
            >
              {loading ? "Creating..." : "🚀 Create Paste"}
            </button>
          </form>

          <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "10px", fontSize: "0.85rem", color: "#6b7280" }}>
            <p style={{ marginBottom: "8px" }}><strong>💡 Tips:</strong></p>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              <li>Set expiry time for temporary content</li>
              <li>Limit views for one-time shares</li>
              <li>Leave both blank for permanent pastes</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "30px", color: "white", opacity: "0.9", fontSize: "0.9rem" }}>
          <p>Built with Next.js & PostgreSQL • Open Source</p>
        </div>
      </div>
    </div>
  );
}
