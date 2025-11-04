import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

async function fetchWikiSummary(title: string, lang: "vi" | "en"): Promise<any | null> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}

async function enrichFromWiki(ten?: string, tenKhoaHoc?: string): Promise<{ image?: string; desc?: string; sci?: string } | null> {
  const candidates = [ten, tenKhoaHoc].filter(Boolean) as string[];
  for (const title of candidates) {
    const vi = await fetchWikiSummary(title, "vi");
    const viImg = vi?.originalimage?.source || vi?.thumbnail?.source;
    const viDesc = vi?.extract as string | undefined;
    const viSci = typeof vi?.description === "string" ? vi.description : undefined;
    if (viImg && viImg.includes("upload.wikimedia.org")) {
      return { image: viImg, desc: viDesc, sci: viSci };
    }
    const en = await fetchWikiSummary(title, "en");
    const enImg = en?.originalimage?.source || en?.thumbnail?.source;
    const enDesc = en?.extract as string | undefined;
    const enSci = typeof en?.description === "string" ? en.description : undefined;
    if (enImg && enImg.includes("upload.wikimedia.org")) {
      return { image: enImg, desc: enDesc, sci: enSci };
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const targetParam = url.searchParams.get("target");
    const target = Math.max(1, Math.min(100, parseInt(targetParam || "100")));

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Step 1: pick up to target docs that already have images
    let docs = await DuocLieu.find({ anhMinhHoa: { $exists: true, $ne: "" } })
      .sort({ ten: 1 })
      .limit(target)
      .select({ _id: 1, ten: 1, tenKhoaHoc: 1, anhMinhHoa: 1, mota: 1 })
      .lean();

    // Step 2: if less than target, supplement from entries without image by enriching from Wikipedia
    if (docs.length < target) {
      const need = target - docs.length;
      const fillCandidates = await DuocLieu.find({ $or: [ { anhMinhHoa: { $exists: false } }, { anhMinhHoa: { $eq: "" } }, { anhMinhHoa: null } ] })
        .sort({ ten: 1 })
        .limit(need)
        .select({ _id: 1, ten: 1, tenKhoaHoc: 1 })
        .lean();

      const updates: any[] = [];
      for (const c of fillCandidates as Array<{ _id: any; ten?: string; tenKhoaHoc?: string }>) {
        const info = await enrichFromWiki(c.ten, c.tenKhoaHoc);
        if (info?.image) {
          updates.push({
            updateOne: {
              filter: { _id: c._id },
              update: { $set: { anhMinhHoa: info.image, mota: info.desc || undefined, tenKhoaHoc: info.sci || undefined } },
            },
          });
        }
      }
      if (updates.length) {
        await DuocLieu.bulkWrite(updates);
      }
      // Reload docs with images to ensure we have target
      docs = await DuocLieu.find({ anhMinhHoa: { $exists: true, $ne: "" } })
        .sort({ ten: 1 })
        .limit(target)
        .select({ _id: 1, ten: 1, tenKhoaHoc: 1, anhMinhHoa: 1, mota: 1 })
        .lean();
    }

    const keepIds = docs.map((d: any) => d._id);
    const delRes = await DuocLieu.deleteMany({ _id: { $nin: keepIds } });

    // Step 3: ensure selected docs have description and scientific name if possible
    const enrichOps: any[] = [];
    for (const d of docs as Array<{ _id: any; ten?: string; tenKhoaHoc?: string; mota?: string; anhMinhHoa?: string }>) {
      if (!d.mota || !d.tenKhoaHoc) {
        const info = await enrichFromWiki(d.ten, d.tenKhoaHoc);
        if (info) {
          enrichOps.push({
            updateOne: {
              filter: { _id: d._id },
              update: { $set: { mota: d.mota || info.desc || undefined, tenKhoaHoc: d.tenKhoaHoc || info.sci || undefined } },
            },
          });
        }
      }
    }
    let enriched = 0;
    if (enrichOps.length) {
      const r = await DuocLieu.bulkWrite(enrichOps);
      enriched = r?.modifiedCount || 0;
    }

    return NextResponse.json({ kept: keepIds.length, deleted: delRes?.deletedCount || 0, enriched });
  } catch (err: any) {
    console.error("[reset/duoc-lieu-top100]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}