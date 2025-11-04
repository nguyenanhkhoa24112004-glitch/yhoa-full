import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Benh } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "12", 10), 1), 50);

    const filter: any = {};
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { ten: regex },
        { moTa: regex },
        { trieuchung: regex },
        { nguyenNhan: regex },
        { phuongPhapDieuTri: regex },
      ];
    }

    const total = await Benh.countDocuments(filter);
    const items = await Benh.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("ten moTa trieuchung nguyenNhan phuongPhapDieuTri baiThuocLienQuan")
      .lean();

    return NextResponse.json({ items, total, page, limit });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}