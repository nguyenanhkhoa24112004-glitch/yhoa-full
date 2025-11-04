import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function toPageUrl(title: string, lang: "vi" | "en") {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, "_"))}`;
}

function imageFromSummary(sum: any): string | null {
  const thumb = sum?.thumbnail?.source || sum?.thumbnail?.url || sum?.thumbnail;
  const orig = sum?.originalimage?.source || sum?.originalimage?.url || sum?.originalimage;
  const pick = (u: any) => (typeof u === "string" && u.includes("upload.wikimedia.org")) ? u : null;
  return pick(thumb) || pick(orig) || null;
}

async function searchWiki(query: string, lang: "vi" | "en", limit = 5): Promise<{ title: string; image?: string }[]> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const pages = json?.pages || [];
    const picked: { title: string; image?: string }[] = [];
    for (const p of pages) {
      const title = p?.title as string | undefined;
      const image = imageFromSummary(p);
      if (title) picked.push({ title, image: image || undefined });
    }
    return picked;
  } catch {
    return [];
  }
}

export async function GET(req: Request) { return POST(req); }

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const limitParam = url.searchParams.get("limit");
  const limit = Math.max(1, Math.min(parseInt(limitParam || "50", 10) || 50, 200));

  if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const items = await BaiThuoc.find({ $or: [ { anhMinhHoa: { $exists: false } }, { anhMinhHoa: { $eq: null } }, { anhMinhHoa: { $eq: "" } } ] })
    .sort({ ten: 1 })
    .limit(limit)
    .lean();

  let updated = 0;
  const results: any[] = [];

  for (const it of items) {
    const name = (it?.ten || "").trim();
    if (!name) continue;

    // Try Vietnamese first, then English
    const viHits = await searchWiki(name, "vi", 5);
    const enHits = viHits.length ? [] : await searchWiki(name, "en", 5);
    const hits = [...viHits, ...enHits];

    const chosen = hits.find(h => !!h.image);
    if (chosen?.image) {
      await BaiThuoc.updateOne({ _id: it._id }, { $set: { anhMinhHoa: chosen.image, nguonGoc: toPageUrl(chosen.title, viHits.length ? "vi" : "en") } });
      updated++;
      results.push({ id: String(it._id), ten: name, image: chosen.image });
    }
  }

  return NextResponse.json({ matched: items.length, updated, results }, { status: 200 });
}