"use client";

import { useState } from "react";

interface TooltipInfoProps {
  content: string;
}

export default function TooltipInfo({ content }: TooltipInfoProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "1px solid #555",
          background: "transparent",
          color: "#888",
          fontSize: "10px",
          cursor: "help",
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
        }}
        aria-label="More information"
      >
        ?
      </button>
      {visible && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2A2A2A",
            border: "1px solid #3A3A3A",
            color: "#D0D0D0",
            fontSize: "12px",
            lineHeight: "1.5",
            padding: "8px 12px",
            borderRadius: "6px",
            width: "240px",
            zIndex: 100,
            whiteSpace: "normal",
            pointerEvents: "none",
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
