# PidanUI-Website

![Last Commit](https://img.shields.io/github/last-commit/PidanEggyTeam/PidanUI-Website?label=Last%20Commit)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.6.2-00DC82?logo=Nuxt&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.5.44-4FC08D?logo=Vue.js&logoColor=white)](https://cn.vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-1.105.2-CC6699?logo=Sass&logoColor=white)](https://sass.hk)
![License](https://img.shields.io/badge/License-AGPL--3.0-orange)

PidanUI 项目的官方网站，使用 Nuxt 4 + @nuxt/content + TypeScript + SCSS 构建，通过 `nuxt generate` 静态生成（SSG）后部署到 GitHub Pages。

## 网站结构

- **首页**：项目介绍、特性展示、下载入口。
- **下载**：`/download`，一个版本列表，提供 PidanUI 多个版本的下载链接。
- **新闻**：`/posts/`，由 @nuxt/content 驱动的内容区，支持分类 / 标签 / 归档分页、站内搜索与 Giscus 评论。
- **关于**：`/about`，展示 PidanUI 项目的简介及项目背后的故事。
- **蛋仔专属性格测试**：`/personality-test`，蛋仔专属性格测试小游戏，关于页的小彩蛋。

## 技术栈

- [Nuxt 4](https://nuxt.com/)（Nitro 预渲染 + SSG）
- [@nuxt/content v3](https://content.nuxt.com/)（Markdown 内容库，MDC + Shiki 双主题）
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://www.sass.hk/docs/index.html)
- [KaTeX](https://katex.org/)（数学公式）

## 数据文件

- `content/posts/*.md` —— 全部文章（唯一内容源），frontmatter 字段见 `content.config.ts`。
- `app/data/download.json` —— PidanUI 版本清单，用于下载页的版本列表展示，构建时随 SSG 固化。
- `shared/site.ts` —— 站点信息、分页大小（`PAGE_SIZE`）、Giscus 配置。

## 构建步骤

1. [下载并安装 Node.js](https://nodejs.org/zh-cn)（建议 22 LTS）
2. 安装 `pnpm`：`npm install -g pnpm`（`pnpm --version` 可验证；安装慢可先执行 `npm config set registry https://registry.npmmirror.com`）
3. 在项目文件夹下执行 `pnpm install`
4. `pnpm dev` 启动开发服务器（默认 `http://localhost:3000`）
5. `pnpm build` 生成静态产物，输出在 **`.output/public`**

## 字体与图标

本网站使用的字体为 MiSans 和 Cascadia Code 分包字体，图标来自 Font Awesome，字体和图标通过 CDN 加载，仓库不保留字体和图标文件。

## 关于 PidanUI

PidanUI 是一款专为 Windows & Linux 系统打造的桌面美化项目，设计灵感来源于网易游戏《蛋仔派对》。项目延续了 EggyUI 在视觉风格上的探索，同时吸取了过往项目在治理、技术与分发方式上的经验教训，重新调整了开发路线与组织方式。

PidanUI 并非 EggyUI 的官方分支，而是一个在 EggyUI 项目经历分裂与重组后，由原核心开发者与社区成员共同创建的新项目。它的目标不是复刻 EggyUI 的历史，而是在继承其技术积累与美学方向的基础上，走一条更稳定、更可持续的路。

## 部署方式

本网站部署于 **GitHub Pages**，通过静态托管的方式对外提供服务。推送到 `main` 后由 `.github/workflows/deploy.yml` 自动执行 `pnpm build` → 上传 `.output/public` → 部署 Pages。站点没有后端，所有内容以静态资源形式存在，更新时需重新构建并推送。

## 许可证

本项目采用 **AGPL v3** 许可证。

**禁止商业用途。** 任何个人或组织不得将本项目及其衍生作品用于商业目的。使用、修改、分发本项目时，请遵守 AGPL v3 的相关条款。

## 版权声明

- 本项目为《蛋仔派对》粉丝二次创作，非官方出品，禁止用于商业用途。
- 所有视觉素材均来自合规渠道或团队重绘，未使用游戏拆包/解包资源。
- 《蛋仔派对》是网易游戏的注册商标，Windows 是微软公司的注册商标。
- 本项目与网易、微软无任何隶属或赞助关系。
