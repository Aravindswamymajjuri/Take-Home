export default function NotFound() {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h1>404</h1>
      <h2>Paste Not Found</h2>
      <p>
        The paste you are looking for does not exist, has expired, or has reached its view limit.
      </p>
      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#1976d2",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Create a New Paste
      </a>
    </div>
  );
}
