'use server';

import dbConnect from '@/lib/mongoose';
import { BaiThuoc } from '@/models';
import { revalidatePath } from 'next/cache';

export async function getBaiThuocList() {
  await dbConnect();
  const baiThuocList = await BaiThuoc.find({}).sort({ ten: 1 });
  return JSON.parse(JSON.stringify(baiThuocList));
}

export async function getBaiThuocById(id: string) {
  await dbConnect();
  const baiThuoc = await BaiThuoc.findById(id).populate('thanhPhan.duocLieu');
  return JSON.parse(JSON.stringify(baiThuoc));
}

export async function searchBaiThuoc(query: string) {
  await dbConnect();
  const baiThuocList = await BaiThuoc.find({
    $or: [
      { ten: { $regex: query, $options: 'i' } },
      { congDung: { $regex: query, $options: 'i' } },
      { 'thanhPhan.tenDuocLieu': { $regex: query, $options: 'i' } }
    ]
  }).sort({ ten: 1 });
  return JSON.parse(JSON.stringify(baiThuocList));
}

export async function createBaiThuoc(data: any) {
  await dbConnect();
  const baiThuoc = new BaiThuoc(data);
  await baiThuoc.save();
  revalidatePath('/bai-thuoc');
  return JSON.parse(JSON.stringify(baiThuoc));
}

export async function updateBaiThuoc(id: string, data: any) {
  await dbConnect();
  const baiThuoc = await BaiThuoc.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  revalidatePath(`/bai-thuoc/${id}`);
  revalidatePath('/bai-thuoc');
  return JSON.parse(JSON.stringify(baiThuoc));
}

export async function deleteBaiThuoc(id: string) {
  await dbConnect();
  await BaiThuoc.findByIdAndDelete(id);
  revalidatePath('/bai-thuoc');
  return { success: true };
}