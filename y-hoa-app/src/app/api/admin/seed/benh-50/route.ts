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

// 50 bệnh thường gặp, mô tả ngắn gọn để demo giao diện
const SEED_50: DiseaseSeed[] = [
  { ten: "Cảm lạnh", moTa: "Nhiễm lạnh gây ho, sổ mũi.", trieuchung: ["Hắt hơi", "Chảy mũi", "Ho nhẹ"], nguyenNhan: "Thời tiết lạnh, nhiễm virus", phuongPhapDieuTri: "Giữ ấm, uống ấm, nghỉ ngơi" },
  { ten: "Cảm nóng", moTa: "Nhiệt tà gây sốt, khát.", trieuchung: ["Sốt", "Khát", "Đổ mồ hôi"], nguyenNhan: "Nhiệt tà xâm nhập", phuongPhapDieuTri: "Thanh nhiệt, bổ sung nước" },
  { ten: "Viêm mũi dị ứng", moTa: "Phản ứng dị ứng đường mũi.", trieuchung: ["Hắt hơi", "Nghẹt mũi", "Ngứa mũi"], nguyenNhan: "Phấn hoa, bụi", phuongPhapDieuTri: "Tránh dị nguyên, rửa mũi" },
  { ten: "Viêm xoang", moTa: "Viêm các xoang mặt.", trieuchung: ["Đau mặt", "Nghẹt mũi", "Chảy dịch"], nguyenNhan: "Nhiễm khuẩn, cơ địa dị ứng", phuongPhapDieuTri: "Giảm viêm, thông xoang" },
  { ten: "Viêm phế quản cấp", moTa: "Viêm đường thở cấp.", trieuchung: ["Ho", "Đờm", "Sốt nhẹ"], nguyenNhan: "Virus/vi khuẩn", phuongPhapDieuTri: "Nghỉ ngơi, long đờm" },
  { ten: "Viêm phế quản mạn", moTa: "Ho kéo dài, tăng tiết nhầy.", trieuchung: ["Ho kéo dài", "Khó thở", "Đờm"], nguyenNhan: "Kích ứng lâu dài", phuongPhapDieuTri: "Giảm ho, cải thiện môi trường" },
  { ten: "Hen phế quản", moTa: "Co thắt đường thở từng cơn.", trieuchung: ["Khò khè", "Khó thở", "Ho về đêm"], nguyenNhan: "Dị ứng, viêm mạn tính", phuongPhapDieuTri: "Giãn phế quản, tránh dị nguyên" },
  { ten: "Viêm phổi nhẹ", moTa: "Tổn thương nhu mô phổi.", trieuchung: ["Sốt", "Ho", "Đau ngực"], nguyenNhan: "Nhiễm khuẩn", phuongPhapDieuTri: "Kháng viêm theo chỉ định" },
  { ten: "Sốt siêu vi", moTa: "Sốt do virus, hay gặp ở trẻ.", trieuchung: ["Sốt", "Mệt", "Đau đầu"], nguyenNhan: "Nhiễm virus", phuongPhapDieuTri: "Nghỉ ngơi, hạ sốt" },
  { ten: "Đau đầu căng thẳng", moTa: "Đau mỏi vùng trán/đỉnh đầu.", trieuchung: ["Căng đầu", "Mỏi cổ", "Giảm tập trung"], nguyenNhan: "Stress, sai tư thế", phuongPhapDieuTri: "Thư giãn, xoa bóp" },
  { ten: "Đau nửa đầu", moTa: "Migraine từng cơn.", trieuchung: ["Buồn nôn", "Nhạy sáng", "Đau một bên"], nguyenNhan: "Mạch máu thần kinh", phuongPhapDieuTri: "Điều chỉnh lối sống" },
  { ten: "Chóng mặt", moTa: "Choáng váng, quay cuồng.", trieuchung: ["Hoa mắt", "Mất thăng bằng"], nguyenNhan: "Tiền đình, huyết áp", phuongPhapDieuTri: "Nghỉ ngơi, tập thăng bằng" },
  { ten: "Rối loạn tiền đình", moTa: "Rối loạn cảm giác thăng bằng.", trieuchung: ["Chóng mặt", "Ù tai", "Buồn nôn"], nguyenNhan: "Viêm/thiểu năng tuần hoàn", phuongPhapDieuTri: "Luyện tập, tăng tuần hoàn" },
  { ten: "Đau lưng", moTa: "Đau vùng thắt lưng.", trieuchung: ["Cứng lưng", "Đau khi cúi"], nguyenNhan: "Căng cơ, thoái hóa", phuongPhapDieuTri: "Chườm ấm, xoa bóp" },
  { ten: "Thoái hóa cột sống", moTa: "Thoái hóa đốt sống.", trieuchung: ["Đau lưng", "Cứng cổ"], nguyenNhan: "Tuổi tác, tải trọng", phuongPhapDieuTri: "Vận động nhẹ, dưỡng khớp" },
  { ten: "Đau vai gáy", moTa: "Co cứng vùng cổ vai.", trieuchung: ["Đau cổ", "Tê vai"], nguyenNhan: "Sai tư thế, lạnh", phuongPhapDieuTri: "Chườm ấm, giãn cơ" },
  { ten: "Đau khớp gối", moTa: "Đau khớp gối khi vận động.", trieuchung: ["Sưng", "Cứng gối"], nguyenNhan: "Viêm/thoái hóa", phuongPhapDieuTri: "Giảm viêm, tập phục hồi" },
  { ten: "Viêm khớp dạng thấp", moTa: "Tự miễn gây viêm khớp.", trieuchung: ["Cứng khớp", "Sưng đau"], nguyenNhan: "Tự miễn", phuongPhapDieuTri: "Giảm viêm, dưỡng chính khí" },
  { ten: "Gút", moTa: "Viêm khớp do muối urat.", trieuchung: ["Sưng đỏ", "Đau dữ dội"], nguyenNhan: "Tăng acid uric", phuongPhapDieuTri: "Điều chỉnh ăn uống" },
  { ten: "Đau thần kinh tọa", moTa: "Đau lan theo đường thần kinh tọa.", trieuchung: ["Đau mông", "Lan xuống chân"], nguyenNhan: "Thoát vị, chèn ép", phuongPhapDieuTri: "Giãn cơ, thư cân" },
  { ten: "Tê bì tay chân", moTa: "Tê, kim châm ngoại biên.", trieuchung: ["Tê", "Châm chích"], nguyenNhan: "Tuần hoàn kém", phuongPhapDieuTri: "Hoạt huyết, giữ ấm" },
  { ten: "Mất ngủ mạn tính", moTa: "Khó ngủ kéo dài.", trieuchung: ["Khó ngủ", "Mệt mỏi"], nguyenNhan: "Căng thẳng", phuongPhapDieuTri: "An thần, thư giãn" },
  { ten: "Lo âu", moTa: "Bồn chồn, hồi hộp.", trieuchung: ["Bứt rứt", "Mất ngủ"], nguyenNhan: "Stress", phuongPhapDieuTri: "Thư giãn, hít thở" },
  { ten: "Rối loạn tiêu hóa", moTa: "Đầy bụng, phân lỏng.", trieuchung: ["Đầy hơi", "Đau bụng"], nguyenNhan: "Ăn uống không điều độ", phuongPhapDieuTri: "Điều hoà tỳ vị" },
  { ten: "Táo bón", moTa: "Đi tiêu khó, ít.", trieuchung: ["Ít phân", "Khó rặn"], nguyenNhan: "Thiếu chất xơ", phuongPhapDieuTri: "Tăng chất xơ, uống nước" },
  { ten: "Trào ngược dạ dày", moTa: "Ợ nóng, chua.", trieuchung: ["Ợ chua", "Đau thượng vị"], nguyenNhan: "Tăng acid, thói quen ăn", phuongPhapDieuTri: "Chia nhỏ bữa, tránh cay" },
  { ten: "Loét dạ dày tá tràng", moTa: "Tổn thương niêm mạc.", trieuchung: ["Đau thượng vị", "Ợ chua"], nguyenNhan: "HP, thuốc", phuongPhapDieuTri: "Bảo vệ niêm mạc" },
  { ten: "Viêm đại tràng co thắt", moTa: "Đau bụng, rối loạn phân.", trieuchung: ["Đau quặn", "Phân lỏng/const"], nguyenNhan: "Tăng đáp ứng ruột", phuongPhapDieuTri: "Điều hoà tiêu hoá" },
  { ten: "Trĩ", moTa: "Giãn tĩnh mạch hậu môn.", trieuchung: ["Chảy máu", "Đau rát"], nguyenNhan: "Táo bón kéo dài", phuongPhapDieuTri: "Nhuận tràng, giảm viêm" },
  { ten: "Nhiệt miệng", moTa: "Loét niêm mạc miệng.", trieuchung: ["Đau rát", "Khó ăn"], nguyenNhan: "Thiếu vi chất, nhiệt", phuongPhapDieuTri: "Thanh nhiệt, sát khuẩn" },
  { ten: "Viêm lợi", moTa: "Sưng đau lợi.", trieuchung: ["Chảy máu", "Hôi miệng"], nguyenNhan: "Mảng bám", phuongPhapDieuTri: "Vệ sinh răng miệng" },
  { ten: "Hôi miệng", moTa: "Mùi khó chịu vùng miệng.", trieuchung: ["Khô miệng", "Mảng bám"], nguyenNhan: "Vệ sinh kém", phuongPhapDieuTri: "Súc miệng, vệ sinh" },
  { ten: "Mụn trứng cá", moTa: "Mụn ở mặt/ lưng.", trieuchung: ["Mụn viêm", "Nhờn"], nguyenNhan: "Nội tiết, vệ sinh", phuongPhapDieuTri: "Thanh nhiệt, điều hoà da" },
  { ten: "Viêm da dị ứng", moTa: "Ngứa đỏ, mảng da.", trieuchung: ["Ngứa", "Mảng đỏ"], nguyenNhan: "Tiếp xúc dị nguyên", phuongPhapDieuTri: "Giảm ngứa, dưỡng da" },
  { ten: "Mày đay", moTa: "Mảng nổi ngứa.", trieuchung: ["Phù cục bộ", "Ngứa"], nguyenNhan: "Dị ứng", phuongPhapDieuTri: "Giải độc, giảm ngứa" },
  { ten: "Á sừng", moTa: "Dày sừng, nứt nẻ.", trieuchung: ["Khô da", "Nứt"], nguyenNhan: "Cơ địa", phuongPhapDieuTri: "Dưỡng ẩm, mềm da" },
  { ten: "Nấm da", moTa: "Tổn thương do nấm.", trieuchung: ["Ngứa", "Tróc vảy"], nguyenNhan: "Nhiễm nấm", phuongPhapDieuTri: "Sát khuẩn, kháng nấm" },
  { ten: "Nấm móng", moTa: "Móng đổi màu, giòn.", trieuchung: ["Dày móng", "Giòn"], nguyenNhan: "Nấm", phuongPhapDieuTri: "Vệ sinh, kháng nấm" },
  { ten: "Chàm", moTa: "Viêm da mạn, khô ngứa.", trieuchung: ["Khô da", "Ngứa"], nguyenNhan: "Cơ địa", phuongPhapDieuTri: "Dưỡng ẩm, chống viêm" },
  { ten: "Rụng tóc", moTa: "Thưa tóc, yếu tóc.", trieuchung: ["Tóc yếu", "Thưa tóc"], nguyenNhan: "Thiếu dưỡng, stress", phuongPhapDieuTri: "Bổ huyết, dưỡng tóc" },
  { ten: "Gàu", moTa: "Vảy trắng trên da đầu.", trieuchung: ["Ngứa", "Vảy"], nguyenNhan: "Nấm men", phuongPhapDieuTri: "Vệ sinh da đầu" },
  { ten: "Đầy bụng khó tiêu", moTa: "Chậm tiêu sau ăn.", trieuchung: ["Đầy hơi", "Ợ"], nguyenNhan: "Ăn quá no", phuongPhapDieuTri: "Tiêu thực, điều khí" },
  { ten: "Buồn nôn", moTa: "Cảm giác nôn nao.", trieuchung: ["Nôn khan", "Chóng mặt"], nguyenNhan: "Tiêu hoá, tiền đình", phuongPhapDieuTri: "An vị, thư can" },
  { ten: "Say tàu xe", moTa: "Chóng mặt khi di chuyển.", trieuchung: ["Buồn nôn", "Vã mồ hôi"], nguyenNhan: "Rối loạn tiền đình", phuongPhapDieuTri: "Ổn định tiền đình" },
  { ten: "Suy nhược cơ thể", moTa: "Mệt mỏi, giảm sức.", trieuchung: ["Mệt", "Hoa mắt"], nguyenNhan: "Ốm kéo dài, dinh dưỡng kém", phuongPhapDieuTri: "Bổ khí huyết" },
  { ten: "Mồ hôi tay chân", moTa: "Ra mồ hôi nhiều.", trieuchung: ["Ướt tay", "Lạnh tay"], nguyenNhan: "Hệ thần kinh thực vật", phuongPhapDieuTri: "Điều hoà, giảm tiết" },
  { ten: "Tiểu đêm", moTa: "Đi tiểu nhiều về đêm.", trieuchung: ["Thức giấc", "Khó ngủ"], nguyenNhan: "Rối loạn tiết niệu", phuongPhapDieuTri: "Ôn thận, cố sáp" },
  { ten: "Thiếu máu nhẹ", moTa: "Hoa mắt, mệt mỏi.", trieuchung: ["Mệt", "Nhợt nhạt"], nguyenNhan: "Thiếu sắt/B12", phuongPhapDieuTri: "Bổ huyết, dưỡng âm" },
  { ten: "Suy giảm miễn dịch nhẹ", moTa: "Dễ ốm, lâu khỏe.", trieuchung: ["Mệt", "Cảm dễ"] , nguyenNhan: "Thiếu dưỡng, stress", phuongPhapDieuTri: "Kiện tỳ, bổ khí" }
];

