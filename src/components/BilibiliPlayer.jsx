import { useEffect, useRef, useState } from 'react';
import './BilibiliPlayer.css';

export const PLAYER_ACTIVATED = 'portfolio:player-activated';

export default function BilibiliPlayer({ work, eager = false }) {
  const [active, setActive] = useState(eager);
  const instance = useRef({});

  useEffect(() => {
    if (eager) return;
    const reset = event => {
      if (event.detail !== instance.current) setActive(false);
    };
    // Removing the cross-origin iframe stops playback without relying on an undocumented API.
    document.addEventListener(PLAYER_ACTIVATED, reset);
    document.addEventListener('play', reset, true);
    return () => {
      document.removeEventListener(PLAYER_ACTIVATED, reset);
      document.removeEventListener('play', reset, true);
    };
  }, [eager]);

  function activate() {
    document.querySelectorAll('video').forEach(video => video.pause());
    document.dispatchEvent(new CustomEvent(PLAYER_ACTIVATED, { detail: instance.current }));
    setActive(true);
  }

  return <div className={`bilibili-player${work.height > work.width ? ' bilibili-player-portrait' : ''}`}>
    {active ? <iframe
      src={`https://player.bilibili.com/player.html?isOutside=true&bvid=${encodeURIComponent(work.bilibiliId)}&page=1&autoplay=0`}
      title={`${work.title} · B站视频播放器`}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    /> : <button className="bilibili-cover" onClick={activate} aria-label={`播放${work.title}（B站）`}>
      <img src={work.poster} alt="" loading="lazy" />
      <span className="bilibili-play-label"><span aria-hidden="true">▶</span> 点击加载 B站播放器</span>
    </button>}
  </div>;
}

export function BilibiliLink({ work }) {
  return <a className="bilibili-link" href={`https://www.bilibili.com/video/${work.bilibiliId}/`} target="_blank" rel="noopener noreferrer">在 B站打开 ↗</a>;
}
