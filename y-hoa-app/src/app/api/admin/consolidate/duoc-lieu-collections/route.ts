import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

type TargetDoc = {
  _id: any;
  ten?: string;
  tenKhoaHoc?: string;
  mota?: string;
  anhMinhHoa?: string;
  vi?: string[];
  tinh?: string[];
  quyKinh?: string[];
  nhom?: string[];
  congDung?: string[];
  chiDinh?: string[];
  cachDung?: string;
  chuY?: string[];
};

function normName(s?: string): string {
  if (!s) return "";
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}

function isWiki(url?: string): boolean {
  return !!url && /upload\.wikimedia\.org/.test(url);
}

function pickImage(a?: string, b?: string): string | undefined {
  const cand = [a, b].filter(Boolean) as string[];
  if (!cand.length) return undefined;
  const wiki = cand.find((u) => isWiki(u));
  return wiki || cand[0];
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const dropSource = url.searchParams.get("dropSource") === "true";
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const conn = mongoose.connection;

    // Nguồn phụ (có khả năng là 'duoclieus' do pluralize mặc định)
    const source = conn.collection("duoclieus");
    const target = conn.collection("duoclieu");

    const sourceDocs: any[] = await source.find({}).toArray();
    let migrated = 0;
    for (const doc of sourceDocs) {
      const ten = doc.ten || doc.tenDuocLieu || "";
      if (!ten) continue;
      const tenKhoaHoc = doc.tenKhoaHoc || doc.latin || undefined;
      const mota = doc.moTa || doc.mota || undefined;
      const congDung = Array.isArray(doc.congDung)
        ? doc.congDung
        : (doc.congDung ? [doc.congDung] : []);
      const chiDinh = Array.isArray(doc.chiDinh)
        ? doc.chiDinh
        : (doc.chiDinh ? [doc.chiDinh] : []);
      const chuY = Array.isArray(doc.chuY)
        ? doc.chuY
        : (doc.chuY ? [doc.chuY] : []);
      const vi = Array.isArray(doc.vi) ? doc.vi : (doc.vi ? [doc.vi] : []);
      const tinh = Array.isArray(doc.tinh) ? doc.tinh : (doc.tinh ? [doc.tinh] : []);
      const quyKinh = Array.isArray(doc.quyKinh) ? doc.quyKinh : (doc.quyKinh ? [doc.quyKinh] : []);
      const nhom = Array.isArray(doc.nhom) ? doc.nhom : (doc.nhom ? [doc.nhom] : []);
      const image = doc.anhMinhHoa || doc.image || undefined;

      const exist: any = await DuocLieu.findOne({ ten: ten }).lean();
      if (exist) {
        // Merge: ưu tiên ảnh wiki, gộp mảng, giữ mô tả dài hơn
        const merged: any = {
          anhMinhHoa: pickImage(exist.anhMinhHoa, image),
          tenKhoaHoc: exist.tenKhoaHoc || tenKhoaHoc,
          mota: (exist.mota?.length || 0) >= (mota?.length || 0) ? exist.mota : mota,
          vi: Array.from(new Set([...(exist.vi || []), ...vi])),
          tinh: Array.from(new Set([...(exist.tinh || []), ...tinh])),
          quyKinh: Array.from(new Set([...(exist.quyKinh || []), ...quyKinh])),
          nhom: Array.from(new Set([...(exist.nhom || []), ...nhom])),
          congDung: Array.from(new Set([...(exist.congDung || []), ...congDung])),
          chiDinh: Array.from(new Set([...(exist.chiDinh || []), ...chiDinh])),
          cachDung: exist.cachDung || doc.cachDung || undefined,
          chuY: Array.from(new Set([...(exist.chuY || []), ...chuY])),
        };
        await DuocLieu.updateOne({ _id: exist._id }, { $set: merged });
      } else {
        await DuocLieu.updateOne(
          { ten },
          {
            $set: {
              ten,
              tenKhoaHoc,
              mota,
              vi,
              tinh,
              quyKinh,
              nhom,
              congDung,
              chiDinh,
              cachDung: doc.cachDung || undefined,
              chuY,
              anhMinhHoa: image,
            },
          },
          { upsert: true }
        );
      }
      migrated++;
    }

    // Khử trùng lặp ngay trong 'duoclieu' theo tên chuẩn hóa
    const targetDocs = (await target.find({}).toArray()) as TargetDoc[];
    const byName: Record<string, TargetDoc[]> = {};
    for (const d of targetDocs as TargetDoc[]) {
      const key = normName(d.ten || "");
      if (!key) continue;
      if (!byName[key]) byName[key] = [];
      byName[key].push(d);
    }

    let dedupDeleted = 0;
    for (const key of Object.keys(byName)) {
      const group: TargetDoc[] = byName[key];
      if (group.length <= 1) continue;
      // Chọn bản ghi đại diện (ưu tiên có ảnh wiki và mô tả dài)
      let rep: TargetDoc = group[0];
      for (const g of group as TargetDoc[]) {
        const betterImage = isWiki(g.anhMinhHoa) && !isWiki(rep.anhMinhHoa);
        const betterDesc = (g.mota?.length || 0) > (rep.mota?.length || 0);
        if (betterImage || betterDesc) rep = g;
      }
      const toDelete = group.filter((g: TargetDoc) => String(g._id) !== String(rep._id)).map((g: TargetDoc) => g._id);
      if (toDelete.length) {
        const delRes = await target.deleteMany({ _id: { $in: toDelete } });
        dedupDeleted += delRes.deletedCount || 0;
      }
    }

    if (dropSource) {
      try { await source.drop(); } catch {}
    }

    return NextResponse.json({ sourceCount: sourceDocs.length, migrated, dedupDeleted, droppedSource: dropSource });
  } catch (err: any) {
    console.error("[consolidate/duoc-lieu-collections]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}