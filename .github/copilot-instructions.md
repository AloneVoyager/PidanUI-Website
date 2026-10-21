# Copilot Instructions

> 本文件仅适用于 **PidanUIWebsite_VitePress**（PidanUI 官网）仓库，请勿套用到其他相关项目（如 StarLight-7693-New、EggyUI 系列）。

## 项目指南

### 交互与视觉（硬性规则）
- 搜索对话框应立即关闭原生 dialog，并由 CSS 对其离场视觉状态做过渡；不要通过 JS 等待动画结束后才调用 close()。
- 项目移动端左右侧栏菜单按钮使用相同的圆形品牌色样式，仅图标不同（左侧 `fa-bars`，右侧 `fa-table-columns`）。
- 新增动效必须遵循系统「减少动态效果」偏好，补 `@media (prefers-reduced-motion: reduce)` 分支。
- 悬浮反馈以颜色、阴影、发光为主，保持克制：卡片封面可轻微 `scale`（如 `1.04`），不要新增大位移、旋转等夸张效果。

### 一致性
- 新闻、分类、标签列表页**必须复用同一套卡片机制**（`PostCard` + `CardGrid` + `Pagination` + `usePagedPosts`），只有归档页例外（按年分页 + 按月折叠分组）。
- 左右移动端抽屉必须行为一致（同一份全局状态与手势实现，见 `useMobileDrawer.ts`），不要单独为某一侧写特例逻辑。

## 项目概况

| 项 | 值 |
| --- | --- |
| 定位 | PidanUI 项目官网，纯静态站点（SSG），部署于 GitHub Pages |
| 线上地址 | https://pidanui.eggycore.top（`app.baseURL = '/'`，URL 不带 `.html` 与尾斜杠） |
| 技术栈 | Nuxt `4.6.2`（Vite 8 + Nitro 预渲染）+ Vue 3 + TypeScript `~7.0.2` + Tailwind CSS `4.3.3`（原生 CSS）+ @nuxt/content `3.16.2` |
| 包管理器 | pnpm（`packageManager: pnpm@12.11.2`），CI 用 `pnpm install --frozen-lockfile` |
| 发布流程 | 推送到 `main` → `.github/workflows/deploy.yml` 构建并部署 `.output/public` |
| 许可证 | AGPL v3，禁止商业用途 |

## 常用命令

```bash
pnpm dev                       # 本地开发（默认 http://localhost:3000）
pnpm build                     # 生产构建 = nuxt generate，产物在 .output/public
pnpm preview                   # 预览（静态模式下需另配静态服务器，见下）
pnpm exec nuxt prepare         # 生成 .nuxt 类型与别名（改 nuxt.config 后手动跑一次）
```

- **构建必须零错误零警告**。`nitro.prerender.failOnError: true`，任何路由 404 都会让构建失败。
- `nuxt generate` 只产出 `.output/public`（没有 `.output/server`），因此 `pnpm preview` 不可用；本地验收静态站点请用任意支持「无扩展名 → `.html` 回退」的静态服务器。
- 项目没有单元测试，验收方式：`pnpm build` 通过 + 浏览器实看页面。

## 目录结构

```
app/                                  # srcDir
├─ app.vue                            # <NuxtLayout><NuxtPage /></NuxtLayout>
├─ error.vue                          # 404 / 错误页（保留站点外壳）
├─ router.options.ts                  # scrollBehavior：禁止 window 滚动，改滚 .site-main
├─ layouts/default.vue                # 全站壳层：进度条 + 左右栏 + 主滚动区 + 搜索弹窗
├─ pages/                             # 路由即布局（见「路由与页面机制」）
├─ components/
│  ├─ content/                        # Prose 覆盖：ProsePre / ProseH2 / ProseH3
│  ├─ views/                          # 13 个页面视图 + 共用外壳 ListView
│  └─ *.vue                           # SiteSidebar / SiteRightBar / PostCard / CardGrid …
├─ composables/                       # usePosts / useSearch / useTheme / useMobileDrawer …
├─ data/                              # download.json、personalityTest.ts、socialLinks.ts
├─ utils/base.ts                      # withBase 垫片（自动导入）
└─ assets/styles/                     # 全局 CSS（入口 index.css）+ tokens.css（@theme 令牌）
content/posts/*.md                    # 文章（唯一内容源）
public/                               # 原样拷贝的静态资源：images/、giscus/、.nojekyll …
server/routes/                        # atom.xml、api/posts.json、api/posts/<slug>/index.json、api/search.json
shared/                               # site.ts（SITE / PAGE_SIZE / GISCUS）、types/、utils/
build/post-index.ts                   # 构建期 fs 枚举：prerender 路由全集
content.config.ts / nuxt.config.ts    # 内容集合定义 / 站点配置
```

