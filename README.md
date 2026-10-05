# 吴言 · 个人影像作品集

React + Vite 单页网站，首页画廊、视频作品、AIGC、关于我和联系方式向下滚动浏览。页面以 PC 展示为主，适配手机；作品区与个人介绍区随屏幕展开。

## GitHub Desktop → Cloudflare Pages

1. 在 GitHub Desktop 中确认仓库对应桌面「吴言个人简历网站」。将 Changes 中的本次修改全部勾选，填写摘要并 Commit to main，然后 Push origin。
2. 在 GitHub 仓库根目录确认存在 `package.json`、`pnpm-lock.yaml`、`src/`、`public/` 和 `scripts/`。只上传 ZIP 不会替换网站源代码。
3. Cloudflare Pages 连接该 GitHub 仓库，生产分支选择 `main`，构建设置如下：

| 设置 | 值 |
| --- | --- |
| 框架预设 | Vite（或 None / 无） |
| 构建命令 | `pnpm run build` |
| 构建输出目录 | `dist` |
| 根目录 | 留空（仓库根目录） |
| Node.js | `.node-version` 指定 24；如后台有 NODE_VERSION，保持一致 |
| 包管理器 | `package.json` 指定 pnpm 11.19.0；后台可设置 `PNPM_VERSION=11.19.0` |

这是 Cloudflare **Pages** 静态网站，无需填写 Workers 的 `wrangler deploy` 部署命令。Git 关联项目通过 Push 自动触发部署，不需要手动上传 ZIP。部署成功后使用 Pages 项目的公网域名。

如果现有 Pages 项目连接的是其他仓库或该仓库此前被删除后重建，需要在 Cloudflare 确认 GitHub 连接仍有效。本地文件检查不能替代 Cloudflare 后台的连接检查。

## 本地启动与构建

使用 Node.js 24 和 pnpm 11.19.0：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm run build
pnpm preview
```

普通构建输出到 `dist/`，会排除 `public/media/videos/`、`public/media/previews/` 和 `.DS_Store`，并检查每个文件不超过 Cloudflare Pages 的 25 MiB 限制。即使本地保留原视频，构建产物也不会带入这些大文件。

`pnpm run export:cloudflare` 使用相同构建逻辑，额外输出到 `output/cloudflare/`，供直接上传型 Pages 项目使用。Git 部署无需使用此命令或 ZIP。

桌面的 `启动网站.command` 可直接预览已生成的 `dist/`，不需要安装开发依赖；修改源代码后需先重新构建。关闭运行该命令的终端会停止本地服务，本地地址不能供外部长期访问。

## 视频与内容维护

全部 10 部作品均通过 **B站 iframe** 播放，需要联网。首页画廊与作品卡片使用同一份作品数据；《踢开门》以 9:16 展示。视频按点击加载，切换作品或关闭弹窗会移除原播放器。无法加载时可使用「在 B站打开」链接；播放器的画质、登录提示、界面和可用性由 B站控制。

- `src/data/portfolio.js`：作品标题、B站 BV 号、简介、职责、获奖信息及联系方式。
- `src/data/media.json`：视频时长、尺寸与本地封面路径；保留的原视频路径用于未配置 B站时的兼容逻辑，当前作品均已配置 B站。
- `src/components/About.jsx`：个人介绍、教育、经历、实习经历和荣誉。
- `public/media/internship/`：易果文化控股有限公司实习期间的“黄山徽艺小镇”和“鹏友圈”项目截图。
- `src/components/BilibiliPlayer.jsx`：B站播放器及站外打开入口。
- `public/media/posters/`：全部作品封面，必须提交到 Git。
- `public/media/photos/`：证件照、工作照、微信二维码，必须提交到 Git。
- `public/media/background/`：不支持 WebGPU 时使用的本地备用背景。

手机号为 `15055552970`，微信号为 `wyan050317`，均支持复制；二维码可在同页放大。

`node_modules/`、`dist/`、`output/`、本地视频和短预览不提交到 Git。不要把原简历、原视频或账户密钥放入网站公开目录。网站使用系统字体，没有自建后端或数据库，也不需要 API 密钥。

## 交互与兼容

首页画廊支持鼠标拖动、滚轮、左右方向键、回车打开作品，以及触屏轻点和横向滑动；不支持 WebGL 时显示可点击的封面列表。作品卡片保持镂空与边框交互。首页粒子、作品区背景以及关于我区域的碎片效果保持既定配色；不支持 WebGPU 时使用静态备用图。现代 Chrome、Edge、Safari、Firefox 可访问，第三方播放器和 GPU 动效仍受设备及浏览器能力影响。
