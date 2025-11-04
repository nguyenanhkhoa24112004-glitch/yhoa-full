// Bảng ánh xạ chuẩn hoá bệnh → danh sách bài thuốc kinh điển phù hợp (YHCT)
// Chỉ dùng các bài thuốc đã có trong seeds của dự án: bai-thuoc-final, extra, last-2, 100
// Lưu ý: tên phải khớp chính xác với field 'ten' của collection BaiThuoc

export type CuratedMap = Record<string, string[]>;

export const BENH_TO_BAITHUOC: CuratedMap = {
  // Hô hấp – cảm mạo
  "cảm lạnh": ["Quế Chi Thang"],
  "cảm cúm": ["Quế Chi Thang", "Tiểu Thanh Long Thang"],
  "sốt": ["Bạch Hổ Gia Nhân Sâm Thang"],
  "ho": ["Mạch Môn Đông Thang", "Nhị Trần Thang"],
  "viêm họng": ["Hoàng Liên Giải Độc Thang"],
  "viêm phế quản": ["Nhị Trần Thang", "Mạch Môn Đông Thang"],

  // Tiêu hóa
  "đau dạ dày": ["Ô Dược Thuận Khí Tán"],
  "viêm dạ dày": ["Hoàng Liên Giải Độc Thang"],
  "tiêu chảy": ["Vị Linh Thang"],
  "đầy bụng khó tiêu": ["Phình Tiêu Hoàn", "Ứng Khí Hoàn"],
  "táo bón": ["Tăng Dịch Thang"],

  // Thần kinh – tâm thần
  "mất ngủ": ["Giao Thái An"],
  "lo âu": ["Quy Tỳ Thang"],
  "suy nhược": ["Thập Toàn Đại Bổ Thang"],
  "thiếu máu": ["Đương Quy Bổ Huyết Thang"],

  // Cơ xương khớp
  "đau khớp": ["Độc Hoạt Tang Ký Sinh"],
  "viêm khớp": ["Độc Hoạt Tang Ký Sinh"],
  "đau lưng": ["Gia Giảm Bát Vị Hoàn"],

  // Gan mật
  "viêm gan": ["Nhân Trần Cao"],
  "men gan cao": ["Nhân Trần Cao"],

  // Da liễu – dị ứng
  "viêm da": ["Hoàng Liên Giải Độc Thang"],
  "viêm da dị ứng": ["Tiêu Diêm Đan"],
  "mày đay": ["Tiêu Diêm Đan"],
  "mụn trứng cá": ["Thanh Nhiệt Giải Độc Thang"],

  // Tai mũi họng – răng miệng
  "viêm xoang": ["Thương Truật Hoá Thấp Thang"],
  "viêm mũi dị ứng": ["Tiểu Thanh Long Thang"],
  "nhiệt miệng": ["Hoàng Liên Giải Độc Thang"],
  "viêm lợi": ["Hoàng Liên Giải Độc Thang"],
  "hôi miệng": ["Phình Tiêu Hoàn"],

  // Tiết niệu – phù thũng
  "phù nề": ["Ngũ Linh Tán"],
  "tiểu ít": ["Ngũ Linh Tán"],

  // Nội tiết – thận
  "thận âm hư": ["Lục Vị Địa Hoàng Hoàn"],
  "thận dương hư": ["Gia Giảm Bát Vị Hoàn"],
};

// Một số tên trong seeds có thể chưa tồn tại (ví dụ Tiểu Thanh Long Thang, Nhị Trần Thang, Độc Hoạt Tang Ký Sinh,
// Nhân Trần Cao, Tiêu Diêm Đan, Thanh Nhiệt Giải Độc Thang...). Nếu thiếu, đoạn enrich sẽ bỏ qua tên không tìm thấy
// và chỉ liên kết những bài thuốc tra được trong DB để đảm bảo tính chính xác.

export function normalizeBenhName(name?: string): string {
  return (name || '').trim().toLowerCase();
}