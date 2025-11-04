# Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Bệnh

## Tổng Quan

Hệ thống quản lý bệnh y học cổ truyền với đầy đủ 100 bệnh khác nhau, được chia thành:
- 50 bệnh cơ bản (đã có)
- 50 bệnh bổ sung (mới tạo)

## Cấu Trúc Dữ Liệu

Mỗi bệnh bao gồm:
- **Tên bệnh**: Tên tiếng Việt
- **Mô tả**: Mô tả tổng quan về bệnh
- **Triệu chứng**: Mảng các triệu chứng
- **Nguyên nhân**: Nguyên nhân theo y học cổ truyền
- **Phương pháp điều trị**: Hướng dẫn điều trị
- **Bài thuốc liên quan**: Liên kết với các bài thuốc chữa bệnh đó

## Cách Seed Dữ Liệu

### 1. Seed 50 Bệnh Đầu Tiên

```bash
# Với admin secret
curl -X POST "http://localhost:3000/api/admin/seed/benh-50?secret=your-secret&reset=true"

# Hoặc trực tiếp (không có secret)
curl -X POST "http://localhost:3000/api/admin/seed/benh-50?reset=true"
```

### 2. Seed 50 Bệnh Bổ Sung

```bash
curl -X POST "http://localhost:3000/api/admin/seed/benh-50-extra?secret=your-secret"
```

### 3. Seed Bệnh Cơ Bản (8 bệnh)

```bash
curl -X POST "http://localhost:3000/api/admin/seed/benh?reset=true"
```

## Các Trang Của Hệ Thống

### 1. Trang Danh Sách Bệnh
**URL**: `/benh`

- Hiển thị danh sách 12 bệnh mỗi trang
- Tìm kiếm theo tên, mô tả, triệu chứng
- Hiển thị số bài thuốc liên quan
- Phân trang

**Tính năng**:
- Tìm kiếm theo từ khóa
- Xem tổng số bệnh
- Mỗi card hiển thị:
  - Tên bệnh
  - Triệu chứng (3 triệu chứng đầu)
  - Số bài thuốc liên quan

### 2. Trang Chi Tiết Bệnh
**URL**: `/benh/[id]`

**Nội dung hiển thị**:
- Tên bệnh và mô tả
- **Triệu chứng**: Dạng badge/pill
- **Nguyên nhân**: Theo quan điểm YHCT
- **Phương pháp điều trị**: Hướng dẫn điều trị
- **Bài thuốc liên quan**: 
  - Card clickable để chuyển đến trang bài thuốc
  - Hiển thị tên bài thuốc
  - Hiển thị thành phần (3 dược liệu đầu)
  - Hiển thị công dụng

### 3. Trang Chi Tiết Bài Thuốc
**URL**: `/bai-thuoc/[id]`

Từ trang bệnh, người dùng có thể click vào bài thuốc để xem:
- Tên và mô tả bài thuốc
- Thành phần (bảng dược liệu + liều lượng)
- Công dụng
- Đối tượng sử dụng
- Cách bào chế/sử dụng
- Chú ý

## Liên Kết Giữa Bệnh và Bài Thuốc

Hệ thống tự động liên kết bài thuốc với bệnh dựa trên:
- Tên bài thuốc
- Mô tả bài thuốc
- Công dụng bài thuốc

**Cơ chế**: Tìm kiếm theo từ khóa liên quan đến bệnh:
- VD: "Cảm cúm" → tìm bài thuốc có từ "cảm", "giải biểu", "phong hàn"
- VD: "Đau dạ dày" → tìm bài thuốc có "dạ dày", "vị", "tỳ vị"

Mỗi bệnh có thể liên kết với tối đa 3 bài thuốc.

## Danh Mục 100 Bệnh

### Bệnh Hô Hấp (15 bệnh)
- Cảm lạnh, Cảm nóng
- Viêm mũi dị ứng
- Viêm xoang
- Viêm phế quản cấp/mạn
- Hen phế quản
- Viêm phổi nhẹ
- Ho
- Viêm họng
- Cảm cúm
- Sốt siêu vi

### Bệnh Thần Kinh - Đầu (8 bệnh)
- Đau đầu căng thẳng
- Đau nửa đầu
- Chóng mặt
- Rối loạn tiền đình
- Ù tai
- Suy giảm trí nhớ
- Mất ngủ
- Rối loạn nhịp tim

### Bệnh Cơ Xương Khớp (10 bệnh)
- Đau lưng
- Thoái hóa cột sống
- Đau vai gáy
- Đau khớp gối
- Viêm khớp dạng thấp
- Gút
- Đau thần kinh tọa
- Viêm xương khớp
- Thoát vị đĩa đệm
- Thoái hóa khớp háng

### Bệnh Tiêu Hóa (10 bệnh)
- Đau dạ dày
- Tiêu chảy
- Rối loạn tiêu hóa
- Táo bón
- Trào ngược dạ dày
- Loét dạ dày tá tràng
- Viêm đại tràng co thắt
- Trĩ
- Đầy bụng khó tiêu
- Buồn nôn

