# Hướng Dẫn Seed 150 Bài Thuốc Y Học Cổ Truyền

## 🎯 Tổng Quan

Đã tạo xong hệ thống **150 Bài Thuốc Y Học Cổ Truyền** với dữ liệu đầy đủ và giao diện đẹp.

## 📋 Cách Seed Dữ Liệu

### Cách 1: Dùng Browser (Đơn giản nhất)
```
http://localhost:3000/api/admin/seed/bai-thuoc-150-yhct?reset=true
```

### Cách 2: Dùng curl
```bash
curl -X POST "http://localhost:3000/api/admin/seed/bai-thuoc-150-yhct?reset=true"
```

### Cách 3: Dùng Postman
- Method: POST
- URL: `http://localhost:3000/api/admin/seed/bai-thuoc-150-yhct?reset=true`

## ✅ Sau Khi Seed

Kiểm tra tại:
- Danh sách: `http://localhost:3000/bai-thuoc`
- Chi tiết: `http://localhost:3000/bai-thuoc/[id]`

Số lượng: **150 bài thuốc**

## 📊 Cấu Trúc Dữ Liệu

Mỗi bài thuốc bao gồm:

```typescript
{
  ten: "Tên bài thuốc",              // Tên đầy đủ
  moTa: "Mô tả chi tiết...",         // Mô tả về bài thuốc
  thanhPhan: [                        // Thành phần
    { tenDuocLieu: "Ma hoàng", lieuLuong: "6-10g" },
    { tenDuocLieu: "Quế chi", lieuLuong: "6-10g" }
  ],
  congDung: "Công dụng...",           // Công dụng chữa bệnh
  cachBaoCheSuDung: "Cách dùng...",  // Hướng dẫn sử dụng
  doiTuongSuDung: "Đối tượng...",    // Ai nên dùng
  chuY: "Chú ý khi dùng..."          // Lưu ý quan trọng
}
```

## 🎨 Giao Diện

### Trang Danh Sách (`/bai-thuoc`)
- Card đẹp với glass effect
- Hiển thị: Tên, Mô tả, Thành phần, Công dụng
- Tìm kiếm theo tên, công dụng, thành phần
- Phân trang 24 bài/trang
- Responsive design

### Trang Chi Tiết (`/bai-thuoc/[id]`)
- Hiển thị đầy đủ thông tin
- Bảng thành phần với dược liệu
- Sections: Mô tả, Thành phần, Công dụng, Cách dùng, Chú ý
- Glass effect, gradient, modern UI

## 📁 File Cấu Trúc

```
y-hoa-app/
├── src/
│   ├── data/
│   │   └── bai-thuoc-150-data.ts      # Dữ liệu 150 bài thuốc
│   ├── app/
│   │   ├── api/admin/seed/
│   │   │   └── bai-thuoc-150-yhct/
│   │   │       └── route.ts           # API seed
│   │   └── bai-thuoc/
│   │       ├── page.tsx               # Trang danh sách
│   │       └── [id]/page.tsx          # Trang chi tiết
```

## 🎭 Nhóm Bài Thuốc

### 1. Giải Biểu - Phát Hãn (15 bài)
- Ma Hoàng Thang
- Quế Chi Thang
- Kinh Phòng Bại Độc Tán
- Ngân Kiều Tán
- Tang Cúc Ẩm
- và 10 bài khác...

### 2. Bổ Khí (15 bài)
- Tứ Quân Tử Thang
- Bổ Trung Ích Khí Thang
- Độc Sâm Thang
- Sinh Mạch Tán
- và 11 bài khác...

### 3. Bổ Huyết (15 bài)
- Tứ Vật Thang
- Đương Quy Bổ Huyết Thang
- và 13 bài khác...

### 4-10. Các Nhóm Khác (105 bài)
- Thanh Nhiệt
- Hoá Đàm
- Hoạt Huyết
- Kiện Tỳ
- Lợi Thủy
- An Thần
- Chỉ Huyết

## 🚀 Tính Năng

✅ **150 bài thuốc** đầy đủ và chi tiết  
✅ **Giao diện đẹp**, glass effect, gradient  
✅ **Responsive** cho mobile, tablet, desktop  
✅ **Tìm kiếm** theo tên, công dụng, thành phần  
✅ **Phân trang** hiệu quả  
✅ **Chi tiết đầy đủ**: Thành phần, cách dùng, chú ý  
✅ **Liên kết** với dược liệu  

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra `.env.local` có `MONGODB_URI`
- Kiểm tra MongoDB đang chạy

### Không seed được
- Thử dùng `reset=true`
- Kiểm tra log console
- Xem chi tiết lỗi trong response

### Không hiển thị bài thuốc
- Clear cache: `rm -rf .next`
- Restart server: `npm run dev`
- Kiểm tra số lượng bài thuốc đã seed

## 📝 Lưu Ý

1. **Reset dữ liệu**: Dùng `?reset=true` để xóa toàn bộ bài thuốc cũ
2. **Bảo mật**: Set `ADMIN_SECRET` trong `.env.local` nếu muốn bảo vệ API
3. **Liên kết dược liệu**: Đảm bảo đã có dữ liệu dược liệu trước (không bắt buộc)
4. **Performance**: Seed 150 bài thuốc mất vài giây, đợi đến khi hoàn thành

## 📞 Hỗ Trợ

Nếu có vấn đề:
1. Kiểm tra MongoDB connection
2. Xem console logs
3. Kiểm tra network tab
4. Đọc file `BAI-THUOC-150-SEED.md`

---

**Chúc bạn sử dụng thành công! 🎉**





