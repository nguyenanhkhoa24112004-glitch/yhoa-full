'use server';

import dbConnect from '@/lib/mongoose';
import { Benh } from '@/models';
import { revalidatePath } from 'next/cache';

export async function getBenhList() {
  await dbConnect();
  const benhList = await Benh.find({}).sort({ ten: 1 });
  return JSON.parse(JSON.stringify(benhList));
}

export async function getBenhById(id: string) {
  await dbConnect();
  const benh = await Benh.findById(id).populate('baiThuocLienQuan');
  return JSON.parse(JSON.stringify(benh));
}

export async function searchBenh(query: string) {
  await dbConnect();
  const benhList = await Benh.find({
    $or: [
      { ten: { $regex: query, $options: 'i' } },
      { moTa: { $regex: query, $options: 'i' } },
      { trieuchung: { $regex: query, $options: 'i' } }
    ]
  }).sort({ ten: 1 });
  return JSON.parse(JSON.stringify(benhList));
}

export async function createBenh(data: any) {
  await dbConnect();
  const benh = new Benh(data);
  await benh.save();
  revalidatePath('/benh');
  return JSON.parse(JSON.stringify(benh));
}

export async function updateBenh(id: string, data: any) {
  await dbConnect();
  const benh = await Benh.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  revalidatePath(`/benh/${id}`);
  revalidatePath('/benh');
  return JSON.parse(JSON.stringify(benh));
}

export async function deleteBenh(id: string) {
  await dbConnect();
  await Benh.findByIdAndDelete(id);
  revalidatePath('/benh');
  return { success: true };
}