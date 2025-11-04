import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DeletePayload = { names: string[]; mode?: "ten" | "tenKhoaHoc" | "any" };

function norm(s: string): string { return (s || "").trim(); }

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as DeletePayload | null;
    const names = Array.isArray(body?.names) ? Array.from(new Set(body!.names.map(norm).filter(Boolean))) : [];
    const mode = body?.mode || "any";
    if (!names.length) {
      return NextResponse.json({ error: "Body must be { names: string[] }" }, { status: 400 });
    }

    await dbConnect();

    // Build OR regex filters anchored to match exactly (case-insensitive)
    const ors: any[] = [];
    for (const n of names) {
      const re = new RegExp(`^${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
      if (mode === "ten" || mode === "any") ors.push({ ten: { $regex: re } });
      if (mode === "tenKhoaHoc" || mode === "any") ors.push({ tenKhoaHoc: { $regex: re } });
    }
    const filter = { $or: ors } as any;

    const toDelete = await DuocLieu.find(filter).select({ _id: 1, ten: 1, tenKhoaHoc: 1 }).lean();
    if (!toDelete.length) {
      return NextResponse.json({ matched: 0, deleted: 0, notFound: names });
    }

    const ids = toDelete.map((d: any) => d._id);
    const res = await DuocLieu.deleteMany({ _id: { $in: ids } });
    const deleted = res?.deletedCount || 0;
    return NextResponse.json({ matched: toDelete.length, deleted, names });
  } catch (err: any) {
    console.error("[delete/duoc-lieu-by-names]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}