'use client';

import { useState } from 'react';
import QuickViewModal from '@/components/ui/QuickViewModal';

export default function TestModalPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-20">
      <h1 className="text-white text-4xl mb-8">Test Modal</h1>
      <button
        onClick={() => {
          console.log('Opening test modal');
          setShowModal(true);
        }}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Open Modal
      </button>

      <QuickViewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={{
          title: "Test Dược Liệu",
          subtitle: "Test Subtitle",
          image: "https://images.unsplash.com/photo-1479064845801-2f3f7f1f0a22?w=800",
          usages: "Test công dụng",
          vi: ["Cay"],
          tinh: ["Ôn"],
          quyKinh: ["Can"],
        }}
      />
    </div>
  );
}

