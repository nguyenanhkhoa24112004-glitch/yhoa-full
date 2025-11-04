import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import { Benh } from "@/models";
import ClearSearchButton from "@/components/ui/ClearSearchButton";

export const revalidate = 30;

// Kiểu dữ liệu cơ bản cho Bệnh
type BenhDoc = {
  _id: string;
  ten?: string;
  moTa?: string;
  trieuchung?: string[];
  nguyenNhan?: string;
  phuongPhapDieuTri?: string;
  baiThuocLienQuan?: string[];
};

async function getBenh(
  page: number,
  limit: number,
  filters?: { q?: string }
): Promise<{ items: BenhDoc[]; total: number }>{
  try {
    await dbConnect();
    const query: any = {};
    if (filters?.q) {
      const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(esc(filters.q), "i");
      query.$or = [
        { ten: regex },
        { moTa: regex },
        { trieuchung: regex },
        { nguyenNhan: regex },
        { phuongPhapDieuTri: regex },
      ];
    }
    const total = await Benh.countDocuments(query);
    const items = await Benh.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("ten moTa trieuchung baiThuocLienQuan")
      .lean();
    return { items: items as unknown as BenhDoc[], total };
  } catch (e) {
    // Khi chưa kết nối DB, trả về rỗng để hiển thị thông báo demo
    return { items: [], total: 0 };
  }
}

