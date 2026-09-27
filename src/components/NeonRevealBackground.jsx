import { useEffect, useRef } from 'react';
import './NeonRevealBackground.css';

export default function NeonRevealBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    // A fixed grain texture drifts slowly, without frame-to-frame noise flicker.
    const grain = document.createElement('canvas');
    grain.width = grain.height = 256;
    const grainContext = grain.getContext('2d');
    if (!grainContext) return undefined;
    const pixels = grainContext.createImageData(256, 256);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const value = Math.random() > .8 ? 255 : 0;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
      pixels.data[i + 3] = Math.random() * 75;
    }
    grainContext.putImageData(pixels, 0, 0);
    const pattern = context.createPattern(grain, 'repeat');
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random(), y: Math.random(), radius: .35 + Math.random() * .8,
      speed: .8 + Math.random() * 1.3, phase: Math.random() * Math.PI * 2,
    }));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 1;
    let height = 1;
    let elapsed = 0;
    let previous = 0;
    let frame = 0;
    let visible = false;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.save();
      const drift = Math.sin(elapsed * .035) * 3;
      context.translate(drift, 0);
      context.fillStyle = pattern;
      context.fillRect(-4, 0, width + 8, height);
      context.restore();
      particles.forEach(particle => {
        const x = particle.x * width + Math.sin(elapsed * .09 + particle.phase) * 6;
        const y = ((particle.y * height - elapsed * particle.speed) % height + height) % height;
        const alpha = (.11 + .07 * Math.sin(elapsed * .25 + particle.phase)) * (1 - y / height);
        context.fillStyle = `rgba(255,220,255,${alpha})`;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
    };
    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const tick = time => {
      frame = requestAnimationFrame(tick);
      if (time - previous < 1000 / 24) return;
      elapsed += Math.min(time - previous, 100) / 1000;
      previous = time;
      draw();
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !document.hidden && !motion.matches) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(container);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  return <div ref={containerRef} className="neon-reveal-background" aria-hidden="true">
    <canvas ref={canvasRef} />
  </div>;
}
