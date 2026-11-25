import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Vibra – Feel every beat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chips = ["Next.js", "TypeScript", "Tailwind CSS", "Jamendo API"];

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/assets/logo.png"));
  // PNG header: width at byte 16, height at byte 20
  const ratio = logo.readUInt32BE(16) / logo.readUInt32BE(20);
  const logoHeight = 130;
  const logoWidth = Math.round(logoHeight * ratio);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "white",
        background: "#0B0F0E",
        backgroundImage:
          "radial-gradient(circle at 88% 8%, rgba(76,217,100,0.30), rgba(11,15,14,0) 55%), radial-gradient(circle at 5% 100%, rgba(27,197,160,0.22), rgba(11,15,14,0) 50%)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          Feel every beat.
        </div>
        <div style={{ marginTop: 22, fontSize: 32, color: "#A3B1AC" }}>
          Free music from independent artists, streamed in your browser.
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {chips.map((chip) => (
          <div
            key={chip}
            style={{
              marginRight: 14,
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 24,
              color: "#4CD964",
              background: "#131A18",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
