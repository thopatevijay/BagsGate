import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "BagsGate";
  const description =
    searchParams.get("description") ||
    "Token-gated creator access on Bags.fm";
  const creator = searchParams.get("creator") || "";
  const tokenSymbol = searchParams.get("token") || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#7C3AED",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            BagsGate
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#ededed",
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 24,
                color: "#737373",
                marginTop: 16,
                maxWidth: 700,
              }}
            >
              {description}
            </div>
          )}
          {(creator || tokenSymbol) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 32,
              }}
            >
              {creator && (
                <div
                  style={{
                    fontSize: 20,
                    color: "#a3a3a3",
                    padding: "8px 16px",
                    border: "1px solid #333",
                    borderRadius: 8,
                  }}
                >
                  by {creator}
                </div>
              )}
              {tokenSymbol && (
                <div
                  style={{
                    fontSize: 20,
                    color: "#7C3AED",
                    padding: "8px 16px",
                    border: "1px solid #7C3AED",
                    borderRadius: 8,
                  }}
                >
                  ${tokenSymbol}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
