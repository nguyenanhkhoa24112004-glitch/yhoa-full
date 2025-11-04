import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";

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
    const conn = mongoose.connection;
    if (!conn || !conn.db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }
    const db = conn.db;
    const collections = ["duoclieu", "duoclieus"];
    const results: Record<string, string> = {};
    for (const name of collections) {
      try {
        const exists = (await db.listCollections({ name }).toArray()).length > 0;
        if (exists) {
          try {
            await db.dropCollection(name);
          } catch (e) {
            // Fallback to drop via collection handle
            await db.collection(name).drop().catch(() => undefined);
          }
          results[name] = "dropped";
        } else {
          results[name] = "not_found";
        }
      } catch (e: any) {
        results[name] = `error:${e?.message || "unknown"}`;
      }
    }
    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    console.error("[reset/duoc-lieu-drop-all]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}