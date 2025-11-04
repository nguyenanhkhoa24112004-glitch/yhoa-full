import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";
import { deriveKnowledge } from "@/lib/knowledge/rules";
import { DUOC_LIEU_KNOWLEDGE } from "@/data/duoc-lieu-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DLDoc = {
  _id: any;
  ten: string;
  nhom?: string[];
  vi?: string[];
  tinh?: string[];
  quyKinh?: string[];
  congDung?: string[];
  chiDinh?: string[];
  cachDung?: string;
  chuY?: string[];
};

type DLDocLean = Pick<DLDoc, '_id' | 'ten' | 'nhom' | 'vi' | 'tinh' | 'quyKinh' | 'congDung' | 'chiDinh' | 'cachDung' | 'chuY'>;

function uniq<T>(arr: T[] = []): T[] { return Array.from(new Set(arr.filter(Boolean))); }

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const overwrite = url.searchParams.get("overwrite") === "true";
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const docs = await DuocLieu.find({})
      .select({ _id: 1, ten: 1, nhom: 1, vi: 1, tinh: 1, quyKinh: 1, congDung: 1, chiDinh: 1, cachDung: 1, chuY: 1 })
      .lean();

    let matched = 0;
    let updated = 0;
    const ops: any[] = [];

    const items: DLDocLean[] = Array.isArray(docs) ? (docs as unknown as DLDocLean[]) : [];
    for (const d of items) {
      if (!d || typeof d.ten !== 'string') {
        continue;
      }
      const base = deriveKnowledge({ ten: d.ten, nhom: d.nhom, vi: d.vi, tinh: d.tinh, quyKinh: d.quyKinh });
      const specific = DUOC_LIEU_KNOWLEDGE[d.ten]?.congDung ? DUOC_LIEU_KNOWLEDGE[d.ten] : undefined;
      const congDung = uniq([...(d.congDung || []), ...base.congDung, ...(specific?.congDung || [])]);
      const chiDinh = uniq([...(d.chiDinh || []), ...base.chiDinh, ...(specific?.chiDinh || [])]);
      const cachDung = specific?.cachDung || d.cachDung || base.cachDung;
      const chuY = uniq([...(d.chuY || []), ...base.chuY, ...(specific?.chuY || [])]);

      const shouldUpdate = overwrite || !d.congDung?.length || !d.chiDinh?.length || !d.cachDung || !d.chuY?.length;
      if (!shouldUpdate) continue;
      matched += 1;
      ops.push({
        updateOne: {
          filter: { _id: d._id },
          update: { $set: { congDung, chiDinh, cachDung, chuY } },
        },
      });
    }

    if (ops.length) {
      const res = await DuocLieu.bulkWrite(ops);
      updated = res?.modifiedCount || 0;
    }

    return NextResponse.json({ matched, updated });
  } catch (err: any) {
    console.error("[enrich/duoc-lieu-derive-knowledge]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}