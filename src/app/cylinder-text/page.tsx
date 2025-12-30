'use client';
import Cylinder3D from '@/components/Cylinder3D';
import React from 'react';

const Page = () => {
    const items = [
        { id: "01", title: "GSAP" },
        { id: "02", title: "NEXTJS" },
        { id: "03", title: "REACT" },
        { id: "04", title: "NODE" },
        { id: "05", title: "WEBGL" },
        { id: "06", title: "THREE" },
        { id: "07", title: "CANVAS" },
        { id: "08", title: "HTML5" },
        { id: "09", title: "CSS3" },
        { id: "10", title: "JQUERY" },
        { id: "11", title: "PYTHON" },
        { id: "12", title: "RUST" },
    ];

    return (
        <div className='bg-black min-h-screen text-white'>
            {/* Top Spacer */}
            <div className='h-screen flex flex-col items-center justify-center relative z-10 bg-neutral-900'>
                <p className='text-amber-500 font-mono'>SCROLL TO START</p>
            </div>

            {/* Cylinder Section */}
            <div className="relative z-0 bg-black min-h-screen">
                {/* <video src={'/lion-v3.mp4'} autoPlay muted loop className='absolute inset-0 w-full h-full object-cover brightness-50 pointer-events-none -z-10' /> */}
                <Cylinder3D 
                    radius={450} 
                    scrollDuration="+=3500" 
                    itemAngle={20} // Adjusted for clean spacing
                    viewOffset={60} // Ensures list starts fully below center
                >
                    {items.map((item, index) => (
                        <div 
                            key={index}
                            className='w-[700px] h-24 flex items-center justify-between px-6 border-b border-white/10'
                        >
                            <div className="flex items-baseline gap-4">
                                <h2 className='text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC00] to-[#FF9900]'>
                                    {item.title}
                                </h2>
                                <span className='text-xl font-mono text-white/30'>
                                    {item.id}
                                </span>
                            </div>

                            <p className='text-xs font-mono text-white/40 tracking-widest uppercase'>
                                // website of the day
                            </p>
                        </div>
                    ))}
                </Cylinder3D>
            </div>

             {/* Bottom Spacer */}
             <div className='h-screen flex flex-col items-center justify-center relative z-10 bg-neutral-900'>
                <p className='text-amber-500 font-mono'>FINISHED</p>
            </div>
        </div>
    )
}

export default Page;