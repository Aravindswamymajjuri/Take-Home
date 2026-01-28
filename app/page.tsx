"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [pasteUrl, setPasteUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCreatePaste = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPasteUrl("");

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
      setPasteUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (pasteUrl) {
      await navigator.clipboard.writeText(pasteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setPasteUrl("");
    setContent("");
    setTtlSeconds("");
    setMaxViews("");
    setError("");
    setCopied(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-block",
            padding: "8px 16px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            marginBottom: "16px",
            backdropFilter: "blur(10px)",
          }}>
            <span style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>✨ Fast & Secure</span>
          </div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "white",
            marginBottom: "12px",
            letterSpacing: "-1px",
          }}>Pastebin Lite</h1>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "500px",
            margin: "0 auto",
          }}>Share text snippets instantly with optional expiration and view limits</p>
        </div>

      {pasteUrl ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#10b981",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <span style={{ fontSize: "32px", color: "white" }}>✓</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#1a1a1a", marginBottom: "8px" }}>
              Paste Created Successfully!
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Your shareable link is ready</p>
          </div>
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <a
                href={pasteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  color: "#667eea",
                  wordBreak: "break-all",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {pasteUrl}
              </a>
              <button
                onClick={handleCopy}
                style={{
                  padding: "10px 20px",
                  backgroundColor: copied ? "#10b981" : "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <a
                href={pasteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  backgroundColor: "#667eea",
                  color: "white",
                  textAlign: "center",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "15px",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                }}
              >
                👁️ View Paste
              </a>
              <button
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  backgroundColor: "white",
                  color: "#667eea",
                  border: "2px solid #667eea",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                ✨ Create Another
              </button>
            </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
        <form onSubmit={handleCreatePaste}>
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="content" style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#1a1a1a", fontSize: "15px" }}>
            📝 Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text here..."
            required
            style={{
              width: "100%",
              minHeight: "220px",
              padding: "16px",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
              resize: "vertical",
              backgroundColor: "#f9fafb",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div>
            <label htmlFor="ttl" style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#1a1a1a", fontSize: "15px" }}>
              ⏱️ TTL (seconds)
            </label>
            <input
              id="ttl"
              type="number"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              placeholder="e.g., 3600"
              min="1"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>

          <div>
            <label htmlFor="maxViews" style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#1a1a1a", fontSize: "15px" }}>
              👁️ Max Views
            </label>
            <input
              id="maxViews"
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="e.g., 10"
              min="1"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              color: "#dc2626",
              backgroundColor: "#fef2f2",
              padding: "14px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid #fecaca",
              fontSize: "14px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: loading ? "#9ca3af" : "#667eea",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 16px rgba(102, 126, 234, 0.4)",
            transform: loading ? "none" : "translateY(0)",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(102, 126, 234, 0.4)";
            }
          }}
        >
          {loading ? "✨ Creating..." : "🚀 Create Paste"}
        </button>
      </form>
      </div>
      )}
      </div>
    </div>
  );
}
