import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/ui/Navbar';
import { Providers } from './providers';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400","600","700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Y HOA – Y học cổ truyền · Tương lai",
  description: "Kết nối tinh hoa cổ truyền với nhịp sống hiện đại. Tra cứu, trò chuyện với trợ lí ảo và đặt lịch chăm sóc sức khỏe theo Y học cổ truyền.",
  keywords: "Y HOA, y học cổ truyền, dược liệu, bài thuốc, đông y, thuốc nam, vũ trụ, tương lai",
  authors: [{ name: "Y HOA" }],
  creator: "Y HOA",
  publisher: "Y HOA",
  openGraph: {
    title: "Y HOA",
    description: "Kết nối tinh hoa cổ truyền với nhịp sống hiện đại.",
    url: "https://yhoa.vn",
    siteName: "Y HOA",
    locale: "vi_VN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <Providers session={session}>
          {/* Cosmic background overlay for all pages */}
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-24 left-1/2 h-[384px] w-[120vw] -translate-x-1/2 rounded-full blur-3xl" style={{background:"radial-gradient(closest-side,var(--accent) 0%, transparent 60%)"}} />
              <div className="absolute bottom-[-140px] right-[-140px] h-[420px] w-[420px] rounded-full blur-3xl" style={{background:"radial-gradient(closest-side,var(--accent-2) 0%, transparent 60%)"}} />
            </div>

            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-200px)]">
              {children}
            </main>
            <footer className="bg-gradient-to-r from-[#0A0A1F] via-[#0E0E28] to-[#0A0A1F] text-white py-8 border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Y HOA</h3>
                    <p className="text-white/70">Y học cổ truyền · Tương lai</p>
                  </div>
                  <div className="text-center md:text-right">
                    <p>© {new Date().getFullYear()} Y HOA.</p>
                    <p className="text-sm text-white/60">Tất cả các quyền được bảo lưu.</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}