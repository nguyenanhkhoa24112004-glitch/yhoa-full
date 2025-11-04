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

// 50 bệnh bổ sung về y học cổ truyền
const SEED_50_EXTRA: DiseaseSeed[] = [
  { ten: "Huyết áp thấp", moTa: "Huyết áp dưới mức bình thường.", trieuchung: ["Chóng mặt", "Choáng váng", "Mệt mỏi"], nguyenNhan: "Khí huyết hư, tỳ vị suy", phuongPhapDieuTri: "Bổ khí dưỡng huyết, tăng cường dinh dưỡng" },
  { ten: "Rối loạn mỡ máu", moTa: "Cholesterol hoặc triglyceride cao.", trieuchung: ["Mệt mỏi", "Đầu đau", "Khó thở khi gắng sức"], nguyenNhan: "Ăn uống nhiều mỡ, rượu, ít vận động", phuongPhapDieuTri: "Giảm mỡ, hoạt huyết khử đàm" },
  { ten: "Rối loạn nhịp tim", moTa: "Tim đập không đều, nhanh hoặc chậm.", trieuchung: ["Hồi hộp", "Chóng mặt", "Khó thở"], nguyenNhan: "Tâm khí hư, âm huyết hao tổn", phuongPhapDieuTri: "An thần định tâm, dưỡng âm bổ khí" },
  { ten: "Suy giảm trí nhớ", moTa: "Kém nhớ, lú lẫn nhẹ.", trieuchung: ["Quên đãng", "Mất tập trung", "Mệt mỏi đầu óc"], nguyenNhan: "Thận khí yếu, não tủy suy", phuongPhapDieuTri: "Bổ thận ích trí, dưỡng não" },
  { ten: "Ù tai", moTa: "Cảm giác tiếng ù trong tai.", trieuchung: ["Ù tai", "Nghe kém", "Chóng mặt"], nguyenNhan: "Thận khí yếu, can hỏa thăng", phuongPhapDieuTri: "Bổ thận, lý thấp" },
  { ten: "Giảm thị lực", moTa: "Mắt mờ, không rõ.", trieuchung: ["Mờ mắt", "Khô mắt", "Mỏi mắt"], nguyenNhan: "Can huyết hư, thận âm hư", phuongPhapDieuTri: "Bổ can thận, dưỡng âm sáng mắt" },
  { ten: "Đau mắt đỏ", moTa: "Viêm kết mạc do virus.", trieuchung: ["Đỏ mắt", "Ngứa rát", "Chảy nước"], nguyenNhan: "Phong nhiệt thượng công", phuongPhapDieuTri: "Thanh nhiệt, tiêu sưng" },
  { ten: "Viêm xương khớp", moTa: "Sưng đau khớp do viêm.", trieuchung: ["Sưng khớp", "Đau nhức", "Cứng khớp"], nguyenNhan: "Phong thấp tà, khí huyết ứ trệ", phuongPhapDieuTri: "Trừ phong thấp, hoạt huyết" },
  { ten: "Thoát vị đĩa đệm", moTa: "Đĩa đệm lồi ra khỏi vị trí.", trieuchung: ["Đau lưng dữ dội", "Tê chân", "Yếu cơ"], nguyenNhan: "Chấn thương, tải trọng", phuongPhapDieuTri: "Thư cân hoạt lạc, bổ thận cường gân" },
  { ten: "Loãng xương nhẹ", moTa: "Xương mỏng, dễ gãy.", trieuchung: ["Đau nhức xương", "Giảm chiều cao", "Gãy dễ"], nguyenNhan: "Thận khí hư, can huyết kém", phuongPhapDieuTri: "Bổ thận cốt, dưỡng âm" },
  { ten: "Đau do phong thấp", moTa: "Đau cơ xương do thấp nhiệt.", trieuchung: ["Đau nhức khắp người", "Sưng", "Cứng"], nguyenNhan: "Phong thấp khí", phuongPhapDieuTri: "Trừ thấp, khử phong" },
  { ten: "Đau cổ vai cánh tay", moTa: "Đau lan từ cổ xuống tay.", trieuchung: ["Tê tay", "Đau cổ", "Yếu tay"], nguyenNhan: "Kinh lạc tắc", phuongPhapDieuTri: "Thông lạc, hoạt huyết" },
  { ten: "Chuột rút", moTa: "Co cơ đau đột ngột.", trieuchung: ["Co cứng", "Đau dữ dội"], nguyenNhan: "Thiếu canxi, máu tuần hoàn kém", phuongPhapDieuTri: "Bổ can thận, thư cân" },
  { ten: "Đau nhức toàn thân", moTa: "Đau mỏi cơ khắp người.", trieuchung: ["Mệt mỏi", "Đau cơ", "Cứng"], nguyenNhan: "Khí huyết hư, phong hàn", phuongPhapDieuTri: "Bổ khí huyết, trừ hàn" },
  { ten: "Thoái hóa khớp háng", moTa: "Khớp háng bị mòn, đau.", trieuchung: ["Đau háng", "Đi khập khiễng", "Cứng"], nguyenNhan: "Lão hóa, tải trọng", phuongPhapDieuTri: "Ôn bổ thận, hoạt huyết" },
  { ten: "Tróc da chân", moTa: "Da chân nứt tróc.", trieuchung: ["Nứt nẻ", "Ngứa", "Khô"], nguyenNhan: "Phong thấp, khô", phuongPhapDieuTri: "Dưỡng ẩm, thanh nhiệt" },
  { ten: "Chân tay lạnh", moTa: "Tay chân lạnh ngắt.", trieuchung: ["Lạnh", "Tê", "Nhợt"], nguyenNhan: "Dương khí hư, huyết hàn", phuongPhapDieuTri: "Ôn kinh, bổ khí" },
  { ten: "Phù chân nhẹ", moTa: "Chân sưng tích nước.", trieuchung: ["Sưng", "Căng", "Nặng"], nguyenNhan: "Tỳ thận khí hư", phuongPhapDieuTri: "Kiện tỳ lợi thủy" },
  { ten: "Tiểu ra máu", moTa: "Nước tiểu có máu.", trieuchung: ["Đỏ nước tiểu", "Đau", "Sốt nhẹ"], nguyenNhan: "Nhiệt độc, viêm", phuongPhapDieuTri: "Thanh nhiệt lợi niệu" },
  { ten: "Tiểu buốt", moTa: "Đau buốt khi tiểu.", trieuchung: ["Đau rát", "Tiểu dắt", "Tiểu nhiều"], nguyenNhan: "Bàng quang nhiệt", phuongPhapDieuTri: "Thanh nhiệt thông lâm" },
  { ten: "Viêm đường tiết niệu", moTa: "Nhiễm khuẩn đường tiểu.", trieuchung: ["Tiểu đau", "Nóng rát", "Khó chịu"], nguyenNhan: "Thấp nhiệt", phuongPhapDieuTri: "Thanh nhiệt giải độc" },
  { ten: "Liệt dương nhẹ", moTa: "Yếu sinh lý.", trieuchung: ["Giảm ham muốn", "Yếu", "Mệt"], nguyenNhan: "Thận khí hư, dương hư", phuongPhapDieuTri: "Bổ thận tráng dương" },
  { ten: "Xuất tinh sớm", moTa: "Khó kiểm soát xuất tinh.", trieuchung: ["Xuất tinh nhanh", "Căng thẳng"], nguyenNhan: "Thận không cố nhiếp", phuongPhapDieuTri: "Bổ thận cố tinh" },
  { ten: "Kinh nguyệt không đều", moTa: "Chu kỳ kinh thay đổi.", trieuchung: ["Chậm", "Sớm", "Số lượng thay đổi"], nguyenNhan: "Can khí uất, huyết hư", phuongPhapDieuTri: "Điều can, bổ huyết" },
  { ten: "Đau bụng kinh", moTa: "Đau bụng khi hành kinh.", trieuchung: ["Quặn bụng", "Đau lưng", "Buồn nôn"], nguyenNhan: "Khí huyết ứ trệ", phuongPhapDieuTri: "Hoạt huyết, thông kinh" },
  { ten: "Kinh nguyệt ra nhiều", moTa: "Lượng máu kinh nhiều.", trieuchung: ["Ra nhiều", "Đau", "Mệt"], nguyenNhan: "Khí hư không cố", phuongPhapDieuTri: "Bổ khí chỉ huyết" },
  { ten: "Kinh nguyệt ra ít", moTa: "Lượng máu kinh ít.", trieuchung: ["Ra ít", "Màu nhạt"], nguyenNhan: "Huyết hư, thận âm hư", phuongPhapDieuTri: "Bổ huyết dưỡng âm" },
  { ten: "Kinh nguyệt ra ít", moTa: "Lượng máu kinh ít.", trieuchung: ["Ra ít", "Màu nhạt"], nguyenNhan: "Huyết hư, thận âm hư", phuongPhapDieuTri: "Bổ huyết dưỡng âm" },
  { ten: "Khô rát âm đạo", moTa: "Âm đạo khô, rát.", trieuchung: ["Khô", "Đau khi giao hợp"], nguyenNhan: "Âm hư", phuongPhapDieuTri: "Dưỡng âm, nhuận táo" },
  { ten: "Ngứa âm đạo", moTa: "Ngứa rát âm đạo.", trieuchung: ["Ngứa", "Rát", "Khí hư"], nguyenNhan: "Thấp nhiệt", phuongPhapDieuTri: "Thanh nhiệt, trừ thấp" },
  { ten: "Viêm đường tiểu nữ", moTa: "Viêm tiết niệu nữ.", trieuchung: ["Tiểu buốt", "Ngứa"], nguyenNhan: "Vệ sinh kém, nhiễm khuẩn", phuongPhapDieuTri: "Thanh nhiệt lợi niệu" },
  { ten: "Da khô nẻ", moTa: "Da khô tróc vảy.", trieuchung: ["Nứt nẻ", "Khô"], nguyenNhan: "Huyết táo", phuongPhapDieuTri: "Dưỡng huyết, nhuận phế" },
  { ten: "Mụn cóc", moTa: "Nốt mụn sần da.", trieuchung: ["Mụn sần", "Nổi"], nguyenNhan: "Virus HPV", phuongPhapDieuTri: "Thanh nhiệt, khử đàm" },
  { ten: "Nốt ruồi", moTa: "Nốt sắc tố đen.", trieuchung: ["Nốt đen", "Không đau"], nguyenNhan: "Bẩm sinh", phuongPhapDieuTri: "Theo dõi, không cần điều trị" },
  { ten: "Tăng sắc tố da", moTa: "Da sẫm màu loang lổ.", trieuchung: ["Mảng sẫm", "Không đều"], nguyenNhan: "Ánh nắng, rối loạn nội tiết", phuongPhapDieuTri: "Kiện tỳ hóa thấp" },
  { ten: "Tóc bạc sớm", moTa: "Tóc bạc trước tuổi.", trieuchung: ["Tóc bạc", "Yếu tóc"], nguyenNhan: "Thận khí hư, can huyết hư", phuongPhapDieuTri: "Bổ thận, dưỡng huyết" },
  { ten: "Gãy tóc", moTa: "Tóc dễ gãy, yếu.", trieuchung: ["Tóc yếu", "Gãy"], nguyenNhan: "Huyết hư, thận khí yếu", phuongPhapDieuTri: "Bổ huyết, ích tinh" },
  { ten: "Rụng móng", moTa: "Móng dễ gãy, rụng.", trieuchung: ["Móng yếu", "Dễ gãy"], nguyenNhan: "Can huyết hư", phuongPhapDieuTri: "Dưỡng can huyết" },
  { ten: "Khô miệng", moTa: "Miệng khô, ít nước bọt.", trieuchung: ["Khô", "Khát"], nguyenNhan: "Âm hư", phuongPhapDieuTri: "Sinh tân dưỡng âm" },
  { ten: "Đắng miệng", moTa: "Vị đắng trong miệng.", trieuchung: ["Đắng", "Khó chịu"], nguyenNhan: "Đởm nhiệt", phuongPhapDieuTri: "Thanh đởm nhiệt" },
  { ten: "Hôi miệng nhẹ", moTa: "Mùi khó chịu vùng miệng.", trieuchung: ["Mùi", "Vệ sinh kém"], nguyenNhan: "Vị nhiệt, răng lợi", phuongPhapDieuTri: "Thanh vị, vệ sinh" },
  { ten: "Chảy máu chân răng", moTa: "Máu chảy khi đánh răng.", trieuchung: ["Chảy máu", "Viêm lợi"], nguyenNhan: "Viêm lợi, thiếu vitamin C", phuongPhapDieuTri: "Thanh nhiệt, cầm huyết" },
  { ten: "Sâu răng", moTa: "Men răng bị phá hủy.", trieuchung: ["Đau răng", "Lỗ sâu"], nguyenNhan: "Vệ sinh kém, vi khuẩn", phuongPhapDieuTri: "Vệ sinh, trám răng" },
  { ten: "Lở loét miệng", moTa: "Nhiệt miệng, loét.", trieuchung: ["Loét", "Đau khi ăn"], nguyenNhan: "Vị tích nhiệt", phuongPhapDieuTri: "Thanh nhiệt, sinh tân" },
  { ten: "Nứt da gót chân", moTa: "Gót chân nứt nẻ.", trieuchung: ["Nứt", "Đau"], nguyenNhan: "Khô da, thiếu dưỡng chất", phuongPhapDieuTri: "Dưỡng ẩm, nhuận" },
  { ten: "Ngứa toàn thân", moTa: "Ngứa da lan tỏa.", trieuchung: ["Ngứa", "Gãi nhiều"], nguyenNhan: "Phong thấp, nội nhiệt", phuongPhapDieuTri: "Trừ phong, thanh nhiệt" }
];

