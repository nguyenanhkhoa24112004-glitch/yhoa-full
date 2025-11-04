import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

const NAMES = [
  { vn: "Gừng", latin: "Zingiber officinale Roscoe" },
  { vn: "Bạc hà", latin: "Mentha arvensis L." },
  { vn: "Cát căn", latin: "Pueraria lobata" },
  { vn: "Cam thảo", latin: "Glycyrrhiza uralensis" },
  { vn: "Quế", latin: "Cinnamomum cassia" },
  { vn: "Hoàng cầm", latin: "Scutellaria baicalensis" },
  { vn: "Hoàng liên", latin: "Coptis chinensis" },
  { vn: "Đương quy", latin: "Angelica sinensis" },
  { vn: "Xuyên khung", latin: "Ligusticum wallichii" },
  { vn: "Khương hoạt", latin: "Notopterygium incisum" },
  { vn: "Bạch truật", latin: "Atractylodes macrocephala" },
  { vn: "Phục linh", latin: "Poria cocos" },
  { vn: "Kinh giới", latin: "Elsholtzia ciliata" },
  { vn: "Tía tô", latin: "Perilla frutescens" },
  { vn: "Bạc hà diệp", latin: "Mentha piperita" },
];

const NHOM = ["giải biểu", "hoạt huyết", "bổ khí", "trừ đàm", "lợi thủy", "thanh nhiệt"];
const VI = ["cay", "ngọt", "đắng", "mặn", "chát"];
const TINH = ["ôn", "hàn", "lương", "bình"];
const QUY_KINH = ["Phế", "Vị", "Tỳ", "Can", "Thận", "Tâm"];
const CONG_DUNG = [
  "phát tán phong hàn",
  "sơ phong giải biểu",
  "hành khí chỉ thống",
  "hoá đàm chỉ khái",
  "thanh nhiệt giải độc",
  "hoạt huyết thông lạc",
  "kiện tỳ ích khí",
];
const CHI_DINH = [
  "cảm mạo",
  "đau đầu do phong hàn",
  "đầy tức ngực bụng",
  "ho có đờm",
  "ăn kém tiêu",
];

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1547514701-9fa1a6e30d70?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524594154248-1f262212d6f7?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1479064845801-2f3f7f1f0a22?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461354464877-64e2f47a1a16?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1200&q=80&auto=format&fit=crop",
];

function pick<T>(arr: T[], n = 1): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    out.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return Array.from(new Set(out));
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const countParam = url.searchParams.get("count");
    const secret = url.searchParams.get("secret");
    const count = countParam ? Math.max(1, Math.min(5000, parseInt(countParam))) : 1000;

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const docs = [] as any[];
    for (let i = 0; i < count; i++) {
      const base = NAMES[i % NAMES.length];
      const name = `${base.vn} ${i + 1}`;
      docs.push({
        ten: name,
        tenKhoaHoc: base.latin,
        mota: "Dược liệu mẫu sinh ra để demo giao diện.",
        vi: pick(VI, 2),
        tinh: pick(TINH, 1),
        quyKinh: pick(QUY_KINH, 2),
        nhom: pick(NHOM, 2),
        congDung: pick(CONG_DUNG, 3),
        chiDinh: pick(CHI_DINH, 2),
        cachDung: "3–9 g sắc uống, có thể dùng ngoài tuỳ vị thuốc.",
        chuY: ["Phụ nữ có thai thận trọng", "Cơ địa dị ứng cần lưu ý"],
        anhMinhHoa: IMAGE_POOL[i % IMAGE_POOL.length],
      });
    }

    const res = await DuocLieu.insertMany(docs, { ordered: false });
    return NextResponse.json({ inserted: res.length });
  } catch (err: any) {
    console.error("[seed/duoc-lieu]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}