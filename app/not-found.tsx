export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "60px 40px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        maxWidth: "500px",
      }}>
        <div style={{
          fontSize: "72px",
          marginBottom: "16px",
        }}>😕</div>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "700",
          color: "#1a1a1a",
          marginBottom: "12px",
        }}>404</h1>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "16px",
        }}>Paste Not Found</h2>
        <p style={{
          color: "#6b7280",
          marginBottom: "32px",
          fontSize: "15px",
          lineHeight: "1.6",
        }}>
          The paste you are looking for does not exist, has expired, or has reached its view limit.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            backgroundColor: "#667eea",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "15px",
            boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
          }}
        >
          ✨ Create a New Paste
        </a>
      </div>
    </div>
  );
}
