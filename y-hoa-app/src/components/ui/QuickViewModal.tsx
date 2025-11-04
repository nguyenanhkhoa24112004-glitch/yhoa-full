'use client';

import { useEffect } from 'react';
import FallbackImage from '@/components/ui/FallbackImage';
import Link from 'next/link';
import { createPortal } from 'react-dom';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    subtitle?: string;
    image?: string;
    usages?: string;
    vi?: string[];
    tinh?: string[];
    quyKinh?: string[];
    nhom?: string[];
    mota?: string;
    congDung?: string[];
    chiDinh?: string[];
    chongChiDinh?: string[];
    cachDung?: string;
    chuY?: string[];
    detailHref?: string;
  } | null;
}

export default function QuickViewModal({ isOpen, onClose, data }: QuickViewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  console.log('QuickViewModal render:', { isOpen, hasData: !!data, data });

  if (!isOpen || !data) {
    console.log('Modal not showing:', { isOpen, hasData: !!data });
    return null;
  }

  const modal = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative bg-gradient-to-br from-[#0A0F1F] to-[#1a1a2e] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden pointer-events-auto border border-white/10">
          {/* Header */}
          <div className="relative border-b border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {data.title}
                </h2>
                {data.subtitle && (
                  <p className="text-white/60 text-lg">
                    ({data.subtitle})
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                aria-label="Đóng"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="overflow-y-auto max-h-[calc(90vh-240px)] px-6 space-y-6 pb-6">
            {/* Image - Large */}
            {data.image && (
              <div className="rounded-xl overflow-hidden">
                <div className="relative aspect-[16/9] w-full">
                  <FallbackImage
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Tags Section */}
            {(data.vi || data.tinh || data.quyKinh || data.nhom).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full" />
                  Thông tin YHCT
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(data.tinh || []).slice(0, 2).map((t, i) => (
                    <span key={`tinh-${i}`} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Tính {t}
                    </span>
                  ))}
                  {(data.quyKinh || []).slice(0, 3).map((q, i) => (
                    <span key={`qk-${i}`} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/20">
                      Quy {q}
                    </span>
                  ))}
                  {(data.vi || []).slice(0, 3).map((v, i) => (
                    <span key={`vi-${i}`} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Vị {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Công dụng chi tiết */}
            {data.congDung && data.congDung.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                  Công dụng chủ yếu
                </h3>
                <ul className="space-y-2">
                  {data.congDung.map((c, i) => (
                    <li key={`congdung-${i}`} className="text-white/70 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-purple-400">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Chỉ định */}
            {data.chiDinh && data.chiDinh.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-teal-400 rounded-full" />
                  Chỉ định
                </h3>
                <ul className="space-y-2">
                  {data.chiDinh.slice(0, 5).map((c, i) => (
                    <li key={`chidinh-${i}`} className="text-white/70 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-green-400">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Chống chỉ định */}
            {data.chongChiDinh && data.chongChiDinh.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-red-400 to-orange-400 rounded-full" />
                  Chống chỉ định
                </h3>
                <ul className="space-y-2">
                  {data.chongChiDinh.slice(0, 5).map((c, i) => (
                    <li key={`chongchidinh-${i}`} className="text-white/60 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-orange-400">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cách dùng */}
            {data.cachDung && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-amber-400 rounded-full" />
                  Cách dùng
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {data.cachDung}
                </p>
              </div>
            )}

            {/* Chú ý */}
            {data.chuY && data.chuY.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-yellow-400 rounded-full" />
                  Chú ý
                </h3>
                <ul className="space-y-2">
                  {data.chuY.slice(0, 4).map((c, i) => (
                    <li key={`chuy-${i}`} className="text-white/60 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-amber-400">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6">
            <div className="flex justify-end gap-3">
              {data.detailHref ? (
                <Link href={data.detailHref} className="px-8 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg">
                  Xem chi tiết
                </Link>
              ) : (
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg"
                >
                  Xem chi tiết
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Portal to body
  if (typeof window !== 'undefined') {
    return createPortal(modal, document.body);
  }

  return null;
}

