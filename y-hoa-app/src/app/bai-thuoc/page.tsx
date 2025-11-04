import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";
import Link from "next/link";
import ClearSearchButton from "@/components/ui/ClearSearchButton";

export const revalidate = 30;

function esc(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Proxy ảnh để tránh chặn hotlink (giữ lại nếu cần dùng nơi khác)
function shouldProxy(url: string) {
  try {
    const u = new URL(url);
    return /upload\.wikimedia\.org$/.test(u.hostname)
      || /tracuuduoclieu\.vn$/.test(u.hostname)
      || /bvyhctbaoloc\.vn$/.test(u.hostname)
      || /images\.unsplash\.com$/.test(u.hostname);
  } catch { return false; }
}

function proxySrc(url?: string) {
  if (!url) return undefined;
  try {
    const cleaned = url.replace(/&amp;/g, "&").trim();
    const normalized = cleaned.startsWith("//") ? `https:${cleaned}` : cleaned;

    try {
      const u0 = new URL(normalized);
      if (u0.hash) {
        const raw = u0.hash.startsWith("#") ? u0.hash.slice(1) : u0.hash;
        const decoded = decodeURIComponent(raw);
        const m = decoded.match(/^\/media\/([^:\/]+):(.+)$/i);
        if (m && m[2]) {
          const baseHost = u0.host;
          const fileName = m[2];
          const special = `https://${baseHost}/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
          return `/api/image-proxy?url=${encodeURIComponent(special)}`;
        }
      }
    } catch {}

    try {
      const base = new URL(normalized);
      const baseHost = base.host;
      const wikiMatch = normalized.match(/^https?:\/\/(?:[a-z]+\.)?wikipedia\.org\/wiki\/([^:\/]+):(.+)$/i);
      const commonsMatch = normalized.match(/^https?:\/\/commons\.wikimedia\.org\/wiki\/([^:\/]+):(.+)$/i);
      const m = wikiMatch || commonsMatch;
      if (m && m[2]) {
        const fileName = decodeURIComponent(m[2]);
        const special = `https://${baseHost}/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
        return `/api/image-proxy?url=${encodeURIComponent(special)}`;
      }
      const viEncoded = normalized.match(/^https?:\/\/(?:[a-z]+\.)?wikipedia\.org\/wiki\/T%[0-9A-Fa-f]{2}p%[0-9A-Fa-f]{2}_tin:(.+)$/);
      if (viEncoded && viEncoded[1]) {
        const fileName = decodeURIComponent(viEncoded[1]);
        const special = `https://${baseHost}/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
        return `/api/image-proxy?url=${encodeURIComponent(special)}`;
      }
    } catch {}

    const u = new URL(normalized);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return shouldProxy(normalized) ? `/api/image-proxy?url=${encodeURIComponent(normalized)}` : normalized;
    }
    return normalized;
  } catch {
    return url;
  }
}

export default async function BaiThuocPage({ searchParams }: { searchParams?: { q?: string; page?: string } }) {
  const { q, page } = (searchParams || {}) as { q?: string; page?: string };
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const limit = 24;
  const skip = (currentPage - 1) * limit;

  await dbConnect();
  const query: any = {};
  if (q && q.trim()) {
    const term = esc(q.trim());
    query.$or = [
      { ten: { $regex: term, $options: "i" } },
      { congDung: { $regex: term, $options: "i" } },
      { "thanhPhan.tenDuocLieu": { $regex: term, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    BaiThuoc.find(query).sort({ ten: 1 }).skip(skip).limit(limit).lean(),
    BaiThuoc.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="px-6 py-8">
      {/* Futuristic Header */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full"></div>
            <div>
              <h1 className="inline-block pr-3 text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Bài Thuốc
              </h1>
            </div>
          </div>
          <p className="text-white/60 text-lg ml-4">Hệ thống bài thuốc Y học cổ truyền đầy đủ và chi tiết</p>
        </div>
      </div>

      <form className="relative" method="GET">
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
                placeholder="Tìm kiếm bài thuốc, công dụng, thành phần..."
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

      {/* Khoảng cách giữa tìm kiếm và kết quả */}
      <div className="mt-8"></div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-10 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white/70">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <p className="text-white/80">Không có kết quả phù hợp.</p>
          <p className="text-white/60 text-sm mt-1">Thử tìm bằng từ khóa khác.</p>
          {q && q.trim() && (
            <Link href="/bai-thuoc?page=1" className="mt-4 inline-block btn-cta-secondary">Xóa lọc</Link>
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((bt: any, idx: number) => {
            const id = String(bt._id || "");
            const congDung = typeof bt.congDung === "string" ? bt.congDung : "";
            const tp = (bt.thanhPhan || []).map((x: any) => x?.tenDuocLieu).filter(Boolean).slice(0, 3);
            
            return (
              <Link 
                key={id} 
                href={`/bai-thuoc/${id}`}
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
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-violet-200 transition-colors">
                      {bt.ten}
                    </h3>
                    
                    {/* Description */}
                    {bt.moTa && (
                      <p className="text-sm text-white/60 line-clamp-3 leading-relaxed mb-4">
                        {bt.moTa}
                      </p>
                    )}
                    
                    {/* Ingredients */}
                    {tp.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {tp.map((herb: string, i: number) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                            >
                              {herb}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Uses */}
                    {congDung && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-400/20">
                        <svg className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-purple-200 line-clamp-2 leading-relaxed">
                          {congDung}
                        </p>
                      </div>
                    )}
                    
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
          href={`/bai-thuoc?page=${Math.max(1, currentPage - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={`px-3 py-2 rounded border ${currentPage > 1 ? "border-white/20 text-white/80 hover:bg-white/10" : "border-white/10 text-white/40 cursor-not-allowed"}`}
          aria-disabled={currentPage === 1}
        >
          Trước
        </Link>
        {(() => {
          const windowSize = 7;
          const start = Math.max(1, currentPage - 3);
          const end = Math.min(totalPages, start + windowSize - 1);
          const pages: number[] = [];
          for (let p = start; p <= end; p++) pages.push(p);
          return (
            <>
              {start > 1 && (
                <>
                  <Link href={`/bai-thuoc?page=1${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="px-3 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">1</Link>
                  {start > 2 && <span className="px-2">…</span>}
                </>
              )}
              {pages.map((p) => (
                <Link
                  key={p}
                  href={`/bai-thuoc?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`px-3 py-2 rounded border ${p === currentPage ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-white/20 text-white/80 hover:bg-white/10"}`}
                >
                  {p}
                </Link>
              ))}
              {end < totalPages && (
                <>
                  {end < totalPages - 1 && <span className="px-2">…</span>}
                  <Link href={`/bai-thuoc?page=${totalPages}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="px-3 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">{totalPages}</Link>
                </>
              )}
            </>
          );
        })()}
        <Link
          href={`/bai-thuoc?page=${Math.min(totalPages, currentPage + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={`px-3 py-2 rounded border ${currentPage < totalPages ? "border-white/20 text-white/80 hover:bg-white/10" : "border-white/10 text-white/40 cursor-not-allowed"}`}
          aria-disabled={currentPage === totalPages}
        >
          Sau
        </Link>
      </div>
    </div>
  );
}