import { useEffect, useState } from 'react';
import { navItems } from '../data/portfolio';
import { Arrow } from './Icons';

export default function Header() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = navItems.map(([id]) => document.getElementById(id)).filter(Boolean);
    let frame = 0;
    const update = () => {
      frame = 0;
      // The short contact footer cannot always reach the top of the viewport.
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const marker = Math.max(100, window.innerHeight * 0.25);
      const section = atBottom ? sections.at(-1) : [...sections].reverse().find(item => item.getBoundingClientRect().top <= marker);
      setActive(section?.id || 'home');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return <header className="site-header"><div className="shell header-inner">
    <a className="wordmark" href="#home" aria-label="吴言，回到首页">吴言<span className="wordmark-dot" /></a>
    <nav aria-label="主导航">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{label}{id === 'contact' ? <Arrow diagonal /> : null}</a>)}</nav>
  </div></header>;
}
