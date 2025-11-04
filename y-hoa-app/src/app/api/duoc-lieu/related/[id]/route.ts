import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import DuocLieu from '@/lib/models/DuocLieu';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { properties } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid drug ID' }, { status: 400 });
    }

    await dbConnect();

    // Get current drug to exclude from results
    const currentDrug = await DuocLieu.findById(id).lean();
    if (!currentDrug) {
      return NextResponse.json({ error: 'Drug not found' }, { status: 404 });
    }

    // Build similarity query based on properties
    const similarityQuery: any = {
      _id: { $ne: id }, // Exclude current drug
    };

    // Add conditions for each property type
    if (properties.vi && properties.vi.length > 0) {
      similarityQuery.vi = { $in: properties.vi };
    }
    if (properties.tinh && properties.tinh.length > 0) {
      similarityQuery.tinh = { $in: properties.tinh };
    }
    if (properties.quyKinh && properties.quyKinh.length > 0) {
      similarityQuery.quyKinh = { $in: properties.quyKinh };
    }
    if (properties.nhom && properties.nhom.length > 0) {
      similarityQuery.nhom = { $in: properties.nhom };
    }

    // Find related drugs
    const relatedDrugs = await DuocLieu.find(similarityQuery)
      .select('ten tenKhoaHoc anhMinhHoa vi tinh quyKinh nhom')
      .limit(6)
      .lean();

    // Calculate similarity scores and sort
    const scoredDrugs = relatedDrugs.map(drug => {
      let score = 0;
      let totalPossibleScore = 0;
      
      // Calculate similarity based on matching properties with weighted scoring
      if (properties.vi && drug.vi && properties.vi.length > 0) {
        const matchingVi = properties.vi.filter(v => drug.vi.includes(v)).length;
        const viWeight = 3;
        score += matchingVi * viWeight;
        totalPossibleScore += properties.vi.length * viWeight;
      }
      
      if (properties.tinh && drug.tinh && properties.tinh.length > 0) {
        const matchingTinh = properties.tinh.filter(t => drug.tinh.includes(t)).length;
        const tinhWeight = 3;
        score += matchingTinh * tinhWeight;
        totalPossibleScore += properties.tinh.length * tinhWeight;
      }
      
      if (properties.quyKinh && drug.quyKinh && properties.quyKinh.length > 0) {
        const matchingQuyKinh = properties.quyKinh.filter(q => drug.quyKinh.includes(q)).length;
        const quyKinhWeight = 2;
        score += matchingQuyKinh * quyKinhWeight;
        totalPossibleScore += properties.quyKinh.length * quyKinhWeight;
      }
      
      if (properties.nhom && drug.nhom && properties.nhom.length > 0) {
        const matchingNhom = properties.nhom.filter(n => drug.nhom.includes(n)).length;
        const nhomWeight = 4;
        score += matchingNhom * nhomWeight;
        totalPossibleScore += properties.nhom.length * nhomWeight;
      }

      // Calculate percentage similarity
      const similarityPercentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;

      return {
        ...drug,
        similarityScore: Math.round(similarityPercentage)
      };
    });

    // Sort by similarity score and return top results
    const sortedDrugs = scoredDrugs
      .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0))
      .slice(0, 6);

    return NextResponse.json(sortedDrugs);

  } catch (error) {
    console.error('Error fetching related drugs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
