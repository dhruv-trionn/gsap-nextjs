'use client';

import { useEffect, useRef } from 'react';

const MOBILE_BREAKPOINT = 768;
const STRIP_HEIGHT = 28;
const STRIP_GAP = 7;
const STEP = STRIP_HEIGHT + STRIP_GAP;
const SEGS = 32;

const vertexSrc = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentSrc = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2 uImageScale;
uniform vec2 uMouseEase;
uniform float uTime;
uniform float uHover;

vec2 containUv(vec2 uv, vec2 viewport, vec2 image) {
  float vr = viewport.x / viewport.y;
  float ir = image.x / image.y;
  vec2 scale = vec2(1.0);
  if (vr > ir) scale.x = ir / vr; else scale.y = vr / ir;
  return (uv - 0.5) / scale + 0.5;
}

void main() {
  vec2 contained = containUv(vUv, uResolution, uImageScale);
  bool outside = contained.x < 0.0 || contained.x > 1.0 || contained.y < 0.0 || contained.y > 1.0;
  vec3 bg = vec3(1.0);
  if (outside) { gl_FragColor = vec4(bg, 1.0); return; }
  vec2 mouse = (uMouseEase - 0.5) * vec2(2.0, -2.0);
  float depth = texture2D(uDepth, contained).r;
  float breathing = sin(uTime * 0.0012) * 0.5 + 0.5;
  float amount = (0.03 + 0.012 * breathing) * uHover;
  vec2 disp = mouse * depth * amount;
  vec2 uv = contained - disp;
  float r = texture2D(uImage, uv + disp * 0.16).r;
  float g = texture2D(uImage, uv).g;
  float b = texture2D(uImage, uv - disp * 0.16).b;
  float a = texture2D(uImage, uv).a;
  vec3 color = mix(bg, vec3(r,g,b), a);
  gl_FragColor = vec4(color, 1.0);
}`;

const assetsByMode = {
  desktop: { image: '/assets/lion.png', depth: '/assets/lion-depth.png' },
  mobile: { image: '/assets/lion-mobile.png', depth: '/assets/lion-mobile-depth.png' },
};

export default function HeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const stripContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = glCanvasRef.current;
    const stripContainer = stripContainerRef.current;
    if (!scene || !canvas || !stripContainer) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false });
    if (!gl) { console.error('WebGL not supported'); return; }

    // ── Strip state ──────────────────────────────────────────────────────────
    let stripCanvas: HTMLCanvasElement | null = null;
    let sctx: CanvasRenderingContext2D | null = null;
    let containerW = 1, containerH = 1, stripCount = 0;
    let offY: Float32Array, velY: Float32Array;
    let dragging = false, dragStrip = -1, dragSeg = -1;

    function buildStrips(w: number, h: number) {
      containerW = w; containerH = h;
      if (!stripCanvas) {
        stripCanvas = document.createElement('canvas');
        stripCanvas.style.cssText = 'position:absolute;inset:0;display:block;cursor:ns-resize;touch-action:none;z-index:2;';
        stripContainer.appendChild(stripCanvas);
        attachEvents();
      }
      stripCanvas.width = Math.round(w);
      stripCanvas.height = Math.round(h);
      stripCanvas.style.width = w + 'px';
      stripCanvas.style.height = h + 'px';
      sctx = stripCanvas.getContext('2d');
      stripCount = Math.ceil(h / STEP) + 2;
      offY = new Float32Array(stripCount);
      velY = new Float32Array(stripCount);
    }

    function attachEvents() {
      if (!stripCanvas) return;
      stripCanvas.addEventListener('mousedown', (e: MouseEvent) => {
        const r = stripCanvas!.getBoundingClientRect();
        const mx = e.clientX - r.left, my = e.clientY - r.top;
        const si = Math.floor(my / STEP);
        if (si < 0 || si >= stripCount) return;
        dragging = true; dragStrip = si;
        dragSeg = Math.round((mx / containerW) * SEGS);
        e.preventDefault();
      });
      stripCanvas.addEventListener('touchstart', (e: TouchEvent) => {
        const r = stripCanvas!.getBoundingClientRect();
        const mx = e.touches[0].clientX - r.left, my = e.touches[0].clientY - r.top;
        const si = Math.floor(my / STEP);
        if (si < 0 || si >= stripCount) return;
        dragging = true; dragStrip = si;
        dragSeg = Math.round((mx / containerW) * SEGS);
      }, { passive: true });
      window.addEventListener('mousemove', (e: MouseEvent) => {
        if (!dragging || !stripCanvas) return;
        const r = stripCanvas.getBoundingClientRect();
        const pointerY = e.clientY - r.top;
        const restY = dragStrip * STEP;
        offY[dragStrip] = pointerY - restY - STRIP_HEIGHT / 2;
      });
      window.addEventListener('touchmove', (e: TouchEvent) => {
        if (!dragging || !stripCanvas) return;
        const r = stripCanvas.getBoundingClientRect();
        const pointerY = e.touches[0].clientY - r.top;
        const restY = dragStrip * STEP;
        offY[dragStrip] = pointerY - restY - STRIP_HEIGHT / 2;
      }, { passive: true });
      window.addEventListener('mouseup', () => { dragging = false; });
      window.addEventListener('touchend', () => { dragging = false; });
    }

    function drawStrip(i: number, topY: number, stripH: number) {
      if (!sctx || stripH < 0.5) return;
      const segW = containerW / SEGS;
      const restY = i * STEP;
      const displacement = topY - restY;
      const clickSeg = dragSeg >= 0 ? dragSeg : SEGS / 2;
      const clickX = clickSeg / SEGS;
      const sigma = 0.18;
      const topPts: { x: number; y: number }[] = [];
      const botPts: { x: number; y: number }[] = [];
      for (let s = 0; s <= SEGS; s++) {
        const t = s / SEGS;
        const x = s * segW;
        const dx = t - clickX;
        const envelope = Math.exp(-(dx * dx) / (2 * sigma * sigma));
        const py = restY + displacement * envelope;
        topPts.push({ x, y: py });
        botPts.push({ x, y: py + stripH });
      }
      sctx.beginPath();
      sctx.moveTo(topPts[0].x, topPts[0].y);
      for (let s = 1; s <= SEGS; s++) sctx.lineTo(topPts[s].x, topPts[s].y);
      for (let s = SEGS; s >= 0; s--) sctx.lineTo(botPts[s].x, botPts[s].y);
      sctx.closePath();
      const grad = sctx.createLinearGradient(0, topPts[0].y, 0, botPts[0].y + stripH);
      grad.addColorStop(0, 'rgba(255,247,216,0)');
      grad.addColorStop(1, '#FFF7D8');
      sctx.fillStyle = grad;
      sctx.fill();
      if (displacement < 0) {
        const strength = Math.min(1, Math.abs(displacement) / 30);
        sctx.beginPath();
        sctx.moveTo(topPts[0].x, topPts[0].y);
        for (let s = 1; s <= SEGS; s++) sctx.lineTo(topPts[s].x, topPts[s].y);
        for (let s = SEGS; s >= 0; s--) sctx.lineTo(botPts[s].x, botPts[s].y);
        sctx.closePath();
        const gradUp = sctx.createLinearGradient(0, botPts[0].y, 0, topPts[0].y);
        gradUp.addColorStop(0, 'rgba(255,247,216,0)');
        gradUp.addColorStop(1, `rgba(255,247,216,${strength.toFixed(3)})`);
        sctx.fillStyle = gradUp;
        sctx.fill();
      }
      sctx.beginPath();
      sctx.moveTo(topPts[0].x, topPts[0].y);
      for (let s = 1; s <= SEGS; s++) sctx.lineTo(topPts[s].x, topPts[s].y);
      sctx.strokeStyle = 'rgba(255,247,216,0.5)';
      sctx.lineWidth = 1;
      sctx.stroke();
    }

    function physicsStep() {
      if (!offY) return;
      for (let i = 0; i < stripCount; i++) {
        if (dragging && i === dragStrip) continue;
        if (dragging && dragStrip >= 0) {
          const dy = offY[dragStrip];
          if (dy > 0 && i < dragStrip) { offY[i] = 0; velY[i] = 0; continue; }
          if (dy < 0 && i > dragStrip) { offY[i] = 0; velY[i] = 0; continue; }
        }
        const sp = (0 - offY[i]) * 0.12;
        velY[i] = (velY[i] + sp) * 0.65;
        offY[i] += velY[i];
        if (Math.abs(offY[i]) < 0.01 && Math.abs(velY[i]) < 0.01) { offY[i] = 0; velY[i] = 0; }
      }
      if (!dragging || dragStrip < 0) return;
      const dy = offY[dragStrip];
      if (dy === 0) return;
      const maxVel = 18;
      if (dy > 0) {
        for (let ii = 1; ii < stripCount; ii++) {
          const ni = dragStrip + ii, ai = dragStrip + ii - 1;
          if (ni >= stripCount) break;
          const aboveTop = ai * STEP + offY[ai];
          const aboveBot = aboveTop + STRIP_HEIGHT;
          const thisRest = ni * STEP;
          const overlap = aboveBot - thisRest;
          if (overlap <= 0) break;
          const sp = (overlap - offY[ni]) * 0.22;
          velY[ni] = Math.max(-maxVel, Math.min(maxVel, (velY[ni] + sp) * 0.62));
          offY[ni] += velY[ni];
          if (offY[ni] > offY[dragStrip]) { offY[ni] = offY[dragStrip]; velY[ni] = 0; }
        }
      } else {
        for (let ii = 1; ii < stripCount; ii++) {
          const ni = dragStrip - ii, ai = dragStrip - ii + 1;
          if (ni < 0) break;
          const belowTop = ai * STEP + offY[ai];
          const thisRest = ni * STEP;
          const thisBotRest = thisRest + STRIP_HEIGHT;
          const overlap = thisBotRest - belowTop;
          if (overlap <= 0) break;
          const tgt2 = -overlap;
          const sp2 = (tgt2 - offY[ni]) * 0.22;
          velY[ni] = Math.max(-maxVel, Math.min(maxVel, (velY[ni] + sp2) * 0.62));
          offY[ni] += velY[ni];
        }
      }
    }

    function renderStrips() {
      if (!sctx) return;
      sctx.clearRect(0, 0, containerW, containerH);
      physicsStep();
      const topY = new Float32Array(stripCount);
      for (let i = 0; i < stripCount; i++) topY[i] = i * STEP + offY[i];
      for (let i = 0; i < stripCount; i++) {
        const nextTop = i + 1 < stripCount ? topY[i + 1] : topY[i] + STEP;
        const spaceDown = nextTop - topY[i];
        const thinDown = Math.max(0, STEP - spaceDown);
        const prevTop = i > 0 ? topY[i - 1] : topY[i] - STEP;
        const spaceUp = topY[i] - prevTop;
        const thinUp = Math.max(0, STEP - spaceUp);
        const thinning = Math.max(thinDown, thinUp);
        const h = Math.max(1, STRIP_HEIGHT - thinning * 0.9);
        drawStrip(i, topY[i], h);
      }
    }

    // ── WebGL helpers ────────────────────────────────────────────────────────
    function createShader(type: number, src: string): WebGLShader {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const i = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error(i ?? ''); }
      return s;
    }
    function createProgram(vs: string, fs: string): WebGLProgram {
      const p = gl.createProgram()!;
      gl.attachShader(p, createShader(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, createShader(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { const i = gl.getProgramInfoLog(p); gl.deleteProgram(p); throw new Error(i ?? ''); }
      return p;
    }
    function createTexture(img: HTMLImageElement): WebGLTexture {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return t;
    }
    function loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
    }

    // ── GL setup ─────────────────────────────────────────────────────────────
    const prog = createProgram(vertexSrc, fragmentSrc);
    gl.useProgram(prog);
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPosLoc = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(prog, 'uResolution')!,
      image: gl.getUniformLocation(prog, 'uImage')!,
      depth: gl.getUniformLocation(prog, 'uDepth')!,
      imageScale: gl.getUniformLocation(prog, 'uImageScale')!,
      mouseEase: gl.getUniformLocation(prog, 'uMouseEase')!,
      time: gl.getUniformLocation(prog, 'uTime')!,
      hover: gl.getUniformLocation(prog, 'uHover')!,
    };

    const state = {
      mouse: { x: 0.5, y: 0.5 }, eased: { x: 0.5, y: 0.5 },
      hover: 1, width: 1, height: 1, imageWidth: 1, imageHeight: 1, mode: null as string | null,
    };

    function getMode() { return window.innerWidth <= MOBILE_BREAKPOINT ? 'mobile' : 'desktop'; }

    function applyCanvasSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = Math.max(window.innerWidth, 1);
      const rw = Math.min(state.imageWidth, vw);
      const rh = Math.max(1, Math.round(state.imageHeight * (rw / state.imageWidth)));
      scene.style.width = `${rw}px`; scene.style.height = `${rh}px`;
      canvas.style.width = `${rw}px`; canvas.style.height = `${rh}px`;
      canvas.width = Math.max(1, Math.round(rw * dpr));
      canvas.height = Math.max(1, Math.round(rh * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      state.width = canvas.width; state.height = canvas.height;
      buildStrips(rw, rh);
    }

    function updatePointer(cx: number, cy: number) {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      state.mouse.x = Math.max(0, Math.min(1, (cx - r.left) / r.width));
      state.mouse.y = Math.max(0, Math.min(1, (cy - r.top) / r.height));
      state.hover = 1;
    }

    async function loadMode(mode: string) {
      const a = assetsByMode[mode as keyof typeof assetsByMode];
      const [image, depth] = await Promise.all([loadImage(a.image), loadImage(a.depth)]);
      state.imageWidth = image.naturalWidth || image.width;
      state.imageHeight = image.naturalHeight || image.height;
      const it = createTexture(image), dt = createTexture(depth);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, it); gl.uniform1i(uniforms.image, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dt); gl.uniform1i(uniforms.depth, 1);
      gl.uniform2f(uniforms.imageScale, state.imageWidth, state.imageHeight);
      state.mode = mode; applyCanvasSize();
    }

    async function ensureMode() {
      const next = getMode();
      if (next === state.mode) { applyCanvasSize(); return; }
      await loadMode(next);
    }

    // ── Render loop ──────────────────────────────────────────────────────────
    let rafId: number;
    function render(time: number) {
      state.eased.x += (state.mouse.x - state.eased.x) * 0.07;
      state.eased.y += (state.mouse.y - state.eased.y) * 0.07;
      gl.uniform2f(uniforms.resolution, state.width, state.height);
      gl.uniform2f(uniforms.mouseEase, state.eased.x, state.eased.y);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.hover, state.hover);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      renderStrips();
      rafId = requestAnimationFrame(render);
    }

    // ── Event listeners ──────────────────────────────────────────────────────
    const onResize = () => ensureMode().catch(console.error);
    const onMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const onMouseLeave = () => { state.mouse.x = 0.5; state.mouse.y = 0.5; };
    const onTouchMove = (e: TouchEvent) => { if (e.touches.length) updatePointer(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchStart = (e: TouchEvent) => { if (e.touches.length) updatePointer(e.touches[0].clientX, e.touches[0].clientY); };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    ensureMode().then(() => { rafId = requestAnimationFrame(render); }).catch(console.error);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      if (stripCanvas && stripContainer.contains(stripCanvas)) stripContainer.removeChild(stripCanvas);
    };
  }, []);

  return (
    <div className="flex justify-center overflow-x-hidden min-h-screen bg-white">
      <div
        ref={sceneRef}
        className="relative inline-block leading-none"
      >
        <canvas ref={glCanvasRef} className="block w-full h-auto max-w-screen touch-none" />
        <div
          ref={stripContainerRef}
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            zIndex: 2,
            mixBlendMode: 'luminosity',
            opacity: 0.9,
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
            WebkitMaskComposite: 'destination-in',
            maskComposite: 'intersect',
          }}
        />
      </div>
    </div>
  );
}
