import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";
import { BaiThuoc, Benh } from "@/models";
import sampleDuocLieu from "@/data/duoc-lieu-sample.json";

// Kiểu dữ liệu lean cho DuocLieu khi truy vấn từ MongoDB
type DuocLieuLean = {
  ten?: string;
  vi?: string[];
  tinh?: string[];
  quyKinh?: string[];
  congDung?: string[];
  chiDinh?: string[];
  cachDung?: string;
  anhMinhHoa?: string;
};

type HerbInfo = {
  ten: string;
  vi: string[];
  tinh: string[];
  quyKinh: string[];
  congDung: string[];
  chiDinh: string[];
  cachDung: string;
  anhMinhHoa: string;
  id?: string;
  sourceLink?: string;
};

type ChatRequest = {
  message?: string;
  age?: number;
  gender?: string;
  messages?: { role: "user" | "assistant"; content: string }[];
};

function noAccent(input: string = ""): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
}

function hasAny(text: string, keywords: string[]): boolean {
  const n = noAccent(text);
  return keywords.some((k) => n.includes(noAccent(k)));
}

function detectEmergency(text: string): string | null {
  const emergentPatterns = [
    "dau nguc du doi",
    "kho tho",
    "mat y thuc",
    "liet",
    "co giat",
    "so t cao", // generic
    "> 39",
    "sot cao",
    "non ra mau",
    "di ngoai phan den",
    "non khong dung",
    "dau bung cap",
    "cung co",
    "dau dau du doi",
    // thai ky/ san khoa nguy co
    "ra mau am dao",
    "dau bung khi mang thai",
    "co that tu cung",
    // nhi khoa
    "tre so sinh",
    "tre < 3 thang sot",
  ];
  if (hasAny(text, emergentPatterns)) {
    return (
      "Triệu chứng bạn mô tả có dấu hiệu nghiêm trọng/khẩn cấp. " +
      "Vui lòng gọi cấp cứu hoặc đến cơ sở y tế gần nhất ngay lập tức."
    );
  }
  return null;
}

// Danh mục dấu hiệu nguy hiểm cần đi viện ngay
function dangerSignsList(): string[] {
  return [
    "Sốt cao không giảm (≥ 39°C) hoặc kéo dài nhiều ngày",
    "Đau ngực, khó thở, hồi hộp trầm trọng",
    "Mất ý thức, liệt, co giật",
    "Nôn ra máu, đi ngoài phân đen",
    "Đau bụng cấp dữ dội, nôn không dừng",
  ];
}

type Pattern = {
  key: string;
  name: string;
  cues: string[]; // normalized cues
  description: string;
};

const PATTERNS: Pattern[] = [
  {
    key: "phongHan",
    name: "Phong hàn",
    cues: ["lanh", "so gio", "dau dau", "dau gay", "khong mo hoi", "dau vai"],
    description:
      "Biểu hàn do phong hàn xâm nhập: đau tăng khi lạnh/gió, mỏi đầu gáy, ít mồ hôi.",
  },
  {
    key: "phongNhiet",
    name: "Phong nhiệt",
    cues: ["nong", "sot", "hong dau", "mieng kho", "mat do"],
    description:
      "Biểu nhiệt do phong nhiệt: đau đầu, sốt, họng đau, khát, miệng khô.",
  },
  {
    key: "thapNhiet",
    name: "Thấp nhiệt",
    cues: ["nang ne", "mui hoi", "tieu it", "dau bung", "tieu chay", "sung nong do"],
    description:
      "Thấp nhiệt ứ trệ: nặng nề, mỏi, đau khớp kèm sưng nóng đỏ; tiêu chảy hôi; tiểu ít.",
  },
  {
    key: "canKhiUat",
    name: "Can khí uất",
    cues: ["cang tuc nguc suon", "stres", "hay tho dai", "day bung", "o hoi", "cau gat"],
    description:
      "Khí cơ uất trệ: căng tức ngực sườn, đầy bụng, ợ hơi, cảm xúc bức bối.",
  },
  {
    key: "huyetU",
    name: "Huyết ứ",
    cues: ["dau nhoi", "dau co dinh", "tham tim", "sau chan thuong"],
    description:
      "Huyết ứ: đau nhói cố định, tím bầm, thường sau chấn thương hoặc ứ trệ lâu ngày.",
  },
  {
    key: "tyViHuHan",
    name: "Tỳ vị hư hàn",
    cues: ["dau bung am i", "lanh bung", "an kem", "tieu chay", "tay chan lanh"],
    description:
      "Tỳ vị hư hàn: đau âm ỉ bụng, sợ lạnh, ăn kém, tiêu lỏng, chân tay lạnh.",
  },
];

type Acupoint = {
  name: string;
  desc: string;
  principle: string;
  imageUrl?: string;
};

function acupointImage(name: string): string | undefined {
  // Dùng ảnh minh họa cơ bản từ public làm mặc định; có thể thay thế bằng ảnh Wikimedia qua image-proxy
  const defaults: Record<string, string> = {
    "Phong trì (GB20)": "/window.svg",
    "Hợp cốc (LI4)": "/window.svg",
    "Kiên tỉnh (GB21)": "/window.svg",
    "Ủy trung (BL40)": "/window.svg",
    "Túc tam lý (ST36)": "/window.svg",
    "Trung quản (CV12)": "/window.svg",
    "Khí hải (CV6)": "/window.svg",
    "Nội quan (PC6)": "/window.svg",
    "Thái xung (LV3)": "/window.svg",
    "Huyết hải (SP10)": "/window.svg",
  };
  return defaults[name];
}

