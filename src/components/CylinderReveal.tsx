'use client'

import { OrbitControls, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { MeshSSSNodeMaterial } from 'three/webgpu'

gsap.registerPlugin(ScrollTrigger)

function Card() {

    const mat = useRef<THREE.ShaderMaterial>(null)
    const tex = useTexture('/work-willam-jonshan.jpg')

    const { progress } = useControls({
        progress: { value: 0, min: 0, max: 1, step: 0.001 },
    })

    const uniforms = useRef({
        uTexture: { value: tex },
        uProgress: { value: 0 },
    })


    useEffect(() => {
        uniforms.current.uProgress.value = progress
    }, [progress])


    const vertexShader = `
          uniform float uProgress;

varying vec2 vUv;

#define PI 3.14159265359

float easeInOutQuad(float t) {
  return t < 0.5
    ? 2.0 * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float offset = 1.5 - uv.y;

  float smoothProgress = clamp(
    (uProgress - offset * 0.2) / 0.6,
    0.0,
    1.0
  );

  float eased = easeInOutQuad(smoothProgress);

  vec3 center = vec3(0.0, 0.0, 1.0);
  pos -= center;


  float angle = eased * PI;

  float s = sin(angle);
  float c = cos(angle);

  float y = pos.y;
  float z = pos.z;

  pos.y = c * y - s * z;
  pos.z = s * y + c * z;

  pos.z *= 1.0; // Zoom

  pos += center;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}


        `;

    const fragmentShader = `
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // If we're drawing the back face, flip UV vertically so it matches front
  if (!gl_FrontFacing) {
    uv.y = 1.0 - uv.y;     // vertical fix
    // If your image is mirrored left/right too, also uncomment:
    // uv.x = 1.0 - uv.x;
  }

  gl_FragColor = texture2D(uTexture, uv);
}

        `

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // Effect 1
            gsap.to(uniforms.current.uProgress, {
                value: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#scroll-section',
                    start: 'top center',
                    end: 'top top',
                    scrub: true,
                    markers:true,
                },
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <mesh>
            <planeGeometry args={[6, 4, 256, 256]} />
            <shaderMaterial
                ref={mat}
                side={THREE.DoubleSide}
                transparent
                uniforms={uniforms.current}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    )

}

export default function HorizontalCylinderDemo() {

    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <div
            id="scroll-section"
            ref={sectionRef}
            className="h-screen w-screen bg-black"
        >
            <Canvas camera={{ position: [0, 0, 12], fov: 40 }}>
                <ambientLight intensity={1} />
                <Card />
                <OrbitControls
                    enableZoom={false}
                />
            </Canvas>
        </div>
    )
}
