import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WikiFound = {
  title?: string;
  pageid?: number;
  extract?: string;
  imageUrl?: string; // upload.wikimedia.org
};

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function resolveCommonsOriginalUrl(fileName: string): Promise<string | undefined> {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent("File:" + fileName)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
  const data = await fetchJson(api);
  try {
    const pages = data?.query?.pages || {};
    const first = Object.values(pages)[0] as any;
    const url = first?.imageinfo?.[0]?.url as string | undefined;
    if (url && url.startsWith("https://upload.wikimedia.org")) return url;
  } catch {}
  return undefined;
}

async function searchWikidataImageByName(name: string): Promise<string | undefined> {
  try {
    const s = await fetchJson(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&limit=5&format=json&origin=*`);
    const hits = s?.search || [];
    for (const h of hits) {
      const qid = h?.id as string | undefined;
      if (!qid) continue;
      const edata = await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
      const entity = edata?.entities?.[qid];
      const p18 = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value as string | undefined;
      if (p18) {
        const url = await resolveCommonsOriginalUrl(p18);
        if (url) return url;
      }
    }
  } catch {}
  return undefined;
}

async function searchCommonsImageByName(name: string): Promise<string | undefined> {
  try {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrlimit=5&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const data = await fetchJson(api);
    const pages = data?.query?.pages || {};
    const arr = Object.values(pages) as any[];
    for (const p of arr) {
      const url = p?.imageinfo?.[0]?.url as string | undefined;
      if (url && url.startsWith('https://upload.wikimedia.org')) return url;
    }
  } catch {}
  return undefined;
}

async function lookupWikipedia(query: string, langs: string[] = ["vi", "en"]): Promise<WikiFound | null> {
  for (const lang of langs) {
    try {
      const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
      const sdata = await fetchJson(searchUrl);
      const hit = sdata?.query?.search?.[0];
      const title = hit?.title as string | undefined;
      const pageid = hit?.pageid as number | undefined;
      if (!title || !pageid) continue;
      const infoUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|pageprops|extracts&piprop=original&explaintext=1&format=json&origin=*`;
      const idata = await fetchJson(infoUrl);
      const pages = idata?.query?.pages || {};
      const first = Object.values(pages)[0] as any;
      const extract = first?.extract as string | undefined;
      let imageUrl: string | undefined = first?.original?.source as string | undefined;
      const qid = first?.pageprops?.wikibase_item as string | undefined;
      if (!imageUrl && qid) {
        const edata = await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
        const entity = edata?.entities?.[qid];
        const p18 = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value as string | undefined;
        if (p18) {
          imageUrl = (await resolveCommonsOriginalUrl(p18)) || undefined;
        }
      }
      return { title, pageid, extract, imageUrl };
    } catch {}
  }
  return null;
}

