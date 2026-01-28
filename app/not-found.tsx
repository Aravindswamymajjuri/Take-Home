export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "60px 40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        textAlign: "center",
        maxWidth: "500px",
      }}>
        <div style={{ fontSize: "6rem", marginBottom: "20px" }}>🔍</div>
        <h1 style={{ fontSize: "3rem", fontWeight: "700", color: "#1f2937", marginBottom: "10px" }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#4b5563", marginBottom: "20px" }}>Paste Not Found</h2>
        <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: "1.6", marginBottom: "30px" }}>
          The paste you're looking for doesn't exist, has expired, or has reached its view limit.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          }}
        >
          ➕ Create a New Paste
        </a>
      </div>
    </div>
  );
}
