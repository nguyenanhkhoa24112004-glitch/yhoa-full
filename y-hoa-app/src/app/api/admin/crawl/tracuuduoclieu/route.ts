import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function noAccent(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function matchTaste(s: string): string[] {
  const n = noAccent(s);
  const res: string[] = [];
  if (n.includes('cay')) res.push('cay');
  if (n.includes('ngot')) res.push('ngot');
  if (n.includes('dang')) res.push('dang');
  if (n.includes('man')) res.push('man');
  if (n.includes('chat')) res.push('chat');
  if (n.includes('nhat')) res.push('nhat');
  return Array.from(new Set(res));
}

function matchNature(s: string): string[] {
  const n = noAccent(s);
  const res: string[] = [];
  if (n.includes('on')) res.push('on');
  if (n.includes('han')) res.push('han');
  if (n.includes('luong')) res.push('luong');
  if (n.includes('binh')) res.push('binh');
  if (n.includes('nhiet')) res.push('nhiet');
  return Array.from(new Set(res));
}

function matchMeridians(s: string): string[] {
  const n = noAccent(s).replace(/\s+/g, ' ');
  const res: string[] = [];
  const pairs: Array<[string, string]> = [
    ['phe', 'phe'],
    ['vi', 'vi'],
    ['ty', 'ty'],
    ['can', 'can'],
    ['than', 'than'],
    ['tam', 'tam'],
    ['dai truong', 'daiTruong'],
    ['tieu truong', 'tieuTruong'],
    ['dam', 'dam'],
    ['bang quang', 'bangQuang'],
    ['tam bao', 'tamBao'],
  ];
  for (const [kw, key] of pairs) {
    if (n.includes(kw)) res.push(key);
  }
  return Array.from(new Set(res));
}

function deriveGroupFromText(texts: string[]): string[] {
  const n = noAccent(texts.join(' '));
  const res: string[] = [];
  if (n.includes('phat han') || n.includes('giai bieu') || n.includes('khu phong')) res.push('giaiBieu');
  if (n.includes('thanh nhiet') || n.includes('giai doc') || n.includes('tru hoa')) res.push('thanhNhiet');
  if (n.includes('hoa dam') || n.includes('chi khai') || n.includes('ly khi')) res.push('truDam');
  if (n.includes('hoat huyet') || n.includes('thong lac') || n.includes('chi thong')) res.push('hoatHuyet');
  if (n.includes('kien ty') || n.includes('bo khi') || n.includes('ich khi')) res.push('boKhi');
  if (n.includes('duong huyet') || n.includes('bo huyet')) res.push('boHuyet');
  if (n.includes('tu am') || n.includes('bo am') || n.includes('nhuan tao')) res.push('boAm');
  if (n.includes('loi tieu') || n.includes('loi thuy') || n.includes('tieu phu') || n.includes('thanh thap nhiet')) res.push('loiThuy');
  if (n.includes('chi huyet') || n.includes('cam mau') || n.includes('hoa u')) res.push('chiHuyet');
  if (n.includes('khu phong') || n.includes('tru thap')) res.push('khuPhong');
  // Kiện tỳ phân riêng
  if (n.includes('kien ty') || n.includes('kien van ty vi')) res.push('kienTy');
  return Array.from(new Set(res));
}

async function searchFirstArticleUrl(query: string): Promise<string | null> {
  const searchUrl = `https://tracuuduoclieu.vn/?s=${encodeURIComponent(query)}`;
  const html = await fetchHtml(searchUrl);
  if (!html) return null;
  // Ưu tiên link trong entry-title (tránh dotAll bằng [\s\S])
  const entryMatch = html.match(/<h2[^>]*class=["'][^"']*entry-title[^"']*["'][^>]*>[\s\S]*?<a[^>]*href=["'](https:\/\/tracuuduoclieu\.vn\/[^"']+)["']/i);
  if (entryMatch && entryMatch[1]) return entryMatch[1];
  // Fallback: lấy anchor đầu tiên tới bài viết
  const hrefs = Array.from(html.matchAll(/href=["'](https:\/\/tracuuduoclieu\.vn\/[^"']+)["']/g)).map(m => m[1]);
  const candidate = hrefs.find(h => !h.includes('/tag/') && !h.includes('/category/') && !h.includes('/page/'));
  return candidate || null;
}

async function extractArticleData(url: string): Promise<{ image?: string; desc?: string; title?: string; vi?: string[]; tinh?: string[]; quyKinh?: string[]; congDung?: string[]; chiDinh?: string[]; cachDung?: string; chuY?: string[]; nhom?: string[] } | null> {
  const html = await fetchHtml(url);
  if (!html) return null;
  // Ảnh: og:image
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  let image = ogMatch ? ogMatch[1] : undefined;
  if (!image) {
    const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/i);
    image = imgMatch ? imgMatch[1] : undefined;
  }
  // Tiêu đề (tránh dotAll bằng [\s\S])
  const titleMatch = html.match(/<h1[^>]*class=["'][^"']*entry-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const rawTitle = titleMatch ? titleMatch[1] : undefined;
  const title = rawTitle ? decodeHtmlEntities(rawTitle.replace(/<[^>]+>/g, '').trim()) : undefined;
  // Mô tả: đoạn p đầu tiên đủ dài trong article
  const articleSectionMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const inScope = articleSectionMatch ? articleSectionMatch[1] : html;
  const pMatches = Array.from(inScope.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map(m => decodeHtmlEntities(m[1].replace(/<[^>]+>/g, '').trim()));
  const desc = pMatches.find(t => t && t.length > 40) || pMatches[0] || undefined;

  // Tính vị, Quy kinh
  const viPara = pMatches.find(t => noAccent(t).includes('tinh vi') || noAccent(t).startsWith('vi ')) || undefined;
  const qkPara = pMatches.find(t => noAccent(t).includes('quy kinh')) || undefined;
  const viArr = viPara ? matchTaste(viPara) : undefined;
  const tinhArr = viPara ? matchNature(viPara) : undefined;
  const quyArr = qkPara ? matchMeridians(qkPara) : undefined;

  // Công dụng, Chỉ định
  const congDungPara = pMatches.find(t => noAccent(t).includes('cong dung') || noAccent(t).includes('tac dung')) || undefined;
  const chiDinhPara = pMatches.find(t => noAccent(t).includes('chi dinh') || noAccent(t).includes('ung dung')) || undefined;
  function toBullets(s?: string): string[] | undefined {
    if (!s) return undefined;
    const raw = s.replace(/[:：]/g, ': ');
    const parts = raw.split(/[.;•\-\n]+/).map(x => x.trim()).filter(x => x.length > 6 && x.length < 300);
    const uniq = Array.from(new Set(parts));
    return uniq.length ? uniq.slice(0, 8) : undefined;
  }
  const congDungArr = toBullets(congDungPara);
  const chiDinhArr = toBullets(chiDinhPara);

  // Cách dùng, Chú ý
  const cachDungPara = pMatches.find(t => noAccent(t).includes('cach dung') || noAccent(t).includes('lieu dung') || noAccent(t).startsWith('dung ')) || undefined;
  const chuYPara = pMatches.find(t => noAccent(t).includes('chu y') || noAccent(t).includes('kieng ky') || noAccent(t).includes('than trong')) || undefined;
  const cachDung = cachDungPara || undefined;
  const chuYArr = toBullets(chuYPara);

  // Nhóm: suy luận từ công dụng/chỉ định/mô tả
  const nhomArr = deriveGroupFromText([
    congDungPara || '',
    chiDinhPara || '',
    desc || '',
  ]);

  return { image, desc, title, vi: viArr, tinh: tinhArr, quyKinh: quyArr, congDung: congDungArr, chiDinh: chiDinhArr, cachDung, chuY: chuYArr, nhom: nhomArr };
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.max(1, Math.min(200, parseInt(limitParam))) : 100;
    const overwriteParam = url.searchParams.get("overwrite");
    const overwrite = overwriteParam === "true";

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Lấy danh sách tên hiện có, ưu tiên tên có ảnh để đỡ crawl
    const names = await DuocLieu.find({}).sort({ ten: 1 }).limit(limit).select({ _id: 1, ten: 1, tenKhoaHoc: 1, anhMinhHoa: 1 }).lean();
    if (!names.length) {
      return NextResponse.json({ imported: 0, updated: 0, skipped: 0, message: "Không có dược liệu để crawl" });
    }

    const ops: any[] = [];
    let updated = 0;
    let skipped = 0;

    for (const n of names as Array<{ _id: any; ten?: string; tenKhoaHoc?: string; anhMinhHoa?: string }>) {
      if (!overwrite && n.anhMinhHoa) { skipped++; continue; }
      const query = n.ten || n.tenKhoaHoc || "";
      if (!query) { skipped++; continue; }
      const articleUrl = await searchFirstArticleUrl(query);
      if (!articleUrl) { skipped++; continue; }
      const data = await extractArticleData(articleUrl);
      if (!data) { skipped++; continue; }
      const update: any = {};
      if (data.image) update.anhMinhHoa = data.image;
      if (data.desc) update.mota = data.desc;
      if (data.vi?.length) update.vi = data.vi;
      if (data.tinh?.length) update.tinh = data.tinh;
      if (data.quyKinh?.length) update.quyKinh = data.quyKinh;
      if (data.nhom?.length) update.nhom = data.nhom;
      if (data.congDung?.length) update.congDung = data.congDung;
      if (data.chiDinh?.length) update.chiDinh = data.chiDinh;
      if (data.cachDung) update.cachDung = data.cachDung;
      if (data.chuY?.length) update.chuY = data.chuY;

      const hasAny = Object.keys(update).length > 0;
      if (!hasAny) { skipped++; continue; }

      ops.push({
        updateOne: {
          filter: { _id: n._id },
          update: { $set: update },
        },
      });
    }

    if (ops.length) {
      const res = await DuocLieu.bulkWrite(ops);
      updated = res?.modifiedCount || 0;
    }

    return NextResponse.json({ imported: names.length, updated, skipped });
  } catch (err: any) {
    console.error("[crawl/tracuuduoclieu]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}