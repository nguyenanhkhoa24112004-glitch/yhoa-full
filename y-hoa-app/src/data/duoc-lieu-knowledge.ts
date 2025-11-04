export type KnowledgeItem = {
  congDung?: string[];
  chiDinh?: string[];
  cachDung?: string;
  chuY?: string[];
  sources?: string[];
};

export const DUOC_LIEU_KNOWLEDGE: Record<string, KnowledgeItem> = {
  "Gừng": {
    congDung: ["Phát tán phong hàn", "Ôn trung chỉ ẩu", "Hoá đàm chỉ khái"],
    chiDinh: ["Cảm lạnh", "Buồn nôn, nôn ói", "Ho có đờm"],
    cachDung: "3–9 g sắc uống; dùng tươi giã đắp hoặc pha trà", 
    chuY: ["Âm hư hoả vượng thận trọng", "Ra mồ hôi nhiều tránh dùng"],
    sources: ["Trung Dược Học", "Bản Thảo Cương Mục"],
  },
  "Bạc hà": {
    congDung: ["Tân lương giải biểu", "Thanh nhiệt", "Sơ phong nhiệt, lợi yết hầu"],
    chiDinh: ["Cảm nóng", "Đau đầu, viêm họng", "Mẩn ngứa do phong nhiệt"],
    cachDung: "3–9 g, hãm hoặc sắc cuối (tránh đun lâu)",
    chuY: ["Âm hư nội nhiệt thận trọng", "Khí hư biểu hư không nên dùng nhiều"],
    sources: ["Trung Dược Học"],
  },
  "Cát căn": {
    congDung: ["Giải cơ, sinh tân", "Thăng dương chỉ tả", "Thanh nhiệt"],
    chiDinh: ["Cảm mạo kèm đau gáy", "Tiêu chảy do nhiệt", "Khát nước"],
    cachDung: "9–15 g sắc uống",
    chuY: ["Âm hư tân dịch hao giảm liều"],
    sources: ["Trung Dược Học"],
  },
  "Cam thảo": {
    congDung: ["Bổ khí hoà trung", "Giải độc", "Điều hoà các vị thuốc"],
    chiDinh: ["Mệt mỏi khí hư", "Ho, đờm", "Ngộ độc do nhiều nguyên nhân"],
    cachDung: "3–9 g; dùng phối ngũ để điều hoà",
    chuY: ["Tăng huyết áp, phù thũng thận trọng", "Dùng lâu dễ giữ nước"],
    sources: ["Trung Dược Học"],
  },
  "Quế": {
    congDung: ["Ôn trung tán hàn", "Thông mạch chỉ thống", "Ôn kinh chỉ huyết"],
    chiDinh: ["Đau lạnh vùng bụng", "Chi lạnh", "Đau do hàn"],
    cachDung: "3–6 g, sắc uống; tinh dầu dùng ngoài",
    chuY: ["Âm hư hoả vượng tránh dùng", "Phụ nữ có thai thận trọng"],
    sources: ["Trung Dược Học"],
  },
  "Đương quy": {
    congDung: ["Bổ huyết điều kinh", "Hoạt huyết chỉ thống", "Nhuận tràng"],
    chiDinh: ["Kinh nguyệt không đều", "Thiếu máu", "Táo bón do huyết hư"],
    cachDung: "6–12 g sắc uống",
    chuY: ["Âm hư nội nhiệt, tiêu chảy thận trọng"],
    sources: ["Trung Dược Học"],
  },
  "Xuyên khung": {
    congDung: ["Hoạt huyết khứ ứ", "Khu phong chỉ thống"],
    chiDinh: ["Đau đầu do phong hàn", "Đau ngực sườn do ứ huyết"],
    cachDung: "3–9 g sắc uống",
    chuY: ["Phụ nữ có thai thận trọng"],
    sources: ["Trung Dược Học"],
  },
  "Bạch truật": {
    congDung: ["Kiện tỳ táo thấp", "Chỉ hãn", "An thai"],
    chiDinh: ["Ăn kém tiêu", "Tiêu chảy do tỳ hư", "Ra mồ hôi nhiều"],
    cachDung: "6–12 g sắc uống",
    chuY: ["Tân dịch kém, táo nhiệt thận trọng"],
    sources: ["Trung Dược Học"],
  },
  "Phục linh": {
    congDung: ["Lợi thuỷ thẩm thấp", "Kiện tỳ an thần"],
    chiDinh: ["Phù nề", "Tiểu ít", "Mất ngủ nhẹ"] ,
    cachDung: "9–15 g sắc uống",
    chuY: ["Âm hư khô táo giảm liều"],
    sources: ["Trung Dược Học"],
  },
  "Kinh giới": {
    congDung: ["Phát tán phong hàn", "Chỉ huyết (than)"],
    chiDinh: ["Cảm lạnh", "Mẩn ngứa"],
    cachDung: "3–9 g; sao tồn tính để chỉ huyết",
    chuY: ["Âm hư nội nhiệt thận trọng"],
    sources: ["Trung Dược Học"],
  },
  "Tía tô": {
    congDung: ["Giải biểu tán hàn", "Hành khí an thai"],
    chiDinh: ["Cảm lạnh", "Nôn do thai nghén"],
    cachDung: "3–9 g sắc uống; dùng lá tươi nấu cháo giải cảm",
    chuY: ["Biểu hư ra mồ hôi nhiều thận trọng"],
    sources: ["Trung Dược Học"],
  },
  // ... Có thể bổ sung dần cho toàn bộ danh sách
};