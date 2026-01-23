'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';

type Obj = {
  el: HTMLDivElement;
  innerEl: HTMLDivElement;

  size: number;
  radius: number;
  spawnAt: number; // when object should start falling (performance.now time)
  spawned: boolean; // started or not

  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;

  dragging: boolean;

  _lastDragT: number;
  _lastDragX: number;
  _lastDragY: number;
  _tossVX: number;
  _tossVY: number;

  lastPress: number;

  onFloor: boolean;
  wasOnFloor: boolean;
  asleep: boolean;
  restTarget: number;

  setX: (v: number) => void;
  setY: (v: number) => void;
  setR: (v: number) => void;
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const MAX_SPD = 2400;

// --- PUT YOUR 6 SVGs HERE (embedded as strings) ---
// I injected these from your uploaded SVGs in the HTML version.
// If you want to swap later, just replace the <svg>…</svg> strings below.
const SVGS = [
  () => `
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 60 60">
  <defs>
    <style>
      .st0 {
        fill: none;
        stroke: #d8d8d8;
        stroke-miterlimit: 10;
      }
    </style>
  </defs>
  <path class="st0" d="M35.9,59.8V.5"/>
  <path class="st0" d="M30,59.7V.4"/>
  <path class="st0" d="M6.4,59.8V.5"/>
  <path class="st0" d="M59.5,59.7V.4"/>
  <path class="st0" d="M53.6,59.7V.4"/>
  <path class="st0" d="M47.7,59.7V.4"/>
  <path class="st0" d="M41.8,59.7V.4"/>
  <path class="st0" d="M24.1,59.7V.3"/>
  <path class="st0" d="M18.2,59.7V.4"/>
  <path class="st0" d="M12.3,59.7V.4"/>
  <path class="st0" d="M.5,59.7V.4"/>
</svg>`,
  () => `
   <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 60 60">
  <defs>
    <style>
      .st0 {
        fill: none;
        stroke: #d8d8d8;
        stroke-miterlimit: 10;
      }
    </style>
  </defs>
  <path class="st0" d="M.6,30c0,16.2,13.2,29.4,29.4,29.4s29.4-13.2,29.4-29.4S46.2.6,30,.6.6,13.8.6,30Z"/>
  <path class="st0" d="M6.6,30c0,12.9,10.5,23.4,23.4,23.4s23.4-10.5,23.4-23.4S42.9,6.6,30,6.6,6.6,17.1,6.6,30Z"/>
  <path class="st0" d="M12.6,30c0,9.6,7.8,17.4,17.4,17.4s17.4-7.8,17.4-17.4-7.8-17.4-17.4-17.4-17.4,7.8-17.4,17.4Z"/>
  <path class="st0" d="M18.6,30c0,6.3,5.1,11.4,11.4,11.4s11.4-5.1,11.4-11.4-5.1-11.4-11.4-11.4-11.4,5.1-11.4,11.4Z"/>
  <path class="st0" d="M24.6,30c0,3,2.4,5.4,5.4,5.4s5.4-2.4,5.4-5.4-2.4-5.4-5.4-5.4-5.4,2.4-5.4,5.4Z"/>
</svg>`,
  () => `
   <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 60 60">
  <defs>
    <style>
      .st0 {
        fill: none;
        stroke: #d8d8d8;
        stroke-miterlimit: 10;
      }
    </style>
  </defs>
  <path class="st0" d="M.6,59.2c0,.1.1.3.3.3h58.3c.1,0,.3-.1.3-.3V.9c0-.1-.1-.3-.3-.3H.8c-.1,0-.3.1-.3.3v58.3h0Z"/>
  <path class="st0" d="M6.6,53.2c0,.1,0,.2.2.2h46.4c.1,0,.2,0,.2-.2V6.8c0-.1,0-.2-.2-.2H6.8c-.1,0-.2,0-.2.2v46.4h0Z"/>
  <path class="st0" d="M12.6,47.2c0,.1.1.3.3.3h34.3c.1,0,.3-.1.3-.3V12.9c0-.1-.1-.3-.3-.3H12.8c-.1,0-.3.1-.3.3v34.3h0Z"/>
  <path class="st0" d="M18.6,41.2c0,.1.1.2.2.2h22.3c.1,0,.2-.1.2-.2v-22.3c0-.1-.1-.2-.2-.2h-22.3c-.1,0-.2.1-.2.2v22.3h0Z"/>
  <path class="st0" d="M24.6,35.2c0,.1,0,.2.2.2h10.4c.1,0,.2,0,.2-.2v-10.4c0-.1,0-.2-.2-.2h-10.4c-.1,0-.2,0-.2.2v10.4Z"/>
  <path class="st0" d="M29.3,30.1c0-.4.3-.7.7-.7s.7.3.7.7-.3.7-.7.7-.7-.3-.7-.7Z"/>
</svg>`,
  () => `
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 60 60">
  <defs>
    <style>
      .st0 {
        fill: none;
        stroke: #d8d8d8;
        stroke-miterlimit: 10;
      }
    </style>
  </defs>
  <path class="st0" d="M.5,59.2c4.7-.1,8.8-1.1,12.5-3,10.1-5.1,16.5-15,16.5-26.2S23.1,8.8,13,3.7C9.3,1.9,5.2.9.5.8"/>
  <path class="st0" d="M59.6.8c-4.7.1-8.8,1.1-12.5,3-10.1,5.1-16.5,15-16.5,26.3s6.4,21.1,16.5,26.2c3.6,1.8,7.8,2.8,12.5,3"/>
  <path class="st0" d="M59.9,6.6c-9.8.6-16.8,5.1-21,13.5-1.5,3-2.2,6.3-2.2,9.9,0,3.6.8,6.9,2.3,9.9,4.3,8.4,11.3,12.9,21.1,13.4"/>
  <path class="st0" d="M60,54.4"/>
  <path class="st0" d="M.4,53.3c7.8-.4,13.9-3.5,18.2-9.2,3.2-4.2,4.8-8.9,4.8-14.1,0-5.2-1.6-9.9-4.8-14.1C14.3,10.2,8.2,7.1.4,6.7"/>
  <path class="st0" d="M.5,47.3c5.7-.3,10.3-2.6,13.6-7.1,2.3-3.1,3.4-6.4,3.4-10.2,0-3.7-1.1-7.1-3.4-10.2-3.3-4.5-7.8-6.8-13.6-7.1"/>
  <path class="st0" d="M59.8,12.6c-6.8.5-11.7,3.5-14.9,9-1.5,2.5-2.2,5.3-2.2,8.3s.7,5.8,2.2,8.3c3.2,5.5,8.2,8.5,14.9,9"/>
  <path class="st0" d="M59.6,18.7c-6.2.4-11,5.2-11,11.3,0,6.1,4.8,10.9,11,11.3"/>
  <path class="st0" d="M.4,41.3c5.3-.5,8.9-3.2,10.6-8.2.3-.9.5-1.9.5-3.1h0c0-1.2-.1-2.3-.4-3.1-1.7-5-5.2-7.7-10.5-8.2"/>
  <path class="st0" d="M.6,35.3c2.7-.3,4.9-2.5,4.9-5.3,0-2.8-2.1-5-4.9-5.3"/>
  <path class="st0" d="M59.7,24.6c-2.8.2-5.1,2.5-5.1,5.3,0,2.8,2.2,5.1,5,5.4"/>
</svg>`,
  () => `
   <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 60 60">
  <defs>
    <style>
      .st0 {
        fill: none;
        stroke: #d8d8d8;
        stroke-miterlimit: 10;
      }
    </style>
  </defs>
  <path class="st0" d="M36.4,25v3.4c0,3-.4,5.3-3,6.9-3.7,2.4-8.3.4-9.5-3.7-.5-1.9-.2-3.7,1.1-5.4,2-2.7,4.4-2.6,8.1-2.6h26.1c.2,0,.3.1.3.3,0,3,.2,6,0,8.6-.9,9.5-5.4,16.9-13.4,22.2-12.7,8.4-30.1,5.2-39.3-6.9C-6.7,30.3,3.1,5.1,24.8,1.1c1.8-.3,5.2-.5,10.1-.5h25"/>
  <path class="st0" d="M53.8,25v5.5c0,3.2-.7,6.3-2.1,9.3-3,6.4-7.9,10.7-14.5,12.8-4.9,1.5-9.7,1.5-14.5,0C6.6,47,1.1,27.1,12.4,14.3c3.3-3.7,7.4-6.2,12.4-7.4,1.9-.4,5.2-.7,10.1-.6h25.2"/>
  <path class="st0" d="M47.9,25.1v5.3c-.2,4.8-1.9,8.8-5.1,12.1-10,10.2-27.1,5.3-30.2-8.5-2.1-9.1,3.2-18.1,12.3-21,1.7-.5,4.7-.8,9.1-.8h26.1"/>
  <path class="st0" d="M42.2,24.9v5c0,5-3,9.4-7.7,11.3-7.6,3-16-2.3-16.5-10.5-.2-3.3.8-6.2,2.9-8.6,1.6-1.8,3.5-3.1,5.7-3.7,1.3-.4,3.5-.6,6.5-.6h27"/>
</svg>`,
  () => `
   <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 60 60">
  <defs>
    <style>
      .st0 {
        fill: none;
        stroke: #d8d8d8;
        stroke-miterlimit: 10;
      }
    </style>
  </defs>
  <path class="st0" d="M17.2,59.4h25.5"/>
  <path class="st0" d="M8.9,52.9h42.2"/>
  <path class="st0" d="M4.2,46.4h51.4"/>
  <path class="st0" d="M1.6,39.8h56.7"/>
  <path class="st0" d="M.4,33.3h59.2"/>
  <path class="st0" d="M0,33.1"/>
  <path class="st0" d="M.4,26.8h59.2"/>
  <path class="st0" d="M1.5,20.3h56.9"/>
  <path class="st0" d="M4.2,13.7h51.5"/>
  <path class="st0" d="M8.9,7.2h42.2"/>
  <path class="st0" d="M17.3.7h25.4"/>
</svg>`,
];

function snapAngle90(deg: number) {
  let a = ((deg % 360) + 360) % 360;
  const snapped = Math.round(a / 90) * 90;
  return snapped % 360;
}
function shortestAngle(a: number, b: number) {
  let d = (b - a) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

export default function FallingSvgPlayground() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    gsap.registerPlugin(Draggable);

    const playground = rootRef.current;

    // physics
    const G = 2400;
    const RESTITUTION = 0.55;
    const FRICTION = 0.985;
    const ROT_DAMP = 0.992;
    const DELAY = 550;

    // keep objects inside this section (top boundary relative to item size)
    const getMinY = (size: number) => -size * 1.2;

    // collisions
    const COLLISION_RESTITUTION = 0.78;
    const COLLISION_FRICTION = 0.98;
    const SOLVER_ITERS = 2;

    // magnet
    const MAG_RANGE = 22;
    const MAG_STRENGTH = 260;
    const MAG_DAMP = 0.18;

    let objs: Obj[] = [];
    let lastT = performance.now();

    const getBounds = () => {
      const r = playground.getBoundingClientRect();
      return { w: r.width, h: r.height, pad: 8 };
    };

    const getSize = () => {
      // ensures 6 can sit side-by-side on small screens (no overlap)
      const b = getBounds();
      const n = 6;
      const gap = 14;
      const usableW = Math.max(0, b.w - b.pad * 2);
      const maxByWidth = Math.floor((usableW - gap * (n - 1)) / n);

      const base = Math.min(b.w, b.h);
      const preferred = Math.round(base * 0.18);

      return Math.round(Math.max(56, Math.min(150, Math.min(preferred, maxByWidth))));
    };

    playground.style.setProperty('--sz', `${getSize()}px`);

    function press(o: Obj, impact: number) {
      const now = performance.now();
      if (now - o.lastPress < 90) return; // throttle to avoid flicker
      o.lastPress = now;

      // stronger bubble press
      const amp = Math.min(0.32, Math.max(0.09, impact / 1800)); // 0.09..0.32
      const sx = 1 - amp * 0.75;
      const sy = 1 + amp * 0.55;

      gsap.killTweensOf(o.innerEl);
      gsap
        .timeline()
        .to(o.innerEl, { scaleX: sx, scaleY: sy, duration: 0.11, ease: 'power2.out' })
        .to(
          o.innerEl,
          { scaleX: 1, scaleY: 1, duration: 0.75, ease: 'elastic.out(1,0.35)' },
          '>-0.02'
        );
    }

    const createObj = (svgFn: () => string, idx: number): Obj => {
      const delay = idx * DELAY; // ✅ stagger delay (ms)
      const now = performance.now();

      const el = document.createElement('div');
      el.className = 'obj';

      const inner = document.createElement('div');
      inner.className = 'inner';
      inner.innerHTML = svgFn();
      el.appendChild(inner);

      playground.appendChild(el);

      const b = getBounds();
      const size = getSize();
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      const state: Obj = {
        el,
        innerEl: inner,
        size,
        radius: size * 0.46,
        spawnAt: now + delay,
        spawned: false,

        x: rand(0, window.outerWidth / 2),
        // start higher so nothing visible at load
        y: rand(getMinY(size * 3), getMinY(size * 3) * 0.5),

        vx: rand(-260, 260),
        vy: rand(-80, 120),
        r: rand(0, 360),
        vr: rand(-220, 220),

        dragging: false,

        _lastDragT: 0,
        _lastDragX: 0,
        _lastDragY: 0,
        _tossVX: 0,
        _tossVY: 0,

        lastPress: 0,

        onFloor: false,
        wasOnFloor: false,
        asleep: false,
        restTarget: 0,

        setX: gsap.quickSetter(el, 'x', 'px') as (v: number) => void,
        setY: gsap.quickSetter(el, 'y', 'px') as (v: number) => void,
        setR: gsap.quickSetter(el, 'rotation', 'deg') as (v: number) => void,
      };

      state.setX(state.x);
      state.setY(state.y);
      state.setR(state.r);

      Draggable.create(el, {
        type: 'x,y',
        bounds: playground,
        inertia: false,

        onPress() {
          state.dragging = true;
          state.asleep = false;
          state.restTarget = 0;

          const now = performance.now();
          state._lastDragT = now;
          state._lastDragX = (this as any).x;
          state._lastDragY = (this as any).y;

          state.vx = 0;
          state.vy = 0;
          state.vr = rand(-180, 180);
        },

        onDrag() {
          const x = (this as any).x as number;
          const y = (this as any).y as number;

          state.x = x;
          state.y = y;

          const now = performance.now();
          const dt = Math.max(0.001, (now - state._lastDragT) / 1000);
          const dx = x - state._lastDragX;
          const dy = y - state._lastDragY;

          const vx = dx / dt;
          const vy = dy / dt;

          state._tossVX = state._tossVX * 0.65 + vx * 0.35;
          state._tossVY = state._tossVY * 0.65 + vy * 0.35;

          // kinematic velocity so dragging pushes others
          state.vx = clamp(state._tossVX, -MAX_SPD, MAX_SPD);
          state.vy = clamp(state._tossVY, -MAX_SPD, MAX_SPD);

          state._lastDragT = now;
          state._lastDragX = x;
          state._lastDragY = y;
        },

        onRelease() {
          state.dragging = false;
          state.vx = clamp(state._tossVX, -MAX_SPD, MAX_SPD);
          state.vy = clamp(state._tossVY, -MAX_SPD, MAX_SPD);
          state.vr = clamp(state.vr + state.vx * 0.04, -520, 520);
        },
      });

      return state;
    };

    function solveCollisions(bounds: { w: number; h: number; pad: number }) {
      for (let iter = 0; iter < SOLVER_ITERS; iter++) {
        for (let i = 0; i < objs.length; i++) {
          const A = objs[i];

          for (let j = i + 1; j < objs.length; j++) {
            const B = objs[j];

            if (A.dragging && B.dragging) continue;
            if (A.asleep && B.asleep) continue;

            const ax = A.x + A.size / 2;
            const ay = A.y + A.size / 2;
            const bx = B.x + B.size / 2;
            const by = B.y + B.size / 2;

            let dx = bx - ax;
            let dy = by - ay;
            const rSum = A.radius + B.radius;

            const d2 = dx * dx + dy * dy;
            if (d2 === 0) {
              dx = (Math.random() - 0.5) * 0.01;
              dy = (Math.random() - 0.5) * 0.01;
            }

            const d = Math.max(0.0001, Math.sqrt(d2));
            const nx = dx / d;
            const ny = dy / d;

            // Magnet (skip if either is sleeping/resting)
            const magLimit = rSum + MAG_RANGE;
            if (d < magLimit && !((A.asleep && !A.dragging) || (B.asleep && !B.dragging))) {
              const t = 1 - d / magLimit;
              const pull = MAG_STRENGTH * t * t;

              const mA = A.radius * A.radius;
              const mB = B.radius * B.radius;

              if (!A.dragging) {
                A.vx += nx * pull * (1 / mA);
                A.vy += ny * pull * (1 / mA);
              }
              if (!B.dragging) {
                B.vx -= nx * pull * (1 / mB);
                B.vy -= ny * pull * (1 / mB);
              }

              const rvx0 = B.vx - A.vx;
              const rvy0 = B.vy - A.vy;

              if (!A.dragging) {
                A.vx += rvx0 * MAG_DAMP * 0.5;
                A.vy += rvy0 * MAG_DAMP * 0.5;
              }
              if (!B.dragging) {
                B.vx -= rvx0 * MAG_DAMP * 0.5;
                B.vy -= rvy0 * MAG_DAMP * 0.5;
              }
            }

            // Real collision overlap
            if (d2 < rSum * rSum) {
              // wake if needed
              if (A.asleep) A.asleep = false;
              if (B.asleep) B.asleep = false;

              const penetration = rSum - d;

              const mA = A.radius * A.radius;
              const mB = B.radius * B.radius;

              // position correction
              if (A.dragging && !B.dragging) {
                B.x += nx * penetration;
                B.y += ny * penetration;
              } else if (!A.dragging && B.dragging) {
                A.x -= nx * penetration;
                A.y -= ny * penetration;
              } else {
                const invSum = 1 / (mA + mB);
                A.x -= nx * penetration * (mB * invSum);
                A.y -= ny * penetration * (mB * invSum);
                B.x += nx * penetration * (mA * invSum);
                B.y += ny * penetration * (mA * invSum);
              }

              // velocity response
              const rvx = B.vx - A.vx;
              const rvy = B.vy - A.vy;
              const relVelN = rvx * nx + rvy * ny;

              if (relVelN < 0) {
                const invA = A.dragging ? 0 : 1 / mA;
                const invB = B.dragging ? 0 : 1 / mB;
                const invMassSum = invA + invB;

                if (invMassSum > 0) {
                  const jImp = (-(1 + COLLISION_RESTITUTION) * relVelN) / invMassSum;
                  const impX = jImp * nx;
                  const impY = jImp * ny;

                  if (!A.dragging) {
                    A.vx -= impX * invA;
                    A.vy -= impY * invA;
                  }
                  if (!B.dragging) {
                    B.vx += impX * invB;
                    B.vy += impY * invB;
                  }

                  // tangential friction
                  const tvx = rvx - relVelN * nx;
                  const tvy = rvy - relVelN * ny;

                  if (!A.dragging) {
                    A.vx += tvx * (1 - COLLISION_FRICTION) * 0.5;
                    A.vy += tvy * (1 - COLLISION_FRICTION) * 0.5;
                  }
                  if (!B.dragging) {
                    B.vx -= tvx * (1 - COLLISION_FRICTION) * 0.5;
                    B.vy -= tvy * (1 - COLLISION_FRICTION) * 0.5;
                  }

                  const impact = Math.min(2600, Math.max(0, -relVelN));
                  press(A, impact);
                  press(B, impact);

                  A.asleep = false;
                  B.asleep = false;
                  A.restTarget = 0;
                  B.restTarget = 0;
                }
              }

              // clamp inside
              if (!A.dragging) {
                A.x = clamp(A.x, bounds.pad, bounds.w - bounds.pad - A.size);
                A.y = clamp(A.y, getMinY(A.size), bounds.h - bounds.pad - A.size);
              }
              if (!B.dragging) {
                B.x = clamp(B.x, bounds.pad, bounds.w - bounds.pad - B.size);
                B.y = clamp(B.y, getMinY(B.size), bounds.h - bounds.pad - B.size);
              }
            }
          }
        }
      }
    }

    function step(dt: number) {
      const b = getBounds();
      const minX = b.pad;
      const maxX = b.w - b.pad;
      const maxY = b.h - b.pad;

      for (const o of objs) {
        if (o.dragging) continue;

        // ✅ stagger spawn
        const now = performance.now();
        if (!o.spawned) {
          if (now < o.spawnAt) {
            // keep hidden above until delay ends
            o.setX(o.x);
            o.setY(o.y);
            o.setR(o.r);
            continue;
          }

          o.spawned = true;

          // start falling with random initial velocity
          o.vx = rand(-220, 220);
          o.vy = rand(-80, 140);
          o.vr = rand(-220, 220);
        }

        // floor tracking
        o.wasOnFloor = o.onFloor;
        o.onFloor = false;

        if (o.asleep) {
          o.vx = 0;
          o.vy = 0;
          o.vr = 0;
          o.setX(o.x);
          o.setY(o.y);
          o.setR(o.r);
          continue;
        }

        o.vy += G * dt;
        o.vx *= Math.pow(FRICTION, dt * 60);
        o.vr *= Math.pow(ROT_DAMP, dt * 60);

        o.x += o.vx * dt;
        o.y += o.vy * dt;
        o.r += o.vr * dt;

        const w = o.size;
        const h = o.size;

        if (o.x < minX) {
          o.x = minX;
          o.vx = -o.vx * RESTITUTION;
        } else if (o.x + w > maxX) {
          o.x = maxX - w;
          o.vx = -o.vx * RESTITUTION;
        }

        const minY = getMinY(o.size);
        if (o.y < minY) {
          o.y = minY;
          o.vy = Math.abs(o.vy) * 0.2;
        }

        if (o.y + h > maxY) {
          const preVy = o.vy;

          o.y = maxY - h;
          o.vy = -o.vy * RESTITUTION;

          o.vx *= 0.86;
          o.vr *= 0.96;

          o.onFloor = true;

          // press only on first contact + meaningful impact
          if (!o.wasOnFloor && Math.abs(preVy) > 180) {
            press(o, Math.min(2600, Math.abs(preVy)));
          }

          if (Math.abs(o.vy) < 90) o.vy = 0;

          // sleep when resting to prevent micro-jitter
          if (o.onFloor && Math.abs(o.vy) < 1 && Math.abs(o.vx) < 6 && Math.abs(o.vr) < 8) {
            if (!o.restTarget) o.restTarget = snapAngle90(o.r);
            o.r = o.restTarget;
            o.vr = 0;
            o.asleep = true;
            o.vx = 0;
            o.vy = 0;
            o.setX(o.x);
            o.setY(o.y);
            o.setR(o.r);
          }
        }
      }

      solveCollisions(b);

      // Smooth settle rotation to nearest 90 when resting
      const K = 22;
      const C = 10;
      for (const o of objs) {
        if (o.dragging || o.asleep) continue;
        if (!o.onFloor) continue;

        const speed = Math.hypot(o.vx, o.vy);
        if (speed < 140 && Math.abs(o.vr) < 140) {
          if (!o.restTarget) o.restTarget = snapAngle90(o.r);

          const delta = shortestAngle(o.r, o.restTarget);
          const acc = K * delta - C * o.vr;
          o.vr += acc * dt;
          o.r += o.vr * dt;

          if (Math.abs(delta) < 0.6 && Math.abs(o.vr) < 8) {
            o.r = o.restTarget;
            o.vr = 0;
          }
        }
      }

      for (const o of objs) {
        if (o.dragging) continue;
        o.setX(o.x);
        o.setY(o.y);
        o.setR(o.r);
      }
    }

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.033, (now - lastT) / 1000);
      lastT = now;
      step(dt);
    };

    gsap.ticker.add(tick);

    // create 6 objects
    objs = SVGS.map((fn, i) => {
      return createObj(fn, i);
    });

    let resizeTO: number | null = null;
    const onResize = () => {
      if (resizeTO) window.clearTimeout(resizeTO);
      resizeTO = window.setTimeout(() => {
        const b = getBounds();
        const sz = getSize();
        playground.style.setProperty('--sz', `${sz}px`);

        for (const o of objs) {
          o.size = sz;
          o.radius = sz * 0.46;
          o.el.style.width = `${sz}px`;
          o.el.style.height = `${sz}px`;

          o.x = clamp(o.x, b.pad, b.w - b.pad - o.size);
          o.y = clamp(o.y, getMinY(o.size), b.h - b.pad - o.size);

          o.asleep = false;
          o.restTarget = 0;

          o.setX(o.x);
          o.setY(o.y);
          o.setR(o.r);
        }
      }, 120);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tick);
      objs.forEach((o) => o.el.remove());
      objs = [];
    };
  }, []);

  return <div ref={rootRef} className="playground "></div>;
}
