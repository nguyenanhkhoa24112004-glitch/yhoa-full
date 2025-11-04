export type YhctNewsItem = {
  id: string;
  title: string;
  date: string; // ISO
  image: string;
  images?: string[]; // gallery images
  excerpt: string;
  content: string;
  category: string;
  source: "internal";
};

export const YHCT_NEWS: YhctNewsItem[] = [
  {
    id: "khai-truong-khoa-phuc-hoi-chuc-nang",
    title: "Khai trương Khoa Phục hồi chức năng – Nâng tầm điều trị YHCT",
    date: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
    ],
    category: "Hoạt động bệnh viện",
    source: "internal",
    excerpt:
      "Bệnh viện Y học cổ truyền chính thức đưa vào hoạt động Khoa Phục hồi chức năng với hệ thống thiết bị hiện đại, kết hợp phương pháp YHCT và vật lí trị liệu. Khoa có khu châm cứu – xoa bóp – phục hồi với phòng chức năng đạt chuẩn, quy trình tiếp đón nhanh, thân thiện.",
    content:
      "Ngày hôm nay, Bệnh viện Y học cổ truyền tổ chức lễ khai trương Khoa Phục hồi chức năng. Khoa được đầu tư đồng bộ máy móc: máy kéo giãn cột sống, siêu âm trị liệu, sóng ngắn, laser công suất thấp, cùng các phòng châm cứu, xoa bóp bấm huyệt đạt chuẩn. Mô hình điều trị kết hợp giữa Y học cổ truyền và phương pháp phục hồi hiện đại giúp người bệnh rút ngắn thời gian điều trị, cải thiện chất lượng cuộc sống.\n\nBên cạnh trang thiết bị, khoa chú trọng các phác đồ cá thể hoá dựa trên biện chứng luận trị (hàn – nhiệt, hư – thực, khí – huyết). Người bệnh được tư vấn bài tập dưỡng sinh, chế độ ăn phù hợp thể chất, kết hợp trị liệu huyệt vị trong theo dõi định kỳ.\n\nTrong thời gian tới, bệnh viện triển khai đào tạo liên tục cho điều dưỡng – kĩ thuật viên, chuẩn hoá quy trình an toàn (kiểm soát vô khuẩn, theo dõi thang điểm đau, đánh giá chức năng). Mục tiêu là nâng cao hiệu quả điều trị, rút ngắn thời gian phục hồi và tăng sự hài lòng người bệnh.",
  },
  {
    id: "hoi-thao-dong-y-thuc-chung",
    title: "Hội thảo Y học cổ truyền thực chứng – Chia sẻ ca lâm sàng điển hình",
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1508015079386-3fe60d76b31d?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Akupunktur.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Electroacupuncture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Acupuncture_needles.jpg",
    ],
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Các bác sĩ trình bày báo cáo chuyên đề về điều trị đau mạn tính bằng châm cứu điện kết hợp bài thuốc gia giảm, mang lại hiệu quả rõ rệt. Phần thảo luận đi sâu vào lựa chọn huyệt, cường độ kích thích và theo dõi VAS.",
    content:
      "Tại hội thảo, nhóm chuyên môn đã trình bày các ca lâm sàng về đau vai gáy, thoái hóa cột sống và đau đầu mạn tính. Phác đồ điều trị sử dụng châm cứu điện có kiểm soát, kết hợp bài thuốc gia giảm dựa trên biện chứng luận trị. Kết quả ghi nhận giảm đau ≥50% sau 10–14 ngày, cải thiện biên độ vận động và chất lượng giấc ngủ.\n\nPhiên thảo luận tập trung vào tiêu chuẩn lựa chọn huyệt (định vị theo mốc giải phẫu), cường độ kích thích phù hợp từng thể bệnh, và cách theo dõi khách quan bằng thang điểm VAS. Nhóm nghiên cứu đề xuất triển khai thử nghiệm đa trung tâm để củng cố bằng chứng thực chứng, đồng thời chuẩn hóa báo cáo kết quả lâm sàng.\n\nHội thảo kết thúc với phần tổng kết kinh nghiệm thực tế, nhấn mạnh nguyên tắc an toàn và sự phối hợp giữa YHCT và vật lí trị liệu để tối ưu hóa kết quả cho người bệnh.",
  },
  {
    id: "lich-kham-dong-y-tuan",
    title: "Cập nhật lịch khám Đông y tuần này – Thêm khung giờ ngoài giờ",
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1580281657527-47a8c6c0c7b3?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Akupunktur.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Acupuncture_needles.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Tuina_massage.jpg",
    ],
    category: "Thông báo",
    source: "internal",
    excerpt:
      "Bệnh viện mở thêm khung giờ khám ngoài giờ từ 17:30–20:00 các ngày trong tuần để phục vụ người bệnh bận rộn.",
    content:
      "Nhằm đáp ứng nhu cầu khám chữa bệnh sau giờ làm, bệnh viện triển khai lịch khám ngoài giờ vào buổi tối từ 17:30–20:00. Các khoa Châm cứu, Nội YHCT và Phục hồi chức năng sẽ bố trí luân phiên bác sĩ. Người bệnh có thể đặt lịch qua website mục ‘Đặt lịch’ hoặc gọi tổng đài. Khuyến khích mang theo hồ sơ bệnh và kết quả chẩn đoán hình ảnh để bác sĩ có thông tin đầy đủ khi khám.",
  },
  {
    id: "ky-thuat-cham-cuu-dien",
    title: "Áp dụng kĩ thuật châm cứu điện – Giảm đau nhanh, an toàn",
    date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1600750781657-88bc34077e47?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Acupuncture_needle.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Electroacupuncture_device.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Acupuncture_treatment.jpg",
    ],
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Kĩ thuật châm cứu điện được triển khai thường quy tại khoa Châm cứu, mang lại hiệu quả giảm đau rõ rệt cho người bệnh thoái hóa cột sống, đau vai gáy. Quy trình an toàn, chuẩn hóa từng bước.",
    content:
      "Châm cứu điện sử dụng dòng xung thấp qua kim châm nhằm tăng hiệu quả giảm đau và thư giãn cơ. Quy trình thực hiện tuân thủ kiểm soát vô khuẩn, lựa chọn huyệt phù hợp từng thể bệnh, cường độ kích thích cá thể hóa. Người bệnh được tư vấn đầy đủ về cảm giác khi điều trị và theo dõi sát sao trong suốt quá trình. Đây là kĩ thuật an toàn, ít tác dụng phụ, đặc biệt hữu ích cho các hội chứng đau cơ xương khớp.\n\nKhoa Châm cứu xây dựng tài liệu hướng dẫn thao tác, kiểm soát chất lượng thông qua checklist an toàn, đào tạo định kì cho nhân viên. Người bệnh được hẹn tái khám, đánh giá hiệu quả bằng thang điểm đau, chức năng vận động, để điều chỉnh phác đồ phù hợp.",
  },
  {
    id: "tap-huan-xoa-bop-bam-huyet",
    title: "Tập huấn xoa bóp bấm huyệt – Chuẩn hóa thao tác an toàn",
    date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1555658636-9e07f3e7f8f7?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Tuina_massage.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Chinese_massage.jpg",
    ],
    category: "Đào tạo",
    source: "internal",
    excerpt:
      "Khóa tập huấn tập trung vào cấu trúc huyệt, chống chỉ định và tiêu chuẩn thao tác, nâng cao hiệu quả và an toàn cho người bệnh. Học viên được hướng dẫn thực hành có kiểm soát.",
    content:
      "Lớp tập huấn quy tụ nhân viên các khoa lâm sàng. Nội dung gồm nhận diện huyệt vị, định vị bằng mốc giải phẫu, kĩ thuật day ấn, lăn, xoa, vận động khớp, cùng các trường hợp chống chỉ định cần lưu ý (loãng xương nặng, viêm cấp). Học viên thực hành trên mô hình và dưới sự giám sát của giảng viên.\n\nTài liệu đào tạo nhấn mạnh quy tắc an toàn, giao tiếp với người bệnh, lượng lực phù hợp, và cách nhận diện dấu hiệu cần dừng can thiệp. Sau khóa học, bệnh viện đánh giá năng lực, chuẩn hóa thao tác trước khi áp dụng trên lâm sàng để đảm bảo hiệu quả – an toàn.",
  },
  {
    id: "tu-thien-kham-suc-khoe-cong-dong",
    title: "Khám sức khỏe cộng đồng – Chương trình thiện nguyện tại xã vùng ven",
    date: new Date(Date.now() - 13 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1542736667-069246bdbc7b?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Acupuncture_treatment.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Electroacupuncture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
    ],
    category: "Cộng đồng",
    source: "internal",
    excerpt:
      "Đội ngũ bác sĩ điều dưỡng phối hợp địa phương tổ chức khám sức khỏe, tư vấn chế độ dinh dưỡng và cấp phát thuốc thiết yếu cho người dân.",
    content:
      "Hoạt động thiện nguyện diễn ra trong hai ngày, tập trung vào phát hiện sớm bệnh mạn tính: tăng huyết áp, đái tháo đường, đau mạn. Người dân được tư vấn chế độ ăn, luyện tập theo nguyên lí dưỡng sinh, hướng dẫn tự xoa bóp bấm huyệt giảm đau. Chương trình nhận được sự chung tay của các mạnh thường quân và đoàn thể địa phương.",
  },
  {
    id: "huong-dan-dat-lich-online",
    title: "Hướng dẫn đặt lịch khám YHCT trực tuyến – Nhanh chóng, tiện lợi",
    date: new Date(Date.now() - 16 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1554734867-bf3f0ddc77b4?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Electroacupuncture_device.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
    ],
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Người bệnh có thể đặt lịch trực tuyến chỉ với vài bước đơn giản, nhận xác nhận qua SMS/Email và chủ động sắp xếp thời gian khám.",
    content:
      "Đặt lịch trực tuyến giúp giảm thời gian chờ. Truy cập mục ‘Đặt lịch’, chọn khoa, bác sĩ, khung giờ phù hợp, cung cấp thông tin liên hệ. Hệ thống sẽ gửi xác nhận qua SMS/Email. Người bệnh có thể chủ động điều chỉnh lịch hẹn trước 24 giờ. Vui lòng đến sớm 15 phút để hoàn tất thủ tục và chuẩn bị trước khi khám.",
  },
  {
    id: "thong-bao-nghi-tet",
    title: "Thông báo nghỉ Tết và lịch trực bệnh viện",
    date: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1519052534-6b1a6b4f7216?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Chinese_massage.jpg",
    ],
    category: "Thông báo",
    source: "internal",
    excerpt:
      "Bệnh viện thông báo lịch nghỉ Tết và bố trí trực 24/7 tại khoa cấp cứu. Người bệnh cần hỗ trợ vui lòng liên hệ tổng đài.",
    content:
      "Trong dịp Tết Nguyên Đán, bệnh viện bố trí lịch trực 24/7 tại khoa cấp cứu. Các khoa lâm sàng sắp xếp lịch khám lại phù hợp. Người bệnh có nhu cầu đổi lịch vui lòng liên hệ tổng đài hoặc sử dụng tính năng online. Chúc quý người bệnh cùng gia đình năm mới an khang, sức khỏe dồi dào.",
  },
  {
    id: "truyen-thong-ve-phong-benh",
    title: "Truyền thông phòng bệnh theo mùa – Bảo vệ sức khỏe chủ động",
    date: new Date(Date.now() - 23 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1532634896-26909cbfff2a?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
    ],
    category: "Giáo dục sức khỏe",
    source: "internal",
    excerpt:
      "Bệnh viện triển khai chuỗi bài truyền thông phòng bệnh theo mùa: giữ ấm đúng cách, dinh dưỡng cân bằng, luyện tập dưỡng sinh hàng ngày.",
    content:
      "Loạt bài truyền thông giúp người dân chủ động phòng bệnh hô hấp, xương khớp khi trời lạnh: giữ ấm cổ vai gáy, ngủ đủ giấc, ăn ấm nóng, tập khí công–dưỡng sinh nhẹ nhàng. Khuyến nghị sử dụng các món ăn điều vị như cháo gừng, trà quế mật ong ở mức độ phù hợp thể trạng. Nếu có bệnh nền, cần hỏi ý kiến bác sĩ trước khi dùng.",
  },
  {
    id: "ra-mat-phong-tu-van-dinh-duong",
    title: "Ra mắt Phòng tư vấn dinh dưỡng theo YHCT",
    date: new Date(Date.now() - 27 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
    ],
    category: "Hoạt động bệnh viện",
    source: "internal",
    excerpt:
      "Phòng tư vấn dinh dưỡng chính thức hoạt động, xây dựng thực đơn theo thể chất và mùa, hỗ trợ người bệnh kiểm soát cân nặng và sức khỏe.",
    content:
      "Phòng tư vấn dinh dưỡng theo YHCT sử dụng nguyên lí phù hợp thời tiết, âm dương ngũ hành để xây dựng thực đơn cá thể hóa. Người bệnh được đánh giá thể chất, thói quen sinh hoạt, từ đó đưa ra gợi ý món ăn điều vị, thời điểm dùng. Dịch vụ tích hợp theo dõi và điều chỉnh định kì để đảm bảo hiệu quả lâu dài.",
  },
  {
    id: "chia-se-benh-nhan",
    title: "Chia sẻ từ người bệnh – Hành trình vượt qua đau mạn",
    date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1516600164266-f3b8166ae679?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Acupuncture_treatment.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Electroacupuncture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Acupuncture_needle.jpg",
    ],
    category: "Câu chuyện người bệnh",
    source: "internal",
    excerpt:
      "Câu chuyện thực tế về hành trình điều trị đau lưng mạn tính bằng châm cứu kết hợp tập luyện, mang lại sự tự tin và chất lượng sống tốt hơn.",
    content:
      "Anh H. chia sẻ về hành trình 8 tuần điều trị đau lưng mạn tính: châm cứu điện 3 buổi/tuần, kết hợp xoa bóp bấm huyệt và các bài vận động cột sống. Sau 4 tuần, mức độ đau giảm rõ rệt, giấc ngủ cải thiện. Anh duy trì thói quen luyện tập hàng ngày, ăn uống lành mạnh, hạn chế ngồi lâu. Câu chuyện là động lực để nhiều người bệnh tin tưởng vào phương pháp điều trị an toàn, bền vững.",
  },
  {
    id: "trien-khai-bvlt-ket-hop-yhct",
    title: "Triển khai mô hình vật lí trị liệu kết hợp YHCT",
    date: new Date(Date.now() - 32 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1580055782271-5f0ef78d66f0?w=1200&q=80&auto=format&fit=crop",
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Phối hợp vật lí trị liệu với châm cứu, xoa bóp giúp tối ưu giảm đau và phục hồi chức năng.",
    content:
      "Mô hình kết hợp điều trị giữa VLT và YHCT được chuẩn hóa: đánh giá đau, biên độ vận động, lựa chọn huyệt phù hợp và bài tập gia cố cơ. Quy trình giúp người bệnh phục hồi sớm, giảm lệ thuộc thuốc giảm đau.",
  },
  {
    id: "cap-nhat-phac-do-viem-khop-vai",
    title: "Cập nhật phác đồ điều trị viêm quanh khớp vai",
    date: new Date(Date.now() - 34 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1579154204601-b4d6b0145b66?w=1200&q=80&auto=format&fit=crop",
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Phác đồ mới kết hợp châm cứu điện, bài thuốc gia giảm và vận động trị liệu.",
    content:
      "Nhóm chuyên môn công bố quy trình điều trị gồm lựa chọn huyệt vùng vai, kích thích điện mức thấp, bài thuốc gia giảm theo thể, kết hợp vận động trị liệu kiểm soát. Kết quả lâm sàng cho thấy cải thiện chức năng rõ rệt.",
  },
  {
    id: "dao-tao-an-toan-cham-cuu",
    title: "Đào tạo an toàn châm cứu – Quy trình vô khuẩn",
    date: new Date(Date.now() - 36 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1584466977773-389d4f1293c3?w=1200&q=80&auto=format&fit=crop",
    category: "Đào tạo",
    source: "internal",
    excerpt:
      "Chuẩn hóa vô khuẩn, thao tác kim và giao tiếp an toàn với người bệnh.",
    content:
      "Khoá học áp dụng checklist vô khuẩn, thực hành thao tác kim, nhận diện dấu hiệu cần dừng can thiệp. Sau đào tạo, nhân viên được đánh giá năng lực và cấp chứng nhận nội bộ.",
  },
  {
    id: "huong-dan-tu-xoa-bop-vai-gay",
    title: "Hướng dẫn tự xoa bóp vai gáy tại nhà",
    date: new Date(Date.now() - 38 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc0?w=1200&q=80&auto=format&fit=crop",
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Các bước day ấn cơ bản, thời lượng phù hợp và lưu ý chống chỉ định.",
    content:
      "Bài hướng dẫn gồm làm nóng vùng cổ – vai, day ấn cơ thang, kéo giãn nhẹ, kết hợp hít thở sâu. Không thực hiện khi có viêm cấp, sốt hoặc nghi ngờ chấn thương.",
  },
  {
    id: "chuong-trinh-dinh-duong-mua-lanh",
    title: "Chương trình dinh dưỡng mùa lạnh theo YHCT",
    date: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
    ],
    category: "Giáo dục sức khỏe",
    source: "internal",
    excerpt:
      "Khuyến nghị món ăn ấm nóng, điều vị phù hợp thể trạng mùa lạnh.",
    content:
      "Thực đơn gợi ý gồm cháo gừng, canh quế, trà mật ong ấm. Tư vấn cá thể hoá theo thể hàn – nhiệt, chú trọng ngủ đủ và luyện tập nhẹ.",
  },
  {
    id: "phong-kham-ngoai-gio-yhct",
    title: "Mở phòng khám YHCT ngoài giờ phục vụ người bận rộn",
    date: new Date(Date.now() - 42 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1578496781854-77b1029904d9?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Akupunktur.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Tuina_massage.jpg",
    ],
    category: "Thông báo",
    source: "internal",
    excerpt:
      "Thêm khung giờ buổi tối, đặt lịch trực tuyến và xác nhận SMS.",
    content:
      "Phòng khám ngoài giờ hoạt động từ 17:30–20:00, triển khai đặt lịch online, xác nhận qua SMS/Email, giảm thời gian chờ và thuận tiện cho người lao động.",
  },
  {
    id: "chien-dich-truyen-thong-phong-benh-mua-mua",
    title: "Chiến dịch truyền thông phòng bệnh mùa mưa",
    date: new Date(Date.now() - 44 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1520978786737-3e2c6b5b1d49?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
    ],
    category: "Giáo dục sức khỏe",
    source: "internal",
    excerpt:
      "Giữ ấm hợp lí, ăn uống lành mạnh và luyện tập dưỡng sinh.",
    content:
      "Khuyến cáo người dân chủ động phòng bệnh hô hấp và xương khớp, kết hợp tự xoa bóp bấm huyệt nhẹ nhàng để thư giãn cơ.",
  },
  {
    id: "kham-sang-loc-cong-dong-vung-ven",
    title: "Khám sàng lọc cộng đồng tại xã vùng ven",
    date: new Date(Date.now() - 46 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1543331707-4f454c2eeea3?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Acupuncture_treatment.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Electroacupuncture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
    ],
    category: "Cộng đồng",
    source: "internal",
    excerpt:
      "Khám sức khỏe, tư vấn dinh dưỡng và cấp phát thuốc thiết yếu.",
    content:
      "Chương trình phối hợp địa phương tổ chức khám sàng lọc bệnh mạn tính, tư vấn luyện tập và dinh dưỡng phù hợp thể trạng, hỗ trợ thuốc thiết yếu.",
  },
  {
    id: "thu-vien-bai-tap-duong-sinh",
    title: "Ra mắt thư viện bài tập dưỡng sinh online",
    date: new Date(Date.now() - 48 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1554306274-f2270f7d3c7e?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Tuina_massage.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Akupunktur.JPG",
    ],
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Video hướng dẫn bài tập nhẹ nhàng, phù hợp nhiều độ tuổi.",
    content:
      "Thư viện gồm các bài tập cơ bản cho cột sống, khớp vai – gối, tập thở và thư giãn, giúp người bệnh duy trì lối sống lành mạnh tại nhà.",
  },
  {
    id: "hoi-thao-cham-cuu-cay-chi",
    title: "Hội thảo về châm cứu và cấy chỉ – Trao đổi thực hành",
    date: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1515386474292-475b7a6305c2?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Akupunktur.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Acupuncture_needles.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Electroacupuncture.jpg",
    ],
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Thảo luận lựa chọn huyệt, liều lượng kích thích và theo dõi an toàn.",
    content:
      "Các báo cáo ca lâm sàng chia sẻ kinh nghiệm thực hành an toàn, lựa chọn huyệt theo mốc giải phẫu và chuẩn hóa ghi nhận hiệu quả.",
  },
  {
    id: "cap-nhat-lich-kham-nam-moi",
    title: "Cập nhật lịch khám đầu năm mới",
    date: new Date(Date.now() - 52 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1584985591226-8541f59af67a?w=1200&q=80&auto=format&fit=crop",
    category: "Thông báo",
    source: "internal",
    excerpt:
      "Điều chỉnh lịch khám phù hợp, thông tin đặt lịch trực tuyến.",
    content:
      "Các khoa lâm sàng cập nhật lịch khám và hướng dẫn người bệnh đặt lịch thuận tiện, giảm thời gian chờ.",
  },
  {
    id: "thuc-don-dieu-vi-cho-nguoi-cao-tuoi",
    title: "Thực đơn điều vị cho người cao tuổi",
    date: new Date(Date.now() - 54 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&auto=format&fit=crop",
    category: "Giáo dục sức khỏe",
    source: "internal",
    excerpt:
      "Gợi ý món ăn dễ tiêu, ấm nóng, phù hợp thể trạng.",
    content:
      "Khuyến nghị thực đơn giàu chất xơ, ít đường đơn, tăng cường thực phẩm ấm, kết hợp tập dưỡng sinh nhẹ.",
  },
  {
    id: "ky-nang-giao-tiep-tren-lam-sang",
    title: "Kỹ năng giao tiếp trên lâm sàng YHCT",
    date: new Date(Date.now() - 56 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1584362917168-1f9a24f01666?w=1200&q=80&auto=format&fit=crop",
    category: "Đào tạo",
    source: "internal",
    excerpt:
      "Nâng cao trải nghiệm người bệnh thông qua giao tiếp và giáo dục sức khỏe.",
    content:
      "Khoá học tập trung vào lắng nghe tích cực, giải thích phác đồ, hướng dẫn tự chăm sóc và xây dựng niềm tin.",
  },
  {
    id: "huong-dan-tap-tho-thu-gian",
    title: "Hướng dẫn tập thở thư giãn cho người đau mạn",
    date: new Date(Date.now() - 58 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&q=80&auto=format&fit=crop",
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Bài tập thở chậm sâu giúp giảm căng thẳng và hỗ trợ giảm đau.",
    content:
      "Hướng dẫn đếm nhịp thở, hít vào bằng mũi, thở ra bằng miệng chậm rãi, kết hợp thư giãn cơ tiến triển.",
  },
  {
    id: "tong-ket-hoat-dong-quy-1",
    title: "Tổng kết hoạt động chuyên môn Quý I",
    date: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1524650359791-7992a2c6f4d7?w=1200&q=80&auto=format&fit=crop",
    category: "Hoạt động bệnh viện",
    source: "internal",
    excerpt:
      "Báo cáo chỉ số chất lượng, đào tạo và nghiên cứu lâm sàng.",
    content:
      "Bệnh viện công bố chỉ số hài lòng, kết quả giảm đau, tỷ lệ biến cố thấp, cùng các khóa đào tạo và đề tài lâm sàng đang triển khai.",
  },
  {
    id: "cap-nhat-quy-trinh-xoa-bop-an-toan",
    title: "Cập nhật quy trình xoa bóp an toàn",
    date: new Date(Date.now() - 62 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1200&q=80&auto=format&fit=crop",
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Chuẩn hóa thao tác, lượng lực và đánh giá hiệu quả sau điều trị.",
    content:
      "Quy trình kiểm soát chất lượng gồm checklist, theo dõi thang điểm đau, đánh giá chức năng vận động, ghi nhận tác dụng phụ nếu có.",
  },
  {
    id: "thuc-hanh-an-giac-sau",
    title: "Thực hành ngủ – ăn – tập đúng: nền tảng phục hồi",
    date: new Date(Date.now() - 64 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc0?w=1200&q=80&auto=format&fit=crop",
    category: "Giáo dục sức khỏe",
    source: "internal",
    excerpt:
      "Hướng dẫn thói quen cơ bản hỗ trợ phục hồi bền vững.",
    content:
      "Tập trung vào ngủ đủ giấc, ăn điều vị, tập nhẹ nhàng hàng ngày để duy trì cân bằng cơ thể và giảm đau mạn.",
  },
  {
    id: "phat-dong-ngay-suc-khoe",
    title: "Phát động Ngày Sức khỏe – Khám miễn phí cho 100 người",
    date: new Date(Date.now() - 66 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1524884932912-1e98ee20a3be?w=1200&q=80&auto=format&fit=crop",
    category: "Cộng đồng",
    source: "internal",
    excerpt:
      "Chương trình khám sức khỏe miễn phí, tư vấn dinh dưỡng và tập luyện.",
    content:
      "Sự kiện hướng tới người dân khó khăn, cung cấp tư vấn dinh dưỡng, luyện tập dưỡng sinh và cấp phát thuốc thiết yếu.",
  },
  {
    id: "thu-nghiem-lieu-trinh-ket-hop",
    title: "Thử nghiệm liệu trình kết hợp châm cứu – VLT",
    date: new Date(Date.now() - 68 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1484981130703-439a490ff245?w=1200&q=80&auto=format&fit=crop",
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Đánh giá giảm đau và cải thiện chức năng qua thang điểm khách quan.",
    content:
      "Nghiên cứu thử nghiệm nhỏ ghi nhận giảm đau, tăng biên độ vận động ở nhóm kết hợp châm cứu và bài tập VLT so với nhóm kiểm soát.",
  },
  {
    id: "huong-dan-tu-cham-soc-khop-goi",
    title: "Hướng dẫn tự chăm sóc khớp gối",
    date: new Date(Date.now() - 70 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1520978831690-2183b6c2b59c?w=1200&q=80&auto=format&fit=crop",
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Bài tập cơ đùi, kéo giãn nhẹ và chế độ ăn hỗ trợ khớp.",
    content:
      "Khuyến nghị tập mạnh cơ tứ đầu, kéo giãn cơ sau đùi, hạn chế tư thế gây áp lực, kết hợp dinh dưỡng phù hợp.",
  },
  {
    id: "cong-bo-tai-lieu-huong-dan-lam-sang",
    title: "Công bố tài liệu hướng dẫn lâm sàng nội bộ",
    date: new Date(Date.now() - 72 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1518551935220-cb1e135e3ca8?w=1200&q=80&auto=format&fit=crop",
    category: "Hoạt động bệnh viện",
    source: "internal",
    excerpt:
      "Tài liệu chuẩn hóa quy trình, thao tác và tiêu chuẩn an toàn.",
    content:
      "Tập hợp hướng dẫn quy trình châm cứu, xoa bóp, VLT, tiêu chuẩn vô khuẩn và ghi nhận hiệu quả lâm sàng.",
  },
  {
    id: "tu-van-thao-duoc-theo-the-chat",
    title: "Tư vấn thảo dược theo thể chất cá thể",
    date: new Date(Date.now() - 74 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1550258987-1901f990a04b?w=1200&q=80&auto=format&fit=crop",
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Gợi ý sử dụng thảo dược phổ biến phù hợp từng thể.",
    content:
      "Hướng dẫn sử dụng gừng, quế, bạc hà ở mức độ phù hợp; người bệnh có nền cần hỏi ý kiến bác sĩ trước khi dùng.",
  },
  {
    id: "nghien-cuu-vai-tro-duong-sinh",
    title: "Nghiên cứu vai trò dưỡng sinh trong giảm đau mạn",
    date: new Date(Date.now() - 76 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=80&auto=format&fit=crop",
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Tập luyện đều đặn giúp cải thiện đau, giấc ngủ và tinh thần.",
    content:
      "Dưỡng sinh kết hợp thở – vận động nhẹ hỗ trợ giảm đau mạn, nâng cao chất lượng giấc ngủ và tâm lí người bệnh.",
  },
  {
    id: "cau-chuyen-phuc-hoi-sau-chan-thuong",
    title: "Câu chuyện phục hồi sau chấn thương",
    date: new Date(Date.now() - 78 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1494326946606-27b34b5c5f34?w=1200&q=80&auto=format&fit=crop",
    category: "Câu chuyện người bệnh",
    source: "internal",
    excerpt:
      "Người bệnh phục hồi chức năng nhờ chương trình kết hợp cá thể hoá.",
    content:
      "Liệu trình kết hợp châm cứu, xoa bóp và bài tập phù hợp giúp phục hồi sau chấn thương nhẹ ở cổ – vai.",
  },
  {
    id: "thong-bao-nang-cap-co-so-vat-chat",
    title: "Thông báo nâng cấp cơ sở vật chất khoa YHCT",
    date: new Date(Date.now() - 80 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=1200&q=80&auto=format&fit=crop",
    category: "Thông báo",
    source: "internal",
    excerpt:
      "Nâng cấp phòng chức năng, thiết bị hỗ trợ điều trị an toàn, hiệu quả.",
    content:
      "Khoa YHCT hoàn thiện nâng cấp thiết bị, tăng chất lượng dịch vụ, cải thiện trải nghiệm người bệnh trong quá trình điều trị.",
  },
  {
    id: "de-xuat-kiem-soat-chat-luong-lam-sang",
    title: "Đề xuất kiểm soát chất lượng lâm sàng YHCT",
    date: new Date(Date.now() - 82 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop",
    category: "Hoạt động bệnh viện",
    source: "internal",
    excerpt:
      "Áp dụng checklist, đánh giá định kì và phản hồi người bệnh.",
    content:
      "Hệ thống theo dõi chất lượng lâm sàng giúp chuẩn hóa quy trình, giảm rủi ro và nâng cao hiệu quả điều trị.",
  },
  {
    id: "huong-dan-tu-cham-soc-cot-song-lung",
    title: "Hướng dẫn tự chăm sóc cột sống lưng",
    date: new Date(Date.now() - 84 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1519340241570-36f507220ac8?w=1200&q=80&auto=format&fit=crop",
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Bài tập kéo giãn và tăng cường cơ lưng – bụng.",
    content:
      "Hướng dẫn các bài tập đơn giản tại nhà giúp hỗ trợ cột sống, cải thiện tư thế và giảm đau mạn tính.",
  },
  {
    id: "xay-dung-phac-do-cho-nguoi-cao-tuoi",
    title: "Xây dựng phác đồ YHCT cho người cao tuổi",
    date: new Date(Date.now() - 86 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1519415552620-6101f1ab2ed8?w=1200&q=80&auto=format&fit=crop",
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Cá thể hoá theo bệnh nền, thể chất và mục tiêu điều trị.",
    content:
      "Phác đồ chú trọng an toàn, ưu tiên can thiệp nhẹ, theo dõi sát để điều chỉnh phù hợp từng cá nhân.",
  },
  {
    id: "tap-huan-giam-dau-an-toan",
    title: "Tập huấn giảm đau an toàn trên lâm sàng",
    date: new Date(Date.now() - 88 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200&q=80&auto=format&fit=crop",
    category: "Đào tạo",
    source: "internal",
    excerpt:
      "Chia sẻ kinh nghiệm kiểm soát đau, ghi nhận hiệu quả khách quan.",
    content:
      "Khoá học nhấn mạnh đánh giá đau, kỹ thuật châm cứu điện an toàn và phối hợp xoa bóp trị liệu.",
  },
  {
    id: "cau-lac-bo-duong-sinh-sang-som",
    title: "Câu lạc bộ dưỡng sinh sáng sớm",
    date: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80&auto=format&fit=crop",
    category: "Cộng đồng",
    source: "internal",
    excerpt:
      "Khuyến khích tập luyện nhẹ nhàng, nâng cao sức khỏe cộng đồng.",
    content:
      "Hoạt động câu lạc bộ duy trì thói quen tập luyện buổi sáng, kết nối cộng đồng quan tâm YHCT.",
  },
  {
    id: "huong-dan-an-theo-mua",
    title: "Hướng dẫn ăn theo mùa – Nguyên lí điều vị",
    date: new Date(Date.now() - 92 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1505935428452-9d90d0cd2b1a?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
    ],
    category: "Giáo dục sức khỏe",
    source: "internal",
    excerpt:
      "Thực đơn phù hợp khí hậu, thể chất cá thể hoá.",
    content:
      "Ăn điều vị theo mùa giúp cân bằng cơ thể, hỗ trợ phòng bệnh theo nguyên lí YHCT.",
  },
  {
    id: "ky-thuat-cay-chi-giam-dau",
    title: "Ứng dụng kĩ thuật cấy chỉ giảm đau",
    date: new Date(Date.now() - 94 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1535911685-0f983b1a40f8?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Acupuncture_needles.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Electroacupuncture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Acupuncture_treatment.jpg",
    ],
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Áp dụng trên một số hội chứng đau mạn có chọn lọc.",
    content:
      "Cấy chỉ được triển khai trong quy trình kiểm soát chặt chẽ, lựa chọn ca phù hợp với mục tiêu giảm đau bền vững.",
  },
  {
    id: "mo-rong-khoa-phuc-hoi-chuc-nang",
    title: "Mở rộng khu Phục hồi chức năng",
    date: new Date(Date.now() - 96 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1603398938378-e0d43d2c7a7f?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Electroacupuncture_device.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Tuina_massage.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
    ],
    category: "Hoạt động bệnh viện",
    source: "internal",
    excerpt:
      "Bổ sung thiết bị hiện đại hỗ trợ phục hồi hiệu quả.",
    content:
      "Khu PHCN được bổ sung thiết bị kéo giãn, siêu âm trị liệu, laser công suất thấp nhằm nâng cao chất lượng dịch vụ.",
  },
  {
    id: "ngay-hoi-suc-khoe-cong-dong",
    title: "Ngày hội Sức khỏe cộng đồng",
    date: new Date(Date.now() - 98 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1514986888952-8cd320577bcd?w=1200&q=80&auto=format&fit=crop",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Akupunktur.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Acupressure_hand.jpg",
    ],
    category: "Cộng đồng",
    source: "internal",
    excerpt:
      "Khám – tư vấn – truyền thông về phòng bệnh.",
    content:
      "Sự kiện nâng cao nhận thức cộng đồng về phòng bệnh theo mùa, dinh dưỡng và luyện tập dưỡng sinh.",
  },
  {
    id: "trien-khai-he-thong-dat-lich-moi",
    title: "Triển khai hệ thống đặt lịch mới",
    date: new Date(Date.now() - 100 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1495305379050-64540d6eece6?w=1200&q=80&auto=format&fit=crop",
    category: "Thông báo",
    source: "internal",
    excerpt:
      "Hệ thống đặt lịch nhanh, xác nhận và nhắc hẹn tự động.",
    content:
      "Nâng cấp trải nghiệm đặt lịch online, giảm thời gian chờ và tăng tính chủ động cho người bệnh.",
  },
  {
    id: "chia-se-tuong-tac-bac-si-nguoi-benh",
    title: "Chia sẻ tương tác bác sĩ – người bệnh",
    date: new Date(Date.now() - 102 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1200&q=80&auto=format&fit=crop",
    category: "Câu chuyện người bệnh",
    source: "internal",
    excerpt:
      "Xây dựng mối tin cậy và hợp tác trong điều trị.",
    content:
      "Câu chuyện nhấn mạnh giao tiếp hai chiều, giải thích phác đồ giúp người bệnh tuân thủ và đạt hiệu quả tốt hơn.",
  },
  {
    id: "huong-dan-cham-soc-co-vai",
    title: "Hướng dẫn chăm sóc cơ vai",
    date: new Date(Date.now() - 104 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80&auto=format&fit=crop",
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Bài tập nhẹ nhàng tăng cường và kéo giãn vùng vai.",
    content:
      "Hướng dẫn bài tập phù hợp cho người làm việc văn phòng, hạn chế ngồi lâu và cải thiện tư thế.",
  },
  {
    id: "doi-moi-noi-dung-truyen-thong-yhct",
    title: "Đổi mới nội dung truyền thông YHCT",
    date: new Date(Date.now() - 106 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1523246126230-5650992683f8?w=1200&q=80&auto=format&fit=crop",
    category: "Giáo dục sức khỏe",
    source: "internal",
    excerpt:
      "Nội dung dễ hiểu, gần gũi, cập nhật theo mùa và nhu cầu.",
    content:
      "Truyền thông giúp người dân nắm vững nguyên lí tự chăm sóc, ăn – ngủ – tập đúng để phòng bệnh.",
  },
  {
    id: "phoi-hop-da-chuyen-khoa",
    title: "Phối hợp đa chuyên khoa trong điều trị",
    date: new Date(Date.now() - 108 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200&q=80&auto=format&fit=crop",
    category: "Hoạt động bệnh viện",
    source: "internal",
    excerpt:
      "Tăng cường hợp tác để tối ưu hoá kết quả cho người bệnh.",
    content:
      "Mô hình phối hợp giữa YHCT, Ngoại, Nội, VLT giúp cá thể hoá điều trị, kiểm soát đau và phục hồi chức năng hiệu quả.",
  },
  {
    id: "ky-nang-tu-cham-soc-ban-than",
    title: "Kỹ năng tự chăm sóc bản thân cho người đau mạn",
    date: new Date(Date.now() - 110 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=80&auto=format&fit=crop",
    category: "Hướng dẫn",
    source: "internal",
    excerpt:
      "Thiết lập thói quen hỗ trợ phục hồi và giảm đau bền vững.",
    content:
      "Hướng dẫn theo dõi mức độ đau, lập kế hoạch tập luyện và ăn uống điều vị phù hợp thể chất.",
  },
  {
    id: "bao-cao-ket-qua-an-toan-lam-sang",
    title: "Báo cáo kết quả an toàn lâm sàng",
    date: new Date(Date.now() - 112 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1523244202754-254f7e7f6940?w=1200&q=80&auto=format&fit=crop",
    category: "Khoa học kỹ thuật",
    source: "internal",
    excerpt:
      "Tỉ lệ biến cố thấp, tuân thủ quy trình vô khuẩn nghiêm ngặt.",
    content:
      "Bệnh viện công bố số liệu minh bạch, duy trì tiêu chuẩn an toàn cao trong can thiệp YHCT.",
  },
  {
    id: "cau-chuyen-hanh-trinh-khoi-benh",
    title: "Câu chuyện hành trình khỏi bệnh của cô M.",
    date: new Date(Date.now() - 114 * 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1527239499573-7028c3b67afb?w=1200&q=80&auto=format&fit=crop",
    category: "Câu chuyện người bệnh",
    source: "internal",
    excerpt:
      "Điều trị đau cổ – vai kết hợp tập luyện giúp cải thiện chức năng.",
    content:
      "Cô M. duy trì liệu trình châm cứu điện và xoa bóp, tuân thủ tập luyện, đạt cải thiện rõ rệt sau 6 tuần.",
  },
];