import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json({ error: "Body must be an array" }, { status: 400 });
    }

    await dbConnect();

    const ops = payload.map((it: any) => ({
      updateOne: {
        filter: { ten: it.ten },
        update: {
          $set: {
            ten: it.ten,
            tenKhoaHoc: it.tenKhoaHoc,
            mota: it.mota,
            vi: it.vi || [],
            tinh: it.tinh || [],
            quyKinh: it.quyKinh || [],
            nhom: it.nhom || [],
            congDung: it.congDung || [],
            chiDinh: it.chiDinh || [],
            cachDung: it.cachDung,
            chuY: it.chuY || [],
            anhMinhHoa: it.anhMinhHoa,
          },
        },
        upsert: true,
      },
    }));

    const res = await DuocLieu.bulkWrite(ops);
    return NextResponse.json({ matched: res.matchedCount, upserted: res.upsertedCount, modified: res.modifiedCount });
  } catch (err: any) {
    console.error("[import/duoc-lieu]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}