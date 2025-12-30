// app/page.tsx or any other component
import WipeRevealImage from '@/components/WipeRevealImage';


export default function WipeImage() {
  return (
    <main className="min-h-screen p-24 bg-gray-100">
      <h1 className="h-screen text-4xl mb-12 font-bold text-black">GSAP Wipe Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        
        {/* Example 1: Wipe from Left (Default) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-black">1. Wipe from Left</h2>
          {/* We define the aspect ratio and width here in the className */}
          <WipeRevealImage
            src={'/image_part_001.jpg'} // Or an external URL
            alt="Model portrait"
            width={600}
            height={800}
            direction="fromLeft"
            maskColor="bg-gray-100" // Matching the page background for seamless reveal
            className="w-full aspect-[3/4] bg-gray-200" // Add bg color so placeholder isn't empty while loading
          />
           <p className="text-black mt-2">Design Strategy.</p>
        </div>


        {/* Example 2: Wipe from Right, different aspect ratio */}
        <div className="h-screen flex flex-col gap-4 mt-32 md:mt-0">
           <h2 className="text-2xl text-black text-right">2. Wipe from Right</h2>
          <WipeRevealImage
            src={'/image_part_002.jpg'}
            alt="Product shot"
            width={800}
            height={600}
            direction="fromRight"
            maskColor="bg-gray-100"
            className="w-full aspect-[4/3] bg-gray-200"
             priority // Use priority if it's above the fold
          />
          <p className="text-black text-right mt-2">Luxury Presence.</p>
        </div>

         {/* Example 1: Wipe from Left (Default) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-black">1. Wipe from Left</h2>
          {/* We define the aspect ratio and width here in the className */}
          <WipeRevealImage
            src={'/image_part_001.jpg'} // Or an external URL
            alt="Model portrait"
            width={600}
            height={800}
            direction="fromLeft"
            maskColor="bg-gray-100" // Matching the page background for seamless reveal
            className="w-full aspect-[3/4] bg-gray-200" // Add bg color so placeholder isn't empty while loading
          />
           <p className="text-black mt-2">Design Strategy.</p>
        </div>


        {/* Example 2: Wipe from Right, different aspect ratio */}
        <div className="h-screen flex flex-col gap-4 mt-32 md:mt-0">
           <h2 className="text-2xl text-black text-right">2. Wipe from Right</h2>
          <WipeRevealImage
            src={'/image_part_002.jpg'}
            alt="Product shot"
            width={800}
            height={600}
            direction="fromRight"
            maskColor="bg-gray-100"
            className="w-full aspect-[4/3] bg-gray-200"
             priority // Use priority if it's above the fold
          />
          <p className="text-black text-right mt-2">Luxury Presence.</p>
        </div>

         {/* Example 1: Wipe from Left (Default) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-black">1. Wipe from Left</h2>
          {/* We define the aspect ratio and width here in the className */}
          <WipeRevealImage
            src={'/image_part_001.jpg'} // Or an external URL
            alt="Model portrait"
            width={600}
            height={800}
            direction="fromLeft"
            maskColor="bg-gray-100" // Matching the page background for seamless reveal
            className="w-full aspect-[3/4] bg-gray-200" // Add bg color so placeholder isn't empty while loading
          />
           <p className="text-black mt-2">Design Strategy.</p>
        </div>


        {/* Example 2: Wipe from Right, different aspect ratio */}
        <div className="h-screen flex flex-col gap-4 mt-32 md:mt-0">
           <h2 className="text-2xl text-black text-right">2. Wipe from Right</h2>
          <WipeRevealImage
            src={'/image_part_002.jpg'}
            alt="Product shot"
            width={800}
            height={600}
            direction="fromRight"
            maskColor="bg-gray-100"
            className="w-full aspect-[4/3] bg-gray-200"
             priority // Use priority if it's above the fold
          />
          <p className="text-black text-right mt-2">Luxury Presence.</p>
        </div>

         {/* Example 1: Wipe from Left (Default) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-black">1. Wipe from Left</h2>
          {/* We define the aspect ratio and width here in the className */}
          <WipeRevealImage
            src={'/image_part_001.jpg'} // Or an external URL
            alt="Model portrait"
            width={600}
            height={800}
            direction="fromLeft"
            maskColor="bg-gray-100" // Matching the page background for seamless reveal
            className="w-full aspect-[3/4] bg-gray-200" // Add bg color so placeholder isn't empty while loading
          />
           <p className="text-black mt-2">Design Strategy.</p>
        </div>


        {/* Example 2: Wipe from Right, different aspect ratio */}
        <div className="h-screen flex flex-col gap-4 mt-32 md:mt-0">
           <h2 className="text-2xl text-black text-right">2. Wipe from Right</h2>
          <WipeRevealImage
            src={'/image_part_002.jpg'}
            alt="Product shot"
            width={800}
            height={600}
            direction="fromRight"
            maskColor="bg-gray-100"
            className="w-full aspect-[4/3] bg-gray-200"
             priority // Use priority if it's above the fold
          />
          <p className="text-black text-right mt-2">Luxury Presence.</p>
        </div>

      </div>

        {/* Filler space to ensure we can scroll */}
      <div className="h-screen"></div>
    </main>
  );
}