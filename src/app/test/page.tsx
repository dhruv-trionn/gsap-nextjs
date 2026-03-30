"use client";
import SlideInRows from "@/components/SlideInRows";
import React from "react";

/* ── inline SVG strings (viewBox 0 0 60 60, stroke-only paths) ── */
const S = "fill:none;stroke:#d8d8d8;stroke-miterlimit:10";

const ICON_SVGS = [
  /* 1 – vertical lines */
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="${S}" d="M35.9,59.8V.5"/><path style="${S}" d="M30,59.7V.4"/><path style="${S}" d="M6.4,59.8V.5"/><path style="${S}" d="M59.5,59.7V.4"/><path style="${S}" d="M53.6,59.7V.4"/><path style="${S}" d="M47.7,59.7V.4"/><path style="${S}" d="M41.8,59.7V.4"/><path style="${S}" d="M24.1,59.7V.3"/><path style="${S}" d="M18.2,59.7V.4"/><path style="${S}" d="M12.3,59.7V.4"/><path style="${S}" d="M.5,59.7V.4"/></svg>`,
  /* 2 – concentric circles */
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="${S}" d="M.6,30c0,16.2,13.2,29.4,29.4,29.4s29.4-13.2,29.4-29.4S46.2.6,30,.6.6,13.8.6,30Z"/><path style="${S}" d="M6.6,30c0,12.9,10.5,23.4,23.4,23.4s23.4-10.5,23.4-23.4S42.9,6.6,30,6.6,6.6,17.1,6.6,30Z"/><path style="${S}" d="M12.6,30c0,9.6,7.8,17.4,17.4,17.4s17.4-7.8,17.4-17.4-7.8-17.4-17.4-17.4-17.4,7.8-17.4,17.4Z"/><path style="${S}" d="M18.6,30c0,6.3,5.1,11.4,11.4,11.4s11.4-5.1,11.4-11.4-5.1-11.4-11.4-11.4-11.4,5.1-11.4,11.4Z"/><path style="${S}" d="M24.6,30c0,3,2.4,5.4,5.4,5.4s5.4-2.4,5.4-5.4-2.4-5.4-5.4-5.4-5.4,2.4-5.4,5.4Z"/></svg>`,
  /* 3 – concentric squares */
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="${S}" d="M.6,59.2c0,.1.1.3.3.3h58.3c.1,0,.3-.1.3-.3V.9c0-.1-.1-.3-.3-.3H.8c-.1,0-.3.1-.3.3v58.3h0Z"/><path style="${S}" d="M6.6,53.2c0,.1,0,.2.2.2h46.4c.1,0,.2,0,.2-.2V6.8c0-.1,0-.2-.2-.2H6.8c-.1,0-.2,0-.2.2v46.4h0Z"/><path style="${S}" d="M12.6,47.2c0,.1.1.3.3.3h34.3c.1,0,.3-.1.3-.3V12.9c0-.1-.1-.3-.3-.3H12.8c-.1,0-.3.1-.3.3v34.3h0Z"/><path style="${S}" d="M18.6,41.2c0,.1.1.2.2.2h22.3c.1,0,.2-.1.2-.2v-22.3c0-.1-.1-.2-.2-.2h-22.3c-.1,0-.2.1-.2.2v22.3h0Z"/><path style="${S}" d="M24.6,35.2c0,.1,0,.2.2.2h10.4c.1,0,.2,0,.2-.2v-10.4c0-.1,0-.2-.2-.2h-10.4c-.1,0-.2,0-.2.2v10.4Z"/><path style="${S}" d="M29.3,30.1c0-.4.3-.7.7-.7s.7.3.7.7-.3.7-.7.7-.7-.3-.7-.7Z"/></svg>`,
  /* 4 – curved parenthesis lines */
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="${S}" d="M.5,59.2c4.7-.1,8.8-1.1,12.5-3,10.1-5.1,16.5-15,16.5-26.2S23.1,8.8,13,3.7C9.3,1.9,5.2.9.5.8"/><path style="${S}" d="M59.6.8c-4.7.1-8.8,1.1-12.5,3-10.1,5.1-16.5,15-16.5,26.3s6.4,21.1,16.5,26.2c3.6,1.8,7.8,2.8,12.5,3"/><path style="${S}" d="M59.9,6.6c-9.8.6-16.8,5.1-21,13.5-1.5,3-2.2,6.3-2.2,9.9,0,3.6.8,6.9,2.3,9.9,4.3,8.4,11.3,12.9,21.1,13.4"/><path style="${S}" d="M.4,53.3c7.8-.4,13.9-3.5,18.2-9.2,3.2-4.2,4.8-8.9,4.8-14.1,0-5.2-1.6-9.9-4.8-14.1C14.3,10.2,8.2,7.1.4,6.7"/><path style="${S}" d="M.5,47.3c5.7-.3,10.3-2.6,13.6-7.1,2.3-3.1,3.4-6.4,3.4-10.2,0-3.7-1.1-7.1-3.4-10.2-3.3-4.5-7.8-6.8-13.6-7.1"/><path style="${S}" d="M59.8,12.6c-6.8.5-11.7,3.5-14.9,9-1.5,2.5-2.2,5.3-2.2,8.3s.7,5.8,2.2,8.3c3.2,5.5,8.2,8.5,14.9,9"/><path style="${S}" d="M59.6,18.7c-6.2.4-11,5.2-11,11.3,0,6.1,4.8,10.9,11,11.3"/><path style="${S}" d="M.4,41.3c5.3-.5,8.9-3.2,10.6-8.2.3-.9.5-1.9.5-3.1h0c0-1.2-.1-2.3-.4-3.1-1.7-5-5.2-7.7-10.5-8.2"/><path style="${S}" d="M.6,35.3c2.7-.3,4.9-2.5,4.9-5.3,0-2.8-2.1-5-4.9-5.3"/><path style="${S}" d="M59.7,24.6c-2.8.2-5.1,2.5-5.1,5.3,0,2.8,2.2,5.1,5,5.4"/></svg>`,
  /* 5 – spiral swirl */
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="${S}" d="M47.9,25c0,2.3,0,4.1,0,5.3-.2,4.8-1.9,8.8-5.1,12.1-10,10.2-27.1,5.3-30.2-8.5-2.1-9.1,3.2-18.1,12.3-21,1.7-.5,4.7-.8,9.1-.8,5.8,0,15.2,0,26.1,0M53.7,25c0,2.5,0,4.4,0,5.5,0,3.2-.7,6.3-2.1,9.3-3,6.4-7.9,10.7-14.5,12.8-4.9,1.5-9.7,1.5-14.5-.1C6.5,47,1,27.1,12.3,14.3c3.3-3.7,7.4-6.2,12.4-7.4,1.9-.4,5.2-.7,10.1-.6,7.2,0,16.2,0,25.2,0M36.4,25c0,1,0,2.1,0,3.4,0,3-.4,5.3-3,6.9-3.7,2.4-8.3.4-9.5-3.7-.5-1.9-.2-3.7,1.1-5.4,2-2.7,4.4-2.6,8.1-2.6,12.4,0,21.1,0,26.1,0,.2,0,.3.1.3.3,0,3,.2,6,0,8.6-.9,9.5-5.4,16.9-13.4,22.2-12.7,8.4-30.1,5.2-39.3-6.9C-6.7,30.3,3.1,5.1,24.8,1.1c1.8-.3,5.2-.5,10.1-.5,4.2,0,13.3,0,25,0M42.1,25c0,1.2,0,2.8,0,5,0,5-3,9.4-7.7,11.3-7.6,3-16-2.3-16.5-10.5-.2-3.3.8-6.2,2.9-8.6,1.6-1.8,3.5-3.1,5.7-3.7,1.3-.4,3.5-.6,6.5-.6,11.4,0,21,0,27,0"/></svg>`,
  /* 6 – horizontal lines */
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="${S}" d="M17.2,59.4h25.5"/><path style="${S}" d="M8.9,52.9h42.2"/><path style="${S}" d="M4.2,46.4h51.4"/><path style="${S}" d="M1.6,39.8h56.7"/><path style="${S}" d="M.4,33.3h59.2"/><path style="${S}" d="M.4,26.8h59.2"/><path style="${S}" d="M1.5,20.3h56.9"/><path style="${S}" d="M4.2,13.7h51.5"/><path style="${S}" d="M8.9,7.2h42.2"/><path style="${S}" d="M17.3.7h25.4"/></svg>`,
];

