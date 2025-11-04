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
  if (n.includes('thanh nhiet') || n.includes('giai doc') || n.includes('tru hoa') || n.includes('khang viem') || n.includes('chong viem')) res.push('thanhNhiet');
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

function deriveTasteFromText(texts: string[]): string[] {
  const n = noAccent(texts.join(' '));
  const res: string[] = [];
  if (n.includes('cay')) res.push('cay');
  if (n.includes('ngot')) res.push('ngot');
  if (n.includes('dang')) res.push('dang');
  if (n.includes('man')) res.push('man');
  if (n.includes('chat')) res.push('chat');
  if (n.includes('nhat')) res.push('nhat');
  return Array.from(new Set(res));
}

function derivePropertyFromText(texts: string[]): string[] {
  const n = noAccent(texts.join(' '));
  const res: string[] = [];
  if (n.includes('han') || n.includes('lanh')) res.push('han');
  if (n.includes('luong') || n.includes('mat')) res.push('luong');
  if (n.includes('on') || n.includes('am')) res.push('on');
  if (n.includes('nhiet') || n.includes('nong')) res.push('nhiet');
  if (n.includes('binh')) res.push('binh');
  return Array.from(new Set(res));
}

function deriveMeridianFromText(texts: string[]): string[] {
  const n = noAccent(texts.join(' '));
  const res: string[] = [];
  if (n.includes('phe')) res.push('phe');
  if (n.includes('vi ')) res.push('vi');
  if (n.includes('ty')) res.push('ty');
  if (n.includes('can')) res.push('can');
  if (n.includes('than')) res.push('than');
  if (n.includes('tam')) res.push('tam');
  if (n.includes('dai truong')) res.push('daiTruong');
  if (n.includes('tieu truong')) res.push('tieuTruong');
  if (n.includes('dam')) res.push('dam');
  if (n.includes('bang quang')) res.push('bangQuang');
  if (n.includes('tam bao')) res.push('tamBao');
  return Array.from(new Set(res));
}

