'use client';

import { useRouter, usePathname } from 'next/navigation';

interface ClearSearchButtonProps {
  hasQuery: boolean;
}

export default function ClearSearchButton({ hasQuery }: ClearSearchButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClear = () => {
    // Xác định trang hiện tại và chuyển về trang đầu tiên không có filter
    if (pathname === '/benh') {
      router.push('/benh?page=1');
    } else if (pathname === '/bai-thuoc') {
      router.push('/bai-thuoc?page=1');
    } else {
      // Fallback cho các trang khác
      router.push(`${pathname}?page=1`);
    }
  };

  if (!hasQuery) return null;

  return (
    <button 
      type="button"
      onClick={handleClear}
      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group"
      title="Xóa tìm kiếm"
    >
      <svg className="w-4 h-4 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
