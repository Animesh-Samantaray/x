import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * Reusable LottieAnimation component that accepts local JSON objects or remote Lottie URLs.
 */
const LottieAnimation = ({
  src,
  width = 28,
  height = 28,
  loop = true,
  autoplay = true,
  className = "",
  style = {},
}) => {
  if (!src) return null;

  // Check if src is a URL string
  const isUrl = typeof src === "string" && (src.startsWith("http") || src.startsWith("/"));

  return (
    <div
      className={`inline-flex items-center justify-center relative shrink-0 ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
    >
      {isUrl ? (
        <DotLottieReact
          src={src}
          loop={loop}
          autoplay={autoplay}
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        /* Handle local JSON animation object via DotLottieReact data or SVG fallback */
        <DotLottieReact
          data={src}
          loop={loop}
          autoplay={autoplay}
          className="w-full h-full object-contain pointer-events-none"
        />
      )}
    </div>
  );
};

export default LottieAnimation;
