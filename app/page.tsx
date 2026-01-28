"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [createdUrl, setCreatedUrl] = useState<string>("");
  const [createdContent, setCreatedContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const handleCreatePaste = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreatedUrl("");
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
      setCreatedUrl(data.url);
      setCreatedContent(content);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(createdUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(createdContent);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCreateAnother = () => {
    setCreatedUrl("");
    setCreatedContent("");
    setCopied(false);
    setCopiedContent(false);
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(45deg);
          }
          50% {
            transform: scale(1.2) rotate(45deg);
          }
          100% {
            transform: scale(1) rotate(45deg);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .slide-down {
          animation: slideDown 0.4s ease-out;
        }

        .scale-in {
          animation: scaleIn 0.5s ease-out;
        }

        .card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .input-field {
          transition: all 0.2s ease;
        }

        .input-field:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .btn {
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-success {
          background: #059669;
          color: white;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #4b5563;
        }

        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          width: 16px;
          height: 16px;
          animation: spin 0.6s linear infinite;
        }

        .success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #059669;
          animation: scaleIn 0.5s ease-out;
        }

        .success-icon::after {
          content: '';
          display: block;
          width: 20px;
          height: 36px;
          border: solid white;
          border-width: 0 4px 4px 0;
          transform: rotate(45deg);
          margin-top: -8px;
          animation: checkmark 0.5s ease-out 0.2s both;
        }

        @media (max-width: 768px) {
          .success-icon {
            width: 70px;
            height: 70px;
          }
          
          .success-icon::after {
            width: 16px;
            height: 30px;
            border-width: 0 3px 3px 0;
            margin-top: -6px;
          }
        }

        @media (max-width: 480px) {
          .success-icon {
            width: 60px;
            height: 60px;
          }
          
          .success-icon::after {
            width: 14px;
            height: 26px;
            border-width: 0 3px 3px 0;
            margin-top: -5px;
          }
        }

        .code-block {
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        /* Responsive Design */
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
          
          .flex-responsive {
            flex-direction: column !important;
          }
          
          .text-center-mobile {
            text-align: center !important;
          }
        }

        @media (max-width: 640px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ maxWidth: "800px", width: "100%" }}>
          {/* Header */}
          <div className="fade-in-up" style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "12px",
              marginBottom: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                background: "#2563eb",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                flexShrink: 0,
              }}>
                📋
              </div>
              <h1 style={{ 
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)", 
                fontWeight: "700", 
                color: "#1e293b",
                margin: 0,
                letterSpacing: "-0.02em",
              }}>
                Pastebin Lite
              </h1>
            </div>
            <p style={{ 
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", 
              color: "#64748b", 
              fontWeight: "400",
              margin: 0,
              padding: "0 10px",
            }}>
              Share text quickly and securely with optional expiration
            </p>
          </div>

          {/* Main Card */}
          <div className={`card ${createdUrl ? 'scale-in' : 'fade-in-up'}`} style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "clamp(20px, 5vw, 40px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}>
            {createdUrl ? (
              /* Success State */
              <div style={{ textAlign: "center" }}>
                <div className="success-icon" style={{ margin: "0 auto 24px" }}></div>
                
                <h2 className="slide-down" style={{ 
                  fontSize: "clamp(1.25rem, 4vw, 1.75rem)", 
                  fontWeight: "700", 
                  color: "#1e293b", 
                  marginBottom: "8px",
                }}>
                  Paste Created Successfully
                </h2>
                <p className="slide-down stagger-1" style={{ 
                  color: "#64748b", 
                  marginBottom: "32px",
                  fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                  padding: "0 10px",
                }}>
                  Your content is ready to share. Copy the link below.
                </p>

                {/* URL Display */}
                <div className="slide-down stagger-2" style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  alignItems: "stretch",
                }}>
                  <input
                    type="text"
                    value={createdUrl}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                    style={{
                      flex: "1",
                      minWidth: "200px",
                      padding: "14px 16px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "clamp(12px, 2vw, 14px)",
                      fontFamily: "'Consolas', 'Monaco', monospace",
                      backgroundColor: "#f8fafc",
                      color: "#334155",
                      cursor: "text",
                    }}
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="btn btn-primary"
                    style={{
                      padding: "14px 24px",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "clamp(13px, 2vw, 14px)",
                      fontWeight: "600",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      background: copied ? "#059669" : "#2563eb",
                      minWidth: "120px",
                    }}
                  >
                    {copied ? "✓ Copied" : "Copy Link"}
                  </button>
                </div>

                {/* Content Display */}
                <div className="slide-down stagger-3" style={{ marginBottom: "32px", textAlign: "left" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginBottom: "12px",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}>
                    <label style={{ 
                      fontWeight: "600", 
                      fontSize: "clamp(0.85rem, 2vw, 0.9rem)", 
                      color: "#334155",
                    }}>
                      Content Preview
                    </label>
                    <button
                      onClick={handleCopyContent}
                      className="btn"
                      style={{
                        padding: "8px 16px",
                        background: copiedContent ? "#059669" : "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "clamp(12px, 2vw, 13px)",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {copiedContent ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="code-block" style={{
                    padding: "clamp(14px, 3vw, 18px)",
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                    borderRadius: "10px",
                    fontSize: "clamp(12px, 2vw, 13px)",
                    overflow: "auto",
                    maxHeight: "200px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                    border: "1px solid #334155",
                  }}>{createdContent}</pre>
                </div>

                {/* Action Buttons */}
                <div className="slide-down stagger-4" style={{ 
                  display: "flex", 
                  gap: "12px", 
                  justifyContent: "center", 
                  flexWrap: "wrap",
                }}>
                  <a
                    href={createdUrl}
                    className="btn btn-secondary"
                    style={{
                      padding: "12px 24px",
                      textDecoration: "none",
                      borderRadius: "10px",
                      fontSize: "clamp(13px, 2vw, 14px)",
                      fontWeight: "600",
                      display: "inline-block",
                      flex: "1",
                      minWidth: "140px",
                      textAlign: "center",
                    }}
                  >
                    View Paste
                  </a>
                  <button
                    onClick={handleCreateAnother}
                    className="btn btn-primary"
                    style={{
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "clamp(13px, 2vw, 14px)",
                      fontWeight: "600",
                      cursor: "pointer",
                      flex: "1",
                      minWidth: "140px",
                    }}
                  >
                    Create Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreatePaste}>
                <div style={{ marginBottom: "24px" }}>
                  <label htmlFor="content" style={{ 
                    display: "block", 
                    marginBottom: "10px", 
                    fontWeight: "600", 
                    fontSize: "clamp(0.85rem, 2vw, 0.9rem)", 
                    color: "#334155",
                  }}>
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your text, code, or notes here..."
                    required
                    className="input-field code-block"
                    style={{
                      width: "100%",
                      minHeight: "clamp(180px, 30vh, 240px)",
                      padding: "clamp(12px, 3vw, 16px)",
                      fontSize: "clamp(13px, 2vw, 14px)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      resize: "vertical",
                      outline: "none",
                      backgroundColor: "#f8fafc",
                      color: "#1e293b",
                      lineHeight: "1.6",
                    }}
                  />
                  <div style={{ 
                    fontSize: "clamp(0.75rem, 1.5vw, 0.8rem)", 
                    color: "#94a3b8", 
                    marginTop: "6px",
                  }}>
                    {content.length} characters
                  </div>
                </div>

                <div className="grid-responsive" style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "clamp(12px, 3vw, 20px)", 
                  marginBottom: "24px",
                }}>
                  <div>
                    <label htmlFor="ttl" style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      fontWeight: "600", 
                      fontSize: "clamp(0.85rem, 2vw, 0.9rem)", 
                      color: "#334155",
                    }}>
                      Expiration Time
                    </label>
                    <input
                      id="ttl"
                      type="number"
                      value={ttlSeconds}
                      onChange={(e) => setTtlSeconds(e.target.value)}
                      placeholder="Seconds (optional)"
                      min="1"
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "clamp(10px, 2vw, 12px) 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "clamp(13px, 2vw, 14px)",
                        outline: "none",
                        backgroundColor: "#f8fafc",
                        color: "#1e293b",
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="maxViews" style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      fontWeight: "600", 
                      fontSize: "clamp(0.85rem, 2vw, 0.9rem)", 
                      color: "#334155",
                    }}>
                      Maximum Views
                    </label>
                    <input
                      id="maxViews"
                      type="number"
                      value={maxViews}
                      onChange={(e) => setMaxViews(e.target.value)}
                      placeholder="Views (optional)"
                      min="1"
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "clamp(10px, 2vw, 12px) 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "clamp(13px, 2vw, 14px)",
                        outline: "none",
                        backgroundColor: "#f8fafc",
                        color: "#1e293b",
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="slide-down" style={{
                    color: "#dc2626",
                    backgroundColor: "#fef2f2",
                    padding: "clamp(12px, 3vw, 14px) clamp(14px, 3vw, 16px)",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    fontSize: "clamp(0.85rem, 2vw, 0.9rem)",
                    border: "1px solid #fecaca",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    wordBreak: "break-word",
                  }}>
                    <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "clamp(14px, 3vw, 16px)",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "clamp(14px, 2.5vw, 15px)",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Creating Paste...</span>
                    </>
                  ) : (
                    "Create Paste"
                  )}
                </button>

                <div className="fade-in" style={{ 
                  marginTop: "24px", 
                  padding: "clamp(14px, 3vw, 18px)", 
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px", 
                  fontSize: "clamp(0.8rem, 2vw, 0.85rem)", 
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                }}>
                  <div style={{ fontWeight: "600", color: "#334155", marginBottom: "8px" }}>
                    ℹ️ Information
                  </div>
                  <ul style={{ paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Leave expiration empty for permanent storage</li>
                    <li>Set max views for one-time secure shares</li>
                    <li>All pastes are encrypted and secure</li>
                  </ul>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="fade-in" style={{ 
            textAlign: "center", 
            marginTop: "clamp(24px, 5vw, 32px)", 
            color: "#64748b", 
            fontSize: "clamp(0.8rem, 2vw, 0.85rem)",
            fontWeight: "400",
            padding: "0 10px",
          }}>
            <p style={{ margin: 0 }}>
              Built with Next.js & PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </>
  );
}