import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { Benh } from "@/models";
import RelatedRemedies from "@/components/ui/RelatedRemedies";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  let item: any = null;
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("invalid id");
    item = await Benh.findById(id).populate("baiThuocLienQuan").lean();
  } catch (e) {
    item = null;
  }

  if (!item) {
    return (
      <div className="px-6 py-8 text-white">
        {/* sửa typo bg-white */}
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-10 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white/70">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <p className="text-white/80">Không tìm thấy bệnh.</p>
        </div>
      </div>
    );
  }

  const trieuchung: string[] = Array.isArray(item.trieuchung) ? item.trieuchung : [];
  const baiThuoc: any[] = Array.isArray(item.baiThuocLienQuan) ? item.baiThuocLienQuan : [];
  // Chuẩn hoá dữ liệu bài thuốc sang plain object an toàn cho Client Component
  const baiThuocSafe = baiThuoc.map((r: any) => ({
    _id: String(r?._id || ""),
    ten: r?.ten || "",
    moTa: r?.moTa || "",
    congDung: Array.isArray(r?.congDung) ? r.congDung : (r?.congDung ? [r.congDung] : []),
    thanhPhan: Array.isArray(r?.thanhPhan)
      ? r.thanhPhan.map((tp: any) => ({ tenDuocLieu: tp?.tenDuocLieu, lieuLuong: tp?.lieuLuong }))
      : [],
    nguonGoc: r?.nguonGoc || "",
    doiTuongSuDung: r?.doiTuongSuDung || "",
  }));

  return (
    <div className="px-6 py-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{item.ten}</h1>
          {item.moTa ? (
            <p className="text-base md:text-lg text-white/70 line-clamp-3">{item.moTa}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Nguyên nhân và Triệu chứng */}
          <div className="glass glow p-6">
            {/* sửa typo text-white */}
            <h2 className="text-xl font-semibold mb-3 text-white">Triệu chứng</h2>
            {trieuchung.length ? (
              <div className="flex flex-wrap gap-2">
                {trieuchung.map((tc, i) => (
                  <span key={`tc-${i}`} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-cyan-300">{tc}</span>
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-sm">Chưa có thông tin.</p>
            )}
          </div>

          <div className="glass glow p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">Nguyên nhân</h2>
            {item.nguyenNhan ? (
              <p className="text-white/80 leading-relaxed">{item.nguyenNhan}</p>
            ) : (
              <p className="text-white/70 text-sm">Chưa có thông tin.</p>
            )}
          </div>

          <div className="glass glow p-6">
            {/* sửa typo text-white */}
            <h2 className="text-xl font-semibold mb-3 text-white">Phương pháp điều trị</h2>
            {item.phuongPhapDieuTri ? (
              <p className="text-white/80 leading-relaxed">{item.phuongPhapDieuTri}</p>
            ) : (
              <p className="text-white/70 text-sm">Chưa có thông tin.</p>
            )}
          </div>
        </div>

        {/* Bài thuốc liên quan */}
        <div className="space-y-6">
          <RelatedRemedies remedies={baiThuocSafe} />
        </div>
      </div>
    </div>
  );
}