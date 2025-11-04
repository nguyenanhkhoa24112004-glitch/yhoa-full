# Hướng Dẫn Seed Dữ Liệu 100 Bệnh Y Học Cổ Truyền

## Tổng Quan

Hệ thống quản lý bệnh y học cổ truyền với đầy đủ **100 bệnh khác nhau** đã được chuẩn bị sẵn sàng. Bạn có thể seed dữ liệu vào MongoDB một cách dễ dàng.

## Yêu Cầu

- MongoDB đã kết nối và hoạt động
- Đã có dữ liệu bài thuốc (để liên kết với bệnh)
- Next.js app đang chạy

## Các Cách Seed Dữ Liệu

### Cách 1: Seed Tất Cả Bệnh (Khuyến Nghị)

Seed tuần tự các bệnh theo thứ tự:

```bash
# 1. Seed 50 bệnh đầu tiên
curl -X POST "http://localhost:3000/api/admin/seed/benh-50?secret=your-secret&reset=true"

# 2. Seed 50 bệnh bổ sung
curl -X POST "http://localhost:3000/api/admin/seed/benh-50-extra?secret=your-secret"

# Hoặc nếu không có secret
curl -X POST "http://localhost:3000/api/admin/seed/benh-50?reset=true"
curl -X POST "http://localhost:3000/api/admin/seed/benh-50-extra"
```

### Cách 2: Seed Từng Loại Riêng

Bạn cũng có thể seed từng loại riêng lẻ:

**8 bệnh cơ bản:**
```bash
curl -X POST "http://localhost:3000/api/admin/seed/benh?reset=true"
```

**50 bệnh đầu tiên:**
```bash
curl -X POST "http://localhost:3000/api/admin/seed/benh-50?reset=true"
```

**50 bệnh bổ sung:**
```bash
curl -X POST "http://localhost:3000/api/admin/seed/benh-50-extra"
```

### Cách 3: Sử Dụng Browser

Mở trình duyệt và truy cập:
```
http://localhost:3000/api/admin/seed/benh-50?reset=true
http://localhost:3000/api/admin/seed/benh-50-extra
```

## Danh Sách 100 Bệnh

### Nhóm 1: Bệnh Hô Hấp (15 bệnh)
1. Cảm lạnh
2. Cảm nóng
3. Viêm mũi dị ứng
4. Viêm xoang
5. Viêm phế quản cấp
6. Viêm phế quản mạn
7. Hen phế quản
8. Viêm phổi nhẹ
9. Sốt siêu vi
10. Ho
11. Cảm cúm
12. Viêm họng
13. Cao huyết áp
14. Tiểu đường type 2
15. Đau đầu căng thẳng

### Nhóm 2: Bệnh Thần Kinh - Tim Mạch (10 bệnh)
16. Đau nửa đầu
17. Chóng mặt
18. Rối loạn tiền đình
19. Mất ngủ
20. Lo âu
21. Rối loạn nhịp tim
22. Huyết áp thấp
23. Rối loạn mỡ máu
24. Suy giảm trí nhớ
25. Ù tai

### Nhóm 3: Bệnh Cơ Xương Khớp (15 bệnh)
26. Đau lưng
27. Thoái hóa cột sống
28. Đau vai gáy
29. Đau khớp gối
30. Viêm khớp dạng thấp
31. Gút
32. Đau thần kinh tọa
33. Tê bì tay chân
34. Viêm xương khớp
35. Thoát vị đĩa đệm
36. Loãng xương nhẹ
37. Đau do phong thấp
38. Đau cổ vai cánh tay
39. Chuột rút
40. Thoái hóa khớp háng

### Nhóm 4: Bệnh Tiêu Hóa (12 bệnh)
41. Đau dạ dày
42. Tiêu chảy
43. Rối loạn tiêu hóa
44. Táo bón
45. Trào ngược dạ dày
46. Loét dạ dày tá tràng
47. Viêm đại tràng co thắt
48. Trĩ
49. Đầy bụng khó tiêu
50. Buồn nôn
51. Say tàu xe
52. Suy nhược cơ thể

### Nhóm 5: Bệnh Da Liễu (15 bệnh)
53. Mụn trứng cá
54. Viêm da dị ứng
55. Mày đay
56. Á sừng
57. Nấm da
58. Nấm móng
59. Chàm
60. Da khô nẻ
61. Mụn cóc
62. Tăng sắc tố da
63. Rụng tóc
64. Gàu
65. Lở loét miệng
66. Nứt da gót chân
67. Ngứa toàn thân

### Nhóm 6: Bệnh Miệng - Răng - Mắt (10 bệnh)
68. Nhiệt miệng
69. Viêm lợi
70. Hôi miệng
71. Chảy máu chân răng
72. Sâu răng
73. Khô miệng
74. Đắng miệng
75. Hôi miệng nhẹ
76. Giảm thị lực
77. Đau mắt đỏ

