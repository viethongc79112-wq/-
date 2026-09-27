import BorderGlow from './BorderGlow';

export default function About() {
  return <section id="about" className="about-section shell" aria-labelledby="about-heading">
    <div className="section-heading"><div className="section-title"><span className="section-number">03 /</span><h2 id="about-heading">关于我</h2></div><span className="about-place">安徽 · 芜湖</span></div>
    <div className="about-layout"><BorderGlow className="about-photo-glow" backgroundColor="#141217" borderRadius={4} glowRadius={24} glowIntensity={0.64} edgeSensitivity={28} colors={['#a855f7', '#38bdf8', '#ec4899']} fillOpacity={0.16}>
      <figure className="working-photo"><img src="/media/photos/working.jpg" alt="吴言在海边逆光中手持相机拍摄" loading="lazy" /><figcaption><span>镜头之后</span><span>吴言 / 工作时刻</span></figcaption></figure>
    </BorderGlow>
        <div className="about-content"><div className="bio-top"><div><p className="bio-intro">你好，我是吴言。</p><p className="bio-lead">在真实与想象之间，<br />寻找影像的表达。</p></div><img className="portrait" src="/media/photos/portrait.jpg" alt="吴言的个人肖像" loading="lazy" /></div>
          <p className="bio-text">就读于安徽师范大学影视摄影与制作专业，预计2027年毕业。从纪录片、现场拍摄到后期剪辑，也从脚本出发，探索 AIGC 影像的制作与表达。</p>
          <p className="bio-text">拍摄让我走近真实，剪辑让我梳理叙事，AIGC 则为想象提供另一种可能。</p>
          <div className="bio-facts"><div><span className="fact-label">教育背景</span><div><h3>安徽师范大学</h3><p>影视摄影与制作 · 本科在读 · 2027届</p></div></div>
            <div><span className="fact-label">工作实践</span><div><h3>镜界影像工作室 · 兼职摄像师</h3><p>2025.05 — 至今 · 累计参与30场婚礼拍摄</p><h3>学院新媒体中心 · 视频部部长</h3><p>2024.01 — 2025.01 · 组织12人团队完成30余项视频任务</p></div></div>
            <div><span className="fact-label">作品发布</span><div><h3>《踢开门》· 独立完成</h3><p>发布于 CMG中央广播电视总台安徽总站 · 累计播放量82万</p><h3>《向未来生长》· 安徽师范大学2026年招生宣传片</h3><p>负责第三篇章脚本设计、AIGC画面生成及后期剪辑。整片视频号数据：点赞800+ · 转发900+ · 推荐600+</p></div></div>
            <div><span className="fact-label">参赛作品</span><div><h3>《和合天下》· 导演、主制作、联合剪辑</h3><p>作品已完成，目前参赛中。</p></div></div>
            <div><span className="fact-label">代表荣誉</span><div><h3>第八届全国大学生数字编辑创新大赛 · 安徽赛区二等奖</h3><p>《遇见长广，育见希望》</p><h3>NCDA 未来设计师大赛 · 安徽赛区一等奖</h3><p>《转身即是出征》</p><h3>平遥国际摄影大展 · 入选作品</h3><p>《油菜梯田》· 2025</p><h3>安徽省大学生摄影大赛 · 三等奖</h3><p>2025</p></div></div>
          </div>
        </div>
      </div>
  </section>;
}
