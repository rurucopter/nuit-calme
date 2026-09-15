import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nuit Calme — Repare ton sommeil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0e27, #12183b, #1e2654)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Moon glow */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 120,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, #fde68a, #f59e0b, #ea580c)",
            boxShadow:
              "0 0 60px rgba(245,158,11,0.4), 0 0 120px rgba(245,158,11,0.15)",
            display: "flex",
          }}
        />
        {/* Stars */}
        {[
          { x: 80, y: 40, s: 4 },
          { x: 200, y: 80, s: 3 },
          { x: 350, y: 50, s: 5 },
          { x: 500, y: 100, s: 3 },
          { x: 700, y: 60, s: 4 },
          { x: 900, y: 90, s: 3 },
          { x: 150, y: 200, s: 3 },
          { x: 1050, y: 150, s: 4 },
        ].map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              borderRadius: "50%",
              background: "white",
              opacity: 0.6,
              display: "flex",
            }}
          />
        ))}
        {/* Logo */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0a0e27",
            fontWeight: 700,
            fontSize: 28,
            marginBottom: 24,
          }}
        >
          NC
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#f0f0f5",
            textAlign: "center",
            lineHeight: 1.2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Tu dors mal.</span>
          <span
            style={{
              background: "linear-gradient(90deg, #f59e0b, #f97316, #ea580c)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            On sait pourquoi.
          </span>
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            marginTop: 20,
            textAlign: "center",
            display: "flex",
          }}
        >
          Diagnostic en 2 min · Plan personnalise · Rituel du soir guide
        </div>
        {/* CTA pill */}
        <div
          style={{
            marginTop: 32,
            padding: "14px 40px",
            borderRadius: 20,
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            color: "#0a0e27",
            fontWeight: 600,
            fontSize: 20,
            display: "flex",
          }}
        >
          Decouvrir ma solution
        </div>
      </div>
    ),
    { ...size }
  );
}
