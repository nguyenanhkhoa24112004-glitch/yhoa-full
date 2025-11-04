/* eslint-disable react/no-unescaped-entities */
import DuocLieu from "@/lib/models/DuocLieu";
import dbConnect from "@/lib/mongoose";
import Link from "next/link";
import Image from "next/image";
import FallbackImage from "@/components/ui/FallbackImage";
import { NHOM, VI as VI_TAXO, TINH as TINH_TAXO, QUY_KINH } from "@/data/duoc-lieu-taxonomy";
import sampleData from "@/data/duoc-lieu-sample.json";
import { CardWithQuickView } from "./CardWithQuickView";

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

export const revalidate = 30; // cache SSR lightly

async function getDuocLieu(
  page: number,
  limit: number,
  filters?: { q?: string; nhom?: string; vi?: string; tinh?: string; quykinh?: string }
): Promise<{ items: DuocLieuDoc[]; total: number }>{
  try {
    await dbConnect();
    const query: any = {};
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (filters?.q) {
      query.$or = [
        { ten: { $regex: filters.q, $options: "i" } },
        { tenKhoaHoc: { $regex: filters.q, $options: "i" } },
        { mota: { $regex: filters.q, $options: "i" } },
        { congDung: { $elemMatch: { $regex: filters.q, $options: "i" } } },
        { chiDinh: { $elemMatch: { $regex: filters.q, $options: "i" } } },
        { chongChiDinh: { $elemMatch: { $regex: filters.q, $options: "i" } } },
        { chuY: { $elemMatch: { $regex: filters.q, $options: "i" } } },
        { cachDung: { $regex: filters.q, $options: "i" } },
      ];
    }
    if (filters?.nhom) {
      query.nhom = { $in: [new RegExp(`^${esc(filters.nhom)}$`, "i")] };
    }
    if (filters?.vi) {
      query.vi = { $in: [new RegExp(`^${esc(filters.vi)}$`, "i")] };
    }
    if (filters?.tinh) {
      query.tinh = { $in: [new RegExp(`^${esc(filters.tinh)}$`, "i")] };
    }
    if (filters?.quykinh) {
      query.quyKinh = { $in: [new RegExp(`^${esc(filters.quykinh)}$`, "i")] };
    }

    const total = await DuocLieu.countDocuments(query);
    const items = await DuocLieu.find(query)
      .sort({ ten: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select({ ten: 1, tenKhoaHoc: 1, congDung: 1, nhom: 1, anhMinhHoa: 1, vi: 1, tinh: 1, quyKinh: 1 })
      .lean();
    return { items: items as unknown as DuocLieuDoc[], total };
  } catch (e) {
    console.warn("[duoc-lieu] Database unreachable, applying filters on sample data as fallback.");
    // Helpers for local filtering on sample data
    const norm = (s?: string) => (s || "").toLowerCase().trim();
    const includesIC = (arr: string[] | undefined, v?: string) => {
      if (!v) return true; if (!Array.isArray(arr)) return false; const nv = norm(v);
      return arr.some((x) => norm(x) === nv || norm(x).includes(nv));
    };
    const containsIC = (text?: string, q?: string) => {
      if (!q) return true; return norm(text).includes(norm(q));
    };
    const isStringArray = (arr: unknown): arr is string[] => Array.isArray(arr) && arr.every((x) => typeof x === "string");

    // Map taxonomy keys to labels to match sample data which stores labels
    const keyToLabel = (list: { key: string; label: string }[], key?: string) => {
      if (!key) return undefined; const found = list.find((x) => x.key === key); return found?.label;
    };

    const labelNhom = keyToLabel(NHOM, filters?.nhom);
    const labelVi = keyToLabel(VI_TAXO, filters?.vi);
    const labelTinh = keyToLabel(TINH_TAXO, filters?.tinh);
    const labelQK = keyToLabel(QUY_KINH, filters?.quykinh);

    const all = (sampleData as any[]).map((item, index) => ({ ...item, _id: `sample-${index}` })) as DuocLieuDoc[];
    const filtered = all.filter((it) => {
      const matchQ =
        containsIC(it.ten, filters?.q) ||
        containsIC(it.tenKhoaHoc, filters?.q) ||
        containsIC(it.mota, filters?.q) ||
        containsIC(it.cachDung, filters?.q) ||
        (isStringArray(it.congDung) && it.congDung.some((c) => containsIC(c, filters?.q))) ||
        (isStringArray(it.chiDinh) && it.chiDinh.some((c) => containsIC(c, filters?.q))) ||
        (isStringArray(it.chongChiDinh) && it.chongChiDinh.some((c) => containsIC(c, filters?.q))) ||
        (isStringArray(it.chuY) && it.chuY.some((c) => containsIC(c, filters?.q)));

      const matchNhom = includesIC(it.nhom, labelNhom);
      const matchVi = includesIC(it.vi, labelVi);
      const matchTinh = includesIC(it.tinh, labelTinh);
      const matchQK = includesIC(it.quyKinh, labelQK);

      // Apply only active filters; if q/filters are undefined, they pass
      const qOk = filters?.q ? matchQ : true;
      const nhomOk = filters?.nhom ? matchNhom : true;
      const viOk = filters?.vi ? matchVi : true;
      const tinhOk = filters?.tinh ? matchTinh : true;
      const qkOk = filters?.quykinh ? matchQK : true;
      return qOk && nhomOk && viOk && tinhOk && qkOk;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    return { items, total };
  }
}


export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; nhom?: string; vi?: string; tinh?: string; quykinh?: string }> }) {
  const s = await searchParams;
  const pageParam = s?.page ? parseInt(s.page as string) : 1;
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = 12;
  const q = s?.q || undefined;
  const nhom = s?.nhom || undefined;
  const vi = s?.vi || undefined;
  const tinh = s?.tinh || undefined;
  const quykinh = s?.quykinh || undefined;
  const { items, total } = await getDuocLieu(page, limit, { q, nhom, vi, tinh, quykinh });
  const isDemo = items.some((i) => typeof i._id === "string" && i._id.startsWith("sample-"));
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="px-6 py-8 text-white max-w-7xl mx-auto">
      {/* Cải tiến Header */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="inline-block pr-3 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Tra cứu dược liệu
              </h1>
              <p className="mt-2 text-white/70 text-lg">Tổng {total} vị · Lọc theo tiêu chí YHCT</p>
              {isDemo && (
                <p className="mt-3 inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">Chế độ demo: DB chưa kết nối, hiển thị dữ liệu mẫu.</p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2 text-white/70">
              <span className="px-3 py-1 rounded-full bg-white/8 border border-white/15 text-xs">Chính xác, tinh tế</span>
              <span className="px-3 py-1 rounded-full bg-white/8 border border-white/15 text-xs">Nhanh chóng</span>
            </div>
          </div>
          <form className="mt-6 flex flex-col gap-4" action="/duoc-lieu" method="get">
            {/* Hàng 1: ô tìm kiếm + nút lọc/xóa */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
                </svg>
                <input
                  type="text"
                  name="q"
                  defaultValue={q || ""}
                  placeholder="Tìm theo tên Việt/Latin, ví dụ: Gừng, Zingiber…"
                  className="w-full h-12 rounded-lg pl-10 pr-4 text-white placeholder-white/70 bg-white/5 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-violet-400/50 hover:bg-white/8 active:bg-white/12 transition-colors"
                />
              </div>
              <input type="hidden" name="page" value="1" />
              <button type="submit" className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105">Lọc</button>
              {(q || nhom || vi || tinh || quykinh) && (
                <Link href="/duoc-lieu?page=1" className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300">Xóa lọc</Link>
              )}
            </div>

            {/* Hàng 2: bộ lọc nâng cấp */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5 w-full">
              <select name="nhom" defaultValue={nhom || ""} className="h-12 w-full rounded-lg px-4 pr-12 cursor-pointer text-white bg-white/5 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.25)] appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400/50 hover:bg-white/8 active:bg-white/12 transition-colors bg-no-repeat bg-[length:20px_20px] bg-[right_0.9rem_center] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%20fill=%22none%22%3E%3Cpath%20d=%22M6%208l4-4%204%204%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3Cpath%20d=%22M6%2012l4%204%204-4%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')]">
                <option value="">Nhóm</option>
                {NHOM.map((n) => (
                  <option key={n.key} value={n.key}>{n.label}</option>
                ))}
              </select>
              <select name="vi" defaultValue={vi || ""} className="h-12 w-full rounded-lg px-4 pr-12 cursor-pointer text-white bg-white/5 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.25)] appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400/50 hover:bg-white/8 active:bg-white/12 transition-colors bg-no-repeat bg-[length:20px_20px] bg-[right_0.9rem_center] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%20fill=%22none%22%3E%3Cpath%20d=%22M6%208l4-4%204%204%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3Cpath%20d=%22M6%2012l4%204%204-4%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')]">
                <option value="">Vị</option>
                {VI_TAXO.map((v) => (
                  <option key={v.key} value={v.key}>{v.label}</option>
                ))}
              </select>
              <select name="tinh" defaultValue={tinh || ""} className="h-12 w-full rounded-lg px-4 pr-12 cursor-pointer text-white bg-white/5 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.25)] appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400/50 hover:bg-white/8 active:bg-white/12 transition-colors bg-no-repeat bg-[length:20px_20px] bg-[right_0.9rem_center] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%20fill=%22none%22%3E%3Cpath%20d=%22M6%208l4-4%204%204%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3Cpath%20d=%22M6%2012l4%204%204-4%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')]">
                <option value="">Tính</option>
                {TINH_TAXO.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
              <select name="quykinh" defaultValue={quykinh || ""} className="h-12 w-full rounded-lg px-4 pr-12 cursor-pointer text-white bg-white/5 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.25)] appearance-none focus:outline-none focus:ring-2 focus:ring-violet-400/50 hover:bg-white/8 active:bg-white/12 transition-colors bg-no-repeat bg-[length:20px_20px] bg-[right_0.9rem_center] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%20fill=%22none%22%3E%3Cpath%20d=%22M6%208l4-4%204%204%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3Cpath%20d=%22M6%2012l4%204%204-4%22%20stroke=%22rgba(255,255,255,0.75)%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')]">
                <option value="">Quy kinh</option>
                {QUY_KINH.map((q) => (
                  <option key={q.key} value={q.key}>{q.label}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-white/60">Gợi ý: nhập "Gừng", "Bạc hà", "Cam thảo"… hoặc tên Latin.</p>
          </form>
        </div>
      </div>
      {items.length === 0 ? (
        <>
          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-10 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white/70">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <p className="text-white/80">Không có kết quả phù hợp.</p>
            <p className="text-white/60 text-sm mt-1">Thử bỏ bớt bộ lọc hoặc tìm bằng từ khóa khác.</p>
            {(q || nhom || vi || tinh || quykinh) && (
              <Link href="/duoc-lieu?page=1" className="mt-4 inline-block px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300">Xóa lọc</Link>
            )}
          </div>
          <div className="mt-8">
            <h2 className="mb-3 text-white/80 text-sm">Gợi ý dược liệu phổ biến</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-7">
              {sampleData.map((item, idx) => (
                <div key={`suggest-${idx}`} style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s backwards` }}>
                  <CardWithQuickView item={{ ...(item as any), _id: `suggest-${idx}` }} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-7">
          {items.map((item, idx) => {
            // Convert MongoDB document to plain object to avoid serialization issues
            const plainItem = JSON.parse(JSON.stringify(item));
            return (
              <div key={plainItem._id} style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s backwards` }}>
                <CardWithQuickView item={plainItem} />
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-8 flex items-center justify-center gap-2">
        <Link
          href={`/duoc-lieu?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
                  <Link href={`/duoc-lieu?page=1${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="px-3 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">1</Link>
                  {start > 2 && <span className="px-2">…</span>}
                </>
              )}
              {pages.map((p) => (
                <Link
                  key={p}
                  href={`/duoc-lieu?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`px-3 py-2 rounded border ${p === page ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-white/20 text-white/80 hover:bg-white/10"}`}
                >
                  {p}
                </Link>
              ))}
              {end < totalPages && (
                <>
                  {end < totalPages - 1 && <span className="px-2">…</span>}
                  <Link href={`/duoc-lieu?page=${totalPages}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="px-3 py-2 rounded border border-white/20 text-white/80 hover:bg-white/10">{totalPages}</Link>
                </>
              )}
            </>
          );
        })()}
        <Link
          href={`/duoc-lieu?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}${nhom ? `&nhom=${encodeURIComponent(nhom)}` : ""}${vi ? `&vi=${encodeURIComponent(vi)}` : ""}${tinh ? `&tinh=${encodeURIComponent(tinh)}` : ""}${quykinh ? `&quykinh=${encodeURIComponent(quykinh)}` : ""}`}
          className={`px-3 py-2 rounded border ${page < totalPages ? "border-white/20 text-white/80 hover:bg-white/10" : "border-white/10 text-white/40 cursor-not-allowed"}`}
          aria-disabled={page === totalPages}
        >
          Sau
        </Link>
      </div>
    </div>
  );
}