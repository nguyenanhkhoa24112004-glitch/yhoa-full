import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXTRA_BAI_THUOC = [
  {
    ten: "An Cung Ngưu Hoàng Hoàn",
    moTa: "Bài thuốc cổ phương nổi tiếng, có tác dụng thanh nhiệt giải độc, khai khiếu tỉnh thần.",
    congDung: "Thanh nhiệt giải độc, khai khiếu tỉnh thần, trấn kinh an thần",
    thanhPhan: [
      { tenDuocLieu: "Ngưu hoàng", lieuLuong: "30g" },
      { tenDuocLieu: "Xạ hương", lieuLuong: "7.5g" },
      { tenDuocLieu: "Trân châu", lieuLuong: "15g" }
    ],
    cachBaoCheSuDung: "Làm hoàn, mỗi hoàn 3g. Uống 1 hoàn/lần, ngày 1-2 lần.",
    doiTuongSuDung: "Người lớn bị sốt cao, hôn mê, co giật",
    chuY: "Thuốc quý, cần theo dõi chặt chẽ. Thai phụ kiêng dùng.",
    nguonGoc: "Cổ phương truyền thống"
  },
  {
    ten: "Bạch Hổ Thang",
    moTa: "Bài thuốc thanh nhiệt sinh tân, chữa các chứng nhiệt bệnh.",
    congDung: "Thanh nhiệt sinh tân, trừ phiền chỉ khát",
    thanhPhan: [
      { tenDuocLieu: "Thạch cao", lieuLuong: "30g" },
      { tenDuocLieu: "Tri mẫu", lieuLuong: "9g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" },
      { tenDuocLieu: "Gạo tẻ", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Sắc nước, uống ấm. Ngày 1 thang, chia 2-3 lần.",
    doiTuongSuDung: "Người bị sốt cao, khát nước nhiều, mồ hôi nhiều",
    chuY: "Không dùng cho người tỳ vị hư hàn",
    nguonGoc: "Thương Hàn Luận"
  },
  {
    ten: "Cam Mạch Đại Táo Thang",
    moTa: "Bài thuốc bổ khí dưỡng âm, điều hòa tâm khí.",
    congDung: "Bổ khí dưỡng âm, điều hòa tâm khí, an thần định chí",
    thanhPhan: [
      { tenDuocLieu: "Cam thảo", lieuLuong: "12g" },
      { tenDuocLieu: "Tiểu mạch", lieuLuong: "15g" },
      { tenDuocLieu: "Đại táo", lieuLuong: "5 quả" }
    ],
    cachBaoCheSuDung: "Sắc nước, uống ấm. Ngày 1 thang.",
    doiTuongSuDung: "Người hay buồn bã, mất ngủ, tim đập nhanh",
    chuY: "Dùng lâu dài cần theo dõi",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Đại Thừa Khí Thang",
    moTa: "Bài thuốc hành khí chỉ thống, chữa đau bụng do khí trệ.",
    congDung: "Hành khí chỉ thống, điều khí giải uất",
    thanhPhan: [
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Hậu phác", lieuLuong: "6g" },
      { tenDuocLieu: "Chi thực", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người đau bụng do khí trệ, đầy bụng khó tiêu",
    chuY: "Khí hư thể yếu thận trọng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Ế Giao Thang",
    moTa: "Bài thuốc bổ âm thanh nhiệt, chữa mất ngủ do âm hư hỏa vượng.",
    congDung: "Bổ âm thanh nhiệt, giao thông tâm thận, an thần",
    thanhPhan: [
      { tenDuocLieu: "Hoàng liên", lieuLuong: "3g" },
      { tenDuocLieu: "Ế giao", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Sắc riêng rồi trộn lại uống. Tối trước khi ngủ.",
    doiTuongSuDung: "Người mất ngủ, bồn chồn, sốt ruột",
    chuY: "Tỳ vị hư hàn không nên dùng",
    nguonGoc: "Đan Khê Tâm Pháp"
  },
  {
    ten: "Phục Linh Hoàn",
    moTa: "Bài thuốc kiện tỳ lợi thủy, an thần định chí.",
    congDung: "Kiện tỳ lợi thủy, an thần định chí, hóa đàm",
    thanhPhan: [
      { tenDuocLieu: "Phục linh", lieuLuong: "15g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn hoặc sắc nước uống.",
    doiTuongSuDung: "Người tỳ hư ẩm trọng, phù nề, mất ngủ",
    chuY: "Âm hư nội nhiệt thận trọng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Gia Vị Tiêu Dao Tán",
    moTa: "Bài thuốc sơ can giải uất, kiện tỳ dưỡng huyết.",
    congDung: "Sơ can giải uất, kiện tỳ dưỡng huyết, điều kinh",
    thanhPhan: [
      { tenDuocLieu: "Đương quy", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch thược", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Bạc hà", lieuLuong: "3g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Phụ nữ kinh nguyệt không đều, đau bụng, stress",
    chuY: "Thai phụ thận trọng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Hoàng Liên Giải Độc Thang",
    moTa: "Bài thuốc thanh nhiệt giải độc mạnh, chữa nhiễm trùng.",
    congDung: "Thanh nhiệt giải độc, tả hỏa định kinh",
    thanhPhan: [
      { tenDuocLieu: "Hoàng liên", lieuLuong: "6g" },
      { tenDuocLieu: "Hoàng cầm", lieuLuong: "9g" },
      { tenDuocLieu: "Hoàng bá", lieuLuong: "6g" },
      { tenDuocLieu: "Chi tử", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2-3 lần.",
    doiTuongSuDung: "Người nhiễm trùng, sốt cao, viêm nhiễm",
    chuY: "Tỳ vị hư hàn kiêng dùng",
    nguonGoc: "Ngoại Khoa Chính Tông"
  },
  {
    ten: "Ích Khí Thang",
    moTa: "Bài thuốc bổ khí kiện tỳ, nâng dương khí.",
    congDung: "Bổ khí kiện tỳ, nâng dương khí, cố biểu",
    thanhPhan: [
      { tenDuocLieu: "Hoàng kỳ", lieuLuong: "15g" },
      { tenDuocLieu: "Nhân sâm", lieuLuong: "6g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người khí hư, mệt mỏi, ra mồ hôi tự nhiên",
    chuY: "Cảm mạo phát sốt tạm ngưng",
    nguonGoc: "Nội Ngoại Thương Biện Hoặc Luận"
  },
  {
    ten: "Kim Quỹ Thận Khí Hoàn",
    moTa: "Bài thuốc bổ thận dương, ôn thận hóa khí.",
    congDung: "Bổ thận dương, ôn thận hóa khí, lợi thủy tiêu phù",
    thanhPhan: [
      { tenDuocLieu: "Phụ tử", lieuLuong: "6g" },
      { tenDuocLieu: "Nhục quế", lieuLuong: "3g" },
      { tenDuocLieu: "Địa hoàng", lieuLuong: "24g" },
      { tenDuocLieu: "Sơn thù du", lieuLuong: "12g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Trạch tả", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn hoặc sắc nước uống.",
    doiTuongSuDung: "Người thận dương hư, phù nề, tiểu tiện bất lợi",
    chuY: "Âm hư hỏa vượng kiêng dùng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  }
];

export async function POST() {
  try {
    await dbConnect();
    
    let created = 0;
    let updated = 0;
    
    for (const baiThuoc of EXTRA_BAI_THUOC) {
      const existing = await BaiThuoc.findOne({ ten: baiThuoc.ten });
      if (existing) {
        await BaiThuoc.findByIdAndUpdate(existing._id, {
          ...baiThuoc,
          updatedAt: new Date()
        });
        updated++;
      } else {
        await BaiThuoc.create({
          ...baiThuoc,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        created++;
      }
    }
    
    const totalCount = await BaiThuoc.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: `Đã thêm ${created} bài thuốc mới, cập nhật ${updated} bài thuốc. Tổng số bài thuốc hiện tại: ${totalCount}`,
      stats: {
        created,
        updated,
        total: totalCount
      }
    });
    
  } catch (error) {
    console.error("Lỗi khi seed bài thuốc:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Lỗi khi seed bài thuốc",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}