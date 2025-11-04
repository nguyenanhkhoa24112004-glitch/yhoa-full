import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SeedItem = {
  ten: string;
  tenKhoaHoc?: string;
  vi?: string[];
  tinh?: string[];
  quyKinh?: string[];
  nhom?: string[];
};

const SEED_30: SeedItem[] = [
  // Giải biểu
  { ten: "Ma hoàng", tenKhoaHoc: "Ephedra sinica", vi: ["cay"], tinh: ["on"], quyKinh: ["phe", "bangQuang"], nhom: ["giaiBieu"] },
  { ten: "Bạc hà", tenKhoaHoc: "Mentha piperita", vi: ["cay"], tinh: ["luong"], quyKinh: ["phe", "can"], nhom: ["giaiBieu"] },
  { ten: "Kinh giới", tenKhoaHoc: "Elsholtzia ciliata", vi: ["cay"], tinh: ["on"], quyKinh: ["phe", "can"], nhom: ["giaiBieu"] },
  { ten: "Tía tô", tenKhoaHoc: "Perilla frutescens", vi: ["cay"], tinh: ["on"], quyKinh: ["phe", "ty"], nhom: ["giaiBieu"] },
  { ten: "Gừng", tenKhoaHoc: "Zingiber officinale", vi: ["cay"], tinh: ["on"], quyKinh: ["ty", "vi", "phe"], nhom: ["giaiBieu"] },

  // Thanh nhiệt
  { ten: "Kim ngân hoa", tenKhoaHoc: "Lonicera japonica", vi: ["dang"], tinh: ["han"], quyKinh: ["phe", "vi"], nhom: ["thanhNhiet"] },
  { ten: "Liên kiều", tenKhoaHoc: "Forsythia suspensa", vi: ["dang"], tinh: ["han"], quyKinh: ["tam", "tieuTruong"], nhom: ["thanhNhiet"] },
  { ten: "Hoàng liên", tenKhoaHoc: "Coptis chinensis", vi: ["dang"], tinh: ["han"], quyKinh: ["tam", "can", "vi"], nhom: ["thanhNhiet"] },
  { ten: "Bồ công anh", tenKhoaHoc: "Taraxacum officinale", vi: ["dang"], tinh: ["han"], quyKinh: ["can", "vi"], nhom: ["thanhNhiet"] },
  { ten: "Diếp cá", tenKhoaHoc: "Houttuynia cordata", vi: ["dang"], tinh: ["han"], quyKinh: ["phe", "daiTruong"], nhom: ["thanhNhiet"] },

  // Hoạt huyết
  { ten: "Xuyên khung", tenKhoaHoc: "Ligusticum chuanxiong", vi: ["cay"], tinh: ["on"], quyKinh: ["can", "dam"], nhom: ["hoatHuyet"] },
  { ten: "Đan sâm", tenKhoaHoc: "Salvia miltiorrhiza", vi: ["dang"], tinh: ["binh"], quyKinh: ["tam", "can"], nhom: ["hoatHuyet"] },
  { ten: "Nghệ", tenKhoaHoc: "Curcuma longa", vi: ["cay", "dang"], tinh: ["on"], quyKinh: ["ty", "can"], nhom: ["hoatHuyet"] },
  { ten: "Hồng hoa", tenKhoaHoc: "Carthamus tinctorius", vi: ["cay"], tinh: ["on"], quyKinh: ["tam", "can"], nhom: ["hoatHuyet"] },
  { ten: "Ích mẫu", tenKhoaHoc: "Leonurus japonicus", vi: ["cay", "dang"], tinh: ["luong"], quyKinh: ["tam", "can", "bangQuang"], nhom: ["hoatHuyet"] },

  // Bổ khí
  { ten: "Nhân sâm", tenKhoaHoc: "Panax ginseng", vi: ["ngot"], tinh: ["on"], quyKinh: ["ty", "phe"], nhom: ["boKhi"] },
  { ten: "Hoàng kỳ", tenKhoaHoc: "Astragalus membranaceus", vi: ["ngot"], tinh: ["on"], quyKinh: ["ty", "phe"], nhom: ["boKhi"] },
  { ten: "Đảng sâm", tenKhoaHoc: "Codonopsis pilosula", vi: ["ngot"], tinh: ["on"], quyKinh: ["ty", "phe"], nhom: ["boKhi"] },
  { ten: "Cam thảo", tenKhoaHoc: "Glycyrrhiza uralensis", vi: ["ngot"], tinh: ["binh"], quyKinh: ["ty", "phe", "tam"], nhom: ["boKhi"] },
  { ten: "Đinh lăng", tenKhoaHoc: "Polyscias fruticosa", vi: ["ngot", "dang"], tinh: ["on"], quyKinh: ["ty", "can"], nhom: ["boKhi"] },

  // Bổ huyết
  { ten: "Đương quy", tenKhoaHoc: "Angelica sinensis", vi: ["ngot", "cay"], tinh: ["on"], quyKinh: ["tam", "can"], nhom: ["boHuyet"] },
  { ten: "Thục địa", tenKhoaHoc: "Rehmannia glutinosa", vi: ["ngot"], tinh: ["binh"], quyKinh: ["can", "than"], nhom: ["boHuyet"] },
  { ten: "Táo tàu", tenKhoaHoc: "Ziziphus jujuba", vi: ["ngot"], tinh: ["binh"], quyKinh: ["ty", "vi"], nhom: ["boKhi", "boHuyet"] },
  { ten: "Long nhãn", tenKhoaHoc: "Dimocarpus longan", vi: ["ngot"], tinh: ["binh"], quyKinh: ["tam", "ty"], nhom: ["boHuyet"] },
  { ten: "Hà thủ ô", tenKhoaHoc: "Fallopia multiflora", vi: ["chat", "ngot"], tinh: ["on"], quyKinh: ["can", "than"], nhom: ["boHuyet"] },

  // Bổ âm
  { ten: "Mạch môn", tenKhoaHoc: "Ophiopogon japonicus", vi: ["ngot"], tinh: ["han"], quyKinh: ["tam", "phe"], nhom: ["boAm"] },
  { ten: "Kỷ tử", tenKhoaHoc: "Lycium barbarum", vi: ["ngot"], tinh: ["binh"], quyKinh: ["can", "than"], nhom: ["boAm"] },
  { ten: "Mè đen", tenKhoaHoc: "Sesamum indicum", vi: ["ngot"], tinh: ["binh"], quyKinh: ["can", "than"], nhom: ["boAm"] },
  { ten: "Thiên môn đông", tenKhoaHoc: "Asparagus cochinchinensis", vi: ["ngot"], tinh: ["han"], quyKinh: ["phế", "thận"].map(k=>({"phe":"phe","than":"than"} as any)[k]) as string[] , nhom: ["boAm"] },
  { ten: "Sa sâm", tenKhoaHoc: "Glehnia littoralis", vi: ["ngot"], tinh: ["han"], quyKinh: ["phe", "vi"], nhom: ["boAm"] },
];

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const resetParam = url.searchParams.get("reset");
    const reset = resetParam === "true";

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    if (reset) {
      await DuocLieu.deleteMany({});
    }

    const docs = SEED_30.map((h) => ({
      ten: h.ten,
      tenKhoaHoc: h.tenKhoaHoc || "",
      vi: h.vi || [],
      tinh: h.tinh || [],
      quyKinh: h.quyKinh || [],
      nhom: h.nhom || [],
    }));

    let inserted = 0;
    for (const d of docs) {
      await DuocLieu.updateOne({ ten: d.ten }, { $setOnInsert: d }, { upsert: true });
      inserted++;
    }

    return NextResponse.json({ inserted });
  } catch (err: any) {
    console.error("[seed/duoc-lieu-30]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}