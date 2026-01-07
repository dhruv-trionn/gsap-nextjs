import InfiniteMarquee from '@/components/InfiniteMarquee';

const CARDS = [
  { id: 1, text: "Next.js", color: "bg-blue-500" },
  { id: 2, text: "GSAP", color: "bg-green-500" },
  { id: 3, text: "React", color: "bg-cyan-500" },
  { id: 4, text: "Tailwind", color: "bg-teal-500" },
  { id: 5, text: "Draggable", color: "bg-purple-500" },
  { id: 6, text: "Animation", color: "bg-pink-500" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-4xl font-bold text-white mb-10">Infinite Draggable Marquee</h1>
      
      {/* Example 1: Slow Speed */}
      <InfiniteMarquee speed={0.5}>
        {/* We map the cards 3 times to ensure we have enough width to scroll infinitely */}
        {[...CARDS, ...CARDS, ...CARDS].map((card, i) => (
          <div 
            key={i} 
            className={`w-[200px] h-[120px] ${card.color} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border border-white/20 select-none`}
          >
            {card.text}
          </div>
        ))}
      </InfiniteMarquee>

      <div className="h-20" />

      {/* Example 2: Faster Speed */}
      <InfiniteMarquee speed={1.2}>
         {/* Using simple text elements */}
         {[...Array(10)].map((_, i) => (
            <span key={i} className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 px-4 select-none">
                CREATIVE DEV
            </span>
         ))}
      </InfiniteMarquee>

    </main>
  );
}