不要提交 `.nuxt/`、`.output/`、`.data/`、`debug.log` 等产物与日志（已在 `.gitignore`）。

## 路由与页面机制

- **路由 = 文件**，不再有 `frontmatter.layout` 分派。新页面：在 `app/pages/` 建 `.vue` → 渲染对应 view 组件 → 用 `usePageSeo` 写标题描述。
- 路由表（保持旧 URL 不变）：

| URL | 文件 |
| --- | --- |
| `/`、`/about`、`/download`、`/personality-test`、`/search/` | `pages/index.vue` 等单文件 |
| `/posts/`、`/posts/page/:n`、`/posts/:slug` | `pages/posts/index.vue`、`posts/page/[page].vue`、`posts/[slug].vue` |
| `/archives/`、`/archives/page/:n` | `pages/archives/index.vue`、`archives/page/[page].vue`（第 n 页 = 第 n 个年份） |
| `/categories/`、`/categories/:name`、`/categories/:name/page/:n` | `pages/categories/**` |
| `/tags/`、`/tags/:name`、`/tags/:name/page/:n` | `pages/tags/**` |

- 站内链接一律用 `<NuxtLink :to>`；**严禁裸 `<a href>` 指向站内路由**——Nuxt 不拦截裸链接，会退化成整页刷新，页面过渡与进度条全部失效。
- 拼链接用 `withBase()`（自动导入）或 `shared/utils/term.ts` 的 `termPath` / `termPagePrefix`；分类、标签名必须 `encodeURIComponent`。
- **预渲染路由必须显式登记**：`build/post-index.ts` 的 `buildRoutes()` 由 `nuxt.config.ts` 的 `hooks['prerender:routes']` 注入。新增一类页面（比如按作者归档）时务必同步这里，否则产物里没有该页。
- 中文 term 传给 `prerender:routes` 时用原始 UTF-8（`/categories/公告`），不要预先编码，否则产物文件名会变成 `%E5%85%AC...`。
- `nitro.prerender.autoSubfolderIndex: false`：`/about` 落成 `about.html`，URL 不需要尾斜杠（giscus 的 pathname 映射依赖这一点，别随意改）。

## 内容与数据

- 文章 frontmatter：`title`、`date`（`YYYY-MM-DD HH:mm:ss`）、`categories`、`tags`、`description`、`stickypost`（仅 `true` 才置顶）、`cover`（可外链）。字段类型在 `content.config.ts` 用 zod 声明，**新增字段先改 schema**。
- `date` 由 YAML 1.2 解析为字符串，**必须**经 `shared/utils/date.ts` 的 `parsePostDate()` 按 UTC 解释，否则构建机时区不同会导致日期/年份漂移。
- 默认封面是 `/images/default_cover.webp`（webp），缺失时由 `toBasePost` 兜底。
- 数据链路：`server/routes/api/posts.json.ts`（轻量列表）与 `api/posts/<slug>/index.json`（单篇含正文）在构建期查询内容库并预渲染成静态 JSON；前端通过 `useAllPosts()` / `fetchAllPosts()` 读取。**不要在组件里直接调 `queryCollection`**——预渲染阶段拿不到请求上下文。
- 列表分页统一 `usePagedPosts(getCurrent, getSource)`，`PAGE_SIZE` 在 `shared/site.ts`（构建期枚举与前端共用同一常量）。
- 站点信息、Giscus 配置在 `shared/site.ts`；社交渠道在 `app/data/socialLinks.ts`，增删渠道只改数据。
- 文章内增强由 `usePostEnhance.ts` 在客户端完成（`[TOC]` 目录、页内锚点接管、代码块复制），是纯渐进增强：禁用 JS 时正文仍可读。

## 样式约定

