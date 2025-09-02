import AnimationDemo from "@/components/AnimationDemo";
import HorizontalScroll, { Panel } from "@/components/HorizontalScroll";

export default function Home() {
  return (
    <div className="min-h-[1000vh] space-y-32">
      <AnimationDemo />
      <HorizontalScroll visibleSlides = {2} />
      <AnimationDemo />
    </div>
  );
}
