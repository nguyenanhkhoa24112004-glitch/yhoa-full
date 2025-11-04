import mongoose, { Schema, models, model } from 'mongoose';

const DuocLieuSchema = new Schema({
  ten: { type: String },
  tenKhoaHoc: { type: String },
  mota: { type: String },
  congDung: { type: [String], default: [] },
  chiDinh: { type: [String], default: [] },
  chongChiDinh: { type: [String], default: [] },
  cachDung: { type: String },
  chuY: { type: [String], default: [] },
  vi: { type: [String], default: [] },
  tinh: { type: [String], default: [] },
  quyKinh: { type: [String], default: [] },
  nhom: { type: [String], default: [] },
  anhMinhHoa: { type: String, default: '' },
}, { timestamps: true });

// Trỏ rõ tới collection 'duoclieu' theo yêu cầu
const DuocLieu = models.DuocLieu || model('DuocLieu', DuocLieuSchema, 'duoclieu');

export default DuocLieu;