function keywordForDisease(name: string): RegExp {
  const k = name.toLowerCase();
  const map: Record<string, string[]> = {
    "cảm lạnh": ["cảm", "giải biểu", "phong hàn"],
    "cảm nóng": ["cảm", "thanh nhiệt", "phong nhiệt"],
    "viêm mũi": ["mũi", "dị ứng"],
    "xoang": ["xoang", "mũi"],
    "viêm phế quản": ["phế", "ho", "đờm"],
    "hen": ["hen", "khò khè", "phế"],
    "đau đầu": ["đầu", "an thần"],
    "migraine": ["đau nửa đầu"],
    "tiền đình": ["tiền đình", "chóng mặt"],
    "dạ dày": ["vị", "tỳ vị"],
    "đại tràng": ["tràng", "tiêu hóa"],
    "trĩ": ["trĩ", "hậu môn"],
    "da": ["da", "ngoại khoa"],
    "rụng tóc": ["tóc", "huyết"],
  };
  const keys = Object.entries(map).find(([p]) => k.includes(p))?.[1] || [name];
  return new RegExp(keys.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
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

    const results: any[] = [];
    for (const d of SEED_50) {
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
          $addToSet: { baiThuocLienQuan: { $each: baiThuocIds } }
        },
        { upsert: true, new: true }
      );

      if (doc) {
        results.push({ ten: (doc as any).ten, baiThuocLienQuan: (doc as any).baiThuocLienQuan });
      }
    }

    const total = await Benh.countDocuments({});
    return NextResponse.json({ ok: true, seeded: results.length, total });
  } catch (e: any) {
    console.error("[seed/benh-50]", e);
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}