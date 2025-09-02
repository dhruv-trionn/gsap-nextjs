import AnimationDemo from "@/components/AnimationDemo";
import HorizontalScroll from "@/components/HorizontalScroll";
import Marquee from "@/components/Marquee";
import FadeOnScroll from "@/components/FadeOnScroll";

export default function Home() {
  return (
    <div className="min-h-[1000vh] space-y-32">

      <AnimationDemo />
      <FadeOnScroll as={'p'} text="Macaroon croissant pastry shortbread cupcake chupa chups pudding. Gummies pie candy canes sweet roll cake chupa chups cake fruitcake. Cake bonbon chupa chups carrot cake cake gingerbread cookie cake. 
Fixed login page UI. Added dynamic GPT payloads from AI Assistant and FAQ post type for chat conversations. Began implementing function calling tools in chat. Updated model response types (e.g., text and JSON object)." className="text-6xl tracking-tight" />
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
