'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import FallbackImage from "@/components/ui/FallbackImage";

interface RelatedDrug {
  _id: string;
  ten: string;
  tenKhoaHoc?: string;
  anhMinhHoa?: string;
  vi?: string[];
  tinh?: string[];
  quyKinh?: string[];
  nhom?: string[];
  similarityScore?: number;
}

interface RelatedDrugsProps {
  currentDrugId: string;
  currentDrugProperties: {
    vi?: string[];
    tinh?: string[];
    quyKinh?: string[];
    nhom?: string[];
  };
}

export default function RelatedDrugs({ currentDrugId, currentDrugProperties }: RelatedDrugsProps) {
  const [relatedDrugs, setRelatedDrugs] = useState<RelatedDrug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchRelatedDrugs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/duoc-lieu/related/${currentDrugId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: currentDrugProperties
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch related drugs');
        }
        
        const data = await response.json();
        setRelatedDrugs(data);
      } catch (error) {
        console.error('Error fetching related drugs:', error);
        setError('Không thể tải các vị thuốc liên quan');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedDrugs();
  }, [currentDrugId, currentDrugProperties]);

  // Check scroll positions
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [relatedDrugs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 320; // Width of card + gap
      const scrollTo = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && canScrollRight) {
      // Swipe left - scroll right
      scroll('right');
    } else if (distance < -minSwipeDistance && canScrollLeft) {
      // Swipe right - scroll left
      scroll('left');
    }
    
    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (loading) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Vị thuốc có cùng tính chất</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Vị thuốc có cùng tính chất</h2>
        <div className="text-center py-4">
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  if (relatedDrugs.length === 0) {
    return null;
  }

  return (
    <section className="relative rounded-2xl border border-gray-200/50 bg-white shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Modern Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl ring-2 ring-white/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Vị thuốc đề xuất</h2>
              <p className="text-sm text-white/90 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Có tính chất tương đồng
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-white drop-shadow-lg">{relatedDrugs.length}</div>
            <div className="text-sm text-white/90 font-medium">sản phẩm</div>
          </div>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative px-6 py-6">
        {/* Enhanced Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 border border-gray-200/50 group"
          >
            <svg className="w-7 h-7 text-gray-700 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 border border-gray-200/50 group"
          >
            <svg className="w-7 h-7 text-gray-700 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Horizontal scroll container */}
        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {relatedDrugs.map((drug, index) => (
            <Link
              key={drug._id}
              href={`/duoc-lieu/${drug._id}`}
              className="group flex-shrink-0 w-72 snap-start"
            >
              <div className="relative h-full bg-white rounded-3xl border border-gray-200/60 hover:border-purple-300 hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
                
                {/* Premium Badge */}
                {drug.similarityScore && drug.similarityScore > 70 && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl animate-pulse">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span className="text-xs font-bold">Khớp {drug.similarityScore}%</span>
                    </div>
                  </div>
                )}

                {/* Similarity Badge */}
                {drug.similarityScore && drug.similarityScore <= 70 && drug.similarityScore > 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-xs font-bold">{drug.similarityScore}%</span>
                    </div>
                  </div>
                )}

                {/* Image Container with Shine Effect */}
                <div className="relative h-56 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-700"></div>
                  
                  <FallbackImage
                    src={drug.anhMinhHoa || "https://images.unsplash.com/photo-1479064845801-2f3f7f1f0a22?w=1200&q=80&auto=format&fit=crop"}
                    alt={drug.ten}
                    width={288}
                    height={224}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  
                  {/* Shine overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  {/* Bottom gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Title Section */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight">
                      {drug.ten}
                    </h3>
                    {drug.tenKhoaHoc && (
                      <p className="text-xs text-gray-500 italic mt-2 line-clamp-1">
                        {drug.tenKhoaHoc}
                      </p>
                    )}
                  </div>

                  {/* Properties Section */}
                  <div className="flex flex-wrap gap-1.5">
                    {drug.vi?.slice(0, 3).map((v, i) => (
                      <span key={`vi-${i}`} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50">
                        Vị {v}
                      </span>
                    ))}
                    {drug.tinh?.slice(0, 2).map((t, i) => (
                      <span key={`tinh-${i}`} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200/50">
                        Tính {t}
                      </span>
                    ))}
                    {drug.nhom?.slice(0, 1).map((n, i) => (
                      <span key={`nhom-${i}`} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200/50">
                        {n}
                      </span>
                    ))}
                  </div>

                  {/* CTA Section */}
                  <div className="pt-2 pb-1">
                    <div className="flex items-center justify-between text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      <span>Khám phá ngay</span>
                      <svg className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom hint - Premium Design */}
        <div className="text-center pt-6 pb-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm font-medium text-gray-700">
              Được sắp xếp theo mức độ <span className="font-bold text-purple-600">tương đồng cao nhất</span>
            </p>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
