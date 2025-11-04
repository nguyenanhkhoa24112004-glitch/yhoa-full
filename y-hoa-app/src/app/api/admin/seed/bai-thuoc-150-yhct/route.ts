import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";
import { BAI_THUOC_150_COMPLETE_DATA } from "@/data/bai-thuoc-150-complete";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const reset = url.searchParams.get("reset") === "true";
    
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    if (reset) {
      await BaiThuoc.deleteMany({});
    }

    // Sử dụng dữ liệu đầy đủ 150 bài thuốc
    const recipes = [...BAI_THUOC_150_COMPLETE_DATA];
    
    const result = await BaiThuoc.insertMany(recipes, { ordered: false });
    
    return NextResponse.json({ 
      ok: true, 
      seeded: result.length,
      total: recipes.length,
      message: `Đã seed thành công ${result.length} bài thuốc y học cổ truyền!`
    });
  } catch (e: any) {
    console.error("[seed/bai-thuoc-150-yhct]", e);
    return NextResponse.json({ 
      error: e?.message || "Internal error",
      details: e?.code === 11000 ? "Có thể đã tồn tại - dùng reset=true" : undefined
    }, { status: 500 });
  }
}