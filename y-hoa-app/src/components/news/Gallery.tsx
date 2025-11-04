"use client";

import { useState } from "react";
import FallbackImage from "@/components/ui/FallbackImage";

type Props = {
  title: string;
  images?: string[];
  main?: string;
};

export default function NewsGallery({ title, images = [], main }: Props) {
  const initial = main || images[0];
  const [active, setActive] = useState<string | undefined>(initial);
  const showImages = [active, ...images.filter((u) => u !== active)].filter(Boolean) as string[];

  const ALLOW_IMG_HOSTS = new Set([
    "images.unsplash.com",
    "upload.wikimedia.org",
    "cdn.pixabay.com",
    "tracuuduoclieu.vn",
    "bvyhctbaoloc.vn",
    "i.vnecdn.net",
    "vcdn-vnexpress.vnecdn.net",
    "i1-suckhoe.vnecdn.net",
    "i1-vnexpress.vnecdn.net",
    "cdn.tuoitre.vn",
    "photo.znews.vn",
    "dantri.com.vn",
  ]);
  const proxySrc = (u?: string) => {
    if (!u) return undefined;
    try {
      const cleaned = u.replace(/&amp;/g, "&").trim();
      const url = new URL(cleaned);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return `/api/proxy-image?url=${encodeURIComponent(cleaned)}`;
      }
      return cleaned;
    } catch {
      return u;
    }
  };

  return (
    <div className="mt-6">
      {/* Main image */}
      {active ? (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          <div className="relative aspect-[16/9]">
            <FallbackImage src={proxySrc(active)!} alt={title} fill className="object-cover" loading="eager" sizes="100vw" />
          </div>
        </div>
      ) : null}

      {/* Thumbnails */}
      {showImages.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 md:grid-cols-4 gap-3">
          {showImages.slice(0, 7).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setActive(u)}
              className={`group relative h-20 md:h-24 rounded-xl overflow-hidden border ${active === u ? "border-cyan-400" : "border-white/10"}`}
            >
              <FallbackImage src={proxySrc(u)!} alt={title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" sizes="33vw" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}