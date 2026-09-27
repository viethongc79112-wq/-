# 吴言个人网站 Implementation Plan

> Inline execution in current session; use executing-plans, React best practices and browser verification.

**Goal:** 实现已确认的单页作品网站，React + Vite，PC 1700px 最大版心。

**Architecture:** 集中数据驱动作品列表，首页、作品区、个人介绍、联系区独立组件。原生 dialog 管理可访问视频播放，CSS 管理响应式和减少动态偏好。离线脚本准备媒体副本。

**Tech Stack:** React、Vite、CSS、Node、Python/FFmpeg 资产处理。

- [x] 素材准备：检测编解码/时长，导出全作品网页 MP4、封面与首页短预览；证件照和工作照生成网页副本；保存实际元信息至 src/data/media.json。
- [x] 基础工程：package.json 配置 dev/build/preview；入口 index.html、src/main.jsx；src/styles.css 统一颜色、1700px 版心、字体及间距。
- [x] 页面组件：Header、Hero、WorkSection、About、Contact；src/data/portfolio.js 维护标题、职责、分组、联系资料。
- [x] 播放：VideoPlayer 使用 dialog.showModal；原生 controls；Escape/关闭/遮罩退出；恢复焦点和滚动；加载失败提供明确提示与文件链接。
- [x] 验证：pnpm build 成功；浏览器 1920px PC、1440px PC、390px 手机无横向溢出；10部作品均 readyState 4、time>0、error=null；6幅首页不含侠客；关闭保留位置；微信复制、导航、二维码放大/退出均通过。
- [x] 交付：README 记录启动、媒体导入、联系资料更新；本地预览已启动。
