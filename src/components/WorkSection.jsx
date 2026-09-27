import { useState } from 'react';
import { formatDuration } from '../data/portfolio';
import ChromaGrid from './ChromaGrid';
import Particles from './Particles';
import MoltenMetal from './MoltenMetal';
import BilibiliPlayer, { BilibiliLink } from './BilibiliPlayer';
import './WorkSection.css';

function pauseOtherVideos(event) {
  document.querySelectorAll('video').forEach(video => {
    if (video !== event.currentTarget) video.pause();
  });
}

function WorkCard({ work, index }) {
  const [playing, setPlaying] = useState(false);
  return <article className={`work-entry chroma-surface work-${work.id}${work.height > work.width ? ' work-entry-portrait' : ''}`} data-index={String(index + 1).padStart(2, '0')} data-playing={playing}>
    <div className="work-media">
      <div className={`work-video-frame ${work.height > work.width ? 'portrait-video' : ''}`}>
        {work.bilibiliId ? <BilibiliPlayer work={work} /> : <video src={work.src} poster={work.poster} controls playsInline preload="none" onPlay={event => { pauseOtherVideos(event); setPlaying(true); }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} aria-label={`${work.title}作品视频`} />}
      </div>
      {work.bilibiliId ? <BilibiliLink work={work} /> : null}
    </div>
    <div className="project-notes">
      <span className="work-type">{work.type}{work.year ? ` / ${work.year}` : ''}</span>
      <h3>{work.title}</h3>
      <p className="project-description">{work.description}</p>
      <Particles className="project-particles" />
      <p className="work-role"><span className="work-number">{String(index + 1).padStart(2, '0')}</span>{work.role}</p>
      {work.achievement ? <p className="project-achievement">{work.achievement}</p> : null}
      <span className="project-duration">片长 {formatDuration(work.duration)}</span>
    </div>
    <div className="chroma-overlay" aria-hidden="true" />
    <div className="chroma-fade" aria-hidden="true" />
    <div className="chroma-spotlight" aria-hidden="true" />
  </article>;
}

export default function WorkSection({ category, works }) {
  const isAI = category === 'aigc';
  return <section id={category} className={`work-section ${isAI ? 'aigc-section' : ''}`} aria-labelledby={`${category}-heading`}>
    <div className="section-molten-bg"><div className="section-molten-field"><MoltenMetal /></div></div>
    <div className="work-content shell">
    <div className="section-heading"><div className="section-title"><span className="section-number">{isAI ? '02' : '01'} /</span><h2 id={`${category}-heading`}>{isAI ? 'AIGC' : '视频作品'}</h2><span className="work-count">{String(works.length).padStart(2, '0')}</span></div><p>{isAI ? <>从想象出发，让画面发生。<br /><span>生成、制作与剪辑</span></> : <>用镜头观察，用剪辑表达。<br /><span>摄影摄像与后期制作</span></>}</p></div>
    <ChromaGrid>{works.map((work, index) => <WorkCard key={work.id} work={work} index={index} />)}</ChromaGrid>
    </div>
  </section>;
}
