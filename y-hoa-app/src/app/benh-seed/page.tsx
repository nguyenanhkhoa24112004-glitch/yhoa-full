import { Benh, BaiThuoc } from "@/models";
import dbConnect from "@/lib/mongoose";
import Link from "next/link";

export default async function Page() {
  let data = {
    ok: false,
    mongodb: "checking...",
    benh: { total: 0, sample: [] as any[] },
    baiThuoc: { total: 0 },
    error: null as string | null,
  };

  try {
    await dbConnect();
    const benhCount = await Benh.countDocuments();
    const baiThuocCount = await BaiThuoc.countDocuments();
    
    const sample = await Benh.find().limit(5).lean();
    
    data = {
      ok: true,
      mongodb: "connected",
      benh: {
        total: benhCount,
        sample: sample.map((b: any) => ({
          ten: b.ten,
          id: b._id,
          baiThuocLienQuan: Array.isArray(b.baiThuocLienQuan) ? b.baiThuocLienQuan.length : 0,
        })),
      },
      baiThuoc: {
        total: baiThuocCount,
      },
      error: null,
    };
  } catch (e: any) {
    data = {
      ok: false,
      mongodb: "disconnected",
      error: e?.message || "Lỗi kết nối",
      benh: { total: 0, sample: [] },
      baiThuoc: { total: 0 },
    };
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🔍 Kiểm Tra Dữ Liệu Bệnh</h1>
        <p className="text-white/70">Xem trạng thái database và seed dữ liệu</p>
      </div>

      {/* MongoDB Status */}
      <div className="glass glow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">MongoDB Status</h2>
          <div className={`px-4 py-2 rounded-full ${data.ok ? "bg-green-500/20 border border-green-400/40 text-green-200" : "bg-red-500/20 border border-red-400/40 text-red-200"}`}>
            {data.mongodb === "connected" ? "✓ Connected" : "✗ Disconnected"}
          </div>
        </div>
        {!data.ok && data.error && (
          <p className="text-red-400 text-sm mt-2">Lỗi: {data.error}</p>
        )}
      </div>

      {/* Bệnh Status */}
      <div className="glass glow p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">📋 Dữ Liệu Bệnh</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/70 text-sm">Tổng số bệnh:</p>
            <p className="text-3xl font-bold text-white">{data.benh.total}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Trạng thái:</p>
            <p className={`text-lg font-semibold ${data.benh.total > 0 ? "text-green-400" : "text-yellow-400"}`}>
              {data.benh.total > 0 ? "✓ Có dữ liệu" : "⚠ Chưa có dữ liệu"}
            </p>
          </div>
        </div>

        {data.benh.sample.length > 0 && (
          <div className="mt-4">
            <p className="text-white/70 text-sm mb-2">Mẫu dữ liệu (5 bệnh đầu):</p>
            <div className="space-y-2">
              {data.benh.sample.map((b: any) => (
                <div key={b.id} className="bg-white/5 rounded p-3 flex justify-between items-center">
                  <span className="text-white">{b.ten}</span>
                  <span className="text-purple-300 text-sm">{b.baiThuocLienQuan} bài thuốc</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bài Thuốc Status */}
      <div className="glass glow p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">💊 Dữ Liệu Bài Thuốc</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/70 text-sm">Tổng số bài thuốc:</p>
            <p className="text-3xl font-bold text-white">{data.baiThuoc.total}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Trạng thái:</p>
            <p className={`text-lg font-semibold ${data.baiThuoc.total > 0 ? "text-green-400" : "text-yellow-400"}`}>
              {data.baiThuoc.total > 0 ? "✓ Có dữ liệu" : "⚠ Cần seed bài thuốc trước"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="glass glow p-6">
        <h2 className="text-2xl font-bold text-white mb-4">⚡ Thao Tác</h2>
        <div className="space-y-3">
          {data.benh.total === 0 ? (
            <>
              <p className="text-white/80 mb-4">
                Chưa có dữ liệu bệnh. Chạy các lệnh sau để seed dữ liệu:
              </p>
              <div className="bg-white/5 rounded p-4 font-mono text-sm">
                <div className="text-cyan-300"># Seed 50 bệnh đầu tiên</div>
                <div className="text-white mt-1">
                  curl -X POST "http://localhost:3000/api/admin/seed/benh-50?reset=true"
                </div>
                <div className="text-cyan-300 mt-3"># Seed 50 bệnh bổ sung</div>
                <div className="text-white mt-1">
                  curl -X POST "http://localhost:3000/api/admin/seed/benh-50-extra"
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href="/api/admin/seed/benh-50?reset=true"
                  target="_blank"
                  className="btn-cta-main"
                >
                  Seed 50 Bệnh Đầu Tiên
                </a>
                <a
                  href="/api/admin/seed/benh-50-extra"
                  target="_blank"
                  className="btn-cta-secondary"
                >
                  Seed 50 Bệnh Bổ Sung
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="text-green-400 mb-4">
                ✅ Đã có {data.benh.total} bệnh trong database!
              </p>
              <div className="flex gap-3">
                <Link href="/benh" className="btn-cta-main">
                  Xem Danh Sách Bệnh
                </Link>
                <a
                  href="/api/admin/seed/benh-50?reset=true"
                  target="_blank"
                  className="btn-cta-secondary"
                >
                  Reset & Seed Lại
                </a>
              </div>
            </>
          )}

          {data.baiThuoc.total === 0 && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400/40 rounded">
              <p className="text-yellow-200 text-sm">
                ⚠️ Cần seed bài thuốc trước để liên kết với bệnh
              </p>
            </div>
          )}

          <div className="mt-4"></div>
        </div>
      </div>
    </div>
  );
}
