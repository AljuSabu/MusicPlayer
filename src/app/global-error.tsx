"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          background: "#0B0F0E",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 28 }}>Vibra hit a snag</h1>
          <p style={{ margin: "0 0 24px", color: "#A3B1AC" }}>
            Something went wrong while loading the app.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "12px 24px",
              border: 0,
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              color: "#0B0F0E",
              background: "linear-gradient(135deg, #A6E23A, #4CD964, #1BC5A0)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
