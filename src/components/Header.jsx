import { useEffect, useState } from 'react';
import { navItems } from '../data/portfolio';
import { Arrow } from './Icons';

export default function Header() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = navItems.map(([id]) => document.getElementById(id));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <header className="site-header"><div className="shell header-inner">
    <a className="wordmark" href="#home" aria-label="吴言，回到首页">吴言<span className="wordmark-dot" /></a>
    <nav aria-label="主导航">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{label}{id === 'contact' ? <Arrow diagonal /> : null}</a>)}</nav>
  </div></header>;
}
