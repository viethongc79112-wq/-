import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

// Each video and its project notes share one ChromaGrid surface.
export default function ChromaGrid({ children, radius = 300, damping = 0.45, fadeOut = 0.6 }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const surfaces = [...root.querySelectorAll('.chroma-surface')];
    const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const position = { x: 0, y: 0 };
    let active = false;
    let bounds = [];

    const readBounds = () => { bounds = surfaces.map(surface => surface.getBoundingClientRect()); };
    const renderPosition = () => {
      surfaces.forEach((surface, index) => {
        surface.style.setProperty('--chroma-x', `${position.x - bounds[index].left}px`);
        surface.style.setProperty('--chroma-y', `${position.y - bounds[index].top}px`);
      });
    };
    const move = event => {
      if (!enabled.matches || event.pointerType === 'touch') return;
      readBounds();
      if (!active) {
        position.x = event.clientX;
        position.y = event.clientY;
        renderPosition();
      }
      active = true;
      gsap.to(position, {
        x: event.clientX, y: event.clientY, duration: damping,
        ease: 'power3.out', overwrite: true, onUpdate: renderPosition,
      });
      gsap.to(root, { '--chroma-fade': 0, duration: 0.25, overwrite: true });
    };
    const leave = () => {
      active = false;
      gsap.killTweensOf(position);
      gsap.to(root, { '--chroma-fade': 1, duration: fadeOut, overwrite: true });
    };
    const updateBounds = () => {
      if (!active) return;
      readBounds();
      renderPosition();
    };
    const reset = () => {
      active = false;
      gsap.killTweensOf(position);
      gsap.killTweensOf(root);
      root.style.setProperty('--chroma-fade', '1');
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', updateBounds, { passive: true });
    window.addEventListener('resize', updateBounds, { passive: true });
    window.addEventListener('blur', reset);
    enabled.addEventListener('change', reset);
    return () => {
      reset();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', updateBounds);
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('blur', reset);
      enabled.removeEventListener('change', reset);
    };
  }, [damping, fadeOut]);

  return <div ref={rootRef} className="work-list chroma-grid" style={{ '--chroma-radius': `${radius}px` }}>{children}</div>;
}
