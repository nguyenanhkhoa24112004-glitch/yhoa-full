export type DeriveInput = {
  ten: string;
  nhom?: string[];
  vi?: string[];
  tinh?: string[];
  quyKinh?: string[];
};

export type DerivedKnowledge = {
  congDung: string[];
  chiDinh: string[];
  cachDung: string;
  chuY: string[];
};

function uniq<T>(arr: T[] = []): T[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

function has(i?: string[], k?: string) {
  return !!i?.includes(k as any);
}

// Công năng theo nhóm
function deriveCongDung(nhom: string[] = [], tinh: string[] = []): string[] {
  const out: string[] = [];
  if (nhom.includes("giaiBieu")) {
    if (has(tinh, "on") || has(tinh, "nhiet")) out.push("Phát tán phong hàn");
    if (has(tinh, "luong") || has(tinh, "han")) out.push("Sơ phong thanh nhiệt");
    out.push("Giải biểu");
  }
  if (nhom.includes("thanhNhiet")) {
    out.push("Thanh nhiệt giải độc", "Táo thấp");
  }
  if (nhom.includes("hoatHuyet")) {
    out.push("Hoạt huyết khứ ứ", "Thông lạc chỉ thống");
  }
  if (nhom.includes("boKhi")) out.push("Kiện tỳ ích khí", "Bổ trung");
  if (nhom.includes("boHuyet")) out.push("Dưỡng huyết điều kinh");
  if (nhom.includes("boAm")) out.push("Tư âm sinh tân");
  if (nhom.includes("loiThuy")) out.push("Lợi thuỷ thẩm thấp");
  if (nhom.includes("truDam")) out.push("Hoá đàm chỉ khái", "Lý khí");
  if (nhom.includes("khuPhong")) out.push("Khu phong trừ thấp", "Chỉ thống");
  if (nhom.includes("kienTy")) out.push("Kiện tỳ táo thấp", "Tiêu trệ");
  if (nhom.includes("chiHuyet")) out.push("Chỉ huyết hoá ứ");
  return uniq(out);
}

// Chỉ định theo kinh quy và nhóm
function deriveChiDinh(quyKinh: string[] = [], nhom: string[] = []): string[] {
  const out: string[] = [];
  if (quyKinh.includes("phe")) out.push("Cảm mạo, ho, viêm họng", "Đờm nhiều, hen suyễn");
  if (quyKinh.includes("ty") || quyKinh.includes("vi")) out.push("Ăn kém tiêu, đầy bụng", "Tiêu chảy, buồn nôn");
  if (quyKinh.includes("can")) out.push("Đau đầu, tức ngực sườn", "Kinh nguyệt không đều");
  if (quyKinh.includes("than")) out.push("Tiểu ít, phù nề", "Đau lưng gối");
  if (quyKinh.includes("tam")) out.push("Hồi hộp, mất ngủ");
  if (quyKinh.includes("bangQuang")) out.push("Tiểu khó, đau lưng");
  if (quyKinh.includes("tieuTruong")) out.push("Đau bụng, tiêu chảy");
  if (quyKinh.includes("daiTruong")) out.push("Lỵ, rối loạn đại tiện");
  if (quyKinh.includes("tamBao")) out.push("Tức ngực, hồi hộp");

  // Theo nhóm
  if (nhom.includes("thanhNhiet")) out.push("Sốt cao, mụn nhọt, viêm nhiễm");
  if (nhom.includes("hoatHuyet")) out.push("Đau do ứ huyết, kinh bế");
  if (nhom.includes("loiThuy")) out.push("Phù nề, tiểu ít");
  if (nhom.includes("truDam")) out.push("Ho đờm, khó thở, tức ngực");
  return uniq(out);
}

// Dùng lượng tham khảo theo nhóm
function deriveCachDung(nhom: string[] = []): string {
  if (nhom.includes("giaiBieu") || nhom.includes("khuPhong") || nhom.includes("truDam") || nhom.includes("hoatHuyet")) {
    return "3–9 g sắc uống; gia giảm theo bài thuốc";
  }
  if (nhom.includes("thanhNhiet") || nhom.includes("kienTy") || nhom.includes("boKhi") || nhom.includes("boHuyet")) {
    return "6–12 g sắc uống; dùng phối ngũ phù hợp";
  }
  if (nhom.includes("loiThuy") || nhom.includes("boAm")) {
    return "9–15 g sắc uống; theo dõi tiểu tiện và dịch";
  }
  return "3–9 g sắc uống; tuỳ chứng và cơ địa";
}

// Khuyến cáo/ chống chỉ định theo tính vị
function deriveChuY(tinh: string[] = [], vi: string[] = [], nhom: string[] = []): string[] {
  const out: string[] = [];
  if (has(tinh, "on") || has(tinh, "nhiet")) out.push("Âm hư nội nhiệt thận trọng");
  if (has(tinh, "han") || has(tinh, "luong")) out.push("Tỳ vị hư hàn thận trọng");
  if (has(vi, "cay")) out.push("Biểu hư tự hãn thận trọng");
  if (has(vi, "dang")) out.push("Tỳ vị hư yếu tránh dùng kéo dài");
  if (has(vi, "man")) out.push("Phù thũng, tăng huyết áp thận trọng");
  if (nhom.includes("hoatHuyet")) out.push("Phụ nữ có thai thận trọng");
  return uniq(out);
}

export function deriveKnowledge(input: DeriveInput): DerivedKnowledge {
  const congDung = deriveCongDung(input.nhom || [], input.tinh || []);
  const chiDinh = deriveChiDinh(input.quyKinh || [], input.nhom || []);
  const cachDung = deriveCachDung(input.nhom || []);
  const chuY = deriveChuY(input.tinh || [], input.vi || [], input.nhom || []);
  return { congDung, chiDinh, cachDung, chuY };
}