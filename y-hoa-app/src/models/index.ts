import mongoose from 'mongoose';

// Định nghĩa schema cho Dược liệu (đồng bộ với lib/models/DuocLieu.ts)
const DuocLieuSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  tenKhoaHoc: { type: String },
  moTa: { type: String },
  congDung: { type: [String], default: [] },
  chiDinh: { type: [String], default: [] },
  chongChiDinh: { type: [String], default: [] },
  cachDung: { type: String },
  anhMinhHoa: { type: String, default: '' },
  nguonGoc: { type: String },
  thanhPhan: [{ type: String }],
  chuY: { type: [String], default: [] },
  vi: { type: [String], default: [] },
  tinh: { type: [String], default: [] },
  quyKinh: { type: [String], default: [] },
  nhom: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Định nghĩa schema cho Bài thuốc
const BaiThuocSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  moTa: { type: String },
  anhMinhHoa: { type: String },
  thanhPhan: [{
    duocLieu: { type: mongoose.Schema.Types.ObjectId, ref: 'DuocLieu' },
    tenDuocLieu: { type: String },
    lieuLuong: { type: String }
  }],
  cachBaoCheSuDung: { type: String },
  congDung: { type: String },
  doiTuongSuDung: { type: String },
  chuY: { type: String },
  nguonGoc: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Định nghĩa schema cho Bệnh
const BenhSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  moTa: { type: String },
  trieuchung: [{ type: String }],
  nguyenNhan: { type: String },
  phuongPhapDieuTri: { type: String },
  baiThuocLienQuan: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BaiThuoc' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Định nghĩa schema cho Người dùng
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi khi hot reload
export const DuocLieu = mongoose.models.DuocLieu || mongoose.model('DuocLieu', DuocLieuSchema, 'duoclieu');
export const BaiThuoc = mongoose.models.BaiThuoc || mongoose.model('BaiThuoc', BaiThuocSchema);
export const Benh = mongoose.models.Benh || mongoose.model('Benh', BenhSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
// News model removed