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
    
    const result = await Benh.deleteMany({});
    
    return NextResponse.json({ 
      ok: true,
      message: "Đã xóa tất cả dữ liệu bệnh cũ",
      deletedCount: result.deletedCount
    });
  } catch (e: any) {
    console.error("[reset/benh-drop-all]", e);
    return NextResponse.json({ 
      error: e?.message || "Internal error"
    }, { status: 500 });
  }
}

// Cho phép POST cũng được
export async function POST(req: Request) {
  return DELETE(req);
}





