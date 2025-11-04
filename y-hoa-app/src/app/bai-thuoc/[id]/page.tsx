import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";
import Link from "next/link";
import mongoose from "mongoose";

export const revalidate = 30;

// Proxy ảnh để tránh chặn hotlink
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

    // Handle anchor-based media links like `#/media/File:...` or `#/media/T%E1%BA%ADp_tin:...`
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

    // Rewrite Wikipedia/Commons File pages (including localized namespaces like "Tập_tin") to Special:FilePath
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

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  let item: any = null;
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("invalid id");
    item = await BaiThuoc.findById(id).populate("thanhPhan.duocLieu").lean();
  } catch (e) {
    item = null;
  }

  if (!item) {
    return (
      <div className="px-6 py-8">
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-700">Không tìm thấy bài thuốc.</p>
        </div>
      </div>
    );
  }

  const congDung = Array.isArray(item.congDung) ? item.congDung : (item.congDung ? [item.congDung] : []);
  const chuY = Array.isArray(item.chuY) ? item.chuY : (item.chuY ? [item.chuY] : []);
  const thanhPhan = Array.isArray(item.thanhPhan) ? item.thanhPhan : [];

  return (
    <div className="px-6 py-8">
      {/* Ẩn ảnh minh họa theo yêu cầu */}

      <div className="mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{item.ten}</h1>
          {item.nguonGoc ? (
            <p className="text-base md:text-lg text-white/70">
              Nguồn: <a href={item.nguonGoc} className="underline" target="_blank" rel="noopener noreferrer">Wikipedia</a>
            </p>
          ) : null}
        </div>
      </div>

      {item.moTa ? (
        <section className="glass glow-cyan p-6 mb-6">
          <h2 className="font-bold text-xl text-white mb-4">Mô tả</h2>
          <p className="text-white/80 leading-relaxed">{item.moTa}</p>
        </section>
      ) : null}

      <section className="glass glow p-6 mb-6">
        <h2 className="font-bold text-xl text-white mb-4">Thành phần</h2>
        {thanhPhan.length ? (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-3 pr-4 font-semibold text-cyan-300 border-b border-white/20">Dược liệu</th>
                  <th className="py-3 pr-4 font-semibold text-cyan-300 border-b border-white/20">Liều lượng</th>
                </tr>
              </thead>
              <tbody>
                {thanhPhan.map((tp: any, i: number) => {
                  const herb = tp?.duocLieu;
                  const name = tp?.tenDuocLieu || herb?.ten || "—";
                  const id = herb?._id ? String(herb._id) : null;
                  return (
                    <tr key={`tp-${i}`} className="border-t border-white/10 hover:bg-white/5">
                      <td className="py-3 pr-4">
                        {id ? (
                          <Link href={`/duoc-lieu/${id}`} className="text-cyan-300 hover:text-cyan-200 font-medium neon-cyan-hover">{name}</Link>
                        ) : (
                          <span className="text-white/90 font-medium">{name}</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-white/70">{tp?.lieuLuong || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/70">Chưa có dữ liệu thành phần.</p>
        )}
      </section>

      {congDung.length ? (
        <section className="glass glow p-6 mb-6">
          <h2 className="font-bold text-xl text-white mb-4">Công dụng</h2>
          <ul className="list-disc pl-6 space-y-2">
            {congDung.map((c: string, i: number) => <li key={`congdung-${i}`} className="text-white/80 leading-relaxed">{c}</li>)}
          </ul>
        </section>
      ) : null}

      {item.doiTuongSuDung ? (
        <section className="glass glow-cyan p-6 mb-6">
          <h2 className="font-bold text-xl text-white mb-4">Đối tượng sử dụng</h2>
          <p className="text-white/80 leading-relaxed">{item.doiTuongSuDung}</p>
        </section>
      ) : null}

      {item.cachBaoCheSuDung ? (
        <section className="glass glow p-6 mb-6">
          <h2 className="font-bold text-xl text-white mb-4">Cách bào chế/ sử dụng</h2>
          <p className="text-white/80 leading-relaxed whitespace-pre-line">{item.cachBaoCheSuDung}</p>
        </section>
      ) : null}

      {chuY.length ? (
        <section className="glass glow-cyan p-6">
          <h2 className="font-bold text-xl text-white mb-4">Chú ý</h2>
          <ul className="list-disc pl-6 space-y-2">
            {chuY.map((c: string, i: number) => <li key={`chuy-${i}`} className="text-white/80 leading-relaxed">{c}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}