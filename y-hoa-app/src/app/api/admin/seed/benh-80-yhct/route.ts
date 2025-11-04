import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Benh, BaiThuoc } from "@/models";
import { BENH_80_YHCT } from "@/data/benh-80-yhct";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mapping keywords để tìm bài thuốc phù hợp
function getKeywordsForDisease(ten: string, trieuchung: string[], nguyenNhan: string): string[] {
  const tenLower = ten.toLowerCase();
  const keywords: string[] = [];
  
  // Keywords từ tên bệnh
  if (tenLower.includes("cảm") || tenLower.includes("ho")) keywords.push("giải biểu", "sơ phong", "phát hãn");
  if (tenLower.includes("đau dạ dày") || tenLower.includes("tiêu hóa")) keywords.push("tỳ vị", "lý khí", "kiện tỳ");
  if (tenLower.includes("tim") || tenLower.includes("huyết áp")) keywords.push("an thần", "định tâm", "bổ tâm");
  if (tenLower.includes("đau") || tenLower.includes("khớp") || tenLower.includes("lưng")) keywords.push("hoạt huyết", "thông lạc", "khu phong");
  if (tenLower.includes("tiểu") || tenLower.includes("niệu")) keywords.push("lợi niệu", "thận", "cố sáp");
  if (tenLower.includes("mất ngủ") || tenLower.includes("lo âu")) keywords.push("an thần", "định chí", "dưỡng tâm");
  if (tenLower.includes("kém ăn") || tenLower.includes("chán ăn")) keywords.push("kiện tỳ", "khai vị", "ích khí");
  if (tenLower.includes("thiếu máu")) keywords.push("bổ huyết", "dưỡng âm", "ích khí");
  
  // Keywords từ triệu chứng
  trieuchung.forEach(tc => {
    const tcLower = tc.toLowerCase();
    if (tcLower.includes("đau")) keywords.push("chỉ thống", "hoạt huyết");
    if (tcLower.includes("sưng") || tcLower.includes("nóng")) keywords.push("thanh nhiệt", "giải độc");
    if (tcLower.includes("lạnh") || tcLower.includes("lạnh")) keywords.push("ôn dương", "tán hàn");
  });
  
  return [...new Set(keywords)]; // Remove duplicates
}

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
      await Benh.deleteMany({});
    }

    const results = [];
    
    for (const benh of BENH_80_YHCT) {
      // Tìm bài thuốc phù hợp
      const keywords = getKeywordsForDisease(benh.ten, benh.trieuchung || [], benh.nguyenNhan);
      const regex = keywords.length > 0 ? new RegExp(keywords.join("|"), "i") : null;
      
      let baiThuocIds: any[] = [];
      if (regex) {
        const related = await BaiThuoc.find({ 
          $or: [
            { ten: regex },
            { congDung: regex },
            { moTa: regex }
          ] 
        })
        .select("_id")
        .limit(5)
        .lean();
        baiThuocIds = related.map(r => r._id);
      }

      // Tạo hoặc cập nhật bệnh
      const doc = await Benh.findOneAndUpdate(
        { ten: benh.ten },
        {
          ten: benh.ten,
          moTa: benh.moTa,
          trieuchung: benh.trieuchung || [],
          nguyenNhan: benh.nguyenNhan,
          phuongPhapDieuTri: benh.phuongPhapDieuTri,
          baiThuocLienQuan: baiThuocIds.length > 0 ? baiThuocIds : undefined
        },
        { upsert: true, new: true }
      );

      if (doc) {
        results.push({
          ten: doc.ten,
          baiThuocLienQuan: Array.isArray(doc.baiThuocLienQuan) ? doc.baiThuocLienQuan.length : 0
        });
      }
    }

    const total = await Benh.countDocuments({});
    
    return NextResponse.json({ 
      ok: true, 
      seeded: results.length,
      total,
      message: `Đã seed thành công ${results.length} bệnh YHCT!`,
      sample: results.slice(0, 5)
    });
  } catch (e: any) {
    console.error("[seed/benh-80-yhct]", e);
    return NextResponse.json({ 
      error: e?.message || "Internal error",
      details: e?.stack
    }, { status: 500 });
  }
}





