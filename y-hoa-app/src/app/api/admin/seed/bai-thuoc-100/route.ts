import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { BaiThuoc } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function make(tp: string[], group: string, idx: number) {
  const name = `${group} ${String(idx).padStart(2, "0")}`;
  const thanhPhan = tp.map((ten) => ({ tenDuocLieu: ten, lieuLuong: "6–12g" }));
  const congDungText = (
    group.includes("Giải biểu") ? "Sơ phong, phát hãn, tán hàn" :
    group.includes("Thanh nhiệt") ? "Thanh nhiệt, giải độc" :
    group.includes("Hoá đàm") ? "Hóa đàm, chỉ khái" :
    group.includes("Hoạt huyết") ? "Hoạt huyết, thông lạc" :
    group.includes("Kiện tỳ") ? "Kiện tỳ, trợ tiêu hóa" :
    group.includes("Lợi thủy") ? "Lợi thủy, tiêu phù" :
    group.includes("Bổ khí") ? "Bổ khí, tăng cường thể lực" :
    group.includes("Chỉ huyết") ? "Chỉ huyết, cầm máu nhẹ" : "Điều hòa kinh khí"
  );
  return {
    ten: `Bài thuốc ${name}`,
    moTa: `Phối hợp dược liệu theo nguyên tắc ${group.toLowerCase()}.`,
    thanhPhan,
    congDung: congDungText,
    cachBaoCheSuDung: "Sắc 2–3 bát lấy 1 bát, uống ấm sau ăn. Dùng 3–7 ngày, theo dõi đáp ứng.",
    doiTuongSuDung: "Người trưởng thành; tùy cơ địa và chỉ định YHCT.",
    chuY: "Tham khảo chuyên gia YHCT. Không tự ý tăng liều.",
    nguonGoc: "Seed nội bộ",
  };
}

const SETS: Record<string, string[][]> = {
  "Giải biểu": [
    ["Gừng", "Kinh giới", "Tía tô", "Bạc hà"],
    ["Ma hoàng", "Quế", "Cam thảo"],
    ["Kinh giới", "Bạc hà", "Cát căn"],
    ["Khương hoạt", "Tê tê", "Kinh giới"],
    ["Tía tô", "Hành", "Gừng"],
    ["Cát căn", "Gừng", "Bạc hà"],
  ],
  "Thanh nhiệt": [
    ["Kim ngân hoa", "Liên kiều", "Bạc hà"],
    ["Hoàng liên", "Hoàng cầm", "Chi tử"],
    ["Liên kiều", "Bồ công anh", "Cam thảo"],
    ["Kim ngân hoa", "Ý dĩ", "Sinh địa"],
    ["Hoàng bá", "Tri mẫu", "Thạch cao"],
    ["Hoàng liên", "Chi tử", "Thương truật"],
  ],
  "Hoá đàm": [
    ["Bán hạ", "Trần bì", "Hạnh nhân"],
    ["Bán hạ", "Nam tinh", "Cam thảo"],
    ["Trần bì", "Cam thảo", "Cát cánh"],
    ["Bán hạ", "Gừng", "Trần bì"],
    ["Tỳ bà diệp", "Hạnh nhân", "Cam thảo"],
    ["Khoản đông hoa", "Bách bộ", "Cam thảo"],
  ],
  "Hoạt huyết": [
    ["Đương quy", "Xuyên khung", "Đan sâm"],
    ["Ngưu tất", "Xuyên khung", "Đan sâm"],
    ["Địa long", "Hồng hoa", "Tam thất"],
    ["Đương quy", "Sinh địa", "Kê huyết đằng"],
    ["Huyết dụ", "Tam thất", "Hồng hoa"],
    ["Ích mẫu", "Ngưu tất", "Hồng hoa"],
  ],
  "Kiện tỳ": [
    ["Bạch truật", "Phục linh", "Cam thảo"],
    ["Bạch truật", "Sơn tra", "Mạch nha"],
    ["Phục linh", "Ý dĩ", "Trần bì"],
    ["Khiêm ngưu", "Cúc la mã", "Hương thảo"],
    ["Cát căn", "Bạch truật", "Sa nhân"],
    ["Đảng sâm", "Bạch truật", "Phục linh"],
  ],
  "Lợi thủy": [
    ["Trạch tả", "Xa tiền tử", "Thông thảo"],
    ["Ý dĩ", "Phục linh", "Trạch tả"],
    ["Xa tiền tử", "Hoạt thạch", "Thông thảo"],
    ["Trạch tả", "Mộc thông", "Phục linh"],
    ["Đậu đỏ", "Ý dĩ", "Xa tiền tử"],
    ["Kim tiền thảo", "Xa tiền tử", "Trạch tả"],
  ],
  "Bổ khí": [
    ["Đảng sâm", "Cam thảo", "Hoàng kỳ"],
    ["Hoàng kỳ", "Bạch truật", "Phục linh"],
    ["Đảng sâm", "Sơn tra", "Mạch nha"],
    ["Cam thảo", "Quế", "Gừng"],
    ["Hoàng kỳ", "Sa nhân", "Bạch truật"],
    ["Đảng sâm", "Ý dĩ", "Phục linh"],
  ],
  "Chỉ huyết": [
    ["Tam thất", "Huyết dụ", "Sinh địa"],
    ["Cỏ tranh", "Hoàng cầm", "Sinh địa"],
    ["Tam thất", "Ngưu tất", "Hồng hoa"],
    ["Huyết dụ", "Địa du", "Sinh địa"],
    ["Bổ cốt chỉ", "Hoàng cầm", "Sinh địa"],
    ["Tam thất", "Hoa hòe", "Sinh địa"],
  ],
};

export async function GET(req: Request) {
  // Delegate to POST for convenience when triggering via browser
  return POST(req);
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Build ~96 from SETS plus a few general-purpose ones to reach ~100
    const docs: any[] = [];
    Object.keys(SETS).forEach((group) => {
      const arr = SETS[group];
      arr.forEach((tp, i) => {
        docs.push(make(tp, group, i + 1));
      });
    });

    const extras = [
      make(["Gừng", "Tía tô", "Kinh giới"], "Giải biểu cảm lạnh", 7),
      make(["Kim ngân hoa", "Liên kiều", "Bạc hà"], "Thanh nhiệt viêm họng", 7),
      make(["Bán hạ", "Trần bì", "Hạnh nhân"], "Hoá đàm ho khan", 7),
      make(["Đương quy", "Xuyên khung", "Đan sâm"], "Hoạt huyết đau đầu", 7),
    ];
    docs.push(...extras);

    let inserted = 0, upserted = 0, updated = 0;
    for (const d of docs) {
      const res = await BaiThuoc.findOneAndUpdate(
        { ten: d.ten },
        { $set: { ...d, updatedAt: new Date() } },
        { upsert: true, new: true }
      );
      // Mongoose upsert does not report inserted/updated counts here simply; we estimate by existence
      if (res) {
        upserted += 1;
      } else {
        inserted += 1;
      }
    }

    return NextResponse.json({ ok: true, count: docs.length, upserted, inserted, updated });
  } catch (err: any) {
    console.error("[seed/bai-thuoc-100]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}