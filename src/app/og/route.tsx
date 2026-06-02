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
          background: "#0f172a",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 24,
            padding: 56,
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.38), rgba(16,185,129,0.24))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                width: 64,
                height: 64,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: "white",
                color: "#0f172a",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              HD
            </div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>HouseOfDev</div>
          </div>
          <div>
            <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.04, maxWidth: 940 }}>
              Transforming Businesses Into Powerful Digital Brands
            </div>
            <div style={{ marginTop: 24, fontSize: 28, color: "#dbeafe", maxWidth: 900 }}>
              Premium websites, web applications, automation, AI, cloud, SEO, and digital
              transformation.
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
