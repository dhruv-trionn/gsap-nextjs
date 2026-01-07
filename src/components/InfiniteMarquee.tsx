"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";

// Register the Draggable plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable, InertiaPlugin);
}

interface MarqueeProps {
    children: React.ReactNode;
    speed?: number; // Speed of the marquee
}

export default function InfiniteMarquee({ children, speed = 1 }: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Get all child elements (the items)
            const items = gsap.utils.toArray(".marquee-item") as HTMLElement[];

            // 2. Initialize the helper function
            horizontalLoop(items, {
                paused: false,
                repeat: -1,
                speed: speed,
                draggable: true, // Enable dragging
                paddingRight: 20, // Optional spacing between items
                dragResistance: 0.8,  //  higher = slower drag
                throwResistance: 3500,  // higher = slower throw
            });
        }, containerRef);

        return () => ctx.revert(); // Cleanup on unmount
    }, [speed]);

    return (
        <div className="w-full overflow-hidden relative bg-neutral-900 py-10" ref={containerRef}>
            <div className="relative flex items-center whitespace-nowrap cursor-grab active:cursor-grabbing">
                {React.Children.map(children, (child, index) => (
                    <div key={index} className="marquee-item flex-shrink-0 px-4">
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * GSAP Horizontal Loop Helper (Modified for React)
 * This function handles the seamless looping and dragging logic.
 */
function horizontalLoop(items: HTMLElement[], config: any) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => {
            tl.totalTime(tl.rawTime() + tl.duration() * 100);
        },
    }),
        length = items.length,
        startX = items[0].offsetLeft,
        times: any[] = [],
        widths: any[] = [],
        xPercents: any[] = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? (v: any) => v : gsap.utils.snap(config.snap || 1),
        totalWidth,
        curX,
        distanceToStart,
        distanceToLoop,
        item,
        i;

    gsap.set(items, {
        xPercent: (i, el) => {
            let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
            xPercents[i] = snap(
                (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
                Number(gsap.getProperty(el, "xPercent"))
            );
            return xPercents[i];
        },
    });
    gsap.set(items, { x: 0 });

    totalWidth =
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        items[length - 1].offsetWidth *
        (gsap.getProperty(items[length - 1], "scaleX") as number) +
        (parseFloat(config.paddingRight) || 0);

    for (i = 0; i < length; i++) {
        item = items[i];
        curX = (xPercents[i] / 100) * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop =
            distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);

        tl.to(
            item,
            {
                xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
                duration: distanceToLoop / pixelsPerSecond,
            },
            0
        )
            .fromTo(
                item,
                {
                    xPercent: snap(
                        ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
                    ),
                },
                {
                    xPercent: xPercents[i],
                    duration:
                        (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                    immediateRender: false,
                },
                distanceToLoop / pixelsPerSecond
            )
            .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index: number, vars: any) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 &&
            (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
            // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }

    tl.next = (vars: any) => toIndex(curIndex + 1, vars);
    tl.previous = (vars: any) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index: number, vars: any) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance

    if (config.reversed) {
        tl.onReverseComplete();
        tl.reverse();
    }

    if (config.draggable && typeof Draggable === "function") {
        let proxy = document.createElement("div"),
            wrap = gsap.utils.wrap(0, 1),
            ratio: number,
            startProgress: number,
            draggable: Draggable,
            dragSnap: any,
            roundFactor: number,
            align = () =>
                tl.progress(
                    wrap(startProgress + (draggable.startX - draggable.x) * ratio)
                ),
            syncIndex = () => tl.closestIndex(true);

        draggable = Draggable.create(proxy, {
            trigger: items[0].parentNode as HTMLElement,
            type: "x",
            inertia: true,
            dragResistance: config?.dragResistance || 0.8,  //  higher = slower drag
            throwResistance: config?.throwResistance || 2500,  // higher = slower throw

            onPress: function () {
                startProgress = tl.progress();
                tl.progress(0);
                tl.progress(startProgress);
                gsap.killTweensOf(tl);
                tl.timeScale(0);
                ratio = 1 / totalWidth;
                roundFactor = Math.pow(10, ((config.speed || 1) * 128 - 1) + "_".length * 0 + 2); // arbitrary math to adjust sensitivity
            },
            onDrag: () => {
                align()
            },
            onThrowUpdate: () => {
                align()
            },
            onRelease: function () {
                // Resume the timeline movement
                gsap.to(tl, { timeScale: config.reversed ? -1 : 1, duration: 1 });
            },
        })[0];
    }

    // @ts-ignore
    tl.closestIndex = (last: boolean) => {
        let index = 0,
            minDist = Infinity,
            latestTime = tl.time(),
            i, dist;
        for (i = 0; i < length; i++) {
            dist = Math.abs(times[i] - latestTime);
            if (dist < minDist) {
                minDist = dist;
                index = i;
            }
        }
        return index;
    };

    return tl;
}