'use server';

import dbConnect from '@/lib/mongoose';
import DuocLieu from '@/lib/models/DuocLieu';
import { revalidatePath } from 'next/cache';

export async function getDuocLieuList() {
  await dbConnect();
  const duocLieuList = await DuocLieu.find({}).sort({ ten: 1 });
  return JSON.parse(JSON.stringify(duocLieuList));
}

export async function getDuocLieuById(id: string) {
  await dbConnect();
  const duocLieu = await DuocLieu.findById(id);
  return JSON.parse(JSON.stringify(duocLieu));
}

export async function searchDuocLieu(query: string) {
  await dbConnect();
  const duocLieuList = await DuocLieu.find({
    $or: [
      { ten: { $regex: query, $options: 'i' } },
      { tenKhoaHoc: { $regex: query, $options: 'i' } },
      { congDung: { $regex: query, $options: 'i' } }
    ]
  }).sort({ ten: 1 });
  return JSON.parse(JSON.stringify(duocLieuList));
}

export async function createDuocLieu(data: any) {
  await dbConnect();
  const duocLieu = await DuocLieu.findOneAndUpdate(
    { ten: data.ten },
    { $set: { ...data, updatedAt: new Date() } },
    { upsert: true, new: true }
  );
  revalidatePath('/duoc-lieu');
  return JSON.parse(JSON.stringify(duocLieu));
}

export async function updateDuocLieu(id: string, data: any) {
  await dbConnect();
  const duocLieu = await DuocLieu.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  revalidatePath(`/duoc-lieu/${id}`);
  revalidatePath('/duoc-lieu');
  return JSON.parse(JSON.stringify(duocLieu));
}

export async function deleteDuocLieu(id: string) {
  await dbConnect();
  await DuocLieu.findByIdAndDelete(id);
  revalidatePath('/duoc-lieu');
  return { success: true };
}