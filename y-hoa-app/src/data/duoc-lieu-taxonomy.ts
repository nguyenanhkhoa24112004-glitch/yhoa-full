export type TaxonomyItem = { key: string; label: string; desc: string };

export const NHOM: TaxonomyItem[] = [
  { key: "giaiBieu", label: "Giải biểu", desc: "Phát tán phong hàn/ nhiệt ở phần biểu." },
  { key: "thanhNhiet", label: "Thanh nhiệt", desc: "Thanh nhiệt, giải độc, trừ hoả." },
  { key: "hoatHuyet", label: "Hoạt huyết", desc: "Hoạt huyết, thông lạc, chỉ thống." },
  { key: "boKhi", label: "Bổ khí", desc: "Kiện tỳ ích khí, nâng đề kháng." },
  { key: "boHuyet", label: "Bổ huyết", desc: "Dưỡng huyết, điều kinh, sinh cơ." },
  { key: "boAm", label: "Bổ âm", desc: "Tư âm, nhuận táo, sinh tân." },
  { key: "loiThuy", label: "Lợi thuỷ", desc: "Lợi tiểu, tiêu phù, thanh thấp nhiệt." },
  { key: "truDam", label: "Trừ đàm", desc: "Hoá đàm, chỉ khái, lý khí." },
  { key: "khuPhong", label: "Khu phong", desc: "Khu phong, trừ thấp, chỉ thống." },
  { key: "kienTy", label: "Kiện tỳ", desc: "Kiện vận tỳ vị, tiêu trệ." },
  { key: "chiHuyet", label: "Chỉ huyết", desc: "Cầm máu, hoá ứ." },
];

export const VI: TaxonomyItem[] = [
  { key: "cay", label: "Cay", desc: "Tán, hành khí, phát hãn." },
  { key: "ngot", label: "Ngọt", desc: "Bổ, hoà trung, điều hoà." },
  { key: "dang", label: "Đắng", desc: "Tả, thanh nhiệt, táo thấp." },
  { key: "man", label: "Mặn", desc: "Nhuận, nhuyễn kiên, lợi thuỷ." },
  { key: "chat", label: "Chát", desc: "Thu liễm, chỉ tả, cầm máu." },
  { key: "nhat", label: "Nhạt", desc: "Lợi thuỷ, thẩm thấp." },
];

export const TINH: TaxonomyItem[] = [
  { key: "on", label: "Ôn", desc: "Ấm, tán hàn, ôn trung." },
  { key: "han", label: "Hàn", desc: "Lạnh, thanh nhiệt, chỉ khát." },
  { key: "luong", label: "Lương", desc: "Mát, thanh nhiệt nhẹ." },
  { key: "binh", label: "Bình", desc: "Không thiên hàn nhiệt, điều hoà." },
  { key: "nhiet", label: "Nhiệt", desc: "Nóng, ôn trung mạnh, tán hàn." },
];

export const QUY_KINH: TaxonomyItem[] = [
  { key: "phe", label: "Phế", desc: "Quy kinh Phế." },
  { key: "vi", label: "Vị", desc: "Quy kinh Vị." },
  { key: "ty", label: "Tỳ", desc: "Quy kinh Tỳ." },
  { key: "can", label: "Can", desc: "Quy kinh Can." },
  { key: "than", label: "Thận", desc: "Quy kinh Thận." },
  { key: "tam", label: "Tâm", desc: "Quy kinh Tâm." },
  { key: "daiTruong", label: "Đại trường", desc: "Quy kinh Đại trường." },
  { key: "tieuTruong", label: "Tiểu trường", desc: "Quy kinh Tiểu trường." },
  { key: "dam", label: "Đởm", desc: "Quy kinh Đởm." },
  { key: "bangQuang", label: "Bàng quang", desc: "Quy kinh Bàng quang." },
  { key: "tamBao", label: "Tâm bào", desc: "Quy kinh Tâm bào." },
];