### Bệnh Da Liễu (12 bệnh)
- Nhiệt miệng
- Mụn trứng cá
- Viêm da dị ứng
- Mày đay
- Á sừng
- Nấm da
- Nấm móng
- Chàm
- Da khô nẻ
- Mụn cóc
- Tăng sắc tố da

### Bệnh Miệng - Răng (5 bệnh)
- Viêm lợi
- Hôi miệng
- Chảy máu chân răng
- Sâu răng
- Lở loét miệng

### Bệnh Mắt (3 bệnh)
- Giảm thị lực
- Đau mắt đỏ
- Chóng mặt (liên quan mắt)

### Bệnh Tiết Niệu - Sinh Lý (8 bệnh)
- Tiểu đêm
- Tiểu ra máu
- Tiểu buốt
- Viêm đường tiết niệu
- Liệt dương nhẹ
- Xuất tinh sớm
- Ngứa âm đạo
- Viêm đường tiểu nữ

### Bệnh Phụ Khoa (6 bệnh)
- Kinh nguyệt không đều
- Đau bụng kinh
- Kinh nguyệt ra nhiều/ít
- Khô rát âm đạo

### Bệnh Nội Tiết - Chuyển Hóa (6 bệnh)
- Cao huyết áp
- Tiểu đường type 2
- Huyết áp thấp
- Rối loạn mỡ máu
- Suy giảm miễn dịch nhẹ
- Thiếu máu nhẹ

### Bệnh Khác (7 bệnh)
- Mồ hôi tay chân
- Tê bì tay chân
- Chuột rút
- Đau nhức toàn thân
- Phù chân nhẹ
- Rụng tóc/Gãy tóc
- Tăng sắc tố da

## Cách Sử Dụng

### Cho Người Dùng

1. **Tìm kiếm bệnh**: Vào trang `/benh`, nhập từ khóa và nhấn "Lọc"
2. **Xem chi tiết bệnh**: Click vào card bệnh
3. **Xem bài thuốc**: Từ trang bệnh, click vào card bài thuốc để xem chi tiết
4. **Đọc thông tin điều trị**: Xem triệu chứng, nguyên nhân, phương pháp điều trị

### Cho Admin/Developer

1. **Seed dữ liệu**: Sử dụng các API seed
2. **Reset dữ liệu**: Thêm `?reset=true` vào URL
3. **Xem logs**: Kiểm tra console/logs khi seed
4. **Quản lý MongoDB**: Dùng MongoDB Compass hoặc CLI

## API Endpoints

### Seed Data
- `POST /api/admin/seed/benh?reset=true` - Seed 8 bệnh cơ bản
- `POST /api/admin/seed/benh-50?secret=xxx&reset=true` - Seed 50 bệnh
- `POST /api/admin/seed/benh-50-extra?secret=xxx` - Seed 50 bệnh bổ sung

### Actions
- `GET /api/admin/actions/benh` - Lấy danh sách bệnh
- `POST /api/admin/actions/benh` - Tạo bệnh mới
- `PUT /api/admin/actions/benh/[id]` - Cập nhật bệnh
- `DELETE /api/admin/actions/benh/[id]` - Xóa bệnh

## Lưu Ý

1. **Bảo mật**: Cần set `ADMIN_SECRET` trong `.env.local` để bảo vệ các API seed
2. **Reset dữ liệu**: Dùng `reset=true` để xóa toàn bộ dữ liệu cũ trước khi seed mới
3. **Liên kết bài thuốc**: Hệ thống tự động tìm bài thuốc liên quan, nhưng có thể chỉnh sửa thủ công nếu cần
4. **MongoDB**: Đảm bảo kết nối MongoDB hoạt động tốt trước khi seed

## Troubleshooting

### Không seed được dữ liệu
- Kiểm tra kết nối MongoDB
- Kiểm tra log lỗi trong console
- Kiểm tra `ADMIN_SECRET` nếu có

### Bài thuốc không hiển thị
- Kiểm tra xem đã có bài thuốc trong DB chưa
- Kiểm tra từ khóa liên kết trong code
- Seed bài thuốc trước rồi mới seed bệnh

### Trang không load được
- Kiểm tra xem Model Benh đã được export chưa
- Kiểm tra file `src/models/index.ts`
- Clear cache Next.js: `rm -rf .next`

## Tương Lai Phát Triển

- [ ] Thêm chức năng tìm kiếm thông minh hơn (AI)
- [ ] Thêm chia sẻ bệnh/bài thuốc
- [ ] Thêm đánh giá và nhận xét
- [ ] Thêm chat tư vấn tự động
- [ ] Thêm lịch sử xem
- [ ] Thêm bookmark bệnh/bài thuốc yêu thích

## Demo

Sau khi seed xong, truy cập:
- Danh sách bệnh: `http://localhost:3000/benh`
- Chi tiết bệnh: `http://localhost:3000/benh/[id]`
- Chi tiết bài thuốc: `http://localhost:3000/bai-thuoc/[id]`