- 全局样式只有 `app/assets/styles/index.css`（tokens / base / layout / sidebar / post / animation / responsive），页面级样式写在各自 `.vue` 的 `<style scoped>`，**一律原生 CSS**（无预处理器）。
- `index.css` 顶部四条铁律：`@import` 必须全部置顶，Tailwind 两条排在项目文件之前；项目局部文件**故意不进 `@layer`**（未分层规则优先级恒高于分层规则，语义类层叠关系与迁移前一致）；不引入 Preflight（保留 `base.css` 自己的重置）；`@theme` / `@custom-variant` 只写在 `tokens.css`。
- 设计令牌在 `tokens.css`（必须 `@theme static`，否则未被工具类引用的变量会被摇树删掉）：圆角 / 阴影 / 断点 / 容器宽度只定义一次，直接 `var()` 取用；颜色与字体的**真值**只在 `base.css` 的 `:root`（深色覆盖也在那里），`tokens.css` 只做 1:1 别名，别名里不写死颜色。
- 工具类只做「增量修饰」：加工具类时必须同时删掉语义类里被取代的声明，否则未分层的语义类会压住它。当前用到工具类的地方很少（ChipsNav / PostCard / Pagination / HomeView 等）。
- 深色规则两种写法都要考虑：`[data-theme='dark']`（手动切换）与 `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) … }`（auto 跟随系统）；工具类可用 `dark:` 变体（`tokens.css` 已定义 `@custom-variant dark`）。
- 媒体查询**手写** `@media (max-width: Npx)`，不用 `sm:` / `md:` 变体：960px 必须与 `useMobileDrawer` 的 `matchMedia('(max-width: 960px)')` 完全一致。
- `vite.build.cssTarget` 已对齐 Tailwind v4 的支持矩阵（chrome111 / safari16.4 / firefox128）：v4 产物本身要求这个下限（`@property`、`color-mix()`、级联层），下调前必须先确认旧内核可用。
- 主题由 `<html data-theme="auto|light|dark">` + CSS 变量驱动（见 `base.css` / `useTheme.ts`）。`localStorage` key 为 `pidanui-theme`，改 key 必须同步 `nuxt.config.ts` head 里的首帧内联脚本。
- `body { overflow: hidden }`，**全站唯一纵向滚动容器是 `.site-main`**。路由滚动由 `app/router.options.ts` 接管（返回 `false` + 手动滚 `.site-main`）；页内锚点由 `usePostEnhance` 接管。
- 折叠/展开动画统一手感：缓动用 `cubic-bezier(0.25, 0.46, 0.45, 0.94)`，头部是 `<button aria-expanded>`、内容区靠 `.active` 切换。高度未知 / 会变的（归档按月分组）用 `grid-template-rows: 1fr ↔ 0fr`；下载页手风琴是 `max-height`（上限 1400px），内容变长会被裁切。
- 注释风格与现有文件一致：中文、`// ====` 分节横幅，只解释“为什么”，不复述代码。

## Markdown 渲染（@nuxt/content）

- `app/components/content/Prose*.vue` 复刻了 VitePress 时期的 DOM 契约，`_post.scss` 690 行排版依赖它：
  - `ProsePre` 必须输出 `div.language-* > button.copy + span.lang + pre.shiki`，复制按钮逻辑靠这个结构定位；
  - `ProseH2/H3` 输出 `<h2 :id><slot/><a class="header-anchor">`，标题锚点图标是 CSS `::before` 画的；
  - 新增 Prose 覆盖（如 `ProseTable`）放同一目录，文件名即组件名。
- Shiki 双主题配置必须是 `highlight.theme = { light, dark }`（键名决定产物里的 `--shiki-light/--shiki-dark`），**不要用 `default`**，否则深色代码块会失去高亮。
- `[TOC]` 不是构建期占位：`fillToc()` 在客户端把文本为 `[TOC]` 的段落替换成 `.post-toc` 容器再填充。
- 数学公式走 `remark-math` + `rehype-katex`（构建期出 HTML + MathML），样式见 `_post.scss` 的 `.katex*` 段。
- 文章正文不允许内联裸 HTML（MDC 会丢弃）；需要结构化块时用 Vue 组件或 MDC 语法。

## 字体与图标

- 字体与图标全部走 CDN（见 `nuxt.config.ts` 的 `app.head`），**仓库不保留任何字体 / 图标文件**：
  - MiSans（`misans-webfont@4.3.1`）—— 正文与 UI；
  - Cascadia Code（`@fontsource/cascadia-code@5.2.3`）—— 代码块等宽英文字体；
  - Font Awesome 7（`@fortawesome/fontawesome-free@7.3.1`）—— 全站图标。
