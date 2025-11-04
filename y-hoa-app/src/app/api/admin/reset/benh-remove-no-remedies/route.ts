import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Benh } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Tìm và xóa các bệnh không có bài thuốc liên quan
    const result = await Benh.deleteMany({
      $or: [
        { baiThuocLienQuan: { $exists: false } },
        { baiThuocLienQuan: { $size: 0 } },
        { baiThuocLienQuan: [] }
      ]
    });
    
    // Đếm lại số lượng
    const remaining = await Benh.countDocuments({});
    const withRemedies = await Benh.countDocuments({
      baiThuocLienQuan: { $exists: true, $not: { $size: 0 } }
    });
    
    return NextResponse.json({ 
      ok: true,
      message: "Đã xóa các bệnh không có bài thuốc",
      deletedCount: result.deletedCount,
      remainingTotal: remaining,
      withRemedies: withRemedies
    });
  } catch (e: any) {
    console.error("[reset/benh-remove-no-remedies]", e);
    return NextResponse.json({ 
      error: e?.message || "Internal error"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return DELETE(req);
}





