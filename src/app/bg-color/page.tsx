"use client"
import React, { useEffect, useRef } from "react"

const Page = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const videoBlock = videoRef.current
    if (!section || !videoBlock) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const red = Math.floor((x / rect.width) * 255)
      const green = Math.floor((y / rect.height) * 255)
      const blue = 150

      videoBlock.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`
    }
    section.addEventListener("mousemove", handleMouseMove)
    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      <div ref={sectionRef} className="h-screen w-full bg-[#272727] relative">
        <div className="video-block mix-blend-hue absolute top-0 left-0 w-full h-full" ref={videoRef}>
        </div>
          <video 
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/banner-t.mp4" type="video/mp4" />
          </video>
      </div>
    </>
  )
}

export default Page