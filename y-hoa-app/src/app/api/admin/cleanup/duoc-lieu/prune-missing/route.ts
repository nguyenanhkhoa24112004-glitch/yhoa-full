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
    const filter = {
      $or: [
        { anhMinhHoa: { $exists: false } },
        { anhMinhHoa: "" },
        { nhom: { $exists: false } },
        { nhom: { $size: 0 } },
      ],
    } as any;

    const res = await DuocLieu.deleteMany(filter);
    return NextResponse.json({ deleted: res?.deletedCount || 0 });
  } catch (err: any) {
    console.error("[cleanup/duoc-lieu/prune-missing]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}