import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

// Danh sách 100 vị (Việt / Latin). Có thể điều chỉnh theo chuẩn tài liệu của bạn.
const CURATED: Array<{ vn: string; latin?: string; nhom?: string[]; vi?: string[]; tinh?: string[]; quyKinh?: string[] }> = [
  { vn: "Ma hoàng", latin: "Ephedra sinica", nhom: ["giaiBieu"], vi: ["cay"], tinh: ["on"], quyKinh: ["phe", "bangQuang"] },
  { vn: "Quế chi", latin: "Cinnamomum cassia", nhom: ["giaiBieu"], vi: ["cay", "ngot"], tinh: ["on"], quyKinh: ["tam", "phế", "thận"] },
  { vn: "Bạch chỉ", latin: "Angelica dahurica", nhom: ["giaiBieu"], vi: ["cay"], tinh: ["on"], quyKinh: ["phế"] },
  { vn: "Kinh giới", latin: "Elsholtzia ciliata", nhom: ["giaiBieu"], vi: ["cay"], tinh: ["on"], quyKinh: ["phế"] },
  { vn: "Tía tô", latin: "Perilla frutescens", nhom: ["giaiBieu"], vi: ["cay"], tinh: ["on"], quyKinh: ["phế", "vị"] },
  { vn: "Bạc hà", latin: "Mentha arvensis", nhom: ["giaiBieu"], vi: ["cay"], tinh: ["luong"], quyKinh: ["phế" , "can"] },
  { vn: "Cát căn", latin: "Pueraria lobata", nhom: ["giaiBieu"], vi: ["ngot"], tinh: ["luong"], quyKinh: ["tỳ", "vị"] },
  { vn: "Hoàng cầm", latin: "Scutellaria baicalensis", nhom: ["thanhNhiet"], vi: ["dang"], tinh: ["han"], quyKinh: ["đởm", "đạiTruong"] },
  { vn: "Hoàng liên", latin: "Coptis chinensis", nhom: ["thanhNhiet"], vi: ["dang"], tinh: ["han"], quyKinh: ["tâm", "vị"] },
  { vn: "Cam thảo", latin: "Glycyrrhiza uralensis", nhom: ["boKhi"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["tỳ", "vị", "phế"] },
  { vn: "Cát cánh", latin: "Platycodon grandiflorus", nhom: ["khuPhong"], vi: ["dang"], tinh: ["binh"], quyKinh: ["phế"] },
  { vn: "Sinh khương", latin: "Zingiber officinale", nhom: ["giaiBieu"], vi: ["cay"], tinh: ["on"], quyKinh: ["vị", "phế"] },
  { vn: "Khương hoạt", latin: "Notopterygium incisum", nhom: ["khuPhong"], vi: ["cay"], tinh: ["on"], quyKinh: ["bàngQuang"] },
  { vn: "Độc hoạt", latin: "Angelica pubescens", nhom: ["khuPhong"], vi: ["cay"], tinh: ["on"], quyKinh: ["thận"] },
  { vn: "Phòng phong", latin: "Saposhnikovia divaricata", nhom: ["khuPhong"], vi: ["cay"], tinh: ["on"], quyKinh: ["bàngQuang"] },
  { vn: "Phục linh", latin: "Poria cocos", nhom: ["loiThuy"], vi: ["nhat"], tinh: ["binh"], quyKinh: ["tỳ", "thận"] },
  { vn: "Bạch truật", latin: "Atractylodes macrocephala", nhom: ["kienTy"], vi: ["dang"], tinh: ["on"], quyKinh: ["tỳ", "vị"] },
  { vn: "Trạch tả", latin: "Alisma plantago-aquatica", nhom: ["loiThuy"], vi: ["nhat"], tinh: ["han"], quyKinh: ["thận", "bàngQuang"] },
  { vn: "Xa tiền tử", latin: "Plantago asiatica", nhom: ["loiThuy"], vi: ["nhat"], tinh: ["han"], quyKinh: ["bàngQuang"] },
  { vn: "Ngưu tất", latin: "Achyranthes bidentata", nhom: ["hoatHuyet"], vi: ["dang"], tinh: ["on"], quyKinh: ["can", "thận"] },
  { vn: "Đan sâm", latin: "Salvia miltiorrhiza", nhom: ["hoatHuyet"], vi: ["dang"], tinh: ["luong"], quyKinh: ["tâm", "can"] },
  { vn: "Xuyên khung", latin: "Ligusticum chuanxiong", nhom: ["hoatHuyet"], vi: ["cay"], tinh: ["on"], quyKinh: ["can"] },
  { vn: "Đương quy", latin: "Angelica sinensis", nhom: ["boHuyet"], vi: ["ngot"], tinh: ["on"], quyKinh: ["tâm", "can"] },
  { vn: "Bạch thược", latin: "Paeonia lactiflora", nhom: ["boHuyet"], vi: ["chua"], tinh: ["luong"], quyKinh: ["can"] },
  { vn: "Thục địa", latin: "Rehmannia glutinosa", nhom: ["boAm"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["thận"] },
  { vn: "Thiên ma", latin: "Gastrodia elata", nhom: ["khuPhong"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["can"] },
  { vn: "Câu đằng", latin: "Uncaria rhynchophylla", nhom: ["khuPhong"], vi: ["dang"], tinh: ["luong"], quyKinh: ["can"] },
  { vn: "Bán hạ", latin: "Pinellia ternata", nhom: ["truDam"], vi: ["cay"], tinh: ["on"], quyKinh: ["tỳ", "vị"] },
  { vn: "Trần bì", latin: "Citrus reticulata pericarp", nhom: ["truDam"], vi: ["cay"], tinh: ["on"], quyKinh: ["tỳ", "phế"] },
  { vn: "Nhân sâm", latin: "Panax ginseng", nhom: ["boKhi"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["tỳ", "phế"] },
  { vn: "Đảng sâm", latin: "Codonopsis pilosula", nhom: ["boKhi"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["tỳ", "phế"] },
  { vn: "Hoàng kỳ", latin: "Astragalus membranaceus", nhom: ["boKhi"], vi: ["ngot"], tinh: ["on"], quyKinh: ["tỳ"] },
  { vn: "Kỷ tử", latin: "Lycium barbarum", nhom: ["boAm"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["can", "thận"] },
  { vn: "Liên nhục", latin: "Nelumbo nucifera", nhom: ["kienTy"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["tỳ", "thận"] },
  { vn: "Đại táo", latin: "Ziziphus jujuba", nhom: ["boKhi"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["tỳ"] },
  { vn: "Sơn tra", latin: "Crataegus pinnatifida", nhom: ["kienTy"], vi: ["chua"], tinh: ["binh"], quyKinh: ["tỳ", "vị"] },
  { vn: "Kim ngân hoa", latin: "Lonicera japonica", nhom: ["thanhNhiet"], vi: ["ngot"], tinh: ["han"], quyKinh: ["phế", "vị"] },
  { vn: "Cúc hoa", latin: "Chrysanthemum morifolium", nhom: ["thanhNhiet"], vi: ["dang"], tinh: ["luong"], quyKinh: ["can"] },
  { vn: "Bồ công anh", latin: "Taraxacum officinale", nhom: ["thanhNhiet"], vi: ["dang"], tinh: ["luong"], quyKinh: ["can", "vị"] },
  { vn: "Diếp cá", latin: "Houttuynia cordata", nhom: ["thanhNhiet"], vi: ["cay"], tinh: ["han"], quyKinh: ["phế"] },
  { vn: "Râu ngô", latin: "Zea mays stigma", nhom: ["loiThuy"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["thận"] },
  { vn: "Ý dĩ", latin: "Coix lacryma-jobi", nhom: ["loiThuy"], vi: ["nhat"], tinh: ["han"], quyKinh: ["tỳ", "phế"] },
  { vn: "Cỏ mực", latin: "Eclipta prostrata", nhom: ["chiHuyet"], vi: ["dang"], tinh: ["han"], quyKinh: ["can", "thận"] },
  { vn: "Ngải cứu", latin: "Artemisia vulgaris", nhom: ["chiHuyet"], vi: ["dang"], tinh: ["on"], quyKinh: ["tỳ"] },
  { vn: "Rau má", latin: "Centella asiatica", nhom: ["thanhNhiet"], vi: ["nhat"], tinh: ["luong"], quyKinh: ["can", "vị"] },
  { vn: "Nghệ", latin: "Curcuma longa", nhom: ["hoatHuyet"], vi: ["dang"], tinh: ["on"], quyKinh: ["can", "tỳ"] },
  { vn: "Huyền sâm", latin: "Scrophularia ningpoensis", nhom: ["boAm"], vi: ["dang"], tinh: ["han"], quyKinh: ["thận"] },
  { vn: "Thăng ma", latin: "Actaea heracleifolia", nhom: ["giaiBieu"], vi: ["cay"], tinh: ["on"], quyKinh: ["đạiTruong"] },
  { vn: "Địa cốt bì", latin: "Lycium chinense", nhom: ["boAm"], vi: ["ngot"], tinh: ["han"], quyKinh: ["thận"] },
  { vn: "Hà thủ ô", latin: "Fallopia multiflora", nhom: ["boHuyet"], vi: ["dang", "ngot"], tinh: ["on"], quyKinh: ["can", "thận"] },
  { vn: "Quế nhục", latin: "Cinnamomum verum", nhom: ["on_trung"], vi: ["cay", "ngot"], tinh: ["nhiet"], quyKinh: ["tỳ", "thận"] },
  { vn: "Tiểu hồi", latin: "Foeniculum vulgare", nhom: ["on_trung"], vi: ["cay"], tinh: ["on"], quyKinh: ["can"] },
  { vn: "Đinh hương", latin: "Syzygium aromaticum", nhom: ["on_trung"], vi: ["cay"], tinh: ["nhiet"], quyKinh: ["tỳ", "vị"] },
  { vn: "Thảo quả", latin: "Amomum tsaoko", nhom: ["on_trung"], vi: ["cay"], tinh: ["on"], quyKinh: ["tỳ", "vị"] },
  { vn: "Thạch hộc", latin: "Dendrobium officinale", nhom: ["boAm"], vi: ["ngot"], tinh: ["luong"], quyKinh: ["vị", "thận"] },
  { vn: "Mạch môn", latin: "Ophiopogon japonicus", nhom: ["boAm"], vi: ["ngot"], tinh: ["han"], quyKinh: ["phế", "vị"] },
  { vn: "Sa sâm", latin: "Glehnia littoralis", nhom: ["boAm"], vi: ["ngot"], tinh: ["han"], quyKinh: ["phế"] },
  { vn: "A giao", latin: "Colla corii asini", nhom: ["chiHuyet"], vi: ["ngot"], tinh: ["binh"], quyKinh: ["phế"] },
  { vn: "Tam thất", latin: "Panax notoginseng", nhom: ["chiHuyet"], vi: ["dang"], tinh: ["on"], quyKinh: ["can"] },
  { vn: "Hồi hương", latin: "Illicium verum", nhom: ["on_trung"], vi: ["cay", "ngot"], tinh: ["on"], quyKinh: ["tỳ", "vị"] },
  { vn: "Cỏ ngọt", latin: "Stevia rebaudiana" },
  { vn: "Húng quế", latin: "Ocimum basilicum" },
  { vn: "Hương thảo", latin: "Rosmarinus officinalis" },
  { vn: "Húng tây", latin: "Thymus vulgaris" },
  { vn: "Mùi tây", latin: "Petroselinum crispum" },
  { vn: "Thì là", latin: "Anethum graveolens" },
  { vn: "Mù tạt", latin: "Brassica juncea" },
  { vn: "Hẹ", latin: "Allium tuberosum" },
  { vn: "Tỏi", latin: "Allium sativum" },
  { vn: "Hành", latin: "Allium cepa" },
  { vn: "Artichoke", latin: "Cynara cardunculus var. scolymus" },
  { vn: "Sâm cau", latin: "Curculigo orchioides" },
  { vn: "Sâm bố chính", latin: "Abelmoschus sagittifolius" },
  { vn: "La hán quả", latin: "Siraitia grosvenorii" },
  { vn: "Cẩu tích", latin: "Cibotium barometz" },
  { vn: "Thổ phục linh", latin: "Smilax glabra" },
  { vn: "Thiên môn", latin: "Asparagus cochinchinensis" },
  { vn: "Kim tiền thảo", latin: "Desmodium styracifolium" },
  { vn: "Trinh nữ hoàng cung", latin: "Crinum latifolium" },
  { vn: "Xạ hương", latin: "Moschus" },
  { vn: "Địa liền", latin: "Kaempferia galanga" },
  { vn: "Uất kim", latin: "Curcuma zedoaria" },
  { vn: "Hà diệp", latin: "Nelumbo nucifera folium" },
  { vn: "Hắc đậu khấu", latin: "Amomum villosum" },
  { vn: "Bồ bồ", latin: "Pogostemon cablin" },
  { vn: "Bạc hà nam", latin: "Mentha spicata" },
  { vn: "Kinh giới tuệ", latin: "Schizonepeta tenuifolia" },
  { vn: "Ngưu hoàng", latin: "Bos taurus calculus bovis" },
  { vn: "Bách hợp", latin: "Lilium brownii" },
  { vn: "Mẫu lệ", latin: "Ostrea gigas" },
  { vn: "Tang bạch bì", latin: "Morus alba cortex" },
  { vn: "Tang diệp", latin: "Morus alba folium" },
  { vn: "Hạnh nhân", latin: "Prunus armeniaca semen" },
  { vn: "Quả giun", latin: "Areca catechu" },
  { vn: "Mạch nha", latin: "Hordeum vulgare germinatus" },
  { vn: "Cốc nha", latin: "Oryza sativa germinatus" },
  { vn: "Sơn dược", latin: "Dioscorea opposita" },
  { vn: "Thỏ ty tử", latin: "Cuscuta chinensis" },
  { vn: "Nữ lang", latin: "Valeriana officinalis" },
  { vn: "La bạc tử", latin: "Raphanus sativus" },
  { vn: "Tiên hạc thảo", latin: "Geranium robertianum" },
  { vn: "Hoắc hương", latin: "Pogostemon cablin" },
  { vn: "Bách lý hương", latin: "Ruta graveolens" },
  { vn: "Ô mai", latin: "Prunus mume" },
  { vn: "Xa sương thảo", latin: "Artemisia annua" },
  { vn: "Xạ can", latin: "Belamcanda chinensis" },
  { vn: "Đại hồi", latin: "Illicium verum" },
  { vn: "Khổ sâm", latin: "Sophora flavescens" },
  { vn: "Thương truật", latin: "Atractylodes lancea" },
  { vn: "Đương quy thân", latin: "Angelica sinensis radix" },
  { vn: "Ngưu bàng tử", latin: "Arctium lappa" },
  { vn: "Hà thủ ô đỏ", latin: "Fallopia multiformis" },
  { vn: "Cúc tần", latin: "Pluchea indica" },
  { vn: "Bìm bìm", latin: "Pharbitis nil" },
  { vn: "Cotton seed", latin: "Gossypium herbaceum" },
];

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const resetParam = url.searchParams.get("reset");

    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    if (resetParam === "true") {
      await DuocLieu.deleteMany({});
    }

    const docs = CURATED.map((d) => ({
      ten: d.vn,
      tenKhoaHoc: d.latin,
      mota: "Seed 100 vị, sẽ enrich từ Wikipedia/taxonomy.",
      vi: d.vi || [],
      tinh: d.tinh || [],
      quyKinh: d.quyKinh || [],
      nhom: d.nhom || [],
      congDung: [],
      chiDinh: [],
      chongChiDinh: [],
      cachDung: undefined,
      chuY: [],
      anhMinhHoa: "",
    }));

    // Dùng upsert theo tên để tránh trùng lặp với dữ liệu cũ
    const ops = docs.map((d) => ({
      updateOne: {
        filter: { ten: d.ten },
        update: { $setOnInsert: d },
        upsert: true,
      },
    }));
    const res = await DuocLieu.bulkWrite(ops, { ordered: false });
    return NextResponse.json({ matched: res.matchedCount, upserted: res.upsertedCount, modified: res.modifiedCount });
  } catch (err: any) {
    console.error("[seed/duoc-lieu-100]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}