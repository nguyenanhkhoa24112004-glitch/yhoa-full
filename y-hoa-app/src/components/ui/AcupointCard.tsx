"use client";

import React from "react";
import FallbackImage from "@/components/ui/FallbackImage";

export type AcupointData = {
  name: string;
  desc: string;
  principle?: string;
  imageUrl?: string;
};

export default function AcupointCard({ data }: { data: AcupointData }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-3">
        {data.imageUrl ? (
          <FallbackImage src={data.imageUrl} alt={data.name} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center text-xs text-white/70">Huyệt</div>
        )}
        <div className="flex-1">
          <div className="font-semibold">{data.name}</div>
          {data.principle ? (
            <div className="text-xs text-white/70">Nguyên lý: {data.principle}</div>
          ) : null}
        </div>
      </div>
      <div className="mt-2 text-xs text-white/80">{data.desc}</div>
    </div>
  );
}