function keywordForDisease(name: string): RegExp {
  const k = name.toLowerCase();
  const map: Record<string, string[]> = {
    "huyết áp": ["huyết áp", "huyết"],
    "mỡ máu": ["mỡ máu", "cholesterol"],
    "tim": ["tim", "tâm", "hồi hộp"],
    "trí nhớ": ["trí nhớ", "não", "đầu"],
    "tai": ["tai", "thận"],
    "mắt": ["mắt", "can", "can huyết"],
    "khớp": ["khớp", "phong thấp"],
    "lưng": ["lưng", "thận", "thắt lưng"],
    "xương": ["xương", "thận cốt"],
    "phong thấp": ["phong thấp", "trừ phong"],
    "cổ vai": ["cổ", "vai", "kinh lạc"],
    "chuột rút": ["chuột rút", "can thận"],
    "háng": ["khớp háng", "thận"],
    "chân": ["chân", "thận", "tỳ"],
    "tiểu": ["tiểu", "thận", "bàng quang"],
    "tiết niệu": ["tiết niệu", "thận", "niệu đạo"],
    "liệt dương": ["sinh lý", "thận dương"],
    "xuất tinh": ["tinh", "thận"],
    "kinh nguyệt": ["kinh", "huyết", "can", "bổ huyết"],
    "đau bụng kinh": ["kinh", "đau", "khí huyết"],
    "âm đạo": ["âm", "phụ nữ", "dưỡng âm"],
    "tiểu nữ": ["tiểu", "phụ nữ"],
    "da khô": ["da khô", "phế", "huyết táo"],
    "mụn cóc": ["mụn", "da", "thanh nhiệt"],
    "sắc tố": ["da", "tỳ"],
    "tóc": ["tóc", "thận", "huyết"],
    "móng": ["móng", "can huyết"],
    "miệng": ["miệng", "tỳ vị", "âm"],
    "răng": ["răng", "thận", "can"],
    "nứt gót": ["chân", "da", "dưỡng ẩm"],
    "ngứa": ["phong", "thấp", "nhiệt"]
  };
  const keys = Object.entries(map).find(([p]) => k.includes(p))?.[1] || [name];
  return new RegExp(keys.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const results: any[] = [];
    for (const d of SEED_50_EXTRA) {
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
        results.push({ ten: (doc as any).ten, baiThuocLienQuan: (doc as any).baiThuocLienQuan?.length || 0 });
      }
    }

    const total = await Benh.countDocuments({});
    return NextResponse.json({ ok: true, seeded: results.length, total, results: results.slice(0, 5) });
  } catch (e: any) {
    console.error("[seed/benh-50-extra]", e);
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
