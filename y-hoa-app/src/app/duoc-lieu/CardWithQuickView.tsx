'use client';

import { useState } from 'react';
import Link from 'next/link';
import FallbackImage from '@/components/ui/FallbackImage';
import QuickViewModal from '@/components/ui/QuickViewModal';
import { NHOM, VI as VI_TAXO, TINH as TINH_TAXO, QUY_KINH } from '@/data/duoc-lieu-taxonomy';

type DuocLieuDoc = {
  _id: string;
  ten?: string;
  tenKhoaHoc?: string;
  congDung?: string[];
  chiDinh?: string[];
  chongChiDinh?: string[];
  cachDung?: string;
  chuY?: string[];
  mota?: string;
  nhom?: string[];
  anhMinhHoa?: string;
  vi?: string[];
  tinh?: string[];
  quyKinh?: string[];
};

export function CardWithQuickView({ item }: { item: DuocLieuDoc }) {
  const [showModal, setShowModal] = useState(false);
  
  const handleShowModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Opening modal for:', item.ten);
    setShowModal(true);
  };
  
  const title = item.ten || "Không rõ tên";
  const subtitle = item.tenKhoaHoc || "";
  const usages = Array.isArray(item.congDung) ? item.congDung.slice(0, 3).join(", ") : item.congDung || "";
  const image = item.anhMinhHoa || "https://images.unsplash.com/photo-1479064845801-2f3f7f1f0a22?w=1200&q=80&auto=format&fit=crop";
  const isSample = typeof item._id === "string" && item._id.startsWith("sample-");
  const isLikelyObjectId = typeof item._id === 'string' && /^[a-f0-9]{24}$/i.test(item._id);
  const detailHref = isLikelyObjectId ? `/duoc-lieu/${item._id}` : `/duoc-lieu?q=${encodeURIComponent(title)}`;

  const MAP_NHOM = new Map(NHOM.map((x) => [x.key, x.label]));
  const MAP_VI = new Map(VI_TAXO.map((x) => [x.key, x.label]));
  const MAP_TINH = new Map(TINH_TAXO.map((x) => [x.key, x.label]));
  const MAP_QK = new Map(QUY_KINH.map((x) => [x.key, x.label]));

  const modalData = {
    title,
    subtitle,
    image,
    usages,
    mota: item.mota,
    congDung: item.congDung,
    chiDinh: item.chiDinh,
    chongChiDinh: item.chongChiDinh,
    cachDung: item.cachDung,
    chuY: item.chuY,
    vi: Array.from(new Set((item.vi || []).filter(Boolean))).map(v => MAP_VI.get(v) || v),
    tinh: Array.from(new Set((item.tinh || []).filter(Boolean))).map(t => MAP_TINH.get(t) || t),
    quyKinh: Array.from(new Set((item.quyKinh || []).filter(Boolean))).map(q => MAP_QK.get(q) || q),
    nhom: Array.from(new Set((item.nhom || []).filter(Boolean))).map(n => MAP_NHOM.get(n) || n),
    detailHref,
  };

  return (
    <>
      <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent backdrop-blur-xl text-white shadow-xl overflow-hidden hover:scale-[1.02] hover:border-violet-400/40 hover:shadow-2xl hover:shadow-violet-500/20 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:via-white/[0.08] group-hover:to-transparent transition-all duration-500 cursor-pointer">
        {/* Animated gradient background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 via-cyan-500/0 to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:from-violet-500/10 group-hover:via-cyan-500/10 group-hover:to-purple-500/10 group-hover:opacity-100 pointer-events-none" />
        
        {/* Neon glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(127, 0, 255, 0.15) 0%, transparent 70%)'
        }}></div>
        
        {/* Image Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/10">
          <FallbackImage
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
          
          {/* Quick View Button - Always visible */}
          <button
            onClick={handleShowModal}
            className="absolute top-3 right-3 z-20 p-2.5 rounded-lg bg-black/70 backdrop-blur-md hover:bg-black/90 transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Xem nhanh"
            title="Xem nhanh"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        
        <div className="relative z-10 p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">
            {title} {subtitle ? <span className="text-white/60 text-lg">({subtitle})</span> : null}
          </h3>
          {usages ? (
            <p className="text-sm text-white/70 line-clamp-2 leading-relaxed mb-4">{usages}</p>
          ) : null}
          <div className="flex flex-wrap gap-2 mb-4">
            {(Array.from(new Set((item.vi || []).filter(Boolean))).slice(0, 2)).map((v, i) => (
              <span key={`vi-${v ?? 'unknown'}-${i}`} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Vị {MAP_VI.get(v) || v}</span>
            ))}
            {(Array.from(new Set((item.tinh || []).filter(Boolean))).slice(0, 1)).map((t, i) => (
              <span key={`tinh-${t ?? 'unknown'}-${i}`} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">Tính {MAP_TINH.get(t) || t}</span>
            ))}
            {(Array.from(new Set((item.quyKinh || []).filter(Boolean))).slice(0, 2)).map((q, i) => (
              <span key={`qk-${q ?? 'unknown'}-${i}`} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/20">Quy {MAP_QK.get(q) || q}</span>
            ))}
            {(Array.from(new Set((item.nhom || []).filter(Boolean))).slice(0, 2)).map((n, i) => (
              <span key={`nhom-${n ?? 'unknown'}-${i}`} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-300 border border-orange-500/20">Nhóm {MAP_NHOM.get(n) || n}</span>
            ))}
          </div>
          <div className="flex justify-end">
            <Link href={detailHref} className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105">Xem chi tiết</Link>
          </div>
          
          {/* Scan line effect on hover */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline transition-opacity"></div>
          </div>
        </div>
      </div>

      <QuickViewModal
        isOpen={showModal}
        onClose={() => {
          console.log('Closing modal');
          setShowModal(false);
        }}
        data={modalData}
      />
    </>
  );
}

