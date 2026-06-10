import TestimonialSlider from "@/components/TestimonialSlider";
import TestimonialCarouselStack from "@/components/TestimonialCarouselStack";
import TestimonialFlip from "@/components/TestimonialFlip";
import TestimonialDrop from "@/components/TestimonialDrop";
import TestimonialTiltSweep from "@/components/TestimonialTiltSweep";
import TestimonialBoxStack from "@/components/TestimonialBoxStack";

export default function KeyFactsPage() {
    return (
        <div className="bg-white min-h-screen">
            <TestimonialSlider />
            <TestimonialCarouselStack />
            <TestimonialFlip />
            <TestimonialDrop />
            <TestimonialTiltSweep />
            <TestimonialBoxStack />
        </div>
    );
}
