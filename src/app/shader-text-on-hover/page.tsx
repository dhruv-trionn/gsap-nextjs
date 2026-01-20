"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";


function createTextTexture(text: string) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = 1024
  canvas.height = 512 

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = 'bold 120px Arial'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  return texture
}


function Plan() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

    const fragmentShader = `
uniform sampler2D uText;
uniform float uTime;
uniform float uHover;

varying vec2 vUv;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

  vec2 uv = vUv;

  // Horizontal glitch lines
  float glitch = step(0.92, random(vec2(uTime * 2.0, uv.y)));

  float strength = 0.01 * uHover;

  uv.x += glitch * strength;

  // RGB split
  vec4 r = texture2D(uText, uv + vec2(strength, 0.0));
  vec4 g = texture2D(uText, uv);
  vec4 b = texture2D(uText, uv - vec2(strength, 0.0));

  gl_FragColor = vec4(r.r, g.g, b.b, g.a);
}


`;

    const texture = useMemo(() => {
      return  createTextTexture('Hello Shaders')
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
        }
    })

    return (
        <mesh
            position={[0, 0, 0]}
            onPointerMove={(e) => {
                if (materialRef.current) {
                    materialRef.current.uniforms.uMouse.value.copy(e.uv);
                }
            }}
            onPointerEnter={() => {
                if (materialRef.current) {
                    gsap.to(materialRef.current.uniforms.uHover, {
                        value: 1,
                        duration: 0.4,
                        ease: "power2.out",
                    });
                }
            }}
            onPointerLeave={() => {
                if (materialRef.current) {
                    gsap.to(materialRef.current.uniforms.uHover, {
                        value: 0,
                        duration: 0.4,
                        ease: "power2.out",
                    });
                }
            }}
        >
            <planeGeometry args={[5, 5, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uText: { value: texture },
                    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                    uHover: { value: 0 },
                }}
            />
        </mesh>
    );
}

const Page = () => {
    return (
        <div className="w-screen h-screen bg-black">
            <Canvas>
                <Plan />
                <OrbitControls rotateSpeed={0.5} enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
};

export default Page;
