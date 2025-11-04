import { NextResponse } from "next/server";
import mongoose from "mongoose";
import DuocLieu from "@/lib/models/DuocLieu";
import dbConnect from "@/lib/mongoose";

// Simple image pool with royalty-free Unsplash images (representative herbs)
const IMAGE_POOL: string[] = [
  "https://images.unsplash.com/photo-1547514701-9fa1a6e30d70?w=1200&q=80&auto=format&fit=crop", // ginger
  "https://images.unsplash.com/photo-1524594154248-1f262212d6f7?w=1200&q=80&auto=format&fit=crop", // mint
  "https://images.unsplash.com/photo-1479064845801-2f3f7f1f0a22?w=1200&q=80&auto=format&fit=crop", // herbs board
  "https://images.unsplash.com/photo-1461354464877-64e2f47a1a16?w=1200&q=80&auto=format&fit=crop", // mortar herbs
  "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=1200&q=80&auto=format&fit=crop", // dried herbs
  "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1200&q=80&auto=format&fit=crop", // green leaves
];

function pickImage(index: number) {
  return IMAGE_POOL[index % IMAGE_POOL.length];
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.max(1, Math.min(2000, parseInt(limitParam))) : 500;

    // Simple guard; you can change SECRET in env and compare here if needed
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find docs missing image or empty
    const docs = await DuocLieu.find({
      $or: [
        { anhMinhHoa: { $exists: false } },
        { anhMinhHoa: { $eq: "" } },
        { anhMinhHoa: null },
      ],
    })
      .limit(limit)
      .select({ _id: 1, ten: 1 });

    if (!docs.length) {
      return NextResponse.json({ updated: 0, message: "Không còn bản ghi thiếu ảnh" });
    }

    const ops = docs.map((doc: { _id: mongoose.Types.ObjectId }, idx: number) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { anhMinhHoa: pickImage(idx) } },
      },
    }));

    const result = await DuocLieu.bulkWrite(ops);
    const modified = result.modifiedCount || 0;

    return NextResponse.json({ updated: modified });
  } catch (err: any) {
    console.error("[enrich/duoc-lieu-images]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}