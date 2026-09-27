import { useEffect, useState } from 'react';
import { works } from './data/portfolio';
import Header from './components/Header';
import Hero from './components/Hero';
import WorkSection from './components/WorkSection';
import About from './components/About';
import Contact from './components/Contact';
import VideoPlayer from './components/VideoPlayer';
import LowerBackground from './components/background/LowerBackground';
import GradientText from './components/GradientText';

const videoWorks = works.filter(work => work.category === 'video');
const aiWorks = works.filter(work => work.category === 'aigc');

export default function App() {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('enter-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.work-entry, .section-heading, .about-layout, .contact-top').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <GradientText className="site-gradient" colors={['#E9E4DA', '#B5D3CE', '#B7B5D9']} animationSpeed={16}>
    <a className="skip-link" href="#video">跳至作品</a><Header /><main><Hero onPlay={setSelected} modalOpen={!!selected} /><WorkSection category="video" works={videoWorks} /><WorkSection category="aigc" works={aiWorks} /><div className="lower-page"><LowerBackground paused={!!selected} /><About /><Contact /></div></main>{selected ? <VideoPlayer key={selected.id} work={selected} onClose={() => setSelected(null)} /> : null}
  </GradientText>;
}
