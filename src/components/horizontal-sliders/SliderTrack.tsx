import { forwardRef } from "react";

const SliderTrack = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div
            ref={ref}
            className="flex w-max gap-6 px-8 items-center"
        >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                    key={i}
                    className="min-w-[600px] border-r-2 border-white flex flex-col gap-40"
                >
                    <h2 className="text-7xl">{i}.</h2>
                    <p>Product design</p>
                </div>
            ))}
        </div>
    );
});

SliderTrack.displayName = "SliderTrack";

export default SliderTrack;
