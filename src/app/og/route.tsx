import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F4F0E6",
          color: "#172A46",
          fontFamily: "Arial, sans-serif",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "3px solid #172A46",
            borderRadius: 30,
            padding: 48,
            background: "#F4F0E6",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <img
              src="https://www.houseofdev.online/brand/houseofdev-mark.svg"
              width="112"
              height="112"
              alt="House Of Dev"
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 1 }}>HOUSE OF DEV</div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 600, letterSpacing: 2 }}>
                LOCAL BUSINESS TRANSITION | GROWTH | VALUE
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.06, maxWidth: 980 }}>
              Websites and automation that help local businesses grow online.
            </div>
            <div style={{ marginTop: 22, fontSize: 27, lineHeight: 1.4, maxWidth: 940 }}>
              Professional websites, dashboards, booking systems, business automation, and AI-powered workflows.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
