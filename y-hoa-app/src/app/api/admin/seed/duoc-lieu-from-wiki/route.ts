import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

type SeedItem = {
  ten: string;
  tenKhoaHoc?: string;
  wikiTitle?: string;
};

async function fetchWikiSummary(title: string, lang: "vi" | "en"): Promise<any | null> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function resolveWiki(ten: string, tenKhoaHoc?: string, wikiTitle?: string): Promise<{ image?: string; desc?: string; title?: string } | null> {
  const candidates = [wikiTitle, tenKhoaHoc, ten].filter(Boolean) as string[];
  for (const t of candidates) {
    const vi = await fetchWikiSummary(t, "vi");
    const viImg = vi?.originalimage?.source || vi?.thumbnail?.source;
    const viDesc = typeof vi?.extract === "string" ? vi.extract : undefined;
    if (viImg && viImg.includes("upload.wikimedia.org")) {
      return { image: viImg, desc: viDesc, title: t };
    }
    const en = await fetchWikiSummary(t, "en");
    const enImg = en?.originalimage?.source || en?.thumbnail?.source;
    const enDesc = typeof en?.extract === "string" ? en.extract : undefined;
    if (enImg && enImg.includes("upload.wikimedia.org")) {
      return { image: enImg, desc: enDesc, title: t };
    }
  }
  return null;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const overwrite = url.searchParams.get("overwrite") === "true";
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Body must be { items: SeedItem[] }" }, { status: 400 });
    }
    const items = body.items as SeedItem[];

    await dbConnect();

    let inserted = 0;
    let updated = 0;
    const errors: Array<{ ten: string; reason: string }> = [];

    for (const it of items) {
      const title = it.wikiTitle || it.tenKhoaHoc || it.ten;
      if (!it.ten || !title) {
        errors.push({ ten: it.ten || "", reason: "missing name/title" });
        continue;
      }

      // Resolve image + description from Wikipedia
      const info = await resolveWiki(it.ten, it.tenKhoaHoc, it.wikiTitle);
      if (!info?.image) {
        errors.push({ ten: it.ten, reason: "no wiki image" });
        continue;
      }

      const doc = {
        ten: it.ten,
        tenKhoaHoc: it.tenKhoaHoc,
        anhMinhHoa: info.image,
        mota: info.desc,
      };

      const res = await DuocLieu.findOneAndUpdate(
        { ten: it.ten },
        { $set: doc },
        { upsert: true, new: true }
      );
      // If it existed, count as updated, else inserted
      if (res) {
        // naive check: try to see if it previously existed by querying again without upsert (optional)
        updated += 1;
      } else {
        inserted += 1;
      }
    }

    return NextResponse.json({ total: items.length, inserted, updated, errors });
  } catch (err: any) {
    console.error("[seed/duoc-lieu-from-wiki]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}