function suggestAcupoints(text: string, patternKey: string): Acupoint[] {
  const n = noAccent(text);
  const pts: Acupoint[] = [];

  // Vị trí cơ thể
  const hasHead = /\b(dau|dau dau|tran|thai duong)\b/.test(n);
  const hasNeck = /\b(gay|co|vai)\b/.test(n);
  const hasShoulder = /\b(vai|khop vai|khoi vai)\b/.test(n);
  const hasBack = /\b(lung)\b/.test(n);
  const hasKnee = /\b(goi|khop goi)\b/.test(n);
  const hasLeg = /\b(chan|dui|cang chan|ban chan)\b/.test(n);
  const hasStomach = /\b(bung|da day|thuong vi|ha vi|ron)\b/.test(n);
  const hasChest = /\b(nguc|tuc nguc)\b/.test(n);

  if (hasHead || patternKey === "phongHan") {
    pts.push({ name: "Phong trì (GB20)", desc: "Chỗ lõm sau gáy, ngoài cơ thang; khu phong, giảm đau đầu/gáy.", principle: "Khu phong, tán hàn, thư cân", imageUrl: acupointImage("Phong trì (GB20)") });
    pts.push({ name: "Hợp cốc (LI4)", desc: "Khe giữa xương bàn tay I–II; hành khí, giảm đau vùng đầu/mặt.", principle: "Hành khí, chỉ thống, điều hòa vệ khí", imageUrl: acupointImage("Hợp cốc (LI4)") });
  }
  if (hasShoulder || hasNeck) {
    pts.push({ name: "Kiên tỉnh (GB21)", desc: "Giữa vai; thư cân, giảm đau vai/cổ (tránh day mạnh khi mang thai).", principle: "Thư cân hoạt lạc, tán ứ", imageUrl: acupointImage("Kiên tỉnh (GB21)") });
  }
  if (hasKnee || hasLeg || hasBack) {
    pts.push({ name: "Ủy trung (BL40)", desc: "Giữa nếp khoeo; thư cân, giảm đau lưng/gối.", principle: "Thư cân, thông lạc, hành khí huyết", imageUrl: acupointImage("Ủy trung (BL40)") });
    pts.push({ name: "Túc tam lý (ST36)", desc: "Dưới bờ xương bánh chè ~3 cun; kiện tỳ, tăng sức, giảm đau chi.", principle: "Kiện tỳ vị, bổ khí huyết", imageUrl: acupointImage("Túc tam lý (ST36)") });
  }
  if (hasStomach || patternKey === "tyViHuHan") {
    pts.push({ name: "Trung quản (CV12)", desc: "Giữa đường nối ức–rốn; hòa vị, giảm đau dạ dày/đầy trướng.", principle: "Hòa vị, giáng nghịch", imageUrl: acupointImage("Trung quản (CV12)") });
    pts.push({ name: "Khí hải (CV6)", desc: "Dưới rốn ~1.5 cun; ôn dương, trợ khí, giảm đau âm ỉ bụng.", principle: "Ôn bổ nguyên khí, cố dương", imageUrl: acupointImage("Khí hải (CV6)") });
  }
  if (hasChest || patternKey === "canKhiUat") {
    pts.push({ name: "Nội quan (PC6)", desc: "Cách nếp gấp cổ tay 2 cun, giữa gân; lý khí, giảm tức ngực, buồn nôn.", principle: "Lý khí, hòa vị, an thần", imageUrl: acupointImage("Nội quan (PC6)") });
    pts.push({ name: "Thái xung (LV3)", desc: "Khe giữa xương bàn chân I–II; sơ can, giảm căng tức sườn.", principle: "Sơ can lý khí, hoạt huyết", imageUrl: acupointImage("Thái xung (LV3)") });
  }

  // Đặc hiệu theo pattern
  if (patternKey === "huyetU") {
    pts.push({ name: "Huyết hải (SP10)", desc: "Mặt trong đùi, trên bờ xương bánh chè; hoạt huyết, tán ứ.", principle: "Hoạt huyết, tán ứ", imageUrl: acupointImage("Huyết hải (SP10)") });
  }

  // Duy nhất hóa
  const seen = new Set<string>();
  return pts.filter((p) => {
    const k = p.name;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

type NutritionAdvice = {
  shouldEat: string[];
  avoid: string[];
  principles?: string[];
};

function suggestNutrition(patternKey: string): NutritionAdvice {
  switch (patternKey) {
    case "phongHan":
      return {
        shouldEat: ["Cháo nóng với tía tô/kinh giới", "Trà gừng ấm", "Canh hành"],
        avoid: ["Đồ lạnh", "Nước đá", "Rau sống lạnh"],
        principles: ["Phát hãn nhẹ, khu phong tán hàn"]
      };
    case "phongNhiet":
      return {
        shouldEat: ["Nước ấm nhiều", "Cháo loãng", "Nước chanh ấm"],
        avoid: ["Đồ cay nóng", "Chiên rán", "Rượu bia"],
        principles: ["Thanh nhiệt, dưỡng âm nhẹ"]
      };
    case "thapNhiet":
      return {
        shouldEat: ["Ý dĩ (bo bo)", "Rau má", "Canh bí đao nhạt"],
        avoid: ["Đồ nhiều dầu mỡ", "Đồ ngọt béo", "Đồ cay nóng"],
        principles: ["Lợi thấp, thanh nhiệt"]
      };
    case "canKhiUat":
      return {
        shouldEat: ["Trà hoa cúc ấm", "Tía tô/hoắc hương", "Ăn nhẹ, dễ tiêu"],
        avoid: ["Cà phê quá mức", "Rượu bia", "Đồ kích thích"],
        principles: ["Sơ can lý khí, hòa vị"]
      };
    case "huyetU":
      return {
        shouldEat: ["Gừng vừa phải", "Món ấm nóng", "Ngũ cốc nguyên hạt"],
        avoid: ["Đồ lạnh", "Ít vận động (nên đi lại nhẹ)", "Thuốc lá"],
        principles: ["Hoạt huyết, tán ứ, ôn hóa nhẹ"]
      };
    case "tyViHuHan":
      return {
        shouldEat: ["Cháo gạo trắng ấm", "Gừng, quế rất ít", "Khoai, cà rốt hầm"],
        avoid: ["Đồ sống/lạnh", "Uống lạnh", "Rau sống"],
        principles: ["Ôn trung kiện tỳ, cố dương"]
      };
    default:
      return { shouldEat: ["Ăn ấm, dễ tiêu"], avoid: ["Đồ lạnh, dầu mỡ"], principles: ["Hòa vị, điều dưỡng"] };
  }
}

function contraindications(patternKey: string): string[] {
  switch (patternKey) {
    case "phongNhiet":
      return ["Tránh sử dụng gừng/quế liều cao khi có biểu nhiệt", "Hạn chế ớt, tiêu, rượu bia"];
    case "tyViHuHan":
      return ["Tránh đồ sống/lạnh; không dùng đồ lạnh sau ăn", "Thận trọng với rau sống khi tiêu hóa yếu"];
    case "huyetU":
      return ["Tránh nằm bất động lâu; tăng vận động nhẹ", "Thận trọng với các thuốc/dược liệu gây đông máu"];
    case "canKhiUat":
      return ["Tránh chất kích thích (cà phê quá mức, rượu)", "Quản lý stress, ngủ đủ"];
    case "thapNhiet":
      return ["Hạn chế dầu mỡ, đồ ngọt; tránh cay nóng", "Giữ vệ sinh ăn uống, uống ấm"];
    case "phongHan":
      return ["Tránh gió/lạnh trực tiếp sau khi ra mồ hôi", "Không tắm nước lạnh khi mệt"];
    default:
      return ["Tuân thủ nguyên tắc ăn ấm, tránh lạnh"];
  }
}

function probingQuestions(text: string): string[] {
  const n = noAccent(text);
  const qs: string[] = [];
  const ask = (arr: string[]) => arr.forEach((q) => qs.push(q));

  if (/\bdau lung\b/.test(n)) {
    ask(["Đau có lan xuống mông/chân không?", "Có tê yếu chi dưới hoặc hạn chế vận động?", "Đau tăng khi trời lạnh hay khi vận động?"]);
  }
  if (/\bdau dau\b/.test(n)) {
    ask(["Đau vùng nào (trán, gáy, thái dương)?", "Có sợ gió/lạnh hoặc kèm sốt khát?", "Có mỏi cổ/gáy hoặc stress kéo dài?"]);
  }
  if (/\bday bung|da day|bung kho chiu\b/.test(n)) {
    ask(["Ăn kém hay đầy trướng sau ăn?", "Phân lỏng hay táo bón?", "Có sợ lạnh hoặc lạnh bụng không?"]);
  }
  if (/\bmat ngu|ngu kem\b/.test(n)) {
    ask(["Khó ngủ do lo âu/stress hay do đau?", "Có mộng mị, dễ tỉnh hoặc tim hồi hộp?", "Giấc ngủ cải thiện khi thư giãn?"]);
  }

  // Nếu câu mô tả quá ngắn, thêm câu hỏi chung
  if (n.length < 15) {
    ask(["Triệu chứng kéo dài bao lâu?", "Thời điểm nặng hơn (sáng/chiều/tối)?"]);
  }
  // Đảm bảo tối thiểu 2 câu
  return qs.slice(0, Math.max(2, qs.length));
}

function pickPatterns(text: string): { primary: { p: Pattern; score: number } | null; secondary: { p: Pattern; score: number } | null } {
  const n = noAccent(text);
  const scored = PATTERNS.map((p) => ({ p, score: p.cues.reduce((acc, cue) => (n.includes(cue) ? acc + 1 : acc), 0) }))
    .sort((a, b) => b.score - a.score);
  const primary = scored[0] && scored[0].score > 0 ? scored[0] : null;
  const secondary = scored[1] && scored[1].score > 0 ? scored[1] : null;
  return { primary, secondary };
}

async function getHerbInfo(names: string[]): Promise<HerbInfo[]> {
  const out: HerbInfo[] = [];
  try {
    await dbConnect();
    // Cache đơn giản để giảm độ trễ tra cứu dược liệu
    const HERB_CACHE: Map<string, HerbInfo> = (global as any).__HERB_CACHE__ || new Map<string, HerbInfo>();
    (global as any).__HERB_CACHE__ = HERB_CACHE;

    await Promise.all(
      names.map(async (name) => {
        const key = name.trim().toLowerCase();
        const cached = HERB_CACHE.get(key);
        if (cached) {
          out.push(cached);
          return;
        }
        const raw = await DuocLieu.findOne({ ten: { $regex: name, $options: "i" } }).lean();
        const doc = raw as DuocLieuLean | null;
        if (doc && !Array.isArray(doc)) {
          const info: HerbInfo = {
            ten: doc.ten ?? name,
            vi: doc.vi ?? [],
            tinh: doc.tinh ?? [],
            quyKinh: doc.quyKinh ?? [],
            congDung: doc.congDung ?? [],
            chiDinh: doc.chiDinh ?? [],
            cachDung: doc.cachDung ?? "",
            anhMinhHoa: doc.anhMinhHoa ?? "",
            id: (raw as any)?._id ? String((raw as any)._id) : undefined,
            sourceLink: `/duoc-lieu?q=${encodeURIComponent(doc.ten ?? name)}`,
          };
          HERB_CACHE.set(key, info);
          out.push(info);
        }
      })
    );
  } catch {
    // DB optional; ignore errors
  }
  // Fallback: tìm trong dữ liệu mẫu nếu DB không khả dụng hoặc không tìm thấy
  try {
    if (out.length < names.length) {
      const remaining = names.filter((n) => !out.some((o) => noAccent(o.ten).includes(noAccent(n))));
      const list = Array.isArray(sampleDuocLieu) ? (sampleDuocLieu as any[]) : [];
      for (const name of remaining) {
        const term = noAccent(name);
        const found = list.find((it) => {
          const t1 = noAccent(it?.ten || "");
          const t2 = noAccent(it?.tenKhoaHoc || "");
          return t1.includes(term) || t2.includes(term);
        });
        if (found) {
          out.push({
            ten: found.ten || name,
            vi: Array.isArray(found.vi) ? found.vi : [],
            tinh: Array.isArray(found.tinh) ? found.tinh : [],
            quyKinh: Array.isArray(found.quyKinh) ? found.quyKinh : [],
            congDung: Array.isArray(found.congDung) ? found.congDung : [],
            chiDinh: Array.isArray(found.chiDinh) ? found.chiDinh : [],
            cachDung: typeof found.cachDung === 'string' ? found.cachDung : "",
            anhMinhHoa: found.anhMinhHoa || "",
            id: found._id ? String(found._id) : undefined,
            sourceLink: `/duoc-lieu?q=${encodeURIComponent(found.ten || name)}`,
          });
        }
      }
    }
  } catch {}
  return out;
}

function herbCandidates(patternKey: string): string[] {
  switch (patternKey) {
    case "phongHan":
      return ["Gừng", "Kinh giới", "Tía tô", "Quế"];
    case "phongNhiet":
      return ["Bạc hà", "Kim ngân hoa", "Hoàng liên", "Rau má"];
    case "thapNhiet":
      return ["Ý dĩ", "Trạch tả", "Phục linh", "Hoắc hương"];
    case "canKhiUat":
      return ["Mộc hương", "Tía tô", "Hoắc hương"];
    case "huyetU":
      return ["Xuyên khung", "Hồng hoa", "Đương quy"];
    case "tyViHuHan":
      return ["Gừng", "Quế", "Bạch truật"];
    default:
      return ["Gừng", "Tía tô", "Bạc hà"];
  }
}

// Tra cứu đơn giản: huyệt đạo
const ACUPOINT_KB: Record<string, { name: string; desc: string; principle: string }> = {
  "hop coc": { name: "Hợp cốc (LI4)", desc: "Giữa xương bàn tay I–II; hành khí, giảm đau đầu/mặt.", principle: "Hành khí, chỉ thống" },
  "phong tri": { name: "Phong trì (GB20)", desc: "Lõm ngoài cơ thang; khu phong, giảm đau đầu/gáy.", principle: "Khu phong, tán hàn" },
  "noi quan": { name: "Nội quan (PC6)", desc: "Cách nếp gấp cổ tay 2 cun; lý khí, giảm tức ngực, buồn nôn.", principle: "Lý khí, hòa vị" },
  "thai xung": { name: "Thái xung (LV3)", desc: "Khe giữa xương bàn chân I–II; sơ can, giảm căng tức sườn.", principle: "Sơ can lý khí" },
  "tuc tam ly": { name: "Túc tam lý (ST36)", desc: "Dưới xương bánh chè ~3 cun; kiện tỳ, giảm đau chi.", principle: "Kiện tỳ vị, bổ khí" },
};

function findAcupointFromText(text: string): Acupoint | null {
  const n = noAccent(text);
  for (const key of Object.keys(ACUPOINT_KB)) {
    if (n.includes(key)) {
      const base = ACUPOINT_KB[key];
      return { name: base.name, desc: base.desc, principle: base.principle, imageUrl: acupointImage(base.name) };
    }
  }
  return null;
}

async function findHerbFromQuestion(message: string): Promise<HerbInfo | null> {
  const m1 = message.match(/công dụng của\s+([^\?\.!\n]+)/i);
  const m2 = message.match(/cong dung cua\s+([^\?\.!\n]+)/i);
  const raw = (m1?.[1] || m2?.[1] || "").trim();
  if (!raw) return null;
  const list = await getHerbInfo([raw]);
  return list[0] || null;
}

// Mở rộng tra cứu: dược liệu, bệnh, bài thuốc theo cụm từ "tra cứu ...", "... là gì"
async function findLookupExt(message: string): Promise<
  { type: "herb" | "acupoint" | "disease" | "formula"; term: string; herb?: HerbInfo; acupoint?: Acupoint; disease?: any; formula?: any }
  | null
> {
  const n = noAccent(message);
  // lấy cụm từ sau "tra cuu" hoặc "... la gi"
  const m1 = n.match(/tra cuu\s+([^\?\.\!\n]+)/);
  const m2 = n.match(/([^\?\.\!\n]+)\s+la gi/);
  const term = (m1?.[1] || m2?.[1] || "").trim();
  if (!term) return null;

  // Ưu tiên huyệt
  const acu = findAcupointFromText(term);
  if (acu) return { type: "acupoint", term, acupoint: acu };

  // Dược liệu
  const herbs = await getHerbInfo([term]);
  if (herbs[0]) return { type: "herb", term, herb: herbs[0] };

  // Bệnh
  try {
    await dbConnect();
    const d: any = await Benh.findOne({ ten: { $regex: term, $options: "i" } })
      .populate("baiThuocLienQuan")
      .lean();
    if (d) {
      return {
        type: "disease",
        term,
        disease: {
          ten: d.ten,
          moTa: d.moTa,
          trieuchung: d.trieuchung || [],
          phuongPhapDieuTri: d.phuongPhapDieuTri || "",
          baiThuocLienQuan: (d.baiThuocLienQuan || []).map((b: any) => ({ id: String(b?._id || ""), ten: b?.ten })),
        },
      };
    }
  } catch {}

  // Bài thuốc
  try {
    await dbConnect();
    const f: any = await BaiThuoc.findOne({ ten: { $regex: term, $options: "i" } }).lean();
    if (f) {
      return {
        type: "formula",
        term,
        formula: {
          id: String((f as any)?._id || ""),
          ten: (f as any)?.ten,
          congDung: (f as any)?.congDung || "",
          thanhPhan: ((f as any)?.thanhPhan || []).slice(0, 6).map((tp: any) => tp?.tenDuocLieu || ""),
        },
      };
    }
  } catch {}

  return null;
}

async function findLookup(message: string): Promise<{ herb?: HerbInfo; acupoint?: Acupoint; term?: string } | null> {
  const n = noAccent(message);
  const mTraCuu = n.match(/tra cuu\s+([^\?\.!\n]+)/i);
  const mLaGi = n.match(/(huyet|huyet dao|huyet\s+)[^\s]+.*la gi/i) || n.match(/([^\?\.!\n]+)\s+la gi/i);
  const term = (mTraCuu?.[1] || mLaGi?.[1] || "").trim();
  if (!term) return null;
  // Ưu tiên nhận diện huyệt trước nếu trùng từ khóa
  const acu = findAcupointFromText(term);
  if (acu) return { acupoint: acu, term };
  const herbs = await getHerbInfo([term]);
  if (herbs[0]) return { herb: herbs[0], term };
  return null;
}

function aggregateContext(messages: { role: "user" | "assistant"; content: string }[] | undefined, current: string): string {
  const parts: string[] = [];
  if (Array.isArray(messages)) {
    const recentUser = messages.filter((m) => m.role === "user").slice(-5);
    for (const m of recentUser) parts.push((m.content || "").trim());
  }
  parts.push(current.trim());
  return parts.filter(Boolean).join(". ");
}

// Rút trích từ khóa đơn giản từ câu tự do (không dấu)
function extractKeywords(input: string, limit: number = 5): string[] {
  const n = noAccent(input).replace(/[^a-z0-9\s]/g, " ");
  const stop: Set<string> = new Set([
    "toi","ban","la","thi","va","hoac","nhu","khi","bi","rat","dau","cam","thay","o","tai","co","gia","ngay","dem","sang","chieu","toi","co","bi","kho","met","ngu","khong","co","la","gi","theo","y","hct","yhct"
  ]);
  const counts: Record<string, number> = {};
  for (const w of n.split(/\s+/).filter(Boolean)) {
    if (w.length < 3 || stop.has(w)) continue;
    counts[w] = (counts[w] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a,b)=>b[1]-a[1])
    .slice(0, limit)
    .map(([k])=>k);
}

async function searchCollectionsByKeywords(keywords: string[]) {
  const q = keywords.length ? keywords.join("|") : "";
  const regex = q ? new RegExp(q, "i") : null;
  const out: { diseases: any[]; herbs: any[]; formulas: any[] } = { diseases: [], herbs: [], formulas: [] };
  try {
    await dbConnect();
    if (regex) {
      // Bệnh
      try {
        const ds: any[] = await Benh.find({ $or: [ { ten: regex }, { moTa: regex }, { trieuchung: regex } ] }).limit(5).lean();
        out.diseases = ds.map((d:any)=>({ id: String(d._id||""), ten: d.ten }));
      } catch {}
      // Dược liệu
      try {
        const hs: any[] = await DuocLieu.find({ $or: [ { ten: regex }, { congDung: regex }, { chiDinh: regex } ] }).limit(5).lean();
        out.herbs = hs.map((h:any)=>({ id: String(h._id||""), ten: h.ten }));
      } catch {}
      // Bài thuốc
      try {
        const fs: any[] = await BaiThuoc.find({ $or: [ { ten: regex }, { congDung: regex }, { "thanhPhan.tenDuocLieu": regex } ] }).limit(5).lean();
        out.formulas = fs.map((f:any)=>({ id: String(f._id||""), ten: f.ten }));
      } catch {}
    }
  } catch {}
  return out;
}

// Bộ nhớ đệm đơn giản cho truy vấn bệnh theo từ khóa để tăng tốc
type RetrievalHit = { id: string; ten: string; score: number; reason: string; link?: string; baiThuocCount?: number };
const getRetrievalCache = () => {
  const g: any = global as any;
  if (!g.__RETRIEVAL_CACHE__) g.__RETRIEVAL_CACHE__ = new Map<string, RetrievalHit[]>();
  return g.__RETRIEVAL_CACHE__ as Map<string, RetrievalHit[]>;
};

async function retrieveDiseasesByText(text: string, detectedSymptoms: string[]): Promise<RetrievalHit[]> {
  const key = noAccent(text).slice(0, 200);
  const cache = getRetrievalCache();
  const cached = cache.get(key);
  if (cached) return cached;

  const keywords = extractKeywords(text, 8);
  if (keywords.length === 0) return [];
  const regex = new RegExp(keywords.join("|"), "i");

  try {
    await dbConnect();
    const docs: any[] = await Benh.find({ $or: [ { ten: regex }, { moTa: regex }, { trieuchung: regex } ] })
      .select({ ten: 1, moTa: 1, trieuchung: 1, baiThuocLienQuan: 1 })
      .limit(50)
      .lean();

    const symNo = detectedSymptoms.map((s) => noAccent(s));
    const hits: RetrievalHit[] = docs.map((d) => {
      const name = String(d?.ten || "");
      const moTa = String(d?.moTa || "");
      const trieuchung: string[] = Array.isArray(d?.trieuchung) ? d.trieuchung : [];
      const textNo = noAccent([name, moTa, trieuchung.join(" ")].join(". "));
      let score = 0;
      for (const kw of keywords) {
        const nkw = noAccent(kw);
        if (noAccent(name).includes(nkw)) score += 3;
        if (textNo.includes(nkw)) score += 1;
      }
      for (const sym of symNo) {
        if (textNo.includes(sym)) score += 2;
      }
      const reasonParts: string[] = [];
      if (keywords.some((k) => noAccent(name).includes(noAccent(k)))) reasonParts.push("khớp tên");
      if (trieuchung.length && keywords.some((k) => trieuchung.some((t) => noAccent(t).includes(noAccent(k))))) reasonParts.push("khớp triệu chứng");
      if (symNo.some((s) => textNo.includes(s))) reasonParts.push("trùng mô tả/symptom");
      const reason = reasonParts.slice(0, 2).join(", ");
      const id = String(d?._id || "");
      const baiThuocCount = Array.isArray(d?.baiThuocLienQuan) ? d.baiThuocLienQuan.length : undefined;
      return { id, ten: name, score, reason, link: id ? `/benh/${id}` : undefined, baiThuocCount };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

    cache.set(key, hits);
    return hits;
  } catch {
    return [];
  }
}

function isAmbiguous(text: string, primary: { p: Pattern; score: number } | null, symptoms: string[]): boolean {
  const n = noAccent(text);
  const vague = ["mo ho", "khong ro", "may may", "doi khi", "thi thoang", "kho chiu", "met moi", "hoi dau", "chut", "mot chut", "dau hon"];
  const hasVague = hasAny(n, vague);
  const lowScore = (primary?.score || 0) < 2;
  const fewSymptoms = (symptoms || []).length < 1;
  return hasVague || lowScore || fewSymptoms;
}

// Tính điểm tin cậy cho gợi ý thể bệnh
function computeConfidence(primary: { p: Pattern; score: number } | null, secondary: { p: Pattern; score: number } | null, symptoms: string[]): number {
  const maxScore = 5; // số cue tối đa mang tính tương đối
  const base = Math.min(1, (primary?.score || 0) / maxScore);
  const bonus = Math.min(0.3, symptoms.length * 0.06);
  const penalty = secondary && (secondary.score >= (primary?.score || 0)) ? 0.2 : 0;
  const conf = Math.max(0, Math.min(1, base + bonus - penalty));
  return Number(conf.toFixed(2));
}

// Điều chỉnh cảnh báo/khuyến cáo theo tuổi, giới và bối cảnh (mang thai)
function personalizeWarnings(warnings: string[], body: ChatRequest, acupoints: Acupoint[], text: string): { warnings: string[]; acupoints: Acupoint[]; notes: string[] } {
  const outWarnings = [...warnings];
  const notes: string[] = [];
  const n = noAccent(text);
  const isChild = typeof body.age === "number" && body.age < 12;
  const isElder = typeof body.age === "number" && body.age >= 65;
  const isFemale = (body.gender || "").toLowerCase().startsWith("f") || (body.gender || "").toLowerCase() === "nu";
  const pregnant = isFemale && (/(mang thai|co thai|bau|thai)/.test(n));

  if (isChild) {
    outWarnings.push("Trẻ <12 tuổi: tránh tự dùng dược liệu/ethanol; tham khảo bác sĩ nhi.");
  }
  if (isElder) {
    outWarnings.push("Người ≥65 tuổi: thận trọng bệnh nền và tương tác thuốc Tây y.");
  }
  if (pregnant) {
    outWarnings.push("Phụ nữ mang thai: tránh day ấn huyệt vùng bụng/thắt lưng mạnh; hỏi ý kiến chuyên gia.");
  }

  // Lọc huyệt không an toàn khi mang thai (ví dụ GB21 Kiên tỉnh)
  let filtered = acupoints;
  if (pregnant) {
    filtered = acupoints.filter((p) => !/Kiên tỉnh \(GB21\)/.test(p.name));
    if (filtered.length !== acupoints.length) {
      notes.push("Đã ẩn huyệt Kiên tỉnh (GB21) do thai kỳ.");
    }
  }

  return { warnings: Array.from(new Set(outWarnings)), acupoints: filtered, notes };
}

function safeDefaultAcupoints(): Acupoint[] {
  return [
    { name: "Hợp cốc (LI4)", desc: "Giữa xương bàn tay I–II; hỗ trợ giảm đau chung.", principle: "Chỉ thống, điều khí", imageUrl: acupointImage("Hợp cốc (LI4)") },
  ];
}

function explainEtiology(patternKey: string, patternName: string): string {
  switch (patternKey) {
    case "phongHan":
      return `${patternName} (Biểu Hàn, Thực) — tức là tà phong hàn xâm nhập phần biểu, vệ khí bị trở ngại khiến đau đầu, mỏi gáy, sợ gió/lạnh, ít mồ hôi.`;
    case "phongNhiet":
      return `${patternName} (Biểu Nhiệt, Thực) — tức là nhiệt tà phạm biểu gây sốt, khát, họng đau, mặt/mắt đỏ.`;
    case "thapNhiet":
      return `${patternName} (Lý, Thấp Nhiệt, Thực) — tức là thấp nhiệt ứ trệ, trở ngại khí cơ và cân mạch khiến nặng nề, đau khớp sưng nóng đỏ, tiêu hóa bất lợi.`;
    case "canKhiUat":
      return `${patternName} (Lý, Thực trệ) — tức là can khí uất kết, khí cơ mất sơ tiết gây căng tức ngực sườn, đầy bụng, ợ hơi, dễ cáu/khó ngủ.`;
    case "huyetU":
      return `${patternName} (Lý, Thực) — tức là huyết hành trì trệ, ứ lại gây đau cố định/đau nhói, tím bầm, thường sau chấn thương hoặc ứ trệ lâu ngày.`;
    case "tyViHuHan":
      return `${patternName} (Lý, Hư Hàn) — tức là tỳ vị hư hàn, dương khí bất túc làm đau âm ỉ bụng, ăn kém, tiêu lỏng, sợ lạnh.`;
    default:
      return `Triệu chứng chưa đủ rõ để quy về một thể bệnh cụ thể. Có thể liên quan đến mất điều hòa khí huyết hoặc thực/ hư.`;
  }
}

function treatmentPrinciples(patternKey: string): string[] {
  switch (patternKey) {
    case "phongHan":
      return ["Khu phong tán hàn", "Phát hãn nhẹ", "Thư cân hoạt lạc"];
    case "phongNhiet":
      return ["Thanh nhiệt giải biểu", "Tuyên phế lý khí", "Bảo vệ tân dịch"];
    case "thapNhiet":
      return ["Lợi thấp thanh nhiệt", "Hành khí hoạt lạc", "Kiện tỳ"];
    case "canKhiUat":
      return ["Sơ can lý khí", "Hòa vị an thần", "Điều khí huyết"];
    case "huyetU":
      return ["Hoạt huyết hóa ứ", "Thư cân thông lạc", "Ôn hóa nhẹ"];
    case "tyViHuHan":
      return ["Ôn trung kiện tỳ", "Cố dương", "Hòa vị"];
    default:
      return ["Điều khí hòa vị", "Dưỡng chính khứ tà nhẹ"];
  }
}

function detectSymptoms(text: string): string[] {
  const n = noAccent(text);
  const map: Record<string, RegExp[]> = {
    "Đau đầu": [/\bdau dau\b/],
    "Đau gáy/ cổ": [/\bdau gay|co|vai\b/],
    "Đau lưng": [/\bdau lung\b/],
    "Đau gối/ chân": [/\bgoi|chan|dui\b/],
    "Đầy bụng/ dạ dày": [/\bday bung|da day|bung kho chiu\b/],
    "Mất ngủ": [/\bmat ngu|ngu kem\b/],
    "Sốt/ nóng": [/\bsot|nong\b/],
    "Sợ gió/ lạnh": [/\bso gio|lanh\b/],
    "Buồn nôn/ nôn": [/\bbuon non|non\b/],
    "Tiêu chảy": [/\btieu chay\b/],
  };
  const out: string[] = [];
  for (const [label, regs] of Object.entries(map)) {
    if (regs.some((r) => r.test(n))) out.push(label);
  }
  return out;
}

// Điều chỉnh ưu tiên theo triệu chứng để tạo khác biệt giữa các nhóm câu hỏi
function specializeBySymptoms(symptoms: string[], acupoints: Acupoint[], herbs: HerbInfo[], patternKey: string) {
  const head = symptoms.includes("Đau đầu");
  const stomach = symptoms.includes("Đầy bụng/ dạ dày") || symptoms.includes("Buồn nôn/ nôn") || symptoms.includes("Tiêu chảy");
  let specializedAcupoints = [...acupoints];
  let specializedHerbs = [...herbs];
  const prioritize = (names: string[]) =>
    (list: any[], pick: (x: any) => string) =>
      list.slice().sort((a, b) => (names.includes(pick(b)) ? 1 : 0) - (names.includes(pick(a)) ? 1 : 0));

  if (head) {
    specializedAcupoints = prioritize(["Phong trì (GB20)", "Hợp cốc (LI4)"])(specializedAcupoints, (x) => x.name);
    specializedHerbs = prioritize(["Bạc hà", "Kinh giới", "Tía tô", "Xuyên khung"])(specializedHerbs, (x) => x.ten);
  }
  if (stomach) {
    specializedAcupoints = prioritize(["Trung quản (CV12)", "Khí hải (CV6)", "Túc tam lý (ST36)"])(specializedAcupoints, (x) => x.name);
    specializedHerbs = prioritize(["Gừng", "Bạch truật", "Hoắc hương", "Ý dĩ"])(specializedHerbs, (x) => x.ten);
  }

  // Cắt ngắn top 4 để rõ ràng
  return {
    acupoints: specializedAcupoints.slice(0, 4),
    herbs: specializedHerbs.slice(0, 6),
    note:
      head
        ? "Tối ưu cho đau đầu: ưu tiên huyệt vùng đầu-mặt và dược liệu giải biểu."
        : stomach
        ? "Tối ưu cho đầy bụng/tiêu hóa: ưu tiên huyệt vị hóa trệ, kiện tỳ."
        : undefined,
  };
}

// Bát Cương cơ bản cho từng thể
function eightPrinciplesForPattern(patternKey: string): string[] {
  switch (patternKey) {
    case "phongHan":
      return ["Biểu", "Hàn", "Thực"];
    case "phongNhiet":
      return ["Biểu", "Nhiệt", "Thực"];
    case "thapNhiet":
      return ["Lý", "Thấp/Nhiệt", "Thực"];
    case "canKhiUat":
      return ["Lý", "Thực trệ"];
    case "huyetU":
      return ["Lý", "Thực (huyết ứ)"];
    case "tyViHuHan":
      return ["Lý", "Hư", "Hàn"];
    default:
      return ["Chưa rõ"];
  }
}

// Tạng phủ liên hệ chính
function zangFuForPattern(patternKey: string): string[] {
  switch (patternKey) {
    case "phongHan":
    case "phongNhiet":
      return ["Phế", "Vệ khí (Biểu)"];
    case "thapNhiet":
    case "tyViHuHan":
      return ["Tỳ", "Vị"];
    case "canKhiUat":
    case "huyetU":
      return ["Can", "Huyết hải"];
    default:
      return ["Khí huyết tổng quát"];
  }
}

// Ngũ Hành suy luận: Mẹ/Con bị ảnh hưởng
function fiveElementAnalysis(patternKey: string): string {
  switch (patternKey) {
    case "canKhiUat":
      return "Mộc (Can) uất: nên quan sát Thổ (Tỳ) — dễ đầy trướng; Thủy (Thận) — nền tảng nuôi Mộc.";
    case "tyViHuHan":
      return "Thổ (Tỳ/Vị) hư hàn: xem Mộc (Can) khắc Thổ gây đầy trướng; Hỏa (Tâm) suy có thể giảm tiêu hóa.";
    case "phongHan":
      return "Kim (Phế) chịu tà phong hàn ở biểu: giữ ấm, hỗ trợ vệ khí.";
    case "phongNhiet":
      return "Kim (Phế) phạm nhiệt ở biểu: thanh nhiệt, bảo vệ tân dịch.";
    case "thapNhiet":
      return "Thổ (Tỳ) bị thấp nhiệt: lợi thấp, điều khí để bảo hộ Thổ.";
    case "huyetU":
      return "Can (Mộc) khí huyết ứ trệ: hoạt huyết, thông lạc, tránh ứ.";
    default:
      return "Cân bằng Ngũ Hành tổng quát: điều khí, dưỡng chính.";
  }
}

// Định hướng trị theo nguyên tắc Phù Chính/ Khu Tà
function phuChinhKhuTaDecision(patternKey: string): string {
  switch (patternKey) {
    case "tyViHuHan":
      return "Phù Chính (bổ ôn trung, kiện tỳ) là chủ đạo";
    case "huyetU":
      return "Khu Tà (hoạt huyết hóa ứ) là chủ đạo";
    case "canKhiUat":
      return "Khu Tà (sơ can lý khí, giải uất) là chủ đạo";
    case "phongHan":
      return "Khu Tà (khu phong tán hàn, phát hãn nhẹ) là chủ đạo";
    case "phongNhiet":
      return "Khu Tà (thanh nhiệt giải biểu) là chủ đạo";
    case "thapNhiet":
      return "Khu Tà (lợi thấp thanh nhiệt) là chủ đạo";
    default:
      return "Cân bằng Phù Chính/Khu Tà mức nhẹ";
  }
}

// Điều chỉnh theo mùa/môi trường
function environmentAdjustments(text: string): string[] {
  const n = noAccent(text);
  const tips: string[] = [];
  if (/(mua dong|lanh|hanh|han)/.test(n)) {
    tips.push("Giữ ấm vùng cổ gáy/bụng; tránh gió lùa (Hàn)");
  }
  if (/(mua he|nong|hoa|nang)/.test(n)) {
    tips.push("Bổ sung nước ấm; hạn chế cay nóng (Hỏa/Thử)");
  }
  if (/(nong am|am uot|am thap|thap)/.test(n)) {
    tips.push("Ăn nhạt dễ tiêu, tăng vận động nhẹ để hóa thấp (Thấp)");
  }
  if (/(lanh kho|kho hanh|tao)/.test(n)) {
    tips.push("Dưỡng âm, ẩm ấm; tránh khô lạnh kéo dài (Táo)");
  }
  return tips;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const message = (body.message || "").trim();
    if (!message) {
      return NextResponse.json({ error: "Thiếu nội dung câu hỏi" }, { status: 400 });
    }

    // Emergency guard
    const emergency = detectEmergency(message);
    if (emergency) {
      return NextResponse.json({
        chanChung: "Khẩn cấp",
        bienChung: emergency,
        phuongPhap: ["Khuyến cáo y tế khẩn"],
        giaiPhap: {
          acupoints: [],
          nutrition: { shouldEat: [], avoid: [], principles: [] },
          herbs: [],
        },
        canhBao: [
          "Triệu chứng nghiêm trọng/khẩn cấp. Gọi cấp cứu hoặc đến cơ sở y tế gần nhất ngay lập tức.",
        ],
        phanBiet: null,
        probingQuestions: [],
        symptomsDetected: [],
        disclaimer:
          "Đây chỉ là thông tin tham khảo theo Y học Cổ truyền và không thể thay thế cho việc chẩn đoán hoặc điều trị y tế chuyên nghiệp. Hãy tham khảo ý kiến bác sĩ hoặc chuyên gia YHCT có chuyên môn.",
      });
    }

    // Tra cứu đơn giản (ưu tiên): câu hỏi trực tiếp về huyệt/ dược liệu
    const directAcu = findAcupointFromText(message);
    const directHerb = await findHerbFromQuestion(message);
    const directLookup = await findLookupExt(message);

    if (directAcu || directHerb || directLookup) {
      const acupoints = directAcu ? [directAcu] : [];
      const herbs = directHerb ? [directHerb] : (directLookup?.herb ? [directLookup.herb] : []);
      const nutrition = { shouldEat: [], avoid: [], principles: [] as string[] };
      let response: any;
      if (directLookup?.type === "disease" && directLookup.disease) {
        response = {
          mode: "lookup",
          lookup: { type: "disease", disease: directLookup.disease, term: directLookup.term },
          chanChung: "Tra cứu bệnh",
          bienChung: directLookup.disease.moTa || "Bệnh theo YHCT",
          phuongPhap: ["Tham khảo mô tả và phương pháp trong trang Bệnh"],
          giaiPhap: { acupoints: [], nutrition, herbs: [] },
          canhBao: ["Thông tin tham khảo, không thay thế chẩn đoán."],
          phanBiet: null,
          probingQuestions: [],
          symptomsDetected: [],
          disclaimer:
            "Đây chỉ là thông tin tham khảo theo Y học Cổ truyền và không thể thay thế cho việc chẩn đoán hoặc điều trị y tế chuyên nghiệp. Hãy tham khảo ý kiến bác sĩ hoặc chuyên gia YHCT có chuyên môn.",
        };
      } else if (directLookup?.type === "formula" && directLookup.formula) {
        response = {
          mode: "lookup",
          lookup: { type: "formula", formula: directLookup.formula, term: directLookup.term },
          chanChung: "Tra cứu bài thuốc",
          bienChung: directLookup.formula.congDung || "Bài thuốc YHCT",
          phuongPhap: ["Thành phần và công năng theo trang Bài thuốc"],
          giaiPhap: { acupoints: [], nutrition, herbs: [] },
          canhBao: ["Thông tin tham khảo, không tự ý dùng thuốc."],
          phanBiet: null,
          probingQuestions: [],
          symptomsDetected: [],
          disclaimer:
            "Đây chỉ là thông tin tham khảo theo Y học Cổ truyền và không thể thay thế cho việc chẩn đoán hoặc điều trị y tế chuyên nghiệp. Hãy tham khảo ý kiến bác sĩ hoặc chuyên gia YHCT có chuyên môn.",
        };
      } else {
        response = {
          mode: "lookup",
          lookup: directAcu
            ? { type: "acupoint", acupoint: directAcu, term: directLookup?.term }
            : { type: "herb", herb: herbs[0], term: directLookup?.term },
          chanChung: directAcu ? "Tra cứu huyệt" : "Tra cứu dược liệu",
          bienChung: directAcu
            ? `Huyệt ${directAcu.name}: ${directAcu.desc}`
            : `Dược liệu ${herbs[0]?.ten || "—"}: ${(herbs[0]?.congDung || []).slice(0, 1).join("; ") || "Công năng chính"}.`,
          phuongPhap: directAcu ? [directAcu.principle] : ["Tham khảo công năng/ chỉ định từ Trang Dược liệu"],
          giaiPhap: { acupoints, nutrition, herbs },
          canhBao: [
            directAcu
              ? "Không bấm quá mạnh, thận trọng nếu có bệnh nền hoặc mang thai."
              : "Không tự ý dùng quá liều; thận trọng khi nội nhiệt/ hỏa vượng.",
          ],
          phanBiet: null,
          probingQuestions: [],
          symptomsDetected: [],
          disclaimer:
            "Đây chỉ là thông tin tham khảo theo Y học Cổ truyền và không thể thay thế cho việc chẩn đoán hoặc điều trị y tế chuyên nghiệp. Hãy tham khảo ý kiến bác sĩ hoặc chuyên gia YHCT có chuyên môn.",
        } as any;
      }
      return NextResponse.json(response);
    }

    const contextText = aggregateContext(body.messages, message);
    const { primary, secondary } = pickPatterns(contextText);
    const patternKey = primary?.p.key || "";
    const patternName = primary?.p.name || "Chưa rõ thể";
    const acupointsRaw = suggestAcupoints(contextText, patternKey);
    const nutrition = suggestNutrition(patternKey);
    const herbs = await getHerbInfo(herbCandidates(patternKey));
    const warnings = contraindications(patternKey);
    const symptoms = detectSymptoms(contextText);
    const questions = probingQuestions(contextText);
    const batCuong = eightPrinciplesForPattern(patternKey);
    const tangPhu = zangFuForPattern(patternKey);
    const nguHanh = fiveElementAnalysis(patternKey);
    const dinhHuongTri = phuChinhKhuTaDecision(patternKey);
    const moiTruong = environmentAdjustments(contextText);
    const dangerSigns = dangerSignsList();

    const needMore = isAmbiguous(contextText, primary, symptoms);
    let acupoints = needMore ? safeDefaultAcupoints() : acupointsRaw;

    // Cá nhân hóa cảnh báo và lọc huyệt theo đối tượng
    const personalized = personalizeWarnings(warnings, body, acupoints, contextText);
    acupoints = personalized.acupoints;
    const finalWarnings = personalized.warnings;

    const confidence = computeConfidence(primary, secondary, symptoms);

    // Áp dụng chuyên biệt theo triệu chứng để câu trả lời khác biệt rõ ràng
    const specialized = specializeBySymptoms(symptoms, acupoints, herbs, patternKey);
    acupoints = specialized.acupoints;
    const herbsFinal = specialized.herbs;

    // Lấy top bệnh gợi ý ngay cả khi không mơ hồ, để tăng tính cụ thể
    const retrievalTop = (await retrieveDiseasesByText(contextText, symptoms))[0];
    const chanChungTitle = retrievalTop && confidence < 0.75
      ? `${patternName} — nghi ngờ: ${retrievalTop.ten}`
      : `${patternName}`;

    const response = {
      chanChung: primary ? chanChungTitle : "Chưa đủ dữ kiện",
      bienChung: explainEtiology(patternKey, patternName),
      phuongPhap: treatmentPrinciples(patternKey),
      giaiPhap: {
        acupoints,
        nutrition,
        herbs: herbsFinal,
      },
      canhBao: [
        ...finalWarnings,
        "Không tư vấn liều lượng thuốc; không thay thế thuốc Tây y; không chẩn đoán bệnh cấp tính/ung thư.",
      ],
      ghiChu: [
        ...(personalized.notes.length ? personalized.notes : []),
        ...(specialized.note ? [specialized.note] : []),
        ...(retrievalTop ? [
          `Gợi ý bệnh phù hợp: ${retrievalTop.ten}${retrievalTop.reason ? ` (${retrievalTop.reason})` : ""}${retrievalTop.link ? ` — xem: ${retrievalTop.link}` : ""}`,
        ] : []),
      ].length ? [
        ...(personalized.notes.length ? personalized.notes : []),
        ...(specialized.note ? [specialized.note] : []),
        ...(retrievalTop ? [
          `Gợi ý bệnh phù hợp: ${retrievalTop.ten}${retrievalTop.reason ? ` (${retrievalTop.reason})` : ""}${retrievalTop.link ? ` — xem: ${retrievalTop.link}` : ""}`,
        ] : []),
      ] : undefined,
      lyLuan: {
        batCuong,
        tangPhu,
        nguHanh,
        dinhHuongTri,
        moiTruong,
        dangerSigns,
      },
      confidence,
      phanBiet: primary && secondary
        ? {
            primary: primary.p.name,
            secondary: secondary.p.name,
            note: `Phân biệt: ${primary.p.name} thiên về ${primary.p.description}; trong khi ${secondary.p.name} có đặc điểm ${secondary.p.description}.`
          }
        : null,
      probingQuestions: needMore ? questions : questions,
      symptomsDetected: symptoms,
      // Gợi ý thông minh khi tín hiệu mơ hồ: tìm trong CSDL theo từ khóa
      suggestions: needMore ? await (async ()=>{
        const kws = extractKeywords(contextText, 6);
        const found = await searchCollectionsByKeywords(kws);
        const retrieval = await retrieveDiseasesByText(contextText, symptoms);
        return {
          keywords: kws,
          diseases: found.diseases.map((d:any)=>({ ...d, link: d.id ? `/benh/${d.id}` : undefined })),
          herbs: found.herbs.map((h:any)=>({ ...h, link: h.id ? `/duoc-lieu/${h.id}` : undefined })),
          formulas: found.formulas.map((f:any)=>({ ...f, link: f.id ? `/bai-thuoc/${f.id}` : undefined })),
          retrieval,
        };
      })() : null,
      disclaimer:
        "Đây chỉ là thông tin tham khảo theo Y học Cổ truyền và không thể thay thế cho việc chẩn đoán hoặc điều trị y tế chuyên nghiệp. Hãy tham khảo ý kiến bác sĩ hoặc chuyên gia YHCT có chuyên môn.",
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[api/yhct/chat]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}