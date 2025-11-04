# YHCT Chatbot — Mastery Level Training

Mục tiêu: Nâng cấp mô hình lên mức chuyên nghiệp với biện chứng sâu (Bát Cương + Tạng Phủ), suy luận Ngũ Hành, xử lý đa chứng, đảm bảo an toàn y tế nghiêm ngặt và giao tiếp học thuật nhưng thân thiện.

## 1. Phân rã Kiến thức & Tập dữ liệu
- Nguồn: Giáo trình YHCT, bài giảng, sách tham khảo, bài báo, hồ sơ ca lâm sàng (đã ẩn thông tin cá nhân).
- Chuẩn hóa: Không dấu song song với có dấu, từ khóa đồng nghĩa (ví dụ: "Can khí uất" ≈ "Can khí uất kết").
- Phân đoạn:
  - Eight Principles (Bát Cương): `Biểu/Lý`, `Hàn/Nhiệt`, `Hư/Thực`.
  - Zang-Fu (Tạng Phủ): cơ chế tạng phủ liên hệ (Phế/Can/Tỳ/Vị/Thận/Tâm).
  - Five Elements (Ngũ Hành): mẹ/con/khắc.
  - Triệu chứng → Chẩn chứng (multi-syndrome: primary + secondary).
  - Điều trị nguyên tắc: Phù Chính/Khu Tà + phương pháp cụ thể.
  - Mùa/môi trường: Lục dục (Phong, Hàn, Thử, Thấp, Táo, Hỏa).
  - Cảnh báo & giới hạn: Dấu hiệu nguy hiểm; phạm vi tư vấn.

## 2. Lược đồ Nhãn (Label Schema)
- `syndrome.primary`: mã thể (ví dụ: `tyViHuHan`).
- `syndrome.secondary`: mã thể phụ (tùy chọn).
- `eight_principles`: `{"scope":"Biểu|Lý","temperature":"Hàn|Nhiệt","deficiency":"Hư|Thực"}`.
- `zang_fu`: mảng tên tạng liên quan.
- `five_elements`: mô tả ngắn các quan hệ mẹ–con–khắc.
- `treatment_orientation`: `Phù Chính|Khu Tà` kèm giải thích.
- `treatment_principles`: danh sách nguyên tắc (3–5).
- `acupoints`: tối đa 3, mỗi mục gồm tên + cơ chế (Khí/Huyết, Kinh Lạc).
- `nutrition`: `should_eat`, `avoid`, `principles`.
- `herbs`: danh sách ngắn (tối đa 4) + công năng chính; không đưa liều lượng.
- `environment`: điều chỉnh theo mùa/môi trường.
- `danger_signs`: mục lục dấu hiệu nặng cần đi viện.
- `boundaries`: câu nhắc phạm vi tư vấn.

## 3. Chiến lược Huấn luyện
- Pretraining tri thức: Tạo corpus có cấu trúc, nhúng vector hóa, tăng cường từ khóa đồng nghĩa.
- Instruction tuning: prompt + output chuẩn hoá thành block duy nhất.
- Multi-syndrome: mẫu huấn luyện có primary/secondary; tránh overfit một thể.
- Ngũ Hành suy luận: case-based reasoning với các mapping phổ biến.
- Phù Chính/Khu Tà: quyết định từ `Hư/Thực` và `Hàn/Nhiệt`.
- Mùa/môi trường: từ khóa và tác động đến nguyên tắc.

## 4. RLHF (Reinforcement Learning from Human Feedback)
- Thu thập đánh giá: độ rõ ràng, sự thân thiện, tính học thuật, an toàn.
- Reward shaping: thưởng câu trả lời ngắn, đúng cấu trúc; phạt dài dòng, liệt kê quá mức.
- Bandit optimization: A/B các biến thể câu trả lời và thứ tự nội dung.

## 5. An toàn & Ranh giới Tư vấn
- Không đưa liều lượng thuốc; không thay thế thuốc Tây y.
- Không chẩn đoán bệnh cấp tính/ung thư; nếu nghi ngờ → cảnh báo vượt phạm vi.
- Luôn liệt kê dấu hiệu nguy hiểm cần đến cơ sở y tế ngay.

## 6. Đánh giá & Chỉ số
- Accuracy biện chứng (so với chuyên gia): primary/secondary đúng.
- Safety violations: số lần vi phạm ranh giới tư vấn.
- Brevity: số token/trả lời; ≤ giới hạn cấu hình.
- Latency: độ trễ phản hồi; cache và truy xuất dữ liệu.
- UX scores: thân thiện và minh bạch.

## 7. Triển khai vào Hệ thống
- API: tổng hợp `lyLuan` (Bát Cương, Tạng Phủ, Ngũ Hành, Định hướng trị, Môi trường, Danger signs).
- UI: một khối hiển thị duy nhất; có CSV xuất.
- Logging: lưu lịch sử để làm dữ liệu RLHF.

Ghi chú: Các ví dụ trong tài liệu tránh dùng liều lượng; tập trung nguyên tắc và an toàn.