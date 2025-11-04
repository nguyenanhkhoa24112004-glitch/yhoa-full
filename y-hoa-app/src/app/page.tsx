import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 -z-10 bg-[#0A0F1F]">
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-96 w-[110vw] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side,#6E59CF 0%, transparent 60%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side,#A855F7 0%, transparent 60%)" }}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 md:px-10 md:py-14 shadow-[0_20px_60px_-20px_rgba(168,85,247,0.35)] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            {/* Logo Y HOA tối giản với gradient tím→cyan */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="yhoaLogoGradientHero" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-2)" />
                </linearGradient>
              </defs>
              <path d="M32 6 L42 22 L58 32 L42 42 L32 58 L22 42 L6 32 L22 22 Z" fill="url(#yhoaLogoGradientHero)" />
              <path d="M32 14 L38 24 L50 32 L38 40 L32 50 L26 40 L14 32 L26 24 Z" fill="rgba(255,255,255,0.18)" />
            </svg>
            <div className="text-white/70 text-sm">Y HOA · Y học cổ truyền – Tương lai</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Kết nối tinh hoa cổ truyền với nhịp sống hiện đại
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/70 max-w-3xl">
            Tra cứu, trò chuyện với trợ lí ảo và đặt lịch chăm sóc sức khỏe theo Y học cổ truyền – tất cả trong một trải nghiệm mượt mà, tinh tế.
          </p>
          {/* CTA removed per request */}
        </div>
      </section>

      {/* Truy cập nhanh (ẩn theo yêu cầu) */}

      {/* Giới thiệu Y HOA - phiên bản mở rộng, định hướng tương lai */}
      <section className="mx-auto max-w-6xl px-6 pb-20 mt-8">
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl overflow-hidden">
          <div className="p-8 md:p-12 text-white">
            {/* Top heading + side intro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Y HOA là gì?</h2>
              </div>
              <div />
            </div>

            {/* Two-column content (no images) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left quote-like paragraph + small image */}
              <div>
                <div className="relative pl-6">
                  <div className="text-4xl text-white/30 absolute -top-1 left-0">“</div>
                  <p className="text-white/85 leading-7 md:leading-8">
                    Y HOA theo đuổi trải nghiệm rõ ràng và hữu ích cho mọi người dùng. 
                    Mỗi nội dung đều được biên soạn mạch lạc, dễ nắm, đi kèm cảnh báo an toàn 
                    và liên kết nhanh giữa Bệnh – Dược liệu – Bài thuốc – Huyệt.
                  </p>
                  <p className="mt-3 text-white/80 leading-7 md:leading-8">
                    Y HOA kết nối tri thức Y học Cổ truyền với công nghệ hiện đại, giúp bạn tra cứu mạch lạc,
                    trò chuyện với trợ lí AI và xây dựng thói quen lành mạnh mỗi ngày.
                  </p>
                </div>
              </div>

              {/* Right about card */}
              <div className="rounded-3xl bg-[#2b2e6e]/80 border border-white/10 p-6 md:p-8">
                <div className="text-xs tracking-widest text-white/70">ABOUT Y HOA</div>
                <div className="mt-3 text-white/90 font-semibold">Hợp tác – Sáng tạo – Lấy người dùng làm trung tâm</div>
                <div className="mt-3 space-y-3 text-sm text-white/80 leading-6">
                  <p>
                    Chúng tôi tin vào sức mạnh của hợp tác và tính sáng tạo. Khi làm việc gần 
                    với người dùng, chúng tôi hiểu rõ mục tiêu – bối cảnh, từ đó đưa ra gợi ý 
                    theo ngữ cảnh giúp tạo ra khác biệt tích cực.
                  </p>
                  <p>
                    Cách tiếp cận của Y HOA kết hợp thiết kế – công nghệ – tri thức YHCT để tạo nên 
                    những trải nghiệm tra cứu và học tập liền mạch, trực quan.
                  </p>
                  <p>
                    Bằng việc đón đầu xu hướng và công nghệ, chúng tôi hướng tới các giải pháp không chỉ 
                    giải quyết vấn đề hiện tại mà còn mở ra cơ hội phát triển trong tương lai.
                  </p>
                </div>
              </div>
            </div>

            {/* Compact navigation pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/chat" className="btn-cta-secondary px-4 py-2 text-sm">Trợ lí Chat</Link>
              <Link href="/benh" className="btn-cta-secondary px-4 py-2 text-sm">Bệnh</Link>
              <Link href="/duoc-lieu" className="btn-cta-secondary px-4 py-2 text-sm">Dược liệu</Link>
              <Link href="/bai-thuoc" className="btn-cta-secondary px-4 py-2 text-sm">Bài thuốc</Link>
              <Link href="/khoe-cung-y-hoa" className="btn-cta-main px-5 py-2.5 text-sm">Khỏe cùng Y HOA</Link>
            </div>
            <div className="mt-6 text-center text-xs text-white/60">Nội dung chỉ tham khảo theo YHCT.</div>
          </div>
        </div>
      </section>

    </div>
  );
}

