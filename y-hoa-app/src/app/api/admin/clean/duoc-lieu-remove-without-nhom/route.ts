import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Xác định những bản ghi không có nhóm hoặc nhóm rỗng
    const match = {
      $or: [
        { nhom: { $exists: false } },
        { nhom: { $size: 0 } },
        { nhom: null },
      ],
    } as any;

    const total = await DuocLieu.countDocuments(match);
    if (!total) return NextResponse.json({ matched: 0, deleted: 0 });

    const res = await DuocLieu.deleteMany(match);
    const deleted = res?.deletedCount || 0;
    return NextResponse.json({ matched: total, deleted });
  } catch (err: any) {
    console.error("[clean/duoc-lieu-remove-without-nhom]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}