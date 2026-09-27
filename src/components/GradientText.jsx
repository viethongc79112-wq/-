import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ['#8b5cf6', '#f0abfc', '#9edff8'],
  animationSpeed = 10,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true
}) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animationDuration = animationSpeed * 1000;

  useAnimationFrame(time => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;
    if (yoyo) {
      const cycleTime = elapsedRef.current % (animationDuration * 2);
      progress.set(cycleTime < animationDuration
        ? (cycleTime / animationDuration) * 100
        : 100 - ((cycleTime - animationDuration) / animationDuration) * 100);
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationDuration, progress, yoyo]);

  const backgroundPosition = useTransform(progress, p => {
    if (direction === 'vertical') return `50% ${p}%`;
    return `${p}% 50%`;
  });
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);
  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);
  const angle = direction === 'vertical' ? 'to bottom' : direction === 'diagonal' ? 'to bottom right' : 'to right';
  const gradientColors = [...colors, colors[0]].join(', ');
  const gradientImage = `linear-gradient(${angle}, ${gradientColors})`;
  const gradientSize = direction === 'vertical' ? '100% 300%' : '300% 300%';
  const gradientStyle = {
    backgroundImage: gradientImage,
    backgroundSize: gradientSize,
    backgroundRepeat: 'repeat',
    backgroundPosition,
    '--gradient-image': gradientImage,
    '--gradient-size': gradientSize,
    '--gradient-position': backgroundPosition
  };

  return <motion.div
    className={`animated-gradient-text ${showBorder ? 'with-border' : ''} ${className}`.trim()}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{ '--gradient-image': gradientImage, '--gradient-size': gradientSize, '--gradient-position': backgroundPosition }}
  >
    {showBorder ? <motion.div className="gradient-overlay" style={gradientStyle} /> : null}
    <motion.div className="text-content" style={gradientStyle}>{children}</motion.div>
  </motion.div>;
}
