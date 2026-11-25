import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B0F0E",
      }}
    >
      <svg width="140" height="140" viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient
            id="g"
            x1="8"
            y1="8"
            x2="56"
            y2="56"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#A6E23A" />
            <stop offset="0.5" stopColor="#4CD964" />
            <stop offset="1" stopColor="#1BC5A0" />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="url(#g)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="122 16.2"
          transform="rotate(156 32 32)"
        />
        <path
          d="M16 34 L22 34 L26 26 L31 43 L36 21 L40 37 L43 34 L48 34"
          stroke="url(#g)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
