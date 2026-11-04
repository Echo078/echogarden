# Projects & Music 迁移清单

检查日期：2026-11-03。来源为用户提供的旧 Google Sites，逐页读取 23 页；不以模板示例作为真实经历。

## 逐页清单（实现前）

| 旧页 / 来源 | 目标 | 原页媒体 |
| --- | --- | --- |
| [Echo's Music](https://sites.google.com/view/helloecho/echos-music) | `/music` | 0 张图 / 0 视频 |
| [From Waveform to Emotion...](https://sites.google.com/view/helloecho/echos-music/music-production) | `/music/music-production` | 2 张图 / 0 视频 |
| [On the Journey of Sound & Soul...](https://sites.google.com/view/helloecho/echos-music/piano-performance) | `/music/piano-performance` | 2 张图 / 1 视频 |
| [Projects Category](https://sites.google.com/view/helloecho/projects) | `/projects（分类筛选）` | 0 张图 / 0 视频 |
| [Acoustics](https://sites.google.com/view/helloecho/projects/acoustics) | `/projects（分类筛选）` | 1 张图 / 0 视频 |
| [Musical Acoustics Analysis of Instrument Pairings](https://sites.google.com/view/helloecho/projects/acoustics/acoustic-analysis-of-music-pairings) | `/projects/acoustic-analysis-of-music-pairings` | 0 张图 / 0 视频 |
| [Deep Learning](https://sites.google.com/view/helloecho/projects/deep-learning) | `/projects（分类筛选）` | 1 张图 / 0 视频 |
| [Music Genius](https://sites.google.com/view/helloecho/projects/deep-learning/music-genius) | `/projects/music-genius` | 7 张图 / 1 视频 |
| [Hardware - Analog](https://sites.google.com/view/helloecho/projects/hardware-analog) | `/projects（分类筛选）` | 3 张图 / 0 视频 |
| [Harmony Hacker](https://sites.google.com/view/helloecho/projects/hardware-analog/harmony-hacker) | `/projects/harmony-hacker` | 3 张图 / 1 视频 |
| [PA-FLRTRX](https://sites.google.com/view/helloecho/projects/hardware-analog/pa-flrtrx) | `/projects/pa-flrtrx` | 4 张图 / 0 视频 |
| [Design Overview](https://sites.google.com/view/helloecho/projects/hardware-analog/pa-flrtrx/design-overview) | `/projects/pa-flrtrx/design-overview` | 5 张图 / 0 视频 |
| [Hardware Design](https://sites.google.com/view/helloecho/projects/hardware-analog/pa-flrtrx/hardware-design) | `/projects/pa-flrtrx/hardware-design` | 6 张图 / 0 视频 |
| [Next Step](https://sites.google.com/view/helloecho/projects/hardware-analog/pa-flrtrx/next-step) | `/projects/pa-flrtrx/next-step` | 5 张图 / 0 视频 |
| [Schematic & Simulation](https://sites.google.com/view/helloecho/projects/hardware-analog/pa-flrtrx/schematic-simulation) | `/projects/pa-flrtrx/schematic-simulation` | 8 张图 / 0 视频 |
| [Testing](https://sites.google.com/view/helloecho/projects/hardware-analog/pa-flrtrx/testing) | `/projects/pa-flrtrx/testing` | 8 张图 / 0 视频 |
| [Soul Manager](https://sites.google.com/view/helloecho/projects/hardware-analog/soul-manager) | `/projects/soul-manager` | 1 张图 / 1 视频 |
| [Hardware - Digital](https://sites.google.com/view/helloecho/projects/hardware-digital) | `/projects（分类筛选）` | 0 张图 / 0 视频 |
| [Dance After Work](https://sites.google.com/view/helloecho/projects/hardware-digital/dance-after-work) | `/projects/dance-after-work` | 0 张图 / 0 视频 |
| [Ghostless Halloween](https://sites.google.com/view/helloecho/projects/hardware-digital/ghostless-halloween-arcade-shooter-game) | `/projects/ghostless-halloween-arcade-shooter-game` | 1 张图 / 0 视频 |
| [Mechanical & Hardware](https://sites.google.com/view/helloecho/projects/mechanical-hardware) | `/projects（分类筛选）` | 2 张图 / 0 视频 |
| [5GW T-Sticks](https://sites.google.com/view/helloecho/projects/mechanical-hardware/5gw-tsticks) | `/projects/5gw-tsticks` | 16 张图 / 0 视频 |
| [Helispin](https://sites.google.com/view/helloecho/projects/mechanical-hardware/helispin) | `/projects/helispin` | 1 张图 / 0 视频 |

## 当前代码检查

- Next.js 16 / React 19 / Tailwind 4；保留浅绿色、衬线标题、植物背景、半透明卡片及日暮主题。
- `data/projects.ts` 的 8 个示例项目没有旧站依据，将替换为旧站 9 个真实项目。
- `/projects` 有领域、类型和技能筛选，但卡片没有实际链接；没有详情路由。
- `/diary` 是数据库驱动的音频标本页，静态回退包含 5 首无音频文件的虚构示例。正式演奏与录音作品放在 `/music`；保留 `/diary` 的数据库功能，清空虚构回退并提供 Music 入口。
- 首页与导航增加正式 Music 入口；手机菜单原本没有展开逻辑，需补齐。
- 构建配置忽略 TypeScript 错误，因此另运行类型检查并记录已有问题。

## 实施范围

1. 9 张真实项目卡片和详情页，沿用现有筛选设计；时间、分类和简述取自旧站分类页。
2. PA-FLRTRX 5 个技术详情子页，按原顺序展示原始技术图片，保留旧页来源。
3. Music 总览、Piano Performance、Music Production；迁移 Numa Ame 视频、两首混音作品、演奏者与录音制作署名。
4. 可下载图片保存到 `public/portfolio/`，不依赖旧站临时图片链接；原始内容与来源保存在 `data/portfolio-source.json`。
5. YouTube 使用响应式嵌入并提供原址；SoundCloud 尝试解析正式曲目地址，保留外链；Google Drive 报告和录音文档保留入口。
6. 未注明日期、角色、成果的内容不补写。旧站的 “Present / currently / in progress” 视为当时记录，不推断为 2026 年状态。

## 待补素材

- Numa Ame 正式混音与全场录像：旧站写仍在制作中，当前只迁移侧拍视频，不能宣称正式版已完成。
- 两首 SoundCloud 作品没有公开可下载音频；不创建本地音频占位或虚假播放条。
- T-Sticks 和 PA-FLRTRX 多数说明是图片，先完整保留。可编辑技术正文、图片文字替代说明及原始高清文件可后续补充。
- 未公开的独立贡献分工不推断。项目整体介绍保留团队语境。
- Dance After Work：原详情页仅有 GitHub 链接；保留分类页的项目介绍，演示图片与视频待补。
- 外部项目报告和录音文档：保留原始 Drive / Docs 链接，本次没有替代原文档或改动其权限。6 个资源链接均返回 HTTP 200；不等同于所有访客都能下载。

## 实施结果与检查

- 已迁移 9 个项目详情、PA-FLRTRX 5 个技术子页、Music 总览和 2 个子页。
- 76 张原图全部保存到本地；8 张项目缩略图由原图生成；记录于 `docs/portfolio-assets.json`。临时图片令牌过期的问题通过刷新源页面解决。
- 4 个 YouTube 嵌入来自旧页（3 个项目演示 + 1 个钢琴演奏），均保留外链入口。
- 两首 SoundCloud 短链接已解析为正式曲目 URL；oEmbed 返回作品标题与有效播放器信息。自动播放关闭。
- 清空 5 首没有音频文件的模板曲目；保留已配置数据库的声音标本功能。首页相关模板动态替换为原站能核实的月级项目 / 音乐记录，不虚构日期。
- 导航增加 Music，Music 与声音标本互通；手机菜单支持展开、关闭、Escape、当前页指示和语言 / 主题切换。
- 无 Supabase 配置时，仅公开的首页、Projects、Music、Diary 可以本地预览；后台、API、认证和受保护路由仍走原验证。公开音频和留言读取失败时有回退处理。
- `npm run build`：通过，31 个静态页面成功生成。保留模板原有 Google 字体，需要首次构建可联网下载。
- HTTP 验证：20 个相关页面返回 200；3 个无效项目 / 章节路径返回 404；77 个实际展示的本地媒体地址返回图片；项目列表有 9 个有效详情链接。
- `tsc --noEmit`：7 个错误，逐项与原始分支对照完全相同，没有新增错误。原有问题：后台创建音乐 / 博客时类型缺少 date；富文本图片扩展选项、setImage、input ref 类型；SpecimenIllustration 的 style 属性。
- 原有构建警告：`serverActions` 配置位置不受 Next 16 识别；`middleware` 文件约定被弃用。这两项与迁移无关，未扩大修改范围。

## 手机布局与预览

已完成响应式代码审查及适配：项目列表在窄屏单列、筛选行在小屏纵向堆叠、技能标签换行；详情标题可折行；原图按容器宽度缩放并可点击原图；视频随宽度保持 16:9；Music 卡片和录音署名在窄屏纵向排列；桌面导航在 lg 以下切换为可展开菜单；底部信息可换行。

本会话浏览器工具不可用（无可用浏览器，原生电脑服务启动失败），因此**未完成真实手机视口的截图、交互和视觉验收**。以上是代码与 HTTP 检查，不能替代浏览器测试。第三方播放器的实际音视频播放也需在浏览器中确认。

本地生产预览：`http://127.0.0.1:3000/projects`、`http://127.0.0.1:3000/music`。重新启动：`npm run build` 后运行 `npm run start -- --hostname 127.0.0.1 --port 3000`。

本次只迁移 Projects / Music 及相关入口；About、Research、CV、Blog、Knowledge 的其他模板内容不属于本次事实核对范围。