function fallbackTaxonomyFromGroup(groups: string[]): { vi?: string[]; tinh?: string[]; quyKinh?: string[] } {
  const g = groups || [];
  const vi: string[] = [];
  const tinh: string[] = [];
  const quyKinh: string[] = [];
  if (g.includes('giaiBieu')) { vi.push('cay'); tinh.push('on'); quyKinh.push('phe'); }
  if (g.includes('thanhNhiet')) { vi.push('dang'); tinh.push('han'); quyKinh.push('can'); }
  if (g.includes('hoatHuyet')) { vi.push('dang'); tinh.push('on'); quyKinh.push('can'); }
  if (g.includes('boKhi')) { vi.push('ngot'); tinh.push('on'); quyKinh.push('ty'); }
  if (g.includes('boHuyet')) { vi.push('ngot'); tinh.push('on'); quyKinh.push('tam'); }
  if (g.includes('boAm')) { vi.push('ngot'); tinh.push('luong'); quyKinh.push('than'); }
  if (g.includes('loiThuy')) { vi.push('nhat'); tinh.push('han'); quyKinh.push('bangQuang'); }
  if (g.includes('truDam')) { vi.push('cay'); tinh.push('on'); quyKinh.push('phe'); }
  if (g.includes('khuPhong')) { vi.push('cay'); tinh.push('on'); quyKinh.push('phe'); }
  if (g.includes('kienTy')) { vi.push('ngot'); tinh.push('on'); quyKinh.push('ty'); }
  if (g.includes('chiHuyet')) { vi.push('dang'); tinh.push('on'); quyKinh.push('can'); }
  return { vi: Array.from(new Set(vi)), tinh: Array.from(new Set(tinh)), quyKinh: Array.from(new Set(quyKinh)) };
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

async function fetchCategoryMembers(lang: string, category: string, limit = 500): Promise<string[]> {
  try {
    const cmtitle = `Category:${category}`;
    const api = `https://${lang}.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(cmtitle)}&cmlimit=${limit}&format=json&origin=*`;
    const data = await fetchJson(api);
    const arr = (data?.query?.categorymembers || []) as Array<{ title?: string; pageid?: number }>;
    return arr.map((x) => x.title).filter(Boolean) as string[];
  } catch { return []; }
}

type TaxonInfo = { sci?: string; rankId?: string };
const ALLOW_RANKS = new Set<string>(["Q7432", /* species */ "Q68969", /* subspecies */ "Q231860", /* variety */ "Q207480" /* cultivar */]);

async function fetchScientificNameByPageId(lang: string, pageid: number): Promise<TaxonInfo | undefined> {
  try {
    const infoUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&pageids=${pageid}&prop=pageprops&format=json&origin=*`;
    const idata = await fetchJson(infoUrl);
    const pages = idata?.query?.pages || {};
    const first = Object.values(pages)[0] as any;
    const qid = first?.pageprops?.wikibase_item as string | undefined;
    if (!qid) return undefined;
    const edata = await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
    const entity = edata?.entities?.[qid];
    const p225 = entity?.claims?.P225?.[0]?.mainsnak?.datavalue?.value as string | undefined; // taxon name
    const rankId = entity?.claims?.P105?.[0]?.mainsnak?.datavalue?.value?.id as string | undefined; // taxon rank (Qid)
    return { sci: p225 || undefined, rankId };
  } catch { return undefined; }
}

function normKey(s: string): string { return noAccent(s || '').replace(/\s+/g, ' ').trim(); }

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const targetParam = url.searchParams.get("target");
    const target = targetParam ? Math.max(50, Math.min(1000, parseInt(targetParam))) : 320;
    const overwrite = url.searchParams.get("overwrite") === "true";
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1) Thu thập tiêu đề từ các category phổ biến
    const viCats = [
      "Thảo_dược",
      "Cây_thuốc",
      "Dược_liệu",
      "Thực_vật_dược_liệu",
    ];
    const enCats = [
      "Herbs_used_in_traditional_Chinese_medicine",
      "Medicinal_plants",
      "Herbal_medicine",
    ];

    const titlesSet = new Set<string>();
    for (const c of viCats) {
      const t = await fetchCategoryMembers('vi', c, 500);
      for (const x of t) titlesSet.add(x);
    }
    // Nếu chưa đủ, lấy thêm từ EN
    if (titlesSet.size < target) {
      for (const c of enCats) {
        const t = await fetchCategoryMembers('en', c, 500);
        for (const x of t) titlesSet.add(x);
        if (titlesSet.size >= target * 2) break;
      }
    }

    const candidates = Array.from(titlesSet);
    if (!candidates.length) {
      return NextResponse.json({ error: "Không lấy được danh sách từ Wikipedia" }, { status: 500 });
    }

    // 2) Duyệt và seed đến khi đạt target
    let inserted = 0;
    let updated = 0;
    const errors: Array<{ title: string; reason: string }> = [];
    const seenKeys = new Set<string>();

    for (const rawTitle of candidates) {
      if (inserted >= target) break;
      const found = await lookupWikipedia(rawTitle, ["vi", "en"]);
      if (!found) { errors.push({ title: rawTitle, reason: "not found" }); continue; }
      const pageid = found.pageid!;
      const vnTitle = found.title || rawTitle;
      const key = normKey(vnTitle);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      // Bỏ qua trang cấp chi/họ hoặc trang không phải loài
      const taxon = await fetchScientificNameByPageId("vi", pageid);
      const sci = taxon?.sci;
      const rankOk = taxon?.rankId ? ALLOW_RANKS.has(taxon.rankId) : true;
      const isGenusOrFamilyTitle = /^\s*(Chi|Họ)\s/i.test(vnTitle);
      if (!rankOk || isGenusOrFamilyTitle) {
        errors.push({ title: vnTitle, reason: "skip-non-species" });
        continue;
      }
      const sections = await extractSections(pageid, "vi");
      const textForGroup = [found.extract || '', ...(sections?.congDung || []), ...(sections?.chongChiDinh || [])];
      const nhom = deriveGroupFromText(textForGroup);
      const vi = deriveTasteFromText(textForGroup);
      const tinh = derivePropertyFromText(textForGroup);
      let quyKinh = deriveMeridianFromText(textForGroup);
      if (!quyKinh.length) {
        const fb = fallbackTaxonomyFromGroup(nhom);
        quyKinh = fb.quyKinh || [];
      }
      const update: any = {
        ten: vnTitle,
        tenKhoaHoc: sci || undefined,
        mota: (found.extract || '').split("\n").find((t) => t && t.length > 40) || found.extract || undefined,
        congDung: sections?.congDung || [],
        cachDung: sections?.cachDung || undefined,
        chongChiDinh: sections?.chongChiDinh || [],
        nhom,
        vi,
        tinh,
        quyKinh,
      };

      // Ảnh minh hoạ: ưu tiên ảnh từ Wikipedia/Wikidata/Commons
      const imageFromFound: string | undefined = found?.imageUrl;
      let imageUrl: string | undefined = imageFromFound;
      if (!imageUrl && sections?.imageFromHtml) imageUrl = sections.imageFromHtml;
      if (!imageUrl) {
        imageUrl = await searchWikidataImageByName(vnTitle) || undefined;
      }
      if (!imageUrl) {
        imageUrl = await searchCommonsImageByName(vnTitle) || undefined;
      }
      if (imageUrl) update.anhMinhHoa = imageUrl;

      const res = await DuocLieu.findOneAndUpdate(
        { ten: vnTitle },
        { $set: update },
        { upsert: true, new: true }
      );
      if (res) {
        updated += 1;
      } else {
        inserted += 1;
      }
    }

    return NextResponse.json({ target, inserted, updated, errorsCount: errors.length });
  } catch (err: any) {
    console.error("[seed/duoc-lieu-320]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}