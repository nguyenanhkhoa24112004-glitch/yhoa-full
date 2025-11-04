import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DuocLieu from "@/lib/models/DuocLieu";

// Mapping ảnh từ Wikipedia cho một số vị thuốc phổ biến
const WIKI_IMAGES: Record<string, string> = {
  "Gừng": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Zingiber_officinale_BotGardBln0906.jpg",
  "Bạc hà": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Mentha_x_piperita_BotGardBln1105BotFJ.jpg",
  "Bạc hà diệp": "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
  "Cát căn": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Pueraria_lobata_young_shoots.jpg",
  "Cam thảo": "https://upload.wikimedia.org/wikipedia/commons/1/17/Liquorice_root.jpg",
  "Quế": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Cinnamon_Cinnamomum_verum_bark.jpg",
  "Hoàng cầm": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Scutellaria_baicalensis_02.JPG",
  "Hoàng liên": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coptis_teeta02.jpg",
  "Đương quy": "https://upload.wikimedia.org/wikipedia/commons/1/17/Angelica_sinensis.jpg",
  "Xuyên khung": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Ligusticum_chuanxiong.jpg",
  "Khương hoạt": "https://upload.wikimedia.org/wikipedia/commons/1/10/Notopterygium_incisa.jpg",
  "Bạch truật": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Atractylodes_macrocephala.jpg",
  "Phục linh": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Poria_cocos.jpg",
  "Kinh giới": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Elsholtzia_ciliata.jpg",
  "Tía tô": "https://upload.wikimedia.org/wikipedia/commons/2/27/Perilla_frutescens_kyoto1.jpg",
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let totalMatched = 0;
    let totalModified = 0;

    for (const key of Object.keys(WIKI_IMAGES)) {
      const img = WIKI_IMAGES[key];
      // Khớp tên bắt đầu bằng key (ví dụ "Gừng", "Bạc hà", ...)
      const filter = { ten: { $regex: `^${key}`, $options: "i" } };
      const matched = await DuocLieu.countDocuments(filter);
      totalMatched += matched;
      const res = await DuocLieu.updateMany(filter, { $set: { anhMinhHoa: img } });
      totalModified += res.modifiedCount || 0;
    }

    return NextResponse.json({ matched: totalMatched, modified: totalModified });
  } catch (err: any) {
    console.error("[enrich/wiki-images]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}