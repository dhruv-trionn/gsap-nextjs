import CirculerSlider from "@/components/Circuler-slider";
import React from "react";

const Page = () => {
  return (
    <div>
      <CirculerSlider />
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center z-10 relative">
        <h1 className="text-4xl font-bold">End of Scroll</h1>
      </div>
    </div>
  );
};

export default Page;
