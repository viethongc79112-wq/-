import { useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';
import './Particles.css';

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vRandom = random;
    vColor = color;
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = uSizeRandomness == 0.0 ? uBaseSize : (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord.xy - vec2(0.5));
    float alpha = (1.0 - smoothstep(0.35, 0.5, d)) * 0.8;
    gl_FragColor = vec4(vColor + 0.16 * sin(gl_PointCoord.yxx + uTime + vRandom.y * 6.28), alpha);
  }
`;
const DEFAULT_PARTICLE_COLORS = ['#ffffff', '#ffffff', '#ffffff'];

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const int = parseInt(value.length === 3 ? value.split('').map(c => c + c).join('') : value, 16);
  return [(int >> 16 & 255) / 255, (int >> 8 & 255) / 255, (int & 255) / 255];
}

export default function Particles({
  particleCount = 160,
  particleSpread = 10,
  speed = 0.08,
  particleColors = DEFAULT_PARTICLE_COLORS,
  particleBaseSize = 70,
  sizeRandomness = 1,
  cameraDistance = 20,
  className = ''
}) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !visible) return undefined;
    let renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 1.5), depth: false, alpha: true });
    } catch {
      return undefined;
    }
    const gl = renderer.gl;
    if (!gl) return undefined;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);
    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);
    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount * 4);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      let x, y, z, len;
      do { x = Math.random() * 2 - 1; y = Math.random() * 2 - 1; z = Math.random() * 2 - 1; len = x * x + y * y + z * z; } while (len > 1 || len === 0);
      const radius = Math.cbrt(Math.random());
      positions.set([x * radius, y * radius, z * radius], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      colors.set(hexToRgb(particleColors[Math.floor(Math.random() * particleColors.length)]), i * 3);
    }
    const geometry = new Geometry(gl, { position: { size: 3, data: positions }, random: { size: 4, data: randoms }, color: { size: 3, data: colors } });
    const program = new Program(gl, {
      vertex, fragment,
      uniforms: { uTime: { value: 0 }, uSpread: { value: particleSpread }, uBaseSize: { value: particleBaseSize * renderer.dpr }, uSizeRandomness: { value: sizeRandomness } },
      transparent: true, depthTest: false
    });
    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    let frame;
    let last = performance.now();
    let elapsed = 0;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = time => {
      frame = requestAnimationFrame(update);
      elapsed += Math.min(time - last, 64) * speed;
      last = time;
      program.uniforms.uTime.value = elapsed * 0.001;
      particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
      particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
      particles.rotation.z = elapsed * 0.0006;
      renderer.render({ scene: particles, camera });
    };
    const syncAnimation = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !motionPreference.matches) {
        last = performance.now();
        frame = requestAnimationFrame(update);
      }
    };
    const resizeObserver = new ResizeObserver(() => {
      resize();
      renderer.render({ scene: particles, camera });
    });
    resizeObserver.observe(container);
    resize();
    renderer.render({ scene: particles, camera });
    syncAnimation();
    document.addEventListener('visibilitychange', syncAnimation);
    motionPreference.addEventListener('change', syncAnimation);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', syncAnimation);
      motionPreference.removeEventListener('change', syncAnimation);
      geometry.remove();
      program.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, [visible, cameraDistance, particleBaseSize, particleColors, particleCount, particleSpread, sizeRandomness, speed]);

  return <div ref={containerRef} className={`particles-container ${className}`} aria-hidden="true" />;
}
