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

    await dbConnect();
    const res = await DuocLieu.deleteMany({});
    return NextResponse.json({ deleted: res.deletedCount || 0 });
  } catch (err: any) {
    console.error("[reset/duoc-lieu]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}