function Card({ item }: { item: BenhDoc }) {
  const title = item.ten || "Không rõ tên";
  const subtitle = (Array.isArray(item.trieuchung) ? item.trieuchung.slice(0, 3).join(", ") : "") || item.moTa || "";
  const baiThuocCount = Array.isArray(item.baiThuocLienQuan) ? item.baiThuocLienQuan.length : 0;

  return (
    <Link href={`/benh/${item._id}`} className="block">
      <div className="glass hover:glow transition-all duration-300 overflow-hidden">
        <div className="p-6">
          <div className="font-bold text-xl text-white mb-3">{title}</div>
          {subtitle ? <div className="text-sm text-white/70 line-clamp-3 leading-relaxed mb-4">{subtitle}</div> : null}
          {Array.isArray(item.trieuchung) && item.trieuchung.length ? (
            <div className="text-xs text-cyan-300 font-medium bg-white/10 px-3 py-2 rounded-full mb-2">Triệu chứng: {item.trieuchung.slice(0, 3).join(", ")}</div>
          ) : null}
          <div className="text-xs text-purple-300 font-medium bg-white/10 px-3 py-2 rounded-full">Bài thuốc liên quan: {baiThuocCount}</div>
        </div>
      </div>
    </Link>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const s = await searchParams;
  const pageParam = s?.page ? parseInt(s.page as string) : 1;
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = 12;
  const q = s?.q || undefined;
  const { items, total } = await getBenh(page, limit, { q });
  const isDemo = items.length === 0 && !q; // nếu DB chưa kết nối, sẽ rỗng
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="px-6 py-8 text-white max-w-7xl mx-auto">
      {/* Futuristic Header */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full"></div>
            <div>
              <h1 className="inline-block pr-3 text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Bệnh YHCT
              </h1>
            </div>
          </div>
          <p className="text-white/60 text-lg ml-4">Hệ thống chẩn đoán và điều trị bằng Y học cổ truyền</p>
        </div>
      </div>

      <form className="relative" action="/benh" method="get">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
        <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-6 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={q || ""}
                placeholder="Tìm kiếm bệnh, triệu chứng, nguyên nhân..."
                className="w-full h-14 rounded-xl pl-12 pr-12 text-white placeholder-white/40 bg-white/5 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 hover:bg-white/8 transition-all duration-300"
              />
              {/* Nút xóa tìm kiếm */}
              <ClearSearchButton hasQuery={!!q} />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
            </div>
            <input type="hidden" name="page" value="1" />
            <button 
              type="submit" 
              className="px-8 h-14 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span>Tìm kiếm</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </form>
      {isDemo && (
        <div className="mt-4 flex items-center justify-end">
          <p className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">Chế độ demo: DB chưa kết nối.</p>
        </div>
      )}

      {/* Khoảng cách giữa tìm kiếm và kết quả */}
      <div className="mt-8"></div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-10 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white/70">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <p className="text-white/80">Không có kết quả phù hợp.</p>
          <p className="text-white/60 text-sm mt-1">Thử bỏ bớt bộ lọc hoặc tìm bằng từ khóa khác.</p>
          {q && (
            <Link href="/benh?page=1" className="mt-4 inline-block btn-cta-secondary">Xóa lọc</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-7">
          {items.map((item, idx) => {
            return (
              <Link 
                key={item._id} 
                href={`/benh/${item._id}`}
                className="group relative"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s backwards`,
                }}
              >
                <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent backdrop-blur-xl p-6 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-violet-400/40 hover:shadow-2xl hover:shadow-violet-500/20 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:via-white/[0.08] group-hover:to-transparent overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 via-cyan-500/0 to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:from-violet-500/10 group-hover:via-cyan-500/10 group-hover:to-purple-500/10 group-hover:opacity-100 pointer-events-none" />
                  
                  {/* Neon glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(127, 0, 255, 0.15) 0%, transparent 70%)'
                  }}></div>
                  
                  <div className="relative z-10">
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-violet-200 transition-colors">
                      {item.ten || "Không rõ tên"}
                    </h3>
                    
                    {/* Description */}
                    {item.moTa && (
                      <p className="text-sm text-white/60 line-clamp-3 leading-relaxed mb-4">
                        {item.moTa}
                      </p>
                    )}
                    
                    {/* Symptoms */}
                    {Array.isArray(item.trieuchung) && item.trieuchung.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {item.trieuchung.slice(0, 3).map((tc, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                            >
                              {tc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Related remedies count with animated counter */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-cyan-500/10 border border-purple-400/30 backdrop-blur-sm shadow-lg">
                        <div className="relative">
                          <svg className="w-5 h-5 text-purple-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <div className="absolute inset-0 blur-sm bg-purple-400/50 opacity-0 group-hover:opacity-50 transition-opacity"></div>
                        </div>
                        <span className="text-xs text-purple-200 font-bold">
                          {Array.isArray(item.baiThuocLienQuan) ? item.baiThuocLienQuan.length : 0} bài thuốc
                        </span>
                      </div>
                      
                      {/* Animated arrow */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 via-cyan-500/30 to-purple-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 border border-violet-400/50">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Scan line effect on hover */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <Link
          href={`/benh?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={`px-3 py-2 rounded border ${page > 1 ? "border-white/20 text-white/80 hover:bg-white/10" : "border-white/10 text-white/40 cursor-not-allowed"}`}
          aria-disabled={page === 1}
        >
          Trước
        </Link>
        {(() => {
          const windowSize = 7;
          const start = Math.max(1, page - 3);
          const end = Math.min(totalPages, start + windowSize - 1);
          const pages: number[] = [];
          for (let p = start; p <= end; p++) pages.push(p);
          return (
            <>
              {start > 1 && (
                <>
                  <Link href={`/benh?page=1${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="px-3 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">1</Link>
                  {start > 2 && <span className="px-2">…</span>}
                </>
              )}
              {pages.map((p) => (
                <Link
                  key={p}
                  href={`/benh?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`px-3 py-2 rounded border ${p === page ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-white/20 text-white/80 hover:bg-white/10"}`}
                >
                  {p}
                </Link>
              ))}
              {end < totalPages && (
                <>
                  {end < totalPages - 1 && <span className="px-2">…</span>}
                  <Link href={`/benh?page=${totalPages}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="px-3 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">{totalPages}</Link>
                </>
              )}
            </>
          );
        })()}
        <Link
          href={`/benh?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={`px-3 py-2 rounded border ${page < totalPages ? "border-white/20 text-white/80 hover:bg-white/10" : "border-white/10 text-white/40 cursor-not-allowed"}`}
          aria-disabled={page === totalPages}
        >
          Sau
        </Link>
      </div>
    </div>
  );
}