/* ── demo card ── */
const ValueCard = ({
  iconSvg,
  title,
  description,
}: {
  iconSvg: string;
  title: string;
  description: string;
}) => (
  <div className="border border-neutral-200 rounded-xl p-8 flex flex-col gap-6 bg-white hover:shadow-md transition-shadow">
    <div
      data-card-svg
      className="w-12 h-12"
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
    <div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const cards = [
  <ValueCard
    key="1"
    iconSvg={ICON_SVGS[0]}
    title="Driven by excellence"
    description="Our work is shaped by high standards, continuous learning, and deep respect for craft — pushing every project beyond the expected."
  />,
  <ValueCard
    key="2"
    iconSvg={ICON_SVGS[1]}
    title="Honesty and authenticity"
    description="In an industry full of noise and inflated promises, we focus on clarity, transparency, and results we're proud to stand behind."
  />,
  <ValueCard
    key="3"
    iconSvg={ICON_SVGS[2]}
    title="Designs that last"
    description="We design systems, products, and brands built to endure — balancing creativity, technology, and purpose for long-term impact."
  />,
  <ValueCard
    key="4"
    iconSvg={ICON_SVGS[3]}
    title="Purposeful decisions"
    description="We're an independent studio of design and coding experts, prioritising quality and emotional value — even above profit when it matters."
  />,
  <ValueCard
    key="5"
    iconSvg={ICON_SVGS[4]}
    title="Creativity with impact"
    description="We don't chase trends. We shape ideas that add real value. For us, creativity matters only when it serves purpose and endures over time."
  />,
  <ValueCard
    key="6"
    iconSvg={ICON_SVGS[5]}
    title="Experience and attitude"
    description="Our experience comes from years of exploration, learning, and solving complex challenges — evolving with every project we take on."
  />,
];

const Page = () => {
  return (
    <>
      {/* Spacer so you can scroll into the section */}
      <section className="min-h-screen bg-black/50 text-white flex items-center justify-center text-2xl">
        Scroll down ↓
      </section>

      <SlideInRows
        className="bg-[#f0efea] min-h-screen"
        items={cards}
        frameCount={235}
        getFramePath={(i) => `/stone/frame_${String(i).padStart(4, "0")}.jpg`}
        preVideoLabel={
          <h2 className="text-white text-9xl text-center">
            <span className="block" >A.I</span>
            <span className="block">Development</span>
            <span className="block">Design</span>
            <span className="block">Branding</span>
          </h2>
        }
        header={
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4">
            <h2 className="text-5xl lg:text-7xl font-light text-neutral-900 leading-tight">
              Our values
            </h2>
            <p className="max-w-sm text-sm text-neutral-500 leading-relaxed">
              We&apos;re one of India&apos;s most creative and recognized web
              design studios, driven by purpose and bold ideas.
            </p>
          </div>
        }
      />

      {/* Spacer after */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        End of page
      </section>
    </>
  );
};

export default Page;
