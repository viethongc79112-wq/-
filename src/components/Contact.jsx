import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/portfolio';
import { Arrow } from './Icons';
import BorderGlow from './BorderGlow';

export default function Contact() {
  const [message, setMessage] = useState('');
  const timer = useRef(null);
  const qrDialog = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy(value, label) {
    try { await navigator.clipboard.writeText(value); setMessage(`${label}已复制`); }
    catch { setMessage(`暂时无法复制，请手动复制：${value}`); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setMessage(''), 4000);
  }
  return <footer id="contact" className="contact-section shell" aria-labelledby="contact-heading">
    <div className="contact-top"><div><span className="section-number">04 /</span><h2 id="contact-heading">联系我<Arrow diagonal /></h2></div><p>关于影像，期待与你交流。</p></div>
    <div className="contact-details"><div className="contact-item"><span>手机</span><div><a className="phone" href={`tel:${profile.phone}`}>{profile.phone}</a><button className="copy-button" onClick={() => copy(profile.phone, '手机号')}>复制</button></div></div>
        <div className="contact-item"><span>微信</span>{profile.wechat ? <button className="wechat-value" onClick={() => copy(profile.wechat, '微信号')}>{profile.wechat}<span>复制</span></button> : <p className="contact-missing">微信号暂未提供</p>}</div>
        <div className="qr-area">{profile.wechatQr ? <><BorderGlow className="qr-glow" backgroundColor="#141217" borderRadius={4} glowRadius={16} glowIntensity={0.68} edgeSensitivity={25} colors={['#38bdf8', '#a855f7', '#f472b6']} fillOpacity={0.18}><button className="qr-button" onClick={() => qrDialog.current.showModal()} aria-label="放大微信二维码"><img src={profile.wechatQr} alt="吴言的微信二维码" loading="lazy" /></button></BorderGlow><span>微信扫码联系 · 点击放大</span></> : <p className="contact-missing">微信二维码暂未提供</p>}</div>
    </div>
    <div className="copy-feedback" role="status" aria-live="polite">{message}</div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} 吴言</span><span>摄像 / 剪辑 / AIGC制作</span><a href="#home">回到顶部<Arrow down className="arrow-up" /></a></div>
    {profile.wechatQr ? <dialog className="qr-dialog" ref={qrDialog} aria-label="微信二维码" onClick={event => { if (event.target === qrDialog.current) qrDialog.current.close(); }}><div><img src={profile.wechatQr} alt="吴言的微信二维码，放大版" /><p>{profile.wechat}</p><button onClick={() => qrDialog.current.close()}>关闭二维码</button></div></dialog> : null}
  </footer>;
}
