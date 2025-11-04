"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  crossOrigin?: "anonymous" | "use-credentials";
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchpriority?: "high" | "low" | "auto";
  fallbackSrc?: string;
  containerClassName?: string;
};

export default function FallbackImage({
  src,
  alt,
  className,
  width,
  height,
  sizes,
  style,
  fill,
  loading = "lazy",
  decoding = "async",
  fetchpriority = "auto",
  referrerPolicy,
  crossOrigin,
  fallbackSrc = "/file.svg",
  containerClassName,
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  const mergedClass = `${fill ? "absolute inset-0 w-full h-full" : ""} ${className ?? ""} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`.trim();

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""} ${containerClassName ?? ""}`.trim()}>
      {/* shimmer while loading */}
      {!loaded ? (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
      ) : null}
      <img
        src={currentSrc}
        alt={alt}
        className={mergedClass}
        width={width}
        height={height}
        sizes={sizes}
        style={style}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchpriority as any}
        {...(referrerPolicy ? { referrerPolicy } : {})}
        {...(crossOrigin ? { crossOrigin } : {})}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            setLoaded(true);
          }
        }}
      />
    </div>
  );
}