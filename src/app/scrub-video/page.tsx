import ScrollScrubVideo from "@/components/ScrubVideo";
import ScrubCanvas from "@/components/ScrubVideo";
import ScrubVideo from "@/components/ScrubVideo";

export default function Home() {
  return (
    <main className="w-full bg-black text-white">
      {/* Intro Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-5xl font-bold">Scroll to Scrub</h1>
          <p className="text-xl text-gray-300">
            Scroll down to control the video playback
          </p>
        </div>
      </section>

      {/* Main Video Section */}
      {/* <ScrollScrubVideo
        src="/lion-roar.mp4"
        // className="h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4"
      /> */}


      <ScrubCanvas 
        basePath="/sequences/lion-roar/" // Path to the folder (must end with /)
        imagePrefix="img_"              // The start of your filename
        fileType="jpg"                  // jpg, png, or webp
        frameCount={300}                // Total number of images
        className="z-10"                // Optional Tailwind classes
      />

      {/* Content Section */}
      <section className="min-h-screen bg-gray-900 px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            This component uses scroll position to control video playback. As
            you scroll through the page, the video frame updates in real-time,
            creating a smooth, interactive experience. Perfect for product
            demos, tutorials, or storytelling.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            The component automatically calculates scroll progress and maps it
            to the video timeline. No manual frame control needed—just scroll
            naturally.
          </p>
        </div>
      </section>

      {/* Second Video Section */}
      {/* <ScrubVideo
        src="banner-t.mp4"
        // className="h-screen flex items-center justify-center bg-gray-950 px-4"
      /> */}

      {/* Final Section */}
      <section className="min-h-screen bg-black px-4 py-20 flex items-center">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-4xl font-bold">That's All!</h2>
          <p className="text-xl text-gray-400">
            Continue scrolling to see the smooth transitions between sections.
          </p>
        </div>
      </section>
    </main>
  );
}
