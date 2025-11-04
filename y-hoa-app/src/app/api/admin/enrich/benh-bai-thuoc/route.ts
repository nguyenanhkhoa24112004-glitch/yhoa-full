import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Benh, BaiThuoc } from '@/models';

export const runtime = 'nodejs';

// Heuristic keyword map: disease -> remedy action keywords
const KEYWORD_MAP: Record<string, string[]> = {
  'cảm lạnh': ['giải biểu', 'phát hãn', 'tán hàn', 'thanh nhiệt'],
  'cảm cúm': ['giải biểu', 'thanh nhiệt', 'ho'],
  'sốt': ['thanh nhiệt', 'giải độc'],
  'ho': ['chỉ khái', 'hóa đàm', 'tuyên phế'],
  'viêm họng': ['thanh nhiệt', 'giải độc', 'lợi yết'],
  'viêm phế quản': ['tuyên phế', 'chỉ khái', 'hóa đàm'],
  'đau dạ dày': ['hòa vị', 'giảm đau', 'chỉ thống'],
  'viêm dạ dày': ['hòa vị', 'thanh nhiệt', 'giải độc'],
  'tiêu chảy': ['sáp trường', 'kiện tỳ', 'thanh nhiệt'],
  'táo bón': ['nhuận tràng', 'bổ âm', 'hoạt huyết'],
  'đau đầu': ['khứ phong', 'hoạt huyết', 'thư cân'],
  'mất ngủ': ['an thần', 'bổ tâm', 'dưỡng tâm âm'],
  'lo âu': ['an thần', 'bổ khí huyết'],
  'suy nhược': ['bổ khí', 'bổ huyết', 'kiện tỳ'],
  'thiếu máu': ['bổ huyết', 'hoạt huyết'],
  'đau khớp': ['khu phong thấp', 'thư cân', 'hoạt huyết'],
  'viêm khớp': ['khu phong thấp', 'thư cân', 'hoạt huyết'],
  'đau lưng': ['bổ thận', 'tráng cân cốt', 'hoạt huyết'],
  'đau bụng': ['lý khí', 'hòa vị', 'chỉ thống'],
  'viêm gan': ['thanh nhiệt', 'giải độc', 'lợi đởm'],
  'men gan cao': ['thanh nhiệt', 'giải độc'],
  'viêm da': ['thanh nhiệt', 'giải độc', 'khu phong'],
  'dị ứng': ['khu phong', 'giải độc', 'bổ khí'],
};

function tokenize(text?: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[.,;:()\-\[\]{}]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function keywordsForBenh(benh: any): string[] {
  const base = new Set<string>();
  tokenize(benh?.ten).forEach((t) => base.add(t));
  tokenize(benh?.moTa).forEach((t) => base.add(t));
  tokenize(Array.isArray(benh?.trieuchung) ? benh.trieuchung.join(' ') : benh?.trieuchung).forEach((t) => base.add(t));
  tokenize(benh?.nguyenNhan).forEach((t) => base.add(t));
  tokenize(benh?.phuongPhapDieuTri).forEach((t) => base.add(t));

  // Map heuristic by full disease name
  const mapped = Object.entries(KEYWORD_MAP)
    .filter(([k]) => (benh?.ten || '').toLowerCase().includes(k))
    .flatMap(([, v]) => v);
  mapped.forEach((t) => base.add(t));

  return Array.from(base);
}

import { BENH_TO_BAITHUOC, normalizeBenhName } from '@/data/benh-to-bai-thuoc';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const mode = (url.searchParams.get('mode') || 'heuristic').toLowerCase();
    const benhs = await Benh.find({}).lean();
    const summary: { benhId: string; ten: string; linked: number; fallback: boolean; mode: string }[] = [];

    for (const b of benhs) {
      let remedies: any[] = [];
      let fallback = false;
      const nameNorm = normalizeBenhName(b.ten);

      if (mode === 'strict') {
        const names = BENH_TO_BAITHUOC[nameNorm] || [];
        if (names.length > 0) {
          remedies = await BaiThuoc.find({ ten: { $in: names } })
            .select({ _id: 1, ten: 1 })
            .lean();
        }
      } else {
        const kws = keywordsForBenh(b);
        const orConditions = kws.flatMap((kw) => ([
          { ten: { $regex: kw, $options: 'i' } },
          { moTa: { $regex: kw, $options: 'i' } },
          { congDung: { $regex: kw, $options: 'i' } },
          { tacDung: { $regex: kw, $options: 'i' } },
        ]));
        if (orConditions.length > 0) {
          remedies = await BaiThuoc.find({ $or: orConditions })
            .select({ _id: 1, ten: 1 })
            .limit(8)
            .lean();
        }
        if (remedies.length === 0) {
          fallback = true;
          remedies = await BaiThuoc.find({})
            .select({ _id: 1, ten: 1 })
            .limit(3)
            .lean();
        }
      }

      const remedyIds = Array.from(new Set(remedies.map((r) => r._id)));

      await Benh.updateOne({ _id: b._id }, { $set: { baiThuocLienQuan: remedyIds } });
      summary.push({ benhId: String(b._id), ten: b.ten, linked: remedyIds.length, fallback, mode });
    }

    const totalLinked = summary.filter((s) => s.linked > 0).length;
    const fallbackUsed = summary.filter((s) => s.fallback).length;

    return NextResponse.json({
      ok: true,
      mode,
      countBenh: benhs.length,
      totalLinked,
      fallbackUsed,
      details: summary.slice(0, 50)
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';