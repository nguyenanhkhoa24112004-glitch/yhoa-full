import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Benh, BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const benhCount = await Benh.countDocuments();
    const baiThuocCount = await BaiThuoc.countDocuments();
    
    // Lấy một số bệnh để kiểm tra
    const sample = await Benh.find().limit(5).lean();
    
    return NextResponse.json({
      ok: true,
      mongodb: "connected",
      benh: {
        total: benhCount,
        sample: sample.map(b => ({
          ten: b.ten,
          id: b._id,
          baiThuocLienQuan: Array.isArray(b.baiThuocLienQuan) ? b.baiThuocLienQuan.length : 0
        }))
      },
      baiThuoc: {
        total: baiThuocCount
      },
      status: benhCount > 0 ? "Có dữ liệu" : "Chưa có dữ liệu - Cần seed"
    });
  } catch (e: any) {
    console.error("[seed/benh-check]", e);
    return NextResponse.json({
      ok: false,
      error: e?.message || "Lỗi kết nối",
      mongodb: "disconnected"
    }, { status: 500 });
  }
}