### Nhóm 7: Bệnh Tiết Niệu - Sinh Lý (12 bệnh)
78. Tiểu đêm
79. Thiếu máu nhẹ
80. Suy giảm miễn dịch nhẹ
81. Mồ hôi tay chân
82. Tiểu ra máu
83. Tiểu buốt
84. Viêm đường tiết niệu
85. Liệt dương nhẹ
86. Xuất tinh sớm
87. Rối loạn mỡ máu (thêm)
88. Phù chân nhẹ

### Nhóm 8: Bệnh Phụ Khoa (7 bệnh)
89. Kinh nguyệt không đều
90. Đau bụng kinh
91. Kinh nguyệt ra nhiều
92. Kinh nguyệt ra ít
93. Khô rát âm đạo
94. Ngứa âm đạo
95. Viêm đường tiểu nữ

### Nhóm 9: Bệnh Khác (4 bệnh)
96. Tóc bạc sớm
97. Gãy tóc
98. Rụng móng
99. Chân tay lạnh
100. Đau nhức toàn thân

## Kiểm Tra Sau Khi Seed

### 1. Kiểm tra số lượng bệnh
Truy cập: `http://localhost:3000/benh`

Số hiển thị phải là **100 bệnh** (hoặc khoảng đó nếu có duplicate được merge)

### 2. Kiểm tra bệnh có bài thuốc liên quan
- Click vào một bệnh
- Xem phần "Bài thuốc liên quan"
- Mỗi bệnh phải có ít nhất 1-3 bài thuốc

### 3. Kiểm tra liên kết
- Click vào bài thuốc từ trang bệnh
- Phải chuyển đến trang chi tiết bài thuốc
- Phải hiển thị đầy đủ thông tin

## Reset Dữ Liệu

Nếu muốn reset và seed lại từ đầu:

```bash
# Xóa tất cả và tạo mới
curl -X POST "http://localhost:3000/api/admin/seed/benh-50?secret=your-secret&reset=true"
curl -X POST "http://localhost:3000/api/admin/seed/benh-50-extra?secret=your-secret"
```

## Troubleshooting

### Lỗi: "MongoDB connection failed"
- Kiểm tra file `.env.local` có biến `MONGODB_URI`
- Kiểm tra MongoDB đang chạy

### Lỗi: "Unauthorized"
- Thêm `ADMIN_SECRET` vào `.env.local`
- Hoặc bỏ tham số `secret` trong URL

### Bệnh không có bài thuốc liên quan
- Seed bài thuốc trước: `curl -X POST "http://localhost:3000/api/admin/seed/bai-thuoc?reset=true"`
- Sau đó mới seed bệnh

### Seed bị duplicate
- Dùng `reset=true` để xóa dữ liệu cũ
- Hoặc hệ thống sẽ tự động merge nếu cùng tên

## Script Tự Động (Optional)

Tạo file `seed-all.sh`:

```bash
#!/bin/bash

echo "Seeding 100 bệnh..."

# Seed 50 bệnh đầu tiên
echo "1/2: Seeding 50 bệnh đầu tiên..."
curl -X POST "http://localhost:3000/api/admin/seed/benh-50?reset=true" || echo "Lỗi!"

sleep 2

# Seed 50 bệnh bổ sung
echo "2/2: Seeding 50 bệnh bổ sung..."
curl -X POST "http://localhost:3000/api/admin/seed/benh-50-extra" || echo "Lỗi!"

echo "Hoàn thành! Kiểm tra tại http://localhost:3000/benh"
```

Chạy:
```bash
chmod +x seed-all.sh
./seed-all.sh
```

## Kết Quả Mong Đợi

Sau khi seed thành công:

✅ **100 bệnh** được thêm vào database  
✅ Mỗi bệnh có **1-3 bài thuốc** liên quan  
✅ Có thể **tìm kiếm** bệnh  
✅ Có thể **xem chi tiết** bệnh  
✅ Có thể **click vào bài thuốc** để xem chi tiết  
✅ **Phân trang** hoạt động (12 bệnh/trang)  
✅ Giao diện **đẹp và responsive**

## Cấu Trúc Dữ Liệu MongoDB

```javascript
{
  "_id": ObjectId("..."),
  "ten": "Cảm lạnh",
  "moTa": "Nhiễm lạnh gây ho, sổ mũi.",
  "trieuchung": ["Hắt hơi", "Chảy mũi", "Ho nhẹ"],
  "nguyenNhan": "Thời tiết lạnh, nhiễm virus",
  "phuongPhapDieuTri": "Giữ ấm, uống ấm, nghỉ ngơi",
  "baiThuocLienQuan": [ObjectId("..."), ObjectId("...")],
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## Support

Nếu có vấn đề, kiểm tra:
1. MongoDB connection
2. Console logs
3. Network tab trong browser DevTools
4. File `BENH-GUIDE.md` để biết thêm chi tiết

---

**Chúc bạn sử dụng thành công! 🎉**
