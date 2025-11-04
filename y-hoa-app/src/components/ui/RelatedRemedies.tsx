"use client";
import Link from "next/link";
import { useState } from "react";

interface RelatedRemedy {
  _id: string;
  ten: string;
  moTa?: string;
  congDung?: string | string[];
  thanhPhan?: Array<{ tenDuocLieu?: string; lieuLuong?: string }>;
  nguonGoc?: string;
  doiTuongSuDung?: string;
}

interface RelatedRemediesProps {
  remedies: RelatedRemedy[];
  title?: string;
}

// Hàm tính điểm độ liên quan dựa trên các yếu tố
function calculateRelevanceScore(remedy: RelatedRemedy): number {
  let score = 0;
  
  // Có mô tả chi tiết
  if (remedy.moTa && remedy.moTa.length > 50) score += 2;
  
  // Có nhiều thành phần
  if (remedy.thanhPhan && remedy.thanhPhan.length > 2) score += 1;
  
  // Có nguồn gốc rõ ràng
  if (remedy.nguonGoc) score += 1;
  
  // Có đối tượng sử dụng cụ thể
  if (remedy.doiTuongSuDung) score += 1;
  
  return score;
}

// Hàm xác định mức độ bằng chứng khoa học
function getEvidenceLevel(remedy: RelatedRemedy): { level: string; color: string; description: string } {
  const score = calculateRelevanceScore(remedy);
  
  if (score >= 4) {
    return {
      level: "Cao",
      color: "text-green-400",
      description: "Có đầy đủ thông tin và nguồn gốc"
    };
  } else if (score >= 2) {
    return {
      level: "Trung bình", 
      color: "text-yellow-400",
      description: "Có thông tin cơ bản"
    };
  } else {
    return {
      level: "Cần bổ sung",
      color: "text-orange-400", 
      description: "Thông tin còn hạn chế"
    };
  }
}

export default function RelatedRemedies({ remedies, title = "Bài thuốc liên quan" }: RelatedRemediesProps) {
  // Hooks phải gọi ở top-level để tránh lỗi "hook called conditionally"
  const [showAll, setShowAll] = useState(false);

  // Chuẩn hoá dữ liệu để an toàn khi rỗng
  const normalized = Array.isArray(remedies) ? remedies : [];

  // Sắp xếp theo độ liên quan và điểm khoa học
  const sortedRemedies = normalized
    .map((remedy) => ({
      ...remedy,
      relevanceScore: calculateRelevanceScore(remedy),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Hiển thị mặc định 1 bài thuốc, nút "Xem thêm" để mở rộng
  const visibleRemedies = showAll ? sortedRemedies : sortedRemedies.slice(0, 1);

  if (sortedRemedies.length === 0) {
    return (
      <div className="glass glow p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-white/50">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 9c-2.34 0-4.29-1.009-5.824-2.709" />
            </svg>
          </div>
          <p className="text-white/70 text-sm">Chưa có dữ liệu bài thuốc liên quan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass glow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="text-sm text-white/60">
          {remedies.length} bài thuốc
        </div>
      </div>

      <div className="space-y-4">
        {visibleRemedies.map((remedy) => {
          const id = String(remedy._id || "");
          const congDung = typeof remedy.congDung === "string" 
            ? remedy.congDung 
            : (remedy.congDung || []).slice(0, 2).join("; ");
          
          const thanhPhan = (remedy.thanhPhan || [])
            .map((x: any) => x?.tenDuocLieu)
            .filter(Boolean)
            .slice(0, 4)
            .join(", ");
          
          const evidence = getEvidenceLevel(remedy);

          return (
            <Link 
              key={id} 
              href={`/bai-thuoc/${id}`} 
              className="group block glass hover:glow transition-all duration-300 overflow-hidden rounded-2xl border border-white/10 hover:border-white/20"
            >
              <div className="p-5">
                {/* Header với tên và mức độ bằng chứng */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors leading-tight">
                    {remedy.ten || "Bài thuốc"}
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-medium ${evidence.color}`}>
                      {evidence.level}
                    </span>
                    <span className="text-xs text-white/50">
                      {remedy.relevanceScore}/5 điểm
                    </span>
                  </div>
                </div>

                {/* Mô tả */}
                {remedy.moTa && (
                  <p className="text-sm text-white/80 line-clamp-2 leading-relaxed mb-3">
                    {remedy.moTa}
                  </p>
                )}

                {/* Thông tin chi tiết trong grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Thành phần */}
                  {thanhPhan && (
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-cyan-300 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <span className="text-cyan-300 font-medium text-xs">Thành phần</span>
                      </div>
                      <p className="text-white/85 text-xs leading-relaxed">{thanhPhan}</p>
                    </div>
                  )}

                  {/* Công dụng */}
                  {congDung && (
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-purple-300 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-purple-300 font-medium text-xs">Công dụng</span>
                      </div>
                      <p className="text-white/85 text-xs leading-relaxed">{congDung}</p>
                    </div>
                  )}
                </div>

                {/* Footer với nguồn gốc */}
                {remedy.nguonGoc && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center text-xs text-white/60">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Nguồn: Wikipedia</span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Nút xem thêm */}
      {!showAll && sortedRemedies.length > 1 ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="btn-cta-secondary px-4 py-2 rounded-full border border-white/20 text-white/90 hover:bg-white/10"
            onClick={() => setShowAll(true)}
          >
            Xem thêm
          </button>
        </div>
      ) : null}

      {/* Legend giải thích mức độ bằng chứng */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">Mức độ bằng chứng khoa học:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
            <span className="text-white/70">Cao: Thông tin đầy đủ</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            <span className="text-white/70">Trung bình: Thông tin cơ bản</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
            <span className="text-white/70">Cần bổ sung: Thông tin hạn chế</span>
          </div>
        </div>
      </div>
    </div>
  );
}







