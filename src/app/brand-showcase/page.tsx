'use client';

import { BrandShowcase } from '@/components/BrandShowcase';

const Page = () => {
  return (
    <div>
      {/* Top spacer */}
      <div className="h-[50vh] bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white/40 text-sm uppercase tracking-[0.3em]">
          Scroll down to Brand Showcase
        </p>
      </div>

      {/* =====================================================
          ANIMATION VARIANTS — uncomment ONE at a time to test:

          INSIDE CARD:
          'shutterSlice'   — horizontal blind strips
          'cubeRotate'     — 3D cube face rotation on X-axis
          'origamiFold'    — diagonal 3D paper fold
          'crossDissolve'  — smooth crossfade with scale breath
          'clipWipe'       — left-to-right clip-path wipe

          OUTSIDE CARD (3D depth / flying cards):
          'cardStack'      — next card slides up & stacks on top
          'cascadeDeck'    — current flies off right, next scales up from behind
          'slideReveal'    — current slides out left, next slides in from right
          'elasticPop'     — pop away + elastic bounce in
          'spiralDepth'    — spiral into background / from foreground
         ===================================================== */}

      <BrandShowcase animationVariant="aceCard" />
      <BrandShowcase animationVariant="shutterSlice" />
      <BrandShowcase animationVariant="cubeRotate" />
      <BrandShowcase animationVariant="origamiFold" />
      <BrandShowcase animationVariant="origamiFoldIn" />
      <BrandShowcase animationVariant="crossDissolve" />
      <BrandShowcase animationVariant="clipWipe" />
      {/* <BrandShowcase animationVariant="cardStack" /> */}
      <BrandShowcase animationVariant="cascadeDeck" />
      {/* <BrandShowcase animationVariant="slideReveal" /> */}
      <BrandShowcase animationVariant="elasticPop" />
      <BrandShowcase animationVariant="spiralDepth" />

      {/* Bottom spacer */}
      <div className="h-[50vh] bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white/40 text-sm uppercase tracking-[0.3em]">
          Section below Brand Showcase
        </p>
      </div>
    </div>
  );
};

export default Page;
