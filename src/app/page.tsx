import AnimationDemo from "@/components/AnimationDemo";
import HorizontalScroll from "@/components/HorizontalScroll";
import Marquee from "@/components/Marquee";

export default function Home() {
  return (
    <div className="min-h-[1000vh] space-y-32">
     
      <AnimationDemo />
      <HorizontalScroll visibleSlides={2} />
       <Marquee
        content={
          <p className="inline-flex text-white text-6xl bg-sky-300">
            Sandip Rathod&nbsp;&nbsp;—&nbsp;&nbsp;
            Dhruv Solanki&nbsp;&nbsp;—&nbsp;&nbsp;
            Sandip Rathod&nbsp;&nbsp;—&nbsp;&nbsp;
            Dhruv Solanki&nbsp;&nbsp;—&nbsp;&nbsp;
            Sandip Rathod&nbsp;&nbsp;—&nbsp;&nbsp;
            Dhruv Solanki&nbsp;&nbsp;—&nbsp;&nbsp;
          </p>
        }
      />
      <AnimationDemo />
    </div>
  );
}
