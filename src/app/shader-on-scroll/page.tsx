'use client'
import { OrbitControls, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)



export function Plan() {

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture('/image_part_002.jpg');

  const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

  const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uProgress;

  varying vec2 vUv;
  
  void main() {

    float wave = sin(vUv.y * 10.0 + uTime) * 0.06;

    // Scroll-based strength
    wave *= uProgress;

   vec2 distortedUv = vUv;
   distortedUv.x += wave;

   vec4 color = texture2D(uTexture, distortedUv);
   gl_FragColor = color;
  }
`

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  });

  // ScrollTrigger
  useGSAP(() => {
    if (!materialRef.current) return

    gsap.to(materialRef.current.uniforms.uProgress, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scroll-section',
        start: 'top center',
        end: 'top top',
        scrub: true,
        markers: true
      },
    })
  }, [])


  return (
    <mesh>
      <planeGeometry args={[2, 3, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe={false}
        uniforms={{
          uTexture: { value: texture },
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
      />
    </mesh>
  )

}

const Page = () => {
  return (
    <section>
      <div className="min-h-screen bg-amber-50 w-full flex flex-col items-center justify-center">
        <h2>Spacer</h2>
      </div>
      <div className='h-screen w-screen bg-black scroll-section' >
        <Canvas>
          <Plan />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </section>

  )
}

export default Page