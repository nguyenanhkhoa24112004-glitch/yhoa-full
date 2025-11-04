import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";
import Image from "next/image";
import FallbackImage from "@/components/ui/FallbackImage";
import mongoose from "mongoose";

export const revalidate = 30;


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item: any = null;
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("invalid id");
    item = await DuocLieu.findById(id).lean();
  } catch (e) {
    item = null;
  }


  if (!item) {
    return (
      <div className="px-6 py-8">
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-700">Không tìm thấy dược liệu.</p>
        </div>
      </div>
    );
  }

  // Dùng trực tiếp ảnh để tránh lỗi proxy trong dev
  const toProxyUrl = (u: string) => u;
  const image = toProxyUrl(
    item.anhMinhHoa || "https://images.unsplash.com/photo-1479064845801-2f3f7f1f0a22?w=1200&q=80&auto=format&fit=crop"
  );
  const congDung: string[] = Array.isArray(item.congDung) ? item.congDung : [];
  const chiDinh: string[] = Array.isArray(item.chiDinh) ? item.chiDinh : [];
  const chongChiDinh: string[] = Array.isArray(item.chongChiDinh) ? item.chongChiDinh : [];
  const chuY: string[] = Array.isArray(item.chuY) ? item.chuY : [];
  // Sanitize and strongly type tag arrays to avoid duplicate/null keys and TS unknown types
  const viTags: string[] = Array.from(
    new Set(((item.vi || []) as unknown[]).filter((x): x is string => typeof x === "string" && x.length > 0))
  );
  const tinhTags: string[] = Array.from(
    new Set(((item.tinh || []) as unknown[]).filter((x): x is string => typeof x === "string" && x.length > 0))
  );
  const quyKinhTags: string[] = Array.from(
    new Set(((item.quyKinh || []) as unknown[]).filter((x): x is string => typeof x === "string" && x.length > 0))
  );
  const nhomTagsArray: string[] = Array.from(
    new Set(((item.nhom || []) as unknown[]).filter((x): x is string => typeof x === "string" && x.length > 0))
  );

  // Suy luận công năng từ nhóm nếu không có công dụng chi tiết
  const CONG_NANG_BY_NHOM: Record<string, string[]> = {
    giaiBieu: ["Giải biểu, phát hãn, tán phong hàn"],
    thanhNhiet: ["Thanh nhiệt, giải độc, tiêu viêm"],
    hoatHuyet: ["Hoạt huyết, thông lạc, giảm đau"],
    boKhi: ["Bổ khí, kiện tỳ, tăng sức đề kháng"],
    boHuyet: ["Bổ huyết, dưỡng huyết, điều huyết"],
    boAm: ["Tư âm, dưỡng âm, sinh tân dịch"],
    loiThuy: ["Lợi thủy, tiêu phù, thông tiểu"],
    khuPhong: ["Khu phong, trừ thấp, giảm đau"],
    truDam: ["Hóa đàm, chỉ khái, thông khí"],
    kienTy: ["Kiện tỳ, tiêu thực, hóa thấp"],
    onTrung: ["Ôn trung, tán hàn, chỉ thống"],
    hanhKhi: ["Hành khí, lý khí, điều khí"],
    boDuong: ["Bổ dương, ôn thận, cố tinh"],
    chiHuyet: ["Chỉ huyết, lương huyết, cầm máu"],
  };
  const congNangList: string[] = (congDung && congDung.length)
    ? congDung.filter((x): x is string => typeof x === 'string' && x.length > 0)
    : Array.from(new Set(nhomTagsArray.flatMap((k) => CONG_NANG_BY_NHOM[k] || [])));

  // Fallback 'Cách dùng' và 'Chống chỉ định' dựa theo nhóm nếu thiếu dữ liệu chi tiết
  const CACH_DUNG_BY_NHOM: Record<string, string[]> = {
    giaiBieu: ["Sắc uống ấm khi cảm lạnh", "Có thể phối gừng/kinh giới"],
    thanhNhiet: ["Sắc uống khi sốt/viêm", "Tránh dùng kéo dài khi hư hàn"],
    hoatHuyet: ["Sắc uống, phối chỉ huyết khi cần", "Thận trọng phụ nữ có thai"],
    boKhi: ["Sắc uống sau ăn 2–4 tuần", "Kết hợp kiện tỳ"],
    boHuyet: ["Sắc uống buổi tối", "Theo dõi tiêu hóa"],
    boAm: ["Sắc uống mát tư âm", "Không dùng khi đàm ẩm tích trệ"],
    loiThuy: ["Sắc uống tăng lợi niệu", "Theo dõi điện giải"],
    khuPhong: ["Sắc uống giảm đau phong thấp", "Thận trọng khi hư huyết"],
    truDam: ["Sắc uống hóa đàm chỉ khái", "Tránh dùng khi âm hư hỏa vượng"],
    kienTy: ["Sắc uống trước ăn kiện tỳ", "Không dùng khi nhiệt thịnh"],
    onTrung: ["Sắc uống ấm ôn trung", "Tránh dùng khi thực nhiệt"],
    hanhKhi: ["Sắc uống hành khí lý khí", "Thận trọng khi khí hư"],
    boDuong: ["Sắc uống tối bổ dương", "Không dùng khi âm hư nội nhiệt"],
    chiHuyet: ["Sắc uống khi xuất huyết nhẹ", "Khám khi xuất huyết kéo dài"],
  };
  const CHONG_CHI_DINH_BY_NHOM: Record<string, string[]> = {
    giaiBieu: ["Hư hàn ra mồ hôi nhiều"],
    thanhNhiet: ["Tỳ vị hư hàn kéo dài"],
    hoatHuyet: ["Phụ nữ có thai, người xuất huyết"],
    boKhi: ["Thực nhiệt, thấp nhiệt rõ"],
    boHuyet: ["Đàm thấp nặng, tiêu hóa yếu"],
    boAm: ["Đàm ẩm, tỳ hư nặng"],
    loiThuy: ["Suy kiệt, mất nước"],
    khuPhong: ["Hư huyết nặng"],
    truDam: ["Âm hư hỏa vượng"],
    kienTy: ["Thực nhiệt, sốt cao"],
    onTrung: ["Thực nhiệt, can hỏa"],
    hanhKhi: ["Khí hư rõ rệt"],
    boDuong: ["Âm hư nội nhiệt"],
    chiHuyet: ["Huyết ứ không rõ nguyên nhân"],
  };
  const cachDungList: string[] = item.cachDung
    ? [item.cachDung].filter((x): x is string => typeof x === 'string' && x.length > 0)
    : Array.from(new Set(nhomTagsArray.flatMap((k) => CACH_DUNG_BY_NHOM[k] || [])));
  const chongChiDinhList: string[] = chongChiDinh.length
    ? chongChiDinh.filter((x): x is string => typeof x === 'string' && x.length > 0)
    : Array.from(new Set(nhomTagsArray.flatMap((k) => CHONG_CHI_DINH_BY_NHOM[k] || [])));

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{item.ten}</h1>
          {item.tenKhoaHoc ? <p className="text-base md:text-lg text-white/70">{item.tenKhoaHoc}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 rounded-lg border border-gray-200 bg-white self-start">
          <div className="p-2">
            <FallbackImage
              src={image}
              alt={item.ten}
              width={1200}
              height={800}
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {viTags.map((v, i) => (
                <span key={`vi-${v}-${i}`} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Vị {v}</span>
              ))}
              {tinhTags.map((t, i) => (
                <span key={`tinh-${t}-${i}`} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Tính {t}</span>
              ))}
              {quyKinhTags.map((q, i) => (
                <span key={`qk-${q}-${i}`} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Quy {q}</span>
              ))}
              {nhomTagsArray.map((n, i) => (
                <span key={`nhom-${n}-${i}`} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Nhóm {n}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {item.mota ? (
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="font-semibold text-gray-900">Mô tả</h2>
              <p className="mt-2 text-gray-700">{item.mota}</p>
            </section>
          ) : null}
          {congNangList.length ? (
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="font-semibold text-gray-900">Công năng</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {congNangList.map((c, i) => <li key={`congnang-${i}`}>{c}</li>)}
              </ul>
            </section>
          ) : null}
          {chiDinh.length ? (
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="font-semibold text-gray-900">Chỉ định</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {chiDinh.filter((x): x is string => typeof x === 'string' && x.length > 0).map((c, i) => <li key={`chidinh-${i}`}>{c}</li>)}
              </ul>
            </section>
          ) : null}
          {chongChiDinhList.length ? (
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="font-semibold text-gray-900">Chống chỉ định</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {chongChiDinhList.map((c, i) => <li key={`chongchidinh-${i}`}>{c}</li>)}
              </ul>
            </section>
          ) : null}
          {cachDungList.length ? (
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="font-semibold text-gray-900">Cách dùng</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {cachDungList.map((c, i) => <li key={`cachdung-${i}`}>{c}</li>)}
              </ul>
            </section>
          ) : null}
          {chuY.length ? (
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="font-semibold text-gray-900">Chú ý</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {chuY.filter((x): x is string => typeof x === 'string' && x.length > 0).map((c, i) => <li key={`chuy-${i}`}>{c}</li>)}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      {/* Dược liệu liên quan */}
    </div>
  );
}