function extractBulletsFromHtmlSection(html: string, headers: string[]): string[] | undefined {
  try {
    const lower = html.toLowerCase();
    let startIdx = -1;
    for (const h of headers) {
      const idx = lower.indexOf(`<h2><span class="mw-headline" id="${h.toLowerCase()}`);
      if (idx >= 0) { startIdx = idx; break; }
    }
    if (startIdx < 0) return undefined;
    const sub = html.slice(startIdx);
    const nextH2 = sub.indexOf("<h2");
    const sectionHtml = nextH2 > 0 ? sub.slice(0, nextH2) : sub;
    const lis = Array.from(sectionHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const ps = Array.from(sectionHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const parts = [...lis, ...ps]
      .map(x => x.replace(/\s+/g, ' ').trim())
      .filter(x => x.length >= 8 && x.length <= 300);
    const uniq = Array.from(new Set(parts));
    return uniq.length ? uniq.slice(0, 10) : undefined;
  } catch {
    return undefined;
  }
}

function noAccent(s: string): string { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function deriveGroupFromText(texts: string[]): string[] {
  const n = noAccent(texts.join(' '));
  const res: string[] = [];
  if (n.includes('phat han') || n.includes('giai bieu') || n.includes('khu phong')) res.push('giaiBieu');
  if (n.includes('thanh nhiet') || n.includes('giai doc') || n.includes('tru hoa') || n.includes('kháng viêm') || n.includes('chống viêm')) res.push('thanhNhiet');
  if (n.includes('hoa dam') || n.includes('chi khai') || n.includes('ly khi')) res.push('truDam');
  if (n.includes('hoat huyet') || n.includes('thong lac') || n.includes('chi thong')) res.push('hoatHuyet');
  if (n.includes('kien ty') || n.includes('bo khi') || n.includes('ich khi')) res.push('boKhi');
  if (n.includes('duong huyet') || n.includes('bo huyet')) res.push('boHuyet');
  if (n.includes('tu am') || n.includes('bo am') || n.includes('nhuan tao')) res.push('boAm');
  if (n.includes('loi tieu') || n.includes('loi thuy') || n.includes('tieu phu') || n.includes('thanh thap nhiet')) res.push('loiThuy');
  if (n.includes('chi huyet') || n.includes('cam mau') || n.includes('hoa u')) res.push('chiHuyet');
  if (n.includes('khu phong') || n.includes('tru thap')) res.push('khuPhong');
  if (n.includes('kien van ty vi')) res.push('kienTy');
  return Array.from(new Set(res));
}

async function extractSections(pageid: number, lang: string): Promise<{ congDung?: string[]; cachDung?: string; chongChiDinh?: string[]; imageFromHtml?: string } | null> {
  try {
    const parseUrl = `https://${lang}.wikipedia.org/w/api.php?action=parse&pageid=${pageid}&prop=text&format=json&origin=*`;
    const pdata = await fetchJson(parseUrl);
    const html = pdata?.parse?.text?.["*"] as string | undefined;
    if (!html) return null;
    const uses = extractBulletsFromHtmlSection(html, ["uses", "công_dụng", "công_dụng_và_tác_dụng"]);
    const dosing = extractBulletsFromHtmlSection(html, ["dosage", "dosing", "preparation", "cách_dùng", "liều_dùng"]);
    const contra = extractBulletsFromHtmlSection(html, ["contraindications", "adverse_effects", "chống_chỉ_định", "tác_dụng_phụ"]);
    const cachDung = dosing && dosing.length ? dosing[0] : undefined;
    // Fallback ảnh: lấy ảnh đầu tiên xuất hiện trong bài
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    let imageFromHtml: string | undefined = undefined;
    if (imgMatch && imgMatch[1]) {
      const src = imgMatch[1].startsWith('//') ? `https:${imgMatch[1]}` : imgMatch[1];
      if (src.startsWith('https://upload.wikimedia.org')) imageFromHtml = src;
    }
    return { congDung: uses, cachDung, chongChiDinh: contra, imageFromHtml };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.max(1, Math.min(500, parseInt(limitParam))) : 100;
    const overwriteParam = url.searchParams.get("overwrite");
    const overwrite = overwriteParam === "true";
    const langsParam = url.searchParams.get("langs") || "vi,en";
    const langs = langsParam.split(",").map(s => s.trim()).filter(Boolean);

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const names = await DuocLieu.find({}).sort({ ten: 1 }).limit(limit).select({ _id: 1, ten: 1, tenKhoaHoc: 1, anhMinhHoa: 1 }).lean();
    if (!names.length) {
      return NextResponse.json({ updated: 0, skipped: 0, message: "Không có dược liệu để enrich" });
    }

    const ops: any[] = [];
    let updated = 0;
    let skipped = 0;

    for (const n of names as Array<{ _id: any; ten?: string; tenKhoaHoc?: string; anhMinhHoa?: string }>) {
      if (!overwrite && n.anhMinhHoa) { skipped++; continue; }
      const query = n.tenKhoaHoc || n.ten || "";
      if (!query) { skipped++; continue; }
      const found = await lookupWikipedia(query, langs);
      // Nếu không tìm thấy bài Wikipedia, thử lấy ảnh qua Wikidata/Commons theo tên
      let fallbackImg: string | undefined = undefined;
      if (!found) {
        const candidates = [n.tenKhoaHoc, n.ten].filter(Boolean) as string[];
        for (const nm of candidates) {
          fallbackImg = await searchWikidataImageByName(nm);
          if (fallbackImg) break;
          fallbackImg = await searchCommonsImageByName(nm);
          if (fallbackImg) break;
        }
        if (!fallbackImg) { skipped++; continue; }
      }
      const pageId: number | undefined = found?.pageid;
      const sections = (pageId && langs[0]) ? await extractSections(pageId, langs[0]) : null;
      const update: any = {};
      const imageFromFound: string | undefined = found?.imageUrl;
      if (imageFromFound) update.anhMinhHoa = imageFromFound;
      else if (sections?.imageFromHtml) update.anhMinhHoa = sections.imageFromHtml;
      else if (fallbackImg) update.anhMinhHoa = fallbackImg;
      const extractText: string | undefined = found?.extract;
      if (extractText) update.mota = extractText.split("\n").find((t: string) => t && t.length > 40) || extractText;
      if (sections?.congDung?.length) update.congDung = sections.congDung;
      if (sections?.cachDung) update.cachDung = sections.cachDung;
      if (sections?.chongChiDinh?.length) update.chongChiDinh = sections.chongChiDinh;
      // Suy luận nhóm nếu chưa có
      const textForGroup = [update.mota || '', ...(update.congDung || []), ...(update.chongChiDinh || [])];
      const nhom = deriveGroupFromText(textForGroup);
      if (nhom.length) update.nhom = nhom;
      if (!Object.keys(update).length) { skipped++; continue; }
      ops.push({ updateOne: { filter: { _id: n._id }, update: { $set: update } } });
    }

    if (ops.length) {
      const res = await DuocLieu.bulkWrite(ops);
      updated = res?.modifiedCount || 0;
    }

    return NextResponse.json({ updated, skipped });
  } catch (err: any) {
    console.error("[enrich/wiki]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}