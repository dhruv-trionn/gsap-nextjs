'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Matter, { Bodies, World } from 'matter-js';
import { useRef } from 'react';

const Page = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const svgImagesPath = [
    '/images/svgs/services-item-1.svg',
    '/images/svgs/services-item-2.svg',
    '/images/svgs/services-item-3.svg',
    '/images/svgs/services-item-4.svg',
    '/images/svgs/services-item-5.svg',
    '/images/svgs/services-item-6.svg',
  ];

  //   useGSAP(
  //     () => {
  //       if (!sectionRef.current) return;

  //       const sectionRect = sectionRef.current.getBoundingClientRect();
  //       const sectionWidth = sectionRect.width;
  //       const sectionHeight = sectionRect.height;

  //       const engine = Matter.Engine.create();
  //       const world = engine.world;

  //       // ⛔ Gravity OFF initially
  //       engine.gravity.y = 0;

  //       const render = Matter.Render.create({
  //         element: sectionRef.current,
  //         engine,
  //         options: {
  //           width: sectionWidth,
  //           height: sectionHeight,
  //           wireframes: false,
  //           background: 'transparent',
  //         },
  //       });

  //       render.canvas.style.position = 'absolute';
  //       render.canvas.style.inset = '0';

  //       // 🔹 Create SVG bodies at STATIC positions
  //       const bodies: Matter.Body[] = [];

  //       svgImagesPath.forEach((svgImagePath, index) => {
  //         const body = Matter.Bodies.rectangle(
  //           150 + index * 120, // spread horizontally
  //           sectionHeight / 2 - 150, // visible static position
  //           200,
  //           200,
  //           {
  //             restitution: 0.7,
  //             friction: 0.3,
  //             render: {
  //               sprite: {
  //                 texture: svgImagePath,
  //                 xScale: 1,
  //                 yScale: 1,
  //               },
  //             },
  //           }
  //         );

  //         bodies.push(body);
  //         Matter.World.add(world, body);
  //       });

  //       // 🔹 Boundaries
  //       const wallThickness = 40;
  //       const half = wallThickness / 2;

  //       const ground = Matter.Bodies.rectangle(
  //         sectionWidth / 2,
  //         sectionHeight + half,
  //         sectionWidth,
  //         wallThickness,
  //         { isStatic: true }
  //       );

  //       const leftWall = Matter.Bodies.rectangle(
  //         -half,
  //         sectionHeight / 2,
  //         wallThickness,
  //         sectionHeight,
  //         { isStatic: true }
  //       );

  //       const rightWall = Matter.Bodies.rectangle(
  //         sectionWidth + half,
  //         sectionHeight / 2,
  //         wallThickness,
  //         sectionHeight,
  //         { isStatic: true }
  //       );

  //       Matter.World.add(world, [ground, leftWall, rightWall]);

  //       // 🔹 Mouse drag
  //       const mouse = Matter.Mouse.create(sectionRef.current);
  //       const mouseConstraint = Matter.MouseConstraint.create(engine, {
  //         mouse,
  //         constraint: {
  //           stiffness: 0.2,
  //           render: { visible: false },
  //         },
  //       });

  //       Matter.World.add(world, mouseConstraint);
  //       render.mouse = mouse;

  //       // 🔹 ScrollTrigger → enable gravity
  //       gsap.timeline({
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: 'top center',
  //           end: 'bottom center',
  //           markers: true, // remove later
  //           onEnter: () => {
  //             engine.gravity.y = 1;
  //           },
  //           onLeaveBack: () => {
  //             engine.gravity.y = 0;
  //           },
  //         },
  //       });

  //       // 🔹 Run
  //       Matter.Render.run(render);
  //       Matter.Runner.run(Matter.Runner.create(), engine);

  //       return () => {
  //         Matter.Render.stop(render);
  //         Matter.World.clear(world, false);
  //         Matter.Engine.clear(engine);
  //       };
  //     },
  //     { scope: sectionRef }
  //   );

  useGSAP(
    () => {
      if (!sectionRef.current) {
        return;
      }

      const sectionRect = sectionRef.current.getBoundingClientRect();

      const sectionWidth = sectionRect.width;
      const sectionHeight = sectionRect.height;

      const engine = Matter.Engine.create();
      const world = engine.world;

      engine.gravity.y = 0;

      const render = Matter.Render.create({
        element: sectionRef.current,
        engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: false,
          background: 'transparent',
        },
      });

      render.canvas.style.position = 'absolute';
      render.canvas.style.inset = '0';

      // 🔹 Create SVG bodies at STATIC positions
      const bodies: Matter.Body[] = [];

      svgImagesPath.forEach((svgImagePath, index) => {
        const body = Matter.Bodies.rectangle(
          250 + index * 300,
          -100, // top, but hidden
          200,
          200,
          {
            isStatic: false, // ❄️ frozen
            restitution: 0.7,
            friction: 0.3,
            render: {
              visible: true,
              sprite: {
                texture: svgImagePath,
                xScale: 1.2,
                yScale: 1.2,
              },
            },
          }
        );

        bodies.push(body);
        Matter.World.add(world, body);
      });

      //   svgImagesPath.forEach((svgImagePath, index) => {
      //     const body = Matter.Bodies.rectangle(
      //       250 + index * 300, // spread horizontally
      //       10, // hide static position
      //       200, // width
      //       200, // height
      //       {
      //         restitution: 0.7,
      //         friction: 0.3,
      //         render: {
      //           sprite: {
      //             texture: svgImagePath,
      //             xScale: 1.2,
      //             yScale: 1.2,
      //           },
      //         },
      //       }
      //     );

      //     bodies.push(body);
      //     Matter.World.add(world, body);
      //   });

      //   Section Boundry Walls
      var wallThickness = 40;
      var halfThickness = wallThickness / 2;

      // Create the boundaries
      var ground = Matter.Bodies.rectangle(
        sectionWidth / 2,
        sectionHeight + halfThickness,
        sectionWidth,
        wallThickness,
        {
          isStatic: true,
          label: 'Ground',
        }
      );

      var ceiling = Matter.Bodies.rectangle(
        sectionWidth / 2,
        -halfThickness,
        sectionWidth,
        wallThickness,
        {
          isStatic: true,
          label: 'Ceiling',
        }
      );

      var leftWall = Matter.Bodies.rectangle(
        -halfThickness,
        sectionHeight / 2,
        wallThickness,
        sectionHeight,
        {
          isStatic: true,
          label: 'Left Wall',
        }
      );

      var rightWall = Matter.Bodies.rectangle(
        sectionWidth + halfThickness,
        sectionHeight / 2,
        wallThickness,
        sectionHeight,
        {
          isStatic: true,
          label: 'Right Wall',
        }
      );

      // Add the boundaries to the world
      Matter.World.add(world, [ground, leftWall, rightWall]);

      //   Item Move With Mouse
      const mouse = Matter.Mouse.create(render.canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

      Matter.World.add(world, mouseConstraint);
      render.mouse = mouse;

      //   Render Scene
      Matter.Render.run(render);
      Matter.Runner.run(Matter.Runner.create(), engine);

      // 🔹 ScrollTrigger → enable gravity
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom top',
          markers: true, // remove later
          onEnter: () => {
            engine.gravity.y = 1;
          },

          onLeaveBack: () => {
            engine.gravity.y = 0;
          },
        },
      });

      //   Clean up
      return () => {
        Matter.Render.stop(render);
        Matter.World.clear(world, false);
        Matter.Engine.clear(engine);
      };
    },
    { scope: sectionRef }
  );

  return (
    <>
      <section className="min-h-screen flex items-center justify-center flex-col ">Spacer</section>
      <section
        ref={sectionRef}
        className="relative min-h-screen bg-neutral-900 overflow-hidden flex items-center justify-center flex-col"
      >
      </section>
      <section className="min-h-screen flex items-center justify-center flex-col ">Spacer</section>
    </>
  );
};

export default Page;

const SvgFromString = ({
  svg,
  innerSVGRef,
}: {
  svg: string;
  innerSVGRef: (el: HTMLDivElement | null) => void;
}) => {
  return <div ref={innerSVGRef} className="text-white" dangerouslySetInnerHTML={{ __html: svg }} />;
};
