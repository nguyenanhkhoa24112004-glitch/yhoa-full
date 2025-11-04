# Hướng Dẫn Seed 150 Bài Thuốc Y Học Cổ Truyền

## Cách Seed Dữ Liệu

### Bước 1: Seed 150 Bài Thuốc Mới

```bash
# Xóa dữ liệu cũ và seed 150 bài thuốc mới
curl -X POST "http://localhost:3000/api/admin/seed/bai-thuoc-150-yhct?reset=true"
```

### Bước 2: Kiểm Tra Kết Quả

Truy cập: `http://localhost:3000/bai-thuoc`

Bạn sẽ thấy danh sách 150 bài thuốc chia theo nhiều nhóm:
- Giải biểu, phát hãn
- Thanh nhiệt, giải độc  
- Hoá đàm, chỉ khái
- Hoạt huyết, thông lạc
- Kiện tỳ, ích khí
- Lợi thủy, tiêu phù
- Bổ khí, dưỡng vị
- Bổ huyết, dưỡng âm
- An thần, định tâm
- Chỉ huyết, cầm máu

## Tính Năng

✅ **150 bài thuốc** đầy đủ và chi tiết  
✅ **Thông tin đầy đủ**: Tên, mô tả, thành phần, liều lượng  
✅ **Công dụng** rõ ràng theo YHCT  
✅ **Cách bào chế** và sử dụng  
✅ **Đối tượng** sử dụng  
✅ **Chú ý** khi dùng  
✅ **Giao diện đẹp**, tương thích với app  
✅ **Liên kết** với dược liệu  

## Nhóm Bài Thuốc

### 1. Bài Thuốc Kinh Điển (10 bài)
- Ma Hoàng Thang
- Quế Chi Thang  
- Tiểu Sài Hồ Thang
- Sinh Thạch Cao Thang
- Ngân Kiều Tán
- Sinh Mạch Tán
- Tứ Quân Tử Thang
- Tứ Vật Thang
- Đương Quy Bổ Huyết Thang
- Độc Sâm Thang

### 2. Bài Thuốc Theo Nhóm (140 bài)
Mỗi nhóm có 14 bài thuốc khác nhau.

## Kiểm Tra

Sau khi seed, kiểm tra:
1. Tổng số bài thuốc: phải là 150
2. Click vào từng bài thuốc để xem chi tiết
3. Thông tin hiển thị đầy đủ
4. Giao diện đẹp, responsive

## Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra .env.local có MONGODB_URI
- Kiểm tra MongoDB đang chạy

### Không hiển thị bài thuốc
- Clear cache: `rm -rf .next`
- Restart server
- Kiểm tra seed có thành công không

### Bài thuốc bị duplicate
- Dùng reset=true để xóa dữ liệu cũ

