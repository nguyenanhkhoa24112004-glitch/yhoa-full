import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const conn = mongoose.connection;
    const db = conn?.db;
    if (!db) {
      return NextResponse.json({ error: "Database connection is not ready" }, { status: 500 });
    }
    const dbName = db.databaseName;
    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name).sort();
    let duocLieuCount = 0;
    try {
      duocLieuCount = await db.collection("duoclieu").countDocuments({});
    } catch (e) {
      // ignore if collection does not exist
    }
    return NextResponse.json({ dbName, collections: names, duocLieuCount });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal Error" }, { status: 500 });
  }
}