import ImageSlider from "@/components/horizontal-sliders/ImageSlider"
import ImageSliderv2 from "@/components/horizontal-sliders/ImageSliderv2"
import SliderTrack from "@/components/horizontal-sliders/SliderTrack"
import HorizontalScroller from "@/components/HorizontalScrollerV3"

const Page = () => {
    return (
        <>
            <section className="min-h-screen bg-black text-white flex items-center justify-center">
                Spacer
            </section>
            <HorizontalScroller
                className="min-h-screen bg-blue-300 "
                header={
                    <div className="max-w-[300px] mx-auto py-20 text-center">
                        <h2 className="uppercase">Great Team</h2>
                        <p>Awesome horizontal scrolling section</p>
                    </div>
                }
                slider={
                    <SliderTrack />
                }
            />


            <section className="min-h-screen bg-black text-white flex items-center justify-center">
                Spacer
            </section>
            <HorizontalScroller
                slider={
                    <ImageSlider />
                }
            />
            <section className="min-h-screen bg-black text-white flex items-center justify-center">
                Spacer
            </section>
            <HorizontalScroller
            className="h-screen bg-neutral-900 text-indigo-50 flex flex-col items-center justify-center overflow-hidden gap-40"
                // header={
                //     <div className="max-w-[300px] mx-auto py-20 text-center">
                //         <h2 className="uppercase">Great Team</h2>
                //         <p>Awesome horizontal scrolling section</p>
                //     </div>
                // }
                slider={
                    <ImageSliderv2 />
                }
            />
            <section className="min-h-screen bg-black text-white flex items-center justify-center">
                Spacer
            </section>
        </>
    )
}

export default Page