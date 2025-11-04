import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Benh, BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DiseaseSeed = {
  ten: string;
  moTa?: string;
  trieuchung?: string[];
  nguyenNhan?: string;
  phuongPhapDieuTri?: string;
};

const COMMON_DISEASES: DiseaseSeed[] = [
  {
    ten: "Cảm cúm",
    moTa: "Bệnh đường hô hấp do virus, thường gặp theo mùa.",
    trieuchung: ["Sốt nhẹ", "Nhức đầu", "Đau họng", "Chảy nước mũi"],
    nguyenNhan: "Nhiễm virus cúm, lây qua đường hô hấp.",
    phuongPhapDieuTri: "Nghỉ ngơi, uống nhiều nước, bổ sung vitamin C; theo dõi và dùng thuốc theo chỉ định."
  },
  {
    ten: "Ho",
    moTa: "Phản xạ tống dị vật hoặc dịch tiết ở đường thở.",
    trieuchung: ["Ho khan", "Ho có đờm", "Cổ họng ngứa"],
    nguyenNhan: "Nhiễm khuẩn, viêm phế quản, kích ứng do bụi khói.",
    phuongPhapDieuTri: "Giảm ho, long đờm; bổ sung nước ấm và chú ý điều kiện môi trường."
  },
  {
    ten: "Viêm họng",
    moTa: "Viêm niêm mạc họng do virus hoặc vi khuẩn.",
    trieuchung: ["Đau rát họng", "Khó nuốt", "Sốt nhẹ"],
    nguyenNhan: "Nhiễm virus/vi khuẩn, thay đổi thời tiết, tiếp xúc lạnh.",
    phuongPhapDieuTri: "Súc họng nước muối, giữ ấm, dùng thuốc theo hướng dẫn y tế."
  },
  {
    ten: "Đau dạ dày",
    moTa: "Đau vùng thượng vị, kèm rối loạn tiêu hóa.",
    trieuchung: ["Đau âm ỉ", "Chướng bụng", "Ợ chua"],
    nguyenNhan: "Viêm dạ dày, loét, stress, chế độ ăn uống không hợp lý.",
    phuongPhapDieuTri: "Chia nhỏ bữa ăn, tránh cay nóng, dùng thuốc giảm acid theo chỉ định."
  },
  {
    ten: "Tiêu chảy",
    moTa: "Đi ngoài phân lỏng nhiều lần trong ngày.",
    trieuchung: ["Đau quặn bụng", "Mất nước", "Mệt mỏi"],
    nguyenNhan: "Nhiễm khuẩn đường ruột, thức ăn nhiễm bẩn hoặc không phù hợp.",
    phuongPhapDieuTri: "Bù nước và điện giải, vệ sinh an toàn thực phẩm; theo dõi triệu chứng."
  },
  {
    ten: "Mất ngủ",
    moTa: "Khó đi vào giấc ngủ hoặc ngủ không sâu.",
    trieuchung: ["Khó ngủ", "Thức giấc sớm", "Mệt mỏi ban ngày"],
    nguyenNhan: "Căng thẳng, thói quen sinh hoạt, rối loạn nhịp sinh học.",
    phuongPhapDieuTri: "Điều chỉnh thói quen ngủ, thư giãn, tham vấn chuyên gia khi cần."
  },
  {
    ten: "Cao huyết áp",
    moTa: "Huyết áp cao kéo dài, tăng nguy cơ biến chứng tim mạch.",
    trieuchung: ["Đau đầu", "Chóng mặt", "Mờ mắt"],
    nguyenNhan: "Di truyền, lối sống, chế độ ăn nhiều muối.",
    phuongPhapDieuTri: "Giảm muối, tập luyện, theo dõi huyết áp; dùng thuốc theo chỉ định."
  },
  {
    ten: "Tiểu đường type 2",
    moTa: "Rối loạn chuyển hóa đường huyết do kháng insulin.",
    trieuchung: ["Khát nước", "Tiểu nhiều", "Sụt cân"],
    nguyenNhan: "Lối sống ít vận động, thừa cân, yếu tố di truyền.",
    phuongPhapDieuTri: "Kiểm soát chế độ ăn, tăng vận động, theo dõi đường huyết thường xuyên."
  }
];

function keywordForDisease(name: string): RegExp {
  const k = name.toLowerCase();
  const map: Record<string, string[]> = {
    "cảm cúm": ["cảm", "cúm", "giải biểu"],
    "ho": ["ho", "hóa đàm", "chỉ khái"],
    "viêm họng": ["họng", "viêm họng", "thanh nhiệt"],
    "đau dạ dày": ["dạ dày", "vị", "tỳ vị"],
    "tiêu chảy": ["tiêu chảy", "lợi thủy", "tràng"],
    "mất ngủ": ["mất ngủ", "an thần", "định tâm"],
    "cao huyết áp": ["huyết áp", "huyết", "hoạt huyết"],
    "tiểu đường": ["tiểu đường", "đường huyết", "đái tháo đường"],
  };
  const keys = Object.entries(map).find(([p]) => k.includes(p))?.[1] || [name];
  return new RegExp(keys.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    // optionally reset existing diseases
    const url = new URL(req.url);
    const reset = url.searchParams.get("reset") === "true";
    if (reset) {
      await Benh.deleteMany({});
    }

    const results: any[] = [];

    for (const d of COMMON_DISEASES) {
      // find related remedies by keywords
      const kw = keywordForDisease(d.ten);
      const related = await BaiThuoc.find({ $or: [{ ten: kw }, { moTa: kw }, { congDung: kw }] })
        .select("_id")
        .limit(3)
        .lean();
      const baiThuocIds = related.map(r => r._id);

      const doc = await Benh.findOneAndUpdate(
        { ten: d.ten },
        {
          $set: {
            moTa: d.moTa || "",
            trieuchung: d.trieuchung || [],
            nguyenNhan: d.nguyenNhan || "",
            phuongPhapDieuTri: d.phuongPhapDieuTri || "",
          },
          $addToSet: {
            baiThuocLienQuan: { $each: baiThuocIds }
          }
        },
        { upsert: true, new: true }
      );

      if (doc) {
        results.push({ ten: (doc as any).ten, baiThuocLienQuan: (doc as any).baiThuocLienQuan });
      }
    }

    const total = await Benh.countDocuments({});
    return NextResponse.json({ ok: true, seeded: results.length, total, results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}