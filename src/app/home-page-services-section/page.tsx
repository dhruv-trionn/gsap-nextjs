"use client";
import TrionnServices from "@/components/TrionnServices";

const Page = () => {
  return (
    <>
      {/* Spacer so you can scroll into the section */}
      <section className="min-h-screen bg-black/50 text-white flex items-center justify-center text-2xl">
        Scroll down ↓
      </section>

      <TrionnServices/>

      {/* Spacer after */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        End of page
      </section>
    </>
  );
};

export default Page;
