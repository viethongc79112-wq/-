import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import './LowerBackground.css';

const AeroShards = lazy(() => import('./AeroShards'));

export default function LowerBackground({ paused }) {
  const container = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);

  useEffect(() => {
    // Load the GPU code only as the visitor approaches the lower page.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setMounted(true);
      observer.disconnect();
    }, { rootMargin: '300px' });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={container} className="lower-background" aria-hidden="true" data-renderer={failed ? 'static' : 'webgpu'}>
    <div className="lower-background-field">
      <img className="shards-fallback" src="/media/background/shards-static.svg" alt="" loading="lazy" />
      {mounted && !failed ? <Suspense fallback={null}><AeroShards
        backgroundColor="#120F17"
        shardColor="#896ABD"
        accentColor="#A855F7"
        placement="full"
        flow="stream"
        material="pearl"
        detail="fine"
        density={1.02}
        shardSize={0.92}
        spread={0.92}
        depth={1.2}
        stretch={1}
        speed={0.6}
        spin={0.85}
        turbulence={1}
        glow={0.82}
        bloom={0.38}
        grain={0.025}
        chromaticAberration={0.0055}
        interaction="repel"
        interactionStrength={0.2}
        rippleIntensity={0.25}
        holdToGather={false}
        paused={paused}
        onError={onError}
      /></Suspense> : null}
    </div>
  </div>;
}
