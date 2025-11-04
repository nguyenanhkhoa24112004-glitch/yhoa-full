import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fetchWikiSummary(title: string, lang: "vi" | "en"): Promise<any | null> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}` as any, {
      headers: { accept: "application/json" },
      cache: "no-store",
    } as any);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function searchWiki(query: string, lang: "vi" | "en", limit = 50): Promise<any[]> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.pages || [];
  } catch {
    return [];
  }
}

function imageFromSummary(sum: any): string | null {
  const thumb = sum?.thumbnail?.source || sum?.thumbnail?.url || sum?.thumbnail;
  const orig = sum?.originalimage?.source || sum?.originalimage?.url || sum?.originalimage;
  const pick = (u: any) => (typeof u === "string" && u.includes("upload.wikimedia.org")) ? u : null;
  return pick(thumb) || pick(orig) || null;
}

function toPageUrl(title: string, lang: "vi" | "en") {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, "_"))}`;
}

export async function GET(req: Request) {
  return POST(req);
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Từ khoá tìm kiếm để lấy nhiều công thức cổ điển
    const queriesVi = [
      "bài thuốc đông y", "bài thuốc y học cổ truyền", "lục vị địa hoàng hoàn", "tứ quân tử thang", "tiểu sài hồ thang",
      "quế chi thang", "ma hoàng thang", "bát trân thang", "bổ trung ích khí thang", "ngũ linh tán",
      "tiểu thanh long thang", "đại thanh long thang", "bạch hổ thang", "hoàng liên giải độc thang", "độc hoạt tang ký sinh",
      "tứ vật thang", "đào hồng tứ vật thang", "cam lộ tiêu độc đan", "lục vị hoàn",
    ];
    const queriesEn = [
      "Traditional Chinese medicine formula", "herbal decoction TCM", "wan TCM formula", "san powder TCM",
      "Gui Zhi Tang", "Ma Huang Tang", "Xiao Chai Hu Tang", "Si Jun Zi Tang", "Ba Zhen Tang",
      "Liu Wei Di Huang Wan", "Bu Zhong Yi Qi Tang", "Bai Hu Tang", "Huang Lian Jie Du Tang", "Du Huo Ji Sheng Tang",
      "Er Chen Tang", "Xue Fu Zhu Yu Tang", "Dang Gui Bu Xue Tang", "Sheng Mai San", "Wu Ling San",
      "Da Cheng Qi Tang", "Tiao Wei Cheng Qi Tang", "Xiao Yao San", "Tong Xie Yao Fang", "Ping Wei San",
      "Bao He Wan", "Chai Hu Shu Gan San", "Si Ni San", "Zhen Wu Tang", "Long Dan Xie Gan Tang",
      "Jia Wei Xiao Yao San", "Sheng Hua Tang", "Tian Ma Gou Teng Yin", "Gan Mai Da Zao Tang", "Ban Xia Hou Po Tang",
      "Gui Pi Tang", "Zhi Gan Cao Tang", "Ge Gen Tang", "Chuan Xiong Cha Tiao San",
    ];

    // Tìm kiếm và gom kết quả
    const pagesVi = (await Promise.all(queriesVi.map((q) => searchWiki(q, "vi", 50)))).flat();
    const pagesEn = (await Promise.all(queriesEn.map((q) => searchWiki(q, "en", 60)))).flat();
    const seen = new Set<string>();
    const picks: { title: string; lang: "vi" | "en" }[] = [];
    for (const p of [...pagesVi, ...pagesEn]) {
      const title: string = p?.title || p?.key || p?.id || "";
      if (!title) continue;
      const lang: "vi" | "en" = (p?.lang || p?.wiki?.lang || "en") === "vi" ? "vi" : "en";
      const key = `${lang}:${title.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      picks.push({ title, lang });
      if (picks.length >= 180) break; // lấy dư phòng trường hợp bị loại sau khi fetch summary
    }

    let created = 0, updated = 0, skipped = 0;
    for (const it of picks) {
      const sumVi = it.lang === "vi" ? await fetchWikiSummary(it.title, "vi") : null;
      const sumEn = it.lang === "en" ? await fetchWikiSummary(it.title, "en") : null;
      const sum = sumVi || sumEn;
      const img = sum ? imageFromSummary(sum) : null;
      const extract = sum?.extract || sum?.description || "";

      // Loại bỏ các trang không phải bài thuốc (ví dụ: bệnh, người, địa danh) theo heuristic đơn giản
      const title = (sum?.title || it.title || "").trim();
      const low = `${title} ${extract}`.toLowerCase();
      const looksFormula = /tang|wan|san|yin|decoction|formula|thang|hoan|tán/.test(low);
      if (!looksFormula || title.length < 3) { skipped++; continue; }

      const doc = {
        ten: title,
        moTa: extract,
        anhMinhHoa: img || "",
        thanhPhan: [],
        cachBaoCheSuDung: "Tham khảo hướng dẫn trên trang gốc và chuyên gia YHCT.",
        congDung: extract ? undefined : undefined,
        doiTuongSuDung: "Phụ thuộc chỉ định bài thuốc, hỏi ý kiến chuyên gia.",
        chuY: "Không tự ý dùng; cần tư vấn chuyên môn.",
        nguonGoc: sum ? toPageUrl(sum.title || title, (sum?.lang || it.lang) === "vi" ? "vi" : "en") : toPageUrl(title, it.lang),
        updatedAt: new Date(),
      } as any;

      const res = await BaiThuoc.findOneAndUpdate(
        { ten: doc.ten },
        { $set: doc },
        { upsert: true, new: true }
      );
      if (res) {
        updated += 1;
      } else {
        created += 1;
      }
      if (created + updated >= 150) break; // dừng khi đã có đủ khoảng 150
    }

    const total = await BaiThuoc.countDocuments({});
    return NextResponse.json({ ok: true, created, updated, skipped, total });
  } catch (err: any) {
    console.error("[seed/bai-thuoc-wiki-150]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}