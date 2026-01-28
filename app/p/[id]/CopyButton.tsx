"use client";

import { useState } from "react";

interface CopyButtonProps {
  content: string;
}

export default function CopyButton({ content }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "10px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "0.9rem",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)",
      }}
    >
      {copied ? "✓ Copied!" : "📋 Copy"}
    </button>
  );
}
