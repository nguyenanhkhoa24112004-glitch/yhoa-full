import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SeedItem = {
  ten: string;
  tenKhoaHoc?: string;
  nhom?: string[];
};

// 50 vị thuốc mới, không trùng với 30 vị đã seed trước đó
const SEED_50: SeedItem[] = [
  // Kiện tỳ
  { ten: "Bạch truật", tenKhoaHoc: "Atractylodes macrocephala", nhom: ["kienTy"] },
  { ten: "Cúc la mã", tenKhoaHoc: "Matricaria chamomilla", nhom: ["kienTy"] },
  { ten: "Hương thảo", tenKhoaHoc: "Rosmarinus officinalis", nhom: ["kienTy"] },
  { ten: "Oải hương", tenKhoaHoc: "Lavandula angustifolia", nhom: ["kienTy"] },
  { ten: "Hành tây", tenKhoaHoc: "Allium cepa", nhom: ["kienTy"] },

  // Lợi thủy
  { ten: "Phục linh", tenKhoaHoc: "Wolfiporia extensa", nhom: ["loiThuy"] },
  { ten: "Trạch tả", tenKhoaHoc: "Alisma orientale", nhom: ["loiThuy"] },
  { ten: "Ý dĩ", tenKhoaHoc: "Coix lacryma-jobi", nhom: ["loiThuy"] },
  { ten: "Xa tiền tử", tenKhoaHoc: "Plantago major", nhom: ["loiThuy"] },
  { ten: "Thông thảo", tenKhoaHoc: "Tetrapanax papyrifer", nhom: ["loiThuy"] },

  // Chỉ huyết
  { ten: "Cỏ tranh", tenKhoaHoc: "Imperata cylindrica", nhom: ["chiHuyet"] },
  { ten: "Huyết dụ", tenKhoaHoc: "Dracaena cochinchinensis", nhom: ["chiHuyet"] },
  { ten: "Tam thất", tenKhoaHoc: "Panax notoginseng", nhom: ["chiHuyet"] },

  // Bổ huyết / Bổ âm
  { ten: "Bạch thược", tenKhoaHoc: "Paeonia lactiflora", nhom: ["boHuyet"] },
  { ten: "Sinh địa", tenKhoaHoc: "Rehmannia glutinosa", nhom: ["boHuyet"] },

  // Thanh nhiệt
  { ten: "Sơn tra", tenKhoaHoc: "Crataegus pinnatifida", nhom: ["truDam"] },
  { ten: "Ngưu bàng", tenKhoaHoc: "Arctium lappa", nhom: ["thanhNhiet"] },
  { ten: "Mẫu đơn bì", tenKhoaHoc: "Paeonia suffruticosa", nhom: ["thanhNhiet"] },
  { ten: "Chi tử", tenKhoaHoc: "Gardenia jasminoides", nhom: ["thanhNhiet"] },
  { ten: "Hoàng bá", tenKhoaHoc: "Phellodendron amurense", nhom: ["thanhNhiet"] },
  { ten: "Tri mẫu", tenKhoaHoc: "Anemarrhena asphodeloides", nhom: ["thanhNhiet"] },
  { ten: "Thạch cao", tenKhoaHoc: "Gypsum fibrosum", nhom: ["thanhNhiet"] },
  { ten: "Lô hội", tenKhoaHoc: "Aloe vera", nhom: ["thanhNhiet"] },
  { ten: "Rau má", tenKhoaHoc: "Centella asiatica", nhom: ["thanhNhiet"] },
  { ten: "Diệp hạ châu", tenKhoaHoc: "Phyllanthus amarus", nhom: ["thanhNhiet"] },
  { ten: "Hạ khô thảo", tenKhoaHoc: "Prunella vulgaris", nhom: ["thanhNhiet"] },
  { ten: "Hoàng cầm", tenKhoaHoc: "Scutellaria baicalensis", nhom: ["thanhNhiet"] },
  { ten: "Xuyến chi", tenKhoaHoc: "Bidens pilosa", nhom: ["thanhNhiet"] },

  // Giải biểu
  { ten: "Bạch chỉ", tenKhoaHoc: "Angelica dahurica", nhom: ["giaiBieu"] },
  { ten: "Hạt tiêu đen", tenKhoaHoc: "Piper nigrum", nhom: ["giaiBieu"] },
  { ten: "Tỏi", tenKhoaHoc: "Allium sativum", nhom: ["giaiBieu"] },

  // Khu phong
  { ten: "Khương hoạt", tenKhoaHoc: "Notopterygium incisum", nhom: ["khuPhong"] },
  { ten: "Độc hoạt", tenKhoaHoc: "Angelica pubescens", nhom: ["khuPhong"] },
  { ten: "Thiên ma", tenKhoaHoc: "Gastrodia elata", nhom: ["khuPhong"] },
  { ten: "Tầm gửi", tenKhoaHoc: "Taxillus chinensis", nhom: ["khuPhong"] },
  { ten: "Ké đầu ngựa", tenKhoaHoc: "Xanthium strumarium", nhom: ["khuPhong"] },
  { ten: "Cúc tần", tenKhoaHoc: "Pluchea indica", nhom: ["khuPhong"] },

  // Trừ đàm
  { ten: "Hoắc hương", tenKhoaHoc: "Pogostemon cablin", nhom: ["truDam"] },
  { ten: "Bạch giới tử", tenKhoaHoc: "Sinapis alba", nhom: ["truDam"] },
  { ten: "Bồ kết", tenKhoaHoc: "Gleditsia sinensis", nhom: ["truDam"] },
  { ten: "Cỏ xạ hương", tenKhoaHoc: "Thymus vulgaris", nhom: ["truDam"] },
  { ten: "Thảo quả", tenKhoaHoc: "Amomum tsao-ko", nhom: ["truDam"] },
  { ten: "Sa nhân", tenKhoaHoc: "Amomum villosum", nhom: ["truDam"] },
  { ten: "Mộc hương", tenKhoaHoc: "Saussurea costus", nhom: ["truDam"] },
  { ten: "Trầu không", tenKhoaHoc: "Piper betle", nhom: ["truDam"] },

  // Hoạt huyết
  { ten: "Quế", tenKhoaHoc: "Cinnamomum cassia", nhom: ["hoatHuyet"] },
  { ten: "Đinh hương", tenKhoaHoc: "Syzygium aromaticum", nhom: ["hoatHuyet"] },
  { ten: "Hồi", tenKhoaHoc: "Illicium verum", nhom: ["hoatHuyet"] },
  { ten: "Ngưu tất", tenKhoaHoc: "Achyranthes bidentata", nhom: ["hoatHuyet"] },
  { ten: "Tam thất", tenKhoaHoc: "Panax notoginseng", nhom: ["hoatHuyet"] },
  { ten: "Nghệ đen", tenKhoaHoc: "Curcuma zedoaria", nhom: ["hoatHuyet"] },
];

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const docs = SEED_50.map((h) => ({
      ten: h.ten,
      tenKhoaHoc: h.tenKhoaHoc || "",
      vi: [],
      tinh: [],
      quyKinh: [],
      nhom: h.nhom || [],
    }));

    let inserted = 0;
    for (const d of docs) {
      await DuocLieu.updateOne({ ten: d.ten }, { $setOnInsert: d }, { upsert: true });
      inserted++;
    }

    return NextResponse.json({ inserted });
  } catch (err: any) {
    console.error("[seed/duoc-lieu-50]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}