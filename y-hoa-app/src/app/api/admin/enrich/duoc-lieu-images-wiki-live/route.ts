import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

async function fetchWikiSummary(title: string, lang: "vi" | "en"): Promise<any | null> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      headers: { accept: "application/json" },
      // server-side fetch; no cache so we can get fresh thumbnails
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}

async function getImageForHerb(ten?: string, tenKhoaHoc?: string): Promise<string | null> {
  const tryTitles = [ten, tenKhoaHoc].filter(Boolean) as string[];
  for (const title of tryTitles) {
    // Try Vietnamese first
    const vi = await fetchWikiSummary(title, "vi");
    const viThumb = vi?.originalimage?.source || vi?.thumbnail?.source;
    if (typeof viThumb === "string" && viThumb.includes("upload.wikimedia.org")) {
      return viThumb;
    }
    // Then English
    const en = await fetchWikiSummary(title, "en");
    const enThumb = en?.originalimage?.source || en?.thumbnail?.source;
    if (typeof enThumb === "string" && enThumb.includes("upload.wikimedia.org")) {
      return enThumb;
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const limitParam = url.searchParams.get("limit");
    const overwriteParam = url.searchParams.get("overwrite");
    const deleteEmptyParam = url.searchParams.get("deleteEmpty");
    const limit = limitParam ? Math.max(1, Math.min(5000, parseInt(limitParam))) : 1000;
    const overwrite = overwriteParam === "true";
    const deleteEmpty = deleteEmptyParam === "true";

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const match: any = {};
    if (!overwrite) {
      match.$or = [
        { anhMinhHoa: { $exists: false } },
        { anhMinhHoa: { $eq: "" } },
        { anhMinhHoa: null },
      ];
    }

    const docs = await DuocLieu.find(match)
      .limit(limit)
      .select({ _id: 1, ten: 1, tenKhoaHoc: 1, anhMinhHoa: 1 })
      .lean();

    if (!docs.length) {
      return NextResponse.json({ matched: 0, updated: 0, deleted: 0, message: "Không có bản ghi cần enrich" });
    }

    let updated = 0;
    const ops: any[] = [];
    const notFoundIds: string[] = [];

    for (const doc of docs as Array<{ _id: any; ten?: string; tenKhoaHoc?: string; anhMinhHoa?: string }>) {
      const current = doc.anhMinhHoa || "";
      // If overwrite=false and already has image, skip
      if (!overwrite && current) continue;
      const img = await getImageForHerb(doc.ten, doc.tenKhoaHoc);
      if (img) {
        ops.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { anhMinhHoa: img } },
          },
        });
      } else {
        notFoundIds.push(String(doc._id));
      }
    }

    let bulkRes: any = null;
    if (ops.length) {
      bulkRes = await DuocLieu.bulkWrite(ops);
      updated = bulkRes?.modifiedCount || 0;
    }

    let deleted = 0;
    if (deleteEmpty && notFoundIds.length) {
      const delRes = await DuocLieu.deleteMany({ _id: { $in: notFoundIds } });
      deleted = delRes?.deletedCount || 0;
    }

    return NextResponse.json({ matched: docs.length, updated, deleted });
  } catch (err: any) {
    console.error("[enrich/duoc-lieu-images-wiki-live]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}