import { useEffect, useRef, useState } from 'react';
import { Close } from './Icons';
import BilibiliPlayer, { BilibiliLink, PLAYER_ACTIVATED } from './BilibiliPlayer';

export default function VideoPlayer({ work, onClose }) {
  const dialog = useRef(null);
  const video = useRef(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousScroll = { top: window.scrollY, left: window.scrollX };
    const oldOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('video').forEach(element => {
      if (element !== video.current) element.pause();
    });
    document.dispatchEvent(new CustomEvent(PLAYER_ACTIVATED));
    video.current?.play().catch(() => { /* Native controls remain usable if autoplay is blocked. */ });
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus({ preventScroll: true });
      window.scrollTo({ ...previousScroll, behavior: 'instant' });
    };
  }, []);
  return <dialog ref={dialog} className="video-dialog" aria-labelledby="player-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="player-panel"><div className="player-heading"><div><p>{work.category === 'aigc' ? 'AIGC' : '视频作品'} <span>/ {work.role}</span></p><h2 id="player-title">{work.title}</h2></div><button className="close-player" onClick={onClose} aria-label="关闭视频"><Close /><span>关闭</span></button></div>
      {work.bilibiliId ? <BilibiliPlayer work={work} eager /> : <video ref={video} src={work.src} poster={work.poster} controls playsInline preload="metadata" onError={() => setError(true)} aria-label={`${work.title}视频播放器`} />}
      {error ? <p className="playback-error" role="alert">视频暂时无法播放。请检查网络，或<a href={work.src} target="_blank" rel="noreferrer">打开视频文件</a>。</p> : null}
      <div className="player-bottom"><p>{work.description || `${work.type} · ${work.role}`}</p>{work.bilibiliId ? <BilibiliLink work={work} /> : null}<span>按 Esc 返回作品集</span></div>
    </div>
  </dialog>;
}
