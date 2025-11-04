import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FINAL_BAI_THUOC = [
  {
    ten: "Lục Vị Địa Hoàng Hoàn",
    moTa: "Bài thuốc bổ thận âm cơ bản, nổi tiếng trong YHCT.",
    congDung: "Bổ thận âm, nhuận táo, thanh hư nhiệt",
    thanhPhan: [
      { tenDuocLieu: "Thục địa hoàng", lieuLuong: "24g" },
      { tenDuocLieu: "Sơn thù du", lieuLuong: "12g" },
      { tenDuocLieu: "Sơn dược", lieuLuong: "12g" },
      { tenDuocLieu: "Trạch tả", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Mẫu đan bì", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn, mỗi lần 6-9g, ngày 2 lần.",
    doiTuongSuDung: "Người thận âm hư, chóng mặt, ù tai, yếu gối",
    chuY: "Tỳ vị hư yếu thận trọng",
    nguonGoc: "Tiểu Nhi Dược Chứng Trực Quyết"
  },
  {
    ten: "Mạch Môn Đông Thang",
    moTa: "Bài thuốc dưỡng âm nhuận phế, chữa ho khan.",
    congDung: "Dưỡng âm nhuận phế, thanh nhiệt sinh tân",
    thanhPhan: [
      { tenDuocLieu: "Mạch môn đông", lieuLuong: "15g" },
      { tenDuocLieu: "Sa sâm", lieuLuong: "9g" },
      { tenDuocLieu: "Ngọc trúc", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người ho khan, khô họng, âm hư phế táo",
    chuY: "Phong hàn cảm mạo kiêng dùng",
    nguonGoc: "Ôn Bệnh Điều Biện"
  },
  {
    ten: "Ngũ Linh Tán",
    moTa: "Bài thuốc lợi thủy thấm thấp, kiện tỳ hóa khí.",
    congDung: "Lợi thủy thấm thấp, kiện tỳ hóa khí",
    thanhPhan: [
      { tenDuocLieu: "Trạch tả", lieuLuong: "15g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "15g" },
      { tenDuocLieu: "Chu linh", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Nhục quế", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Tán mịn, mỗi lần 6g, ngày 2-3 lần, pha nước ấm uống.",
    doiTuongSuDung: "Người phù nề, tiểu tiện bất lợi, thấp trọng",
    chuY: "Âm hư nội nhiệt thận trọng",
    nguonGoc: "Thương Hàn Luận"
  },
  {
    ten: "Ô Dược Thuận Khí Tán",
    moTa: "Bài thuốc hành khí chỉ thống, chữa đau bụng kinh nguyệt.",
    congDung: "Hành khí hoạt huyết, điều kinh chỉ thống",
    thanhPhan: [
      { tenDuocLieu: "Ô dược", lieuLuong: "6g" },
      { tenDuocLieu: "Hương phụ", lieuLuong: "6g" },
      { tenDuocLieu: "Đương quy", lieuLuong: "9g" },
      { tenDuocLieu: "Xuyên khung", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Phụ nữ đau bụng kinh nguyệt, kinh nguyệt không đều",
    chuY: "Thai phụ kiêng dùng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Phình Tiêu Hoàn",
    moTa: "Bài thuốc tiêu thực hóa tích, chữa khó tiêu.",
    congDung: "Tiêu thực hóa tích, kiện vị trợ tiêu hóa",
    thanhPhan: [
      { tenDuocLieu: "Sơn tra", lieuLuong: "15g" },
      { tenDuocLieu: "Thần khúc", lieuLuong: "9g" },
      { tenDuocLieu: "Mạch nha", lieuLuong: "9g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Bán hạ", lieuLuong: "6g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn hoặc sắc nước uống.",
    doiTuongSuDung: "Người ăn nhiều khó tiêu, đầy bụng, ợ hơi",
    chuY: "Thai phụ và trẻ em thận trọng",
    nguonGoc: "Đan Khê Tâm Pháp"
  },
  {
    ten: "Quế Chi Thang",
    moTa: "Bài thuốc điều hòa doanh vệ, giải cơ phát biểu.",
    congDung: "Điều hòa doanh vệ, giải cơ phát biểu, ôn kinh thông mạch",
    thanhPhan: [
      { tenDuocLieu: "Quế chi", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch thược", lieuLuong: "9g" },
      { tenDuocLieu: "Sinh khương", lieuLuong: "9g" },
      { tenDuocLieu: "Đại táo", lieuLuong: "12 quả" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống ấm. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người cảm mạo, đau nhức cơ thể, sợ lạnh",
    chuY: "Âm hư hỏa vượng thận trọng",
    nguonGoc: "Thương Hàn Luận"
  },
  {
    ten: "Rồng Đởm Tả Gan Thang",
    moTa: "Bài thuốc thanh can tả hỏa, trấn kinh an thần.",
    congDung: "Thanh can tả hỏa, trấn kinh an thần, minh mục",
    thanhPhan: [
      { tenDuocLieu: "Long đởm", lieuLuong: "15g" },
      { tenDuocLieu: "Mẫu lệ", lieuLuong: "15g" },
      { tenDuocLieu: "Hoàng liên", lieuLuong: "6g" },
      { tenDuocLieu: "Hoàng cầm", lieuLuong: "9g" },
      { tenDuocLieu: "Chi tử", lieuLuong: "9g" },
      { tenDuocLieu: "Đại hoàng", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Long đởm, mẫu lệ sao trước. Sắc nước uống.",
    doiTuongSuDung: "Người gan hỏa vượng, mất ngủ, cáu gắt, đỏ mắt",
    chuY: "Tỳ vị hư hàn kiêng dùng",
    nguonGoc: "Lan Thất Bí Tạng"
  },
  {
    ten: "Sơ Phong Tán",
    moTa: "Bài thuốc sơ phong giải biểu, chữa cảm mạo phong hàn.",
    congDung: "Sơ phong giải biểu, tuyên phế chỉ khái",
    thanhPhan: [
      { tenDuocLieu: "Tử tô diệp", lieuLuong: "9g" },
      { tenDuocLieu: "Phòng phong", lieuLuong: "6g" },
      { tenDuocLieu: "Kinh giới", lieuLuong: "6g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống ấm. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người cảm lạnh, sổ mũi, ho, sợ lạnh",
    chuY: "Cảm nóng không nên dùng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Thập Toàn Đại Bổ Thang",
    moTa: "Bài thuốc bổ khí dưỡng huyết toàn diện, tăng cường thể lực.",
    congDung: "Bổ khí dưỡng huyết, kiện tỳ dưỡng tâm",
    thanhPhan: [
      { tenDuocLieu: "Nhân sâm", lieuLuong: "6g" },
      { tenDuocLieu: "Hoàng kỳ", lieuLuong: "12g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Đương quy", lieuLuong: "9g" },
      { tenDuocLieu: "Thục địa hoàng", lieuLuong: "12g" },
      { tenDuocLieu: "Bạch thược", lieuLuong: "9g" },
      { tenDuocLieu: "Xuyên khung", lieuLuong: "6g" },
      { tenDuocLieu: "Nhục quế", lieuLuong: "3g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người khí huyết lưỡng hư, mệt mỏi, ăn kém",
    chuY: "Cảm mạo phát sốt tạm ngưng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Ứng Khí Hoàn",
    moTa: "Bài thuốc hành khí tiêu tích, chữa đầy bụng khó tiêu.",
    congDung: "Hành khí tiêu tích, kiện vị hóa thấp",
    thanhPhan: [
      { tenDuocLieu: "Hương phụ", lieuLuong: "9g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Thương truật", lieuLuong: "6g" },
      { tenDuocLieu: "Hậu phác", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn hoặc sắc nước uống.",
    doiTuongSuDung: "Người đầy bụng, ợ hơi, khó tiêu do khí trệ",
    chuY: "Khí hư thể yếu thận trọng",
    nguonGoc: "Đan Khê Tâm Pháp"
  },
  {
    ten: "Vị Linh Thang",
    moTa: "Bài thuốc kiện tỳ lợi thủy, hóa thấp chỉ tả.",
    congDung: "Kiện tỳ lợi thủy, hóa thấp chỉ tả",
    thanhPhan: [
      { tenDuocLieu: "Thương truật", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "12g" },
      { tenDuocLieu: "Trạch tả", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "6g" },
      { tenDuocLieu: "Nhục quế", lieuLuong: "3g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người tiêu chảy, phù nề, tỳ hư thấp trọng",
    chuY: "Âm hư nội nhiệt thận trọng",
    nguonGoc: "Thương Hàn Luận"
  },
  {
    ten: "Xuyên Khung Trà Điều Tán",
    moTa: "Bài thuốc sơ phong giải biểu, chữa đau đầu cảm mạo.",
    congDung: "Sơ phong giải biểu, chỉ thống định kinh",
    thanhPhan: [
      { tenDuocLieu: "Xuyên khung", lieuLuong: "6g" },
      { tenDuocLieu: "Trà điều", lieuLuong: "6g" },
      { tenDuocLieu: "Bạch chỉ", lieuLuong: "6g" },
      { tenDuocLieu: "Phòng phong", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống ấm. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người đau đầu do cảm mạo, đau nhức cơ thể",
    chuY: "Âm hư hỏa vượng thận trọng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Ý Dĩ Nhân Thang",
    moTa: "Bài thuốc kiện tỳ lợi thủy, thanh nhiệt bài nùng.",
    congDung: "Kiện tỳ lợi thủy, thanh nhiệt bài nùng, thông tý",
    thanhPhan: [
      { tenDuocLieu: "Ý dĩ nhân", lieuLuong: "30g" },
      { tenDuocLieu: "Phụ tử", lieuLuong: "6g" },
      { tenDuocLieu: "Bại tương thảo", lieuLuong: "15g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người viêm ruột thừa, áp xe, phù nề",
    chuY: "Thai phụ thận trọng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Trạch Tả Thang",
    moTa: "Bài thuốc lợi thủy thấm thấp, chữa phù nề tiểu tiện bất lợi.",
    congDung: "Lợi thủy thấm thấp, kiện tỳ hóa khí",
    thanhPhan: [
      { tenDuocLieu: "Trạch tả", lieuLuong: "15g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "12g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người phù nề, tiểu tiện ít, khát nước",
    chuY: "Thận âm hư thận trọng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Bạch Hổ Gia Nhân Sâm Thang",
    moTa: "Bài thuốc thanh nhiệt sinh tân, bổ khí phục mạch.",
    congDung: "Thanh nhiệt sinh tân, bổ khí phục mạch",
    thanhPhan: [
      { tenDuocLieu: "Thạch cao", lieuLuong: "30g" },
      { tenDuocLieu: "Tri mẫu", lieuLuong: "9g" },
      { tenDuocLieu: "Nhân sâm", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" },
      { tenDuocLieu: "Gạo tẻ", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống ấm. Ngày 1 thang.",
    doiTuongSuDung: "Người sốt cao, khát nước, mệt mỏi, mạch yếu",
    chuY: "Tỳ vị hư hàn kiêng dùng",
    nguonGoc: "Thương Hàn Luận"
  },
  {
    ten: "Chính Khí Thiên Hương Tán",
    moTa: "Bài thuốc lý khí hóa thấp, kiện tỳ hòa vị.",
    congDung: "Lý khí hóa thấp, kiện tỳ hòa vị",
    thanhPhan: [
      { tenDuocLieu: "Tử tô diệp", lieuLuong: "6g" },
      { tenDuocLieu: "Hậu phác", lieuLuong: "6g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Bán hạ", lieuLuong: "6g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người cảm mạo, đầy bụng, buồn nôn",
    chuY: "Khí hư thể yếu thận trọng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Đình Lịch Thang",
    moTa: "Bài thuốc thanh nhiệt giải độc, lợi thủy thông lâm.",
    congDung: "Thanh nhiệt giải độc, lợi thủy thông lâm",
    thanhPhan: [
      { tenDuocLieu: "Hoàng bá", lieuLuong: "9g" },
      { tenDuocLieu: "Tri mẫu", lieuLuong: "9g" },
      { tenDuocLieu: "Xa tiền tử", lieuLuong: "9g" },
      { tenDuocLieu: "Cù mạch", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người tiểu tiện đau rát, tiểu ra máu",
    chuY: "Thận dương hư thận trọng",
    nguonGoc: "Đan Khê Tâm Pháp"
  },
  {
    ten: "Ế Giao Hoàng Liên Thang",
    moTa: "Bài thuốc thanh tâm an thần, giao thông tâm thận.",
    congDung: "Thanh tâm an thần, giao thông tâm thận",
    thanhPhan: [
      { tenDuocLieu: "Hoàng liên", lieuLuong: "6g" },
      { tenDuocLieu: "Ế giao", lieuLuong: "12g" },
      { tenDuocLieu: "Hoàng cầm", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch thược", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Tối trước khi ngủ.",
    doiTuongSuDung: "Người mất ngủ, bồn chồn, sốt ruột",
    chuY: "Tỳ vị hư hàn kiêng dùng",
    nguonGoc: "Đan Khê Tâm Pháp"
  },
  {
    ten: "Phục Linh Tứ Nghịch Thang",
    moTa: "Bài thuốc ôn dương cứu nghịch, kiện tỳ lợi thủy.",
    congDung: "Ôn dương cứu nghịch, kiện tỳ lợi thủy",
    thanhPhan: [
      { tenDuocLieu: "Phụ tử", lieuLuong: "15g" },
      { tenDuocLieu: "Khô khương", lieuLuong: "9g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "6g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "12g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống ấm. Ngày 1 thang.",
    doiTuongSuDung: "Người dương khí suy thoái, tay chân lạnh",
    chuY: "Âm hư hỏa vượng kiêng dùng",
    nguonGoc: "Thương Hàn Luận"
  },
  {
    ten: "Gia Giảm Bát Vị Hoàn",
    moTa: "Bài thuốc bổ thận dương, ôn thận hóa khí cải tiến.",
    congDung: "Bổ thận dương, ôn thận hóa khí, cố tinh chỉ di",
    thanhPhan: [
      { tenDuocLieu: "Thục địa hoàng", lieuLuong: "24g" },
      { tenDuocLieu: "Sơn thù du", lieuLuong: "12g" },
      { tenDuocLieu: "Sơn dược", lieuLuong: "12g" },
      { tenDuocLieu: "Phụ tử", lieuLuong: "6g" },
      { tenDuocLieu: "Nhục quế", lieuLuong: "3g" },
      { tenDuocLieu: "Trạch tả", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Mẫu đan bì", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn, mỗi lần 6-9g, ngày 2 lần.",
    doiTuongSuDung: "Người thận dương hư, di tinh, yếu gối",
    chuY: "Âm hư hỏa vượng kiêng dùng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Hoàng Kỳ Kiến Trung Thang",
    moTa: "Bài thuốc bổ khí kiện trung, ôn dương tán hàn.",
    congDung: "Bổ khí kiện trung, ôn dương tán hàn, dưỡng huyết",
    thanhPhan: [
      { tenDuocLieu: "Hoàng kỳ", lieuLuong: "15g" },
      { tenDuocLieu: "Quế chi", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch thược", lieuLuong: "18g" },
      { tenDuocLieu: "Sinh khương", lieuLuong: "6g" },
      { tenDuocLieu: "Đại táo", lieuLuong: "12 quả" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "6g" },
      { tenDuocLieu: "Đường mạch nha", lieuLuong: "30g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống ấm. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người khí huyết hư, đau bụng, mệt mỏi",
    chuY: "Cảm mạo phát sốt tạm ngưng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Ích Vị Thang",
    moTa: "Bài thuốc bổ khí kiện tỳ, nâng dương cử hãm.",
    congDung: "Bổ khí kiện tỳ, nâng dương cử hãm",
    thanhPhan: [
      { tenDuocLieu: "Hoàng kỳ", lieuLuong: "18g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Đương quy", lieuLuong: "3g" },
      { tenDuocLieu: "Thăng ma", lieuLuong: "3g" },
      { tenDuocLieu: "Sài hồ", lieuLuong: "3g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người sa dạ dày, sa ruột, mệt mỏi",
    chuY: "Âm hư hỏa vượng thận trọng",
    nguonGoc: "Đông Viên Thí Hiệu"
  },
  {
    ten: "Kim Quỹ Hoàn",
    moTa: "Bài thuốc bổ thận cố tinh, chữa di tinh mộng tinh.",
    congDung: "Bổ thận cố tinh, an thần định chí",
    thanhPhan: [
      { tenDuocLieu: "Thục địa hoàng", lieuLuong: "240g" },
      { tenDuocLieu: "Sơn thù du", lieuLuong: "120g" },
      { tenDuocLieu: "Sơn dược", lieuLuong: "120g" },
      { tenDuocLieu: "Trạch tả", lieuLuong: "90g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "90g" },
      { tenDuocLieu: "Mẫu đan bì", lieuLuong: "90g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn với mật ong, mỗi hoàn 9g, ngày 2 lần.",
    doiTuongSuDung: "Người thận âm hư, di tinh, mộng tinh",
    chuY: "Tỳ vị hư yếu thận trọng",
    nguonGoc: "Tiểu Nhi Dược Chứng Trực Quyết"
  },
  {
    ten: "Lý Trung Hoàn",
    moTa: "Bài thuốc ôn trung tán hàn, lý khí chỉ thống.",
    congDung: "Ôn trung tán hàn, lý khí chỉ thống",
    thanhPhan: [
      { tenDuocLieu: "Nhân sâm", lieuLuong: "6g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Khô khương", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn hoặc sắc nước uống.",
    doiTuongSuDung: "Người tỳ vị hư hàn, đau bụng, tiêu chảy",
    chuY: "Âm hư nội nhiệt kiêng dùng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Mạch Vị Địa Hoàng Hoàn",
    moTa: "Bài thuốc bổ thận âm, thanh hư nhiệt, chữa tiểu đường.",
    congDung: "Bổ thận âm, thanh hư nhiệt, sinh tân chỉ khát",
    thanhPhan: [
      { tenDuocLieu: "Thục địa hoàng", lieuLuong: "24g" },
      { tenDuocLieu: "Sơn thù du", lieuLuong: "12g" },
      { tenDuocLieu: "Sơn dược", lieuLuong: "12g" },
      { tenDuocLieu: "Trạch tả", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Mẫu đan bì", lieuLuong: "9g" },
      { tenDuocLieu: "Mạch môn đông", lieuLuong: "12g" },
      { tenDuocLieu: "Ngũ vị tử", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn, mỗi lần 6-9g, ngày 2 lần.",
    doiTuongSuDung: "Người tiểu đường, khát nước nhiều, tiểu nhiều",
    chuY: "Tỳ vị hư yếu thận trọng",
    nguonGoc: "Y Lâm Cải Thác"
  },
  {
    ten: "Nhị Trần Thang",
    moTa: "Bài thuốc bổ khí dưỡng huyết, điều hòa doanh vệ.",
    congDung: "Bổ khí dưỡng huyết, điều hòa doanh vệ",
    thanhPhan: [
      { tenDuocLieu: "Hoàng kỳ", lieuLuong: "15g" },
      { tenDuocLieu: "Đương quy", lieuLuong: "9g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người khí huyết hư, mệt mỏi, chóng mặt",
    chuY: "Cảm mạo phát sốt tạm ngưng",
    nguonGoc: "Nội Ngoại Thương Biện Hoặc Luận"
  },
  {
    ten: "Ô Mạch Thang",
    moTa: "Bài thuốc dưỡng âm nhuận táo, chữa táo bón do âm hư.",
    congDung: "Dưỡng âm nhuận táo, thanh nhiệt sinh tân",
    thanhPhan: [
      { tenDuocLieu: "Mạch môn đông", lieuLuong: "15g" },
      { tenDuocLieu: "Huyền sâm", lieuLuong: "9g" },
      { tenDuocLieu: "Sinh địa hoàng", lieuLuong: "15g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người táo bón, khô miệng, âm hư nội nhiệt",
    chuY: "Tỳ vị hư hàn kiêng dùng",
    nguonGoc: "Ôn Bệnh Điều Biện"
  },
  {
    ten: "Phình Tiêu Thang",
    moTa: "Bài thuốc tiêu thực hóa tích, kiện vị trợ tiêu hóa.",
    congDung: "Tiêu thực hóa tích, kiện vị trợ tiêu hóa",
    thanhPhan: [
      { tenDuocLieu: "Sơn tra", lieuLuong: "15g" },
      { tenDuocLieu: "Thần khúc", lieuLuong: "9g" },
      { tenDuocLieu: "Mạch nha", lieuLuong: "9g" },
      { tenDuocLieu: "Bán hạ", lieuLuong: "6g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Liên kiều", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người ăn nhiều khó tiêu, đầy bụng, ợ hơi",
    chuY: "Thai phụ và trẻ em thận trọng",
    nguonGoc: "Đan Khê Tâm Pháp"
  },
  {
    ten: "Quân Tử Thang",
    moTa: "Bài thuốc bổ khí kiện tỳ cơ bản, tăng cường tiêu hóa.",
    congDung: "Bổ khí kiện tỳ, ích vị hòa trung",
    thanhPhan: [
      { tenDuocLieu: "Nhân sâm", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "9g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người tỳ vị hư yếu, mệt mỏi, ăn kém",
    chuY: "Cảm mạo phát sốt tạm ngưng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Sinh Mạch Tán",
    moTa: "Bài thuốc ích khí phục mạch, dưỡng âm sinh tân.",
    congDung: "Ích khí phục mạch, dưỡng âm sinh tân",
    thanhPhan: [
      { tenDuocLieu: "Nhân sâm", lieuLuong: "9g" },
      { tenDuocLieu: "Mạch môn đông", lieuLuong: "9g" },
      { tenDuocLieu: "Ngũ vị tử", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người khí âm lưỡng hư, mệt mỏi, khát nước",
    chuY: "Cảm mạo phát sốt tạm ngưng",
    nguonGoc: "Y Học Khải Nguyên"
  },
  {
    ten: "Thập Hương Trả Khí Tán",
    moTa: "Bài thuốc lý khí giải uất, kiện tỳ hòa vị.",
    congDung: "Lý khí giải uất, kiện tỳ hòa vị",
    thanhPhan: [
      { tenDuocLieu: "Hương phụ", lieuLuong: "6g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Chi thực", lieuLuong: "6g" },
      { tenDuocLieu: "Ô dược", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người lý khí giải uất, đầy bụng, khó tiêu",
    chuY: "Khí hư thể yếu thận trọng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Ứng Khí Hoàn Cải Tiến",
    moTa: "Bài thuốc hành khí tiêu tích cải tiến, chữa đầy bụng khó tiêu.",
    congDung: "Hành khí tiêu tích, kiện vị hóa thấp, chỉ thống",
    thanhPhan: [
      { tenDuocLieu: "Hương phụ", lieuLuong: "9g" },
      { tenDuocLieu: "Trần bì", lieuLuong: "6g" },
      { tenDuocLieu: "Chi thực", lieuLuong: "6g" },
      { tenDuocLieu: "Bán hạ", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Tán mịn làm hoàn hoặc sắc nước uống.",
    doiTuongSuDung: "Người đầy bụng, ợ hơi, khó tiêu do khí trệ",
    chuY: "Khí hư thể yếu thận trọng",
    nguonGoc: "Đan Khê Tâm Pháp"
  },
  {
    ten: "Vị Linh Thang Gia Giảm",
    moTa: "Bài thuốc kiện tỳ lợi thủy cải tiến, hóa thấp chỉ tả.",
    congDung: "Kiện tỳ lợi thủy, hóa thấp chỉ tả, ôn dương hóa khí",
    thanhPhan: [
      { tenDuocLieu: "Thương truật", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "12g" },
      { tenDuocLieu: "Trạch tả", lieuLuong: "9g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "6g" },
      { tenDuocLieu: "Nhục quế", lieuLuong: "3g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" },
      { tenDuocLieu: "Sinh khương", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người tiêu chảy, phù nề, tỳ hư thấp trọng",
    chuY: "Âm hư nội nhiệt thận trọng",
    nguonGoc: "Thương Hàn Luận"
  },
  {
    ten: "Xuyên Khung Trà Điều Tán Gia Giảm",
    moTa: "Bài thuốc sơ phong giải biểu cải tiến, chữa đau đầu cảm mạo.",
    congDung: "Sơ phong giải biểu, chỉ thống định kinh, thanh nhiệt",
    thanhPhan: [
      { tenDuocLieu: "Xuyên khung", lieuLuong: "6g" },
      { tenDuocLieu: "Trà điều", lieuLuong: "6g" },
      { tenDuocLieu: "Bạch chỉ", lieuLuong: "6g" },
      { tenDuocLieu: "Phòng phong", lieuLuong: "6g" },
      { tenDuocLieu: "Kinh giới", lieuLuong: "6g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống ấm. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người đau đầu do cảm mạo, đau nhức cơ thể",
    chuY: "Âm hư hỏa vượng thận trọng",
    nguonGoc: "Thái Bình Huệ Dân Hòa Tế Cục Phương"
  },
  {
    ten: "Ý Dĩ Nhân Thang Gia Giảm",
    moTa: "Bài thuốc kiện tỳ lợi thủy cải tiến, thanh nhiệt bài nùng.",
    congDung: "Kiện tỳ lợi thủy, thanh nhiệt bài nùng, thông tý, giải độc",
    thanhPhan: [
      { tenDuocLieu: "Ý dĩ nhân", lieuLuong: "30g" },
      { tenDuocLieu: "Phụ tử", lieuLuong: "6g" },
      { tenDuocLieu: "Bại tương thảo", lieuLuong: "15g" },
      { tenDuocLieu: "Đông qua nhân", lieuLuong: "12g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người viêm ruột thừa, áp xe, phù nề, viêm nhiễm",
    chuY: "Thai phụ thận trọng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  },
  {
    ten: "Trạch Tả Thang Gia Giảm",
    moTa: "Bài thuốc lợi thủy thấm thấp cải tiến, chữa phù nề tiểu tiện bất lợi.",
    congDung: "Lợi thủy thấm thấp, kiện tỳ hóa khí, thanh nhiệt",
    thanhPhan: [
      { tenDuocLieu: "Trạch tả", lieuLuong: "15g" },
      { tenDuocLieu: "Bạch truật", lieuLuong: "9g" },
      { tenDuocLieu: "Phục linh", lieuLuong: "12g" },
      { tenDuocLieu: "Cam thảo", lieuLuong: "3g" },
      { tenDuocLieu: "Chu linh", lieuLuong: "6g" }
    ],
    cachBaoCheSuDung: "Sắc nước uống. Ngày 1 thang, chia 2 lần.",
    doiTuongSuDung: "Người phù nề, tiểu tiện ít, khát nước, thấp nhiệt",
    chuY: "Thận âm hư thận trọng",
    nguonGoc: "Kim Quỹ Yếu Lược"
  }
];

export async function POST() {
  try {
    await dbConnect();
    
    let created = 0;
    let updated = 0;
    
    for (const baiThuoc of FINAL_BAI_THUOC) {
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