- 图标统一写 `<i class="fa-solid fa-xxx" aria-hidden="true"></i>`（品牌图标用 `fa-brands`），**不要再引入自绘 / 内联 SVG 图标**。
- 网站 Logo 是图片资源（`public/images/logo.webp`），不属于图标 CDN 体系，保持现状。
- 字体栈定义在 `_variables.scss`（`$font-ui` / `$font-mono`）并同步到 `--vp-font-family-*`；调整字体请同时改这两处。

## 移动端与抽屉

- 断点：`$bp-md = 960px` 及以下为抽屉模式；左右侧栏共用 `useMobileDrawer.ts` 的模块级状态（`activeMobileDrawer` / `drawerProgress` / `drawerOffset` / `isDragging`）。
- 抽屉必须用 `transform` + `visibility` 常驻（`display` 无法过渡），位移由 `--drawer-offset` 驱动；拖拽中加 `is-dragging` 取消过渡，避免回弹。
- 手势已实现：屏幕左右边缘内滑、抽屉内反向拖拽关闭、35% 位移或 0.5px/ms 速度阈值、滚动锁定、Esc 关闭、路由切换与跨断点自动关闭——改手势时保持这些行为。
- 交互元素（`a, button, input…`）上的触摸不应被手势劫持，判定依赖 `INTERACTIVE_SELECTOR`。

## 无障碍与降级

- 图标一律 `aria-hidden="true"` 并提供文字或 `aria-label`；可切换按钮补 `aria-expanded` / `aria-controls` / `aria-current`。
- 主内容使用 `<main id="content" role="main">`；`<html class="js">` 仅在 JS 可用时由 head 内联脚本添加，`html:not(.js)` 的降级样式必须保持可用。
- 搜索对话框用原生 `<dialog>` + `showModal()`，退出动画靠 `@starting-style` / `allow-discrete`；JS 只负责善后（清空关键词、还焦点）。
- 不要在模板里用 `<noscript>` 做降级（会造成 hydration mismatch），统一走 `html:not(.js)` + CSS。

## 配置与类型（易踩坑）

- `tsconfig.json` 只是 `extends ./.nuxt/tsconfig.json`；别名规则：`@` / `~` → `app/`，`~~` → 仓库根，`#shared` → `shared/`，`#server` → `server/`。
- `@nuxt/content` 需要 `better-sqlite3` 原生绑定：它已在 `pnpm-workspace.yaml` 的 `allowBuilds` 中放行，**不要在 CI 上加 `--ignore-scripts`**。
- 改了 `nuxt.config.ts` 里影响类型 / 别名的配置后跑一次 `pnpm exec nuxt prepare`，否则编辑器会报找不到自动导入。
- 服务端路由里查询内容库必须 `queryCollection(event, 'posts')`（带 event）；文件名不要写 `[slug].json.ts` 这种「参数 + 点后缀」组合，Nitro 会把后缀并进参数——需要 JSON 后缀时用 `<dir>/index.json.ts`。
- `nuxt generate` 之后不要再跑 `nuxt preview`（静态预设没有 server 产物）。

## Git 与协作

- 提交信息用中文，`feat:` / `fix:` / `style:` / `chore:` / `docs:` 前缀，一句话说明做了什么。
- PR 从 fork `ColdFieldObserver:main` 发往 `PidanEggyTeam:main`（`gh pr create --repo PidanEggyTeam/PidanUI-Website --base main --head ColdFieldObserver:main`）。
- 创建跨 fork PR 前确认 `gh auth status` 的活动账号不是组织账号（组织账号会报 `Fork collab can't be granted`），必要时 `gh auth switch -u ColdFieldObserver`。
- 中文提交信息请写入 UTF-8（无 BOM）文件后用 `git commit -F`，避免编码错乱成 `??`。

## 提交前自检清单

1. `pnpm build` 通过且**零警告**（`failOnError: true` 下任何预渲染 404 都会失败）。
2. `find .output/public -name "*.html"` 与预期路由清单一致；中文分类 / 标签文件名未被百分号编码。
3. 浏览器实看：首页、`/download`、`/posts/`、`/archives/`、`/tags/`、一篇 `/posts/<slug>`。
4. 桌面与 ≤960px 移动端各过一遍：左右抽屉开合与拖拽、搜索对话框、主题三态切换。
5. 站内跳转不整页刷新（Network 里不应出现 document 请求）。
6. 新增图标是 Font Awesome 类名，新增颜色 / 圆角 / 断点来自变量，新增动效有 reduced-motion 分支。
7. 没有提交构建产物、缓存或临时文件。
