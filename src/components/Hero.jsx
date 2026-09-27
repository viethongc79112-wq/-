import { useCallback, useMemo } from 'react';
import { byId, heroIds, profile } from '../data/portfolio';
import { Arrow } from './Icons';
import CircularGallery from './CircularGallery';
import BorderGlow from './BorderGlow';
import NeonRevealBackground from './NeonRevealBackground';

export default function Hero({ onPlay }) {
  const items = useMemo(() => heroIds.map(id => ({
    id,
    image: byId[id].poster,
    text: byId[id].title
  })), []);
  const handleGalleryClick = useCallback(id => onPlay(byId[id]), [onPlay]);

  return <section className="hero shell" id="home" aria-labelledby="hero-title">
    <NeonRevealBackground />
    <div className="hero-heading">
      <div className="name-block">
        <h1 id="hero-title">{profile.name}<span className="name-period">.</span></h1>
        <span className="name-roman" aria-hidden="true">WU YAN</span>
      </div>
      <div className="hero-identity">
        <p>{profile.role}</p>
        <div><span>影像作品与个人介绍</span><span className="tiny-cross" aria-hidden="true">+</span></div>
      </div>
    </div>

    <div className="hero-spiral-layout">
      <div className="hero-spiral-copy">
        <span className="spiral-index">作品画廊 / {String(items.length).padStart(2, '0')}</span>
        <p>沿着时间与想象，浏览我的影像片段。</p>
        <span className="spiral-hint">拖动或滚轮浏览</span>
      </div>
      <BorderGlow className="hero-gallery-glow" backgroundColor="transparent" borderRadius={0} glowRadius={22} glowIntensity={0.65} edgeSensitivity={24} colors={['#c084fc', '#f472b6', '#38bdf8']} fillOpacity={0.18}>
        <div className="hero-spiral-frame" aria-label={`全部${items.length}部作品弧形展示`}>
          <CircularGallery
            items={items}
            bend={2.4}
            textColor="#eceeea"
            borderRadius={0.035}
            font="bold 24px 'PingFang SC'"
            scrollSpeed={1.7}
            scrollEase={0.075}
            onItemClick={handleGalleryClick}
          />
        </div>
      </BorderGlow>
    </div>

    <div className="hero-footer">
      <span className="film-index"><span className="signal-dot" />动态作品流</span>
      <a className="scroll-hint" href="#video">向下探索<Arrow down /></a>
    </div>
  </section>;
}
