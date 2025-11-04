"use client";

import { useCallback } from "react";

export default function SocialShare({ className = "" }: { className?: string }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const openShare = useCallback((url: string) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {}
  }, []);

  const onFacebook = useCallback(() => {
    const u = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    openShare(u);
  }, [shareUrl, openShare]);

  const onZalo = useCallback(() => {
    const u = `https://social.zalo.me/share?url=${encodeURIComponent(shareUrl)}`;
    openShare(u);
  }, [shareUrl, openShare]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button type="button" onClick={onFacebook} className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs hover:bg-white/15 transition">
        Facebook
      </button>
      <button type="button" onClick={onZalo} className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs hover:bg-white/15 transition">
        Zalo
      </button>
    </div>
  );
}