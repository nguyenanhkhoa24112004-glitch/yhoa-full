"use client";

import React from "react";

export default function YinYangLoader({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative ${className} animate-spin`} aria-label="Đang xử lý">
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-black" />
      <div className="absolute inset-0 rounded-full border border-white/30" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[20%] w-[30%] h-[30%] bg-white rounded-full shadow" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[20%] w-[30%] h-[30%] bg-black rounded-full" />
    </div>
  );
}