'use client';

import { useEffect, useRef } from 'react';

type Vec = {
  x: number;
  y: number;
};

type NodeT = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

class Node implements NodeT {
  x: number;
  y: number;
  vx = 0;
  vy = 0;

  constructor(pos: Vec) {
    this.x = pos.x;
    this.y = pos.y;
  }
}

class Line {
  spring: number;
  friction: number;
  nodes: Node[];

  constructor(pos: Vec, size: number, friction: number, springBase: number) {
    this.spring = springBase + 0.08 * Math.random() - 0.1;
    this.friction = friction + 0.02 * Math.random() - 0.004;
    this.nodes = Array.from({ length: size }, () => new Node(pos));
  }

  update(pos: Vec, dampening: number, tension: number) {
    let spring = this.spring;
    const n0 = this.nodes[0];

    n0.vx += (pos.x - n0.x) * spring;
    n0.vy += (pos.y - n0.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];

      if (i > 0) {
        const prev = this.nodes[i - 1];
        n.vx += (prev.x - n.x) * spring;
        n.vy += (prev.y - n.y) * spring;
        n.vx += prev.vx * dampening;
        n.vy += prev.vy * dampening;
      }

      n.vx *= this.friction;
      n.vy *= this.friction;
      n.x += n.vx;
      n.y += n.vy;

      spring *= tension;
    }
  }

  draw(ctx: CanvasRenderingContext2D, stroke: string, lineWidth: number) {
    ctx.beginPath();
    ctx.moveTo(this.nodes[0].x, this.nodes[0].y);

    for (let i = 1; i < this.nodes.length - 2; i++) {
      const a = this.nodes[i];
      const b = this.nodes[i + 1];
      const cx = (a.x + b.x) * 0.5;
      const cy = (a.y + b.y) * 0.5;
      ctx.quadraticCurveTo(a.x, a.y, cx, cy);
    }

    const a = this.nodes[this.nodes.length - 2];
    const b = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);

    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

export default function CursorTrails() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runningRef = useRef(true);
  const pos = useRef<Vec>({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    const DPR = () => Math.max(1, window.devicePixelRatio || 1);

    const E = {
      trails: 3,
      size: 10,
      friction: 0.56,
      dampening: 0.124,
      tension: 0.98,
      lineWidth: 1,
      alpha: 1,
    };

    let lines: Line[] = [];
    let phase = 0;

    const resize = () => {
      const dpr = DPR();
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rebuild = () => {
      lines = [];
      for (let i = 0; i < E.trails; i++) {
        lines.push(
          new Line(
            pos.current,
            E.size,
            E.friction,
            0.35 + (i / E.trails) * 0.03
          )
        );
      }
    };

    const render = () => {
      if (!runningRef.current) return;

      phase += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      const stroke = `rgba(247,76,31,${E.alpha})`;

      for (const line of lines) {
        line.update(pos.current, E.dampening, E.tension);
        line.draw(ctx, stroke, E.lineWidth);
      }

      requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length) {
        pos.current.x = e.touches[0].pageX;
        pos.current.y = e.touches[0].pageY;
      } else if ('clientX' in e) {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
      }
    };

    resize();
    rebuild();
    render();

    window.addEventListener('resize', () => {
      resize();
      rebuild();
    });

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchstart', onMove, { passive: true });

    document.addEventListener('visibilitychange', () => {
      runningRef.current = !document.hidden;
      if (runningRef.current) render();
    });

    return () => {
      runningRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchstart', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        mixBlendMode: 'difference',
        zIndex: 9999,
      }}
    />
  );
}