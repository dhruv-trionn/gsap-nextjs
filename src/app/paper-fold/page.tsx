'use client';

import { PaperFold } from '@/components/PaperFold';

const Page = () => {
  return (
    <div>
      {/* Top spacer */}
      <div className="h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white/40 text-sm uppercase tracking-[0.3em]">
          Scroll down to Paper Fold section
        </p>
      </div>

      <PaperFold />

      {/* Bottom spacer */}
      <div className="h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white/40 text-sm uppercase tracking-[0.3em]">
          Section below Paper Fold
        </p>
      </div>
    </div>
  );
};

export default Page;
