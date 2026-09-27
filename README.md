# 吴言 · 个人影像作品集

React + Vite 单页网站，PC 优先，最大版心 **1700px**。首页多帧精选作品、视频作品、AIGC、个人介绍和联系方式按纵向展开。

## 本地启动

Node.js 20.19+ 或 22.12+，使用 pnpm：

```bash
pnpm install
pnpm dev
```

打开终端显示的本地地址。构建及预览：

```bash
pnpm build
pnpm preview
```

当前桌面环境也可以直接运行 `scripts/dev-local.sh`，它会使用系统 Node/pnpm，或回退到本机 Codex 自带运行时。

## 内容维护

- `src/data/portfolio.js`：联系方式、项目标题、职责、分类。
- `src/data/media.json`：实际视频时长、尺寸、资源路径。
- `src/components/About.jsx`：个人介绍、经历和荣誉。
- `src/styles.css`：颜色、1700px 版心、排版与响应式断点。
- `public/media/posters/`：作品封面。
- `public/media/photos/`：肖像、工作照、微信二维码。
- `public/media/videos/`：完整视频的网页 MP4 副本。
- `public/media/previews/`：首页无声短预览。

联系区已配置微信 `wyan050317`、简历手机号及用户提供的真实二维码；支持复制和同页放大。页面不显示邮箱。

## 视频资源

已生成网页副本，不修改桌面原文件。完整视频点击后才加载；首页只播放约 1MB 的无声预览。播放器使用原生控制，支持全屏、进度、暂停、Escape 关闭，关闭后恢复原滚动位置和键盘焦点。首页仅选择四部 AIGC 加《云南风光》《香格里拉》，《侠客》仍在 AIGC 区展示。

大视频不进入 Git。当前本地目录和构建产物已包含媒体，复制项目到其他机器时需要同时复制 `public/media/videos/` 与 `public/media/previews/`。部署时上传整个 `dist/`，服务器应支持 MP4 Range 请求。

需要从原素材重新生成时：

```bash
python3 -m pip install Pillow imageio-ffmpeg
python3 scripts/prepare_media.py '/素材目录/作品集'
```

该脚本为当前 macOS 环境使用 VideoToolbox 硬件编码，现有生成文件会被保留。需要更换某张封面时，先移走该封面后重新执行。工作照通过 EXIF 自动校正方向。微信二维码按当前提供图片的实际范围裁切，保留白色静区；替换新二维码时直接替换 `public/media/photos/wechat-qr.png`，不要套用旧裁切参数。

本项目不依赖外部字体、分析服务或在线素材 API。

## 下半页碎片背景

“关于我”与“联系我”共用用户提供的 AeroShards 效果，使用 `vgpu` 在浏览器中绘制。`src/components/background/LowerBackground.jsx` 保留原始深紫背景、紫色碎片、紫色高光与珍珠材质，集中配置慢速流动及交互强度；相邻 CSS 文件控制遮罩和位置。

碎片以全宽流线覆盖下半页，采用更高密度、更宽分布和原始彩色边缘折射，保留原始紫色。组件接近视口后才加载，离屏或页面隐藏时停止绘制；打开作品视频时暂停。尊重系统减少动态设置，不支持 WebGPU 时使用本地静态碎片图。效果层不拦截链接、复制按钮或二维码的点击。
