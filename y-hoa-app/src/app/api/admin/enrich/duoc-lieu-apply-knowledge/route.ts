import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";
import { DUOC_LIEU_KNOWLEDGE } from "@/data/duoc-lieu-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DLDocId = { _id: any };

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

    for (const name of Object.keys(DUOC_LIEU_KNOWLEDGE)) {
      const k = DUOC_LIEU_KNOWLEDGE[name];
      const filter: any = { ten: { $regex: `^${name}$`, $options: "i" } };
      const current = await DuocLieu.findOne(filter)
        .select({ _id: 1, congDung: 1, chiDinh: 1, cachDung: 1, chuY: 1 })
        .lean();
      if (!current || Array.isArray(current)) continue;
      matched += 1;
      const shouldUpdate = overwrite || !current.congDung?.length || !current.chiDinh?.length || !current.cachDung || !current.chuY?.length;
      if (!shouldUpdate) continue;
      ops.push({
        updateOne: {
          filter: { _id: (current as DLDocId)._id },
          update: {
            $set: {
              congDung: k.congDung,
              chiDinh: k.chiDinh,
              cachDung: k.cachDung,
              chuY: k.chuY,
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
    console.error("[enrich/duoc-lieu-apply-knowledge]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}