'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Physics2DPlugin, PhysicsPropsPlugin } from 'gsap/all';
import React, { useRef } from 'react'

gsap.registerPlugin(Physics2DPlugin);
gsap.registerPlugin(PhysicsPropsPlugin)

// 1. velocity
// How fast the object starts moving.

// 2. angle
// Direction of movement in degrees.
// 0 → right
// 90 → down
// 180 → left
// -90 → up


// 3. gravity
// Pulls the object downward over time.



// velocity → how fast it starts
// angle → which direction it flies
// gravity → how strongly it gets pulled down
// No easing needed → physics is the motion

const Page = () => {

    const ballRef = useRef<HTMLDivElement | null>(null);

    const handleClickBall = () => {

        // Use case: bullets, arrows, thrown objects
        gsap.to(ballRef.current, {
            duration: 2,
            physics2D: {
                velocity: 1200,
                angle: -45,
                gravity: 600
            }
        });

        // gsap.to(ballRef.current, {
        //     duration: 3,
        //     physics2D: {
        //         velocity: gsap.utils.random(200, 500),
        //         angle: gsap.utils.random(0, 360),
        //         gravity: 600
        //     },
        //     opacity: 0
        // });

        // Fake bounce (ground hit)
        // gsap.to(ballRef.current, {
        //     duration: 1,
        //     physics2D: {
        //         velocity: 0,
        //         angle: 90,
        //         gravity: 500
        //     },
        //     onComplete() {
        //         gsap.to(ballRef.current, {
        //             duration: 0.6,
        //             physics2D: {
        //                 velocity: 400,
        //                 angle: -90,
        //                 gravity: 700
        //             }
        //         });
        //     }
        // });

        // Falling & drifting (snow / leaves)
        // gsap.to(ballRef.current, {
        //     duration: 3,
        //     physics2D: {
        //         velocity: 100,
        //         angle: 90,
        //         gravity: 50
        //     },
        //     rotation: 360,
        //     repeat: -1
        // });




    }


    useGSAP(() => {

        // Use case: button explosions, score celebrations, logo bursts
        // gsap.utils.toArray(".piece").forEach(piece => {
        //     gsap.to(piece, {
        //         duration: 2,
        //         physics2D: {
        //             velocity: gsap.utils.random(300, 600),
        //             angle: gsap.utils.random(0, 360),
        //             gravity: 800
        //         },
        //         scale: 0,
        //         opacity: 0,
        //         display: 'none',
        //     });
        // });

        // Use case: sparks, smoke puffs, fire embers
        gsap.utils.toArray(".piece").forEach(emitParticle);

        gsap.to(".box", {
            duration: 2,
            physicsProps: {
                rotation: {
                    velocity: 360,  // Starting speed of the property
                    acceleration: -200, // Constant force (can be negative)
                    friction: 0.02, // Resistance (0–1)
                    //0 → no slowdown
                    // 0.05–0.2 → realistic inertia
                    // 1 → stops immediately
                }
            }
        });



    }, [])


    // eslint-disable-next-line
    function emitParticle(particle: any) {
        gsap.set(particle, { x: 0, y: 0, opacity: 1 });

        gsap.to(particle, {
            duration: 1.5,
            physics2D: {
                velocity: gsap.utils.random(150, 300),
                angle: gsap.utils.random(-110, -70),
                gravity: 400
            },
            opacity: 0,
            onComplete: emitParticle,
            onCompleteParams: [particle]
        });
    }


    return (
        <div className='flex items-center justify-center  flex-col overflow-hidden' >
            <div className='min-h-screen flex items-center justify-center'>
                <div onClick={handleClickBall} ref={ballRef} className='w-5 bg-sky-400 rounded-full aspect-square cursor-pointer' >
                </div>
            </div>

            <div className='min-h-screen flex items-center justify-center gap-0.5' >
                <div className=" piece w-6 bg-sky-400 rounded-full aspect-square cursor-pointer flex items-center justify-center "></div>
                <div className=" piece w-6 bg-sky-400 rounded-full aspect-square cursor-pointer flex items-center justify-center "></div>
                <div className=" piece w-6 bg-sky-400 rounded-full aspect-square cursor-pointer flex items-center justify-center "></div>
                <div className=" piece w-6 bg-sky-400 rounded-full aspect-square cursor-pointer flex items-center justify-center "></div>
                <div className=" piece w-6 bg-sky-400 rounded-full aspect-square cursor-pointer flex items-center justify-center "></div>
                <div className=" piece w-6 bg-sky-400 rounded-full aspect-square cursor-pointer flex items-center justify-center "></div>
            </div>
            <div className='min-h-screen flex items-center justify-center gap-0.5' >
                <div className=" box w-2xs bg-sky-400  aspect-square cursor-pointer flex items-center justify-center "></div>
            </div>


        </div>
    )
}

export default Page