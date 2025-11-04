'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const [isClient, setIsClient] = useState(false);

  // Tránh sai khác SSR/CSR gây hydration error: đợi mount trước khi hiển thị phần phụ thuộc session
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // Render skeleton on server and first client render to avoid hydration mismatch
  if (!isClient) {
    return (
      <nav className="bg-[var(--background)] text-white border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-28 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
                  <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
                  <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
                  <div className="h-6 w-24 rounded bg-white/10 animate-pulse" />
                  <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
                  <div className="w-16 h-4 rounded bg-white/10 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <div className="h-8 w-8 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[var(--background)] text-white border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold flex items-center gap-2">
                {/* Y HOA Logo: 4-point sparkle with smooth corners, gradient violet→cyan */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="yhoaLogoGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" />
                      <stop offset="100%" stopColor="var(--accent-2)" />
                    </linearGradient>
                  </defs>
                  {/* Central diamond star */}
                  <path
                    d="M32 6 L42 22 L58 32 L42 42 L32 58 L22 42 L6 32 L22 22 Z"
                    fill="url(#yhoaLogoGradient)"
                    stroke="none"
                  />
                  {/* Subtle inner cuts to evoke minimalist petals */}
                  <path
                    d="M32 14 L38 24 L50 32 L38 40 L32 50 L26 40 L14 32 L26 24 Z"
                    fill="rgba(255,255,255,0.18)"
                    stroke="none"
                  />
                </svg>
                <span className="tracking-wide">Y HOA</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/duoc-lieu" className="px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-out neon-cyan-hover">
                  Dược liệu
                </Link>
                <Link href="/bai-thuoc" className="px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-out neon-cyan-hover">
                  Bài thuốc
                </Link>
                <Link href="/benh" className="px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-out neon-cyan-hover">
                  Bệnh
                </Link>
                <Link href="/chat" className="px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-out neon-cyan-hover">
                  Chat trợ lí ảo
                </Link>
                <Link href="/khoe-cung-y-hoa" className="px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-out neon-cyan-hover">
                  Khỏe cùng Y HOA
                </Link>
                {/* Tin tức removed */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {!isClient || isLoading ? (
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
                  <div className="w-16 h-4 rounded bg-white/10 animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--accent)]/50 text-white violet-glow-hover">
                    {/* Dùng logo chính làm avatar hình học */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
                      <defs>
                        <linearGradient id="yhoaLogoGradientAvatar" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" />
                          <stop offset="100%" stopColor="var(--accent-2)" />
                        </linearGradient>
                      </defs>
                      <path d="M32 6 L42 22 L58 32 L42 42 L32 58 L22 42 L6 32 L22 22 Z" fill="url(#yhoaLogoGradientAvatar)" />
                    </svg>
                    <span className="text-sm font-medium">{session?.user?.name || 'Người dùng'}</span>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-out flex items-center neon-cyan-hover"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/dang-nhap" className="px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-out flex items-center neon-cyan-hover">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Đăng nhập
                  </Link>
                  <Link href="/dang-ky" className="px-3 py-2 rounded-md text-sm font-medium btn-primary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white transition duration-200 ease-out neon-cyan-hover"
            >
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/duoc-lieu" className="block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-out flex items-center neon-cyan-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Dược liệu
          </Link>
          <Link href="/bai-thuoc" className="block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-out flex items-center neon-cyan-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Bài thuốc
          </Link>
          <Link href="/benh" className="block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-out flex items-center neon-cyan-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Bệnh
          </Link>
          <Link href="/chat" className="block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-out flex items-center neon-cyan-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-8 7l4-4h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12z" />
            </svg>
            Chat trợ lí ảo
          </Link>
          <Link href="/khoe-cung-y-hoa" className="block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-out flex items-center neon-cyan-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v1H7a3 3 0 100 6h10a3 3 0 100-6h-2v-1c0-1.657-1.343-3-3-3z" />
            </svg>
            Khỏe cùng Y HOA
          </Link>
          {/* Tin tức removed */}
          {!isClient || isLoading ? (
            <>
              <div className="block px-3 py-2 text-base font-medium text-white rounded-md mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-white/10 animate-pulse"></div>
                <div className="w-20 h-4 rounded bg-white/10 animate-pulse"></div>
              </div>
              <div className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white flex items-center">
                <div className="w-5 h-5 mr-2 rounded bg-white/10 animate-pulse"></div>
                <div className="w-16 h-4 rounded bg-white/10 animate-pulse"></div>
              </div>
            </>
          ) : isAuthenticated ? (
            <>
              <Link href="#" className="block px-3 py-2 text-base font-medium text-white rounded-md mb-2 flex items-center gap-2 border border-[var(--accent)]/50 violet-glow-hover">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
                  <defs>
                    <linearGradient id="yhoaLogoGradientAvatarM" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" />
                      <stop offset="100%" stopColor="var(--accent-2)" />
                    </linearGradient>
                  </defs>
                  <path d="M32 6 L42 22 L58 32 L42 42 L32 58 L22 42 L6 32 L22 22 Z" fill="url(#yhoaLogoGradientAvatarM)" />
                </svg>
                <span>{session?.user?.name || 'Người dùng'}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white transition duration-200 ease-out flex items-center neon-cyan-hover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/dang-nhap" className="block px-3 py-2 rounded-md text-base font-medium transition duration-200 ease-out flex items-center neon-cyan-hover">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Đăng nhập
              </Link>
              <Link href="/dang-ky" className="block px-3 py-2 rounded-md text-base font-medium btn-primary mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}