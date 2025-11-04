import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LAST_2_BAI_THUOC = [
  {
    ten: "Bổ Dương Hoàn Ngũ Thang Gia Giảm",
    moTa: "Bài thuốc bổ dương hoàn ngũ cải tiến, chữa liệt nửa người sau tai biến.",
    congDung: "Bổ khí hoạt huyết, thông kinh lạc, phục hồi chức năng vận động",
    thanhPhan: [
      { tenDuocLieu: "Hoàng kỳ", lieuLuong: "120g" },
      { tenDuocLieu: "Đương quy vĩ", lieuLuong: "6g" },
      { tenDuocLieu: "Xích thược", lieuLuong: "4.5g" },
      { tenDuocLieu: "Địa long", lieuLuong: "3g" },
      { tenDuocLieu: "Xuyên khung", lieuLuong: "3g" },
      { tenDuocLieu: "Đào nhân", lieuLuong: "3g" },
      { tenDuocLieu: "Hồng hoa", lieuLuong: "3g" },
      { tenDuocLieu: "Đan sâm", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người liệt nửa người, tai biến mạch máu não, tê liệt",
    chuY: "Thai phụ kiêng dùng, xuất huyết thận trọng",
    nguonGoc: "Y Lâm Cải Thác"
  },
  {
    ten: "Định Chí Hoàn Gia Giảm",
    moTa: "Bài thuốc định chí an thần cải tiến, chữa kinh thần bất ổn.",
    congDung: "An thần định chí, kiện tỳ hóa đàm, thanh tâm trừ phiền",
    thanhPhan: [
      { tenDuocLieu: "Nhân sâm", lieuLuong: "6g" },
      { tenDuocLieu: "Phục thần", lieuLuong: "9g" },
      { tenDuocLieu: "Xương bồ", lieuLuong: "6g" },
      { tenDuocLieu: "Viễn chí", lieuLuong: "6g" },
      { tenDuocLieu: "Long cốt", lieuLuong: "12g" },
      { tenDuocLieu: "Mẫu lệ", lieuLuong: "12g" }
    ],
    cachBaoCheSuDung: "Long cốt, mẫu lệ sao trước. Tán mịn làm hoàn với mật ong.",
    doiTuongSuDung: "Người kinh thần bất ổn, mất ngủ, hay quên, hoảng sợ",
    chuY: "Cảm mạo phát sốt tạm ngưng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  }
];

export async function POST() {
  try {
    await dbConnect();
    
    let created = 0;
    let updated = 0;
    
    for (const baiThuoc of LAST_2_BAI_THUOC) {
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