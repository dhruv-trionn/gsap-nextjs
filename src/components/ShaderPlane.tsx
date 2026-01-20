'use client'

import { OrbitControls, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'



function Plane() {
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
  uniform vec2 uMouse;
  uniform float uHover;

  varying vec2 vUv;
  
  void main() {

    // Distance from mouse
    float dist = distance(vUv, uMouse);

    // Distortion strength
    float ripple = sin(dist * 20.0 - uTime * 4.0) * 0.03;

    // Fade effect by distance + hover
    ripple *= smoothstep(0.6, 0.0, dist) * uHover;

    vec2 distortedUv = vUv;
    distortedUv += ripple;

    vec4 image = texture2D(uTexture, distortedUv);
    gl_FragColor = image;
  }
`;

const glitchEffectFragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;

varying vec2 vUv;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

  vec2 uv = vUv;

  // Horizontal glitch lines
  float glitchLine = step(0.95, random(vec2(uTime * 2.0, uv.y)));

  // Distortion strength
  float strength = 0.03 * uHover;

  // Offset only when glitch line exists
  uv.x += glitchLine * strength;

  // RGB split
  vec4 r = texture2D(uTexture, uv + vec2(strength, 0.0));
  vec4 g = texture2D(uTexture, uv);
  vec4 b = texture2D(uTexture, uv - vec2(strength, 0.0));

  gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
}

`

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture('/image_part_002.jpg');


  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={[0, 0, 0]}

      onPointerMove={(e) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uMouse.value.copy(e.uv)
        }
      }}

      onPointerEnter={() => {
        if (materialRef.current) {
          gsap.to(materialRef.current.uniforms.uHover, {
            value: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        }
      }}

      onPointerLeave={() => {
        if (materialRef.current) {
          gsap.to(materialRef.current.uniforms.uHover, {
            value: 0,
            duration: 0.4,
            ease: 'power2.out',
          })
        }
      }}

    >
      <planeGeometry args={[3, 3]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={glitchEffectFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uTexture: { value: texture },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uHover: { value: 0 },
        }}
      />
    </mesh>
  )
}

const Box = () => {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useTexture('/image_part_002.jpg');

  useMemo(() => {

    texture.colorSpace = THREE.SRGBColorSpace // Always do this for color textures:
    texture.anisotropy = 16 // Improves sharpness at angles.

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)

  }, [texture])

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial ref={materialRef} map={texture} />
    </mesh>
  )
}

export default function ShaderPlane() {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas>
        <Plane />
        {/* <Box /> */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}

