'use client'

import HorizontalCylinderCard from '@/components/CylinderReveal'

export default function Page() {
  return (
    <main className="bg-neutral-950 text-white">
      <section className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl px-6 text-center">
          <h1 className="text-4xl font-semibold">Scroll down</h1>
          <p className="mt-4 text-white/70">
            The next section pins a canvas and reveals the image with a cylindrical roll.
          </p>
        </div>
      </section>

      {/* Sticky scroll section */}
      <HorizontalCylinderCard/>

      <section className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-semibold">End</h2>
          <p className="mt-4 text-white/70">Keep scrolling content normally.</p>
        </div>
      </section>
    </main>
  )
}
