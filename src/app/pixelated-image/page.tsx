import PixelatedImage from "@/components/PixelatedImage";

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Spacer to allow scrolling */}
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Scroll Down ↓</h1>
      </div>

      {/* WRAPPER 1 
         Note: We must set a height (e.g., h-[600px] or aspect-video) 
         because Next.js Image "fill" requires a positioned parent.
      */}
      <div className="w-full max-w-4xl mx-auto my-24 h-[600px]">
        <PixelatedImage
          src="/work-kuros.jpg"
          alt="Demo Effect"
        //   blockSize={0.005} // Adjust this: Lower = Bigger starting blocks
        />
      </div>

      {/* WRAPPER 2 */}
      <div className="w-full max-w-4xl mx-auto my-24 h-[600px]">
        <PixelatedImage
          src="/work-luxury-presence.jpg"
          alt="Demo Effect 2"
        //   blockSize={0.02}
        />
      </div>

      {/* WRAPPER 3 */}
      <div className="w-full max-w-4xl mx-auto my-24 h-[600px]">
        <PixelatedImage
          src="/work-willam-jonshan.jpg"
          alt="Demo Effect 3"
        //   blockSize={0.02}
        />
      </div>

      <div className="h-screen bg-gray-100"></div>
    </main>
  );
}
