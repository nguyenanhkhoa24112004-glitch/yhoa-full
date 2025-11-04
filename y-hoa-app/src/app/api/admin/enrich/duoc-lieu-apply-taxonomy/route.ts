import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";
import { DUOC_LIEU_TAXO } from "@/data/duoc-lieu-mapping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DLDocBasic = {
  _id: any;
  vi?: string[];
  tinh?: string[];
  nhom?: string[];
  quyKinh?: string[];
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const overwrite = url.searchParams.get("overwrite") === "true";
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let matched = 0;
    let updated = 0;
    const ops: any[] = [];
    for (const name of Object.keys(DUOC_LIEU_TAXO)) {
      const taxo = DUOC_LIEU_TAXO[name];
      const filter: any = { ten: { $regex: `^${name}$`, $options: "i" } };
      const currentRaw = await DuocLieu.findOne(filter)
        .select({ _id: 1, vi: 1, tinh: 1, nhom: 1, quyKinh: 1 })
        .lean();
      if (!currentRaw || Array.isArray(currentRaw)) continue;
      const current = currentRaw as DLDocBasic;
      matched += 1;
      const shouldUpdate = overwrite || !current.vi || !current.tinh || !current.nhom || !current.quyKinh;
      if (!shouldUpdate) continue;
      ops.push({
        updateOne: {
          filter: { _id: current._id },
          update: {
            $set: {
              vi: taxo.vi,
              tinh: taxo.tinh,
              nhom: taxo.nhom,
              quyKinh: taxo.quyKinh,
            },
          },
        },
      });
    }

    if (ops.length) {
      const res = await DuocLieu.bulkWrite(ops);
      updated = res?.modifiedCount || 0;
    }

    return NextResponse.json({ matched, updated });
  } catch (err: any) {
    console.error("[enrich/duoc-lieu-apply-